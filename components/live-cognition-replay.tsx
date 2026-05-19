"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { ReactFlow, useNodesState, useEdgesState, Background, Handle, MiniMap, Controls, type Node, type Edge, Position, MarkerType } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, SkipForward, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

// ─── Node type configs ────────────────────────────────────────────────────────
const NODE_CFG = {
  thought:      { label: "THOUGHT",       accent: "oklch(0.72 0.19 195)",   border: "#1a4a5c", bg: "rgba(0,200,255,0.06)",  glow: "0 0 30px oklch(0.72 0.19 195 / 0.35)" },
  tool:         { label: "TOOL CALL",     accent: "oklch(0.65 0.22 300)",   border: "#3d1f5c", bg: "rgba(150,50,255,0.06)", glow: "0 0 30px oklch(0.65 0.22 300 / 0.35)" },
  hallucination:{ label: "RISK DETECTED", accent: "oklch(0.577 0.245 27)", border: "#5c1a1a", bg: "rgba(255,50,50,0.08)",   glow: "0 0 35px oklch(0.577 0.245 27 / 0.5)"  },
  safeOutput:   { label: "SAFE OUTPUT",   accent: "oklch(0.75 0.18 150)",   border: "#1a4a35", bg: "rgba(50,220,120,0.06)", glow: "0 0 30px rgba(50,220,120,0.35)"          },
} as const

type NodeKind = keyof typeof NODE_CFG

// ─── Reusable cinematic node ─────────────────────────────────────────────────
function CinematicNode({ data }: { data: { label: string; sub: string; kind: NodeKind; active?: boolean; completed?: boolean } }) {
  const cfg = NODE_CFG[data.kind]
  const isActive = !!data.active
  const isDone   = !!data.completed

  return (
    <div style={{ position: "relative", width: 250 }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      <motion.div
        animate={{ scale: isActive ? 1.04 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          width: 250,
          minHeight: 88,
          borderRadius: 14,
          border: `2px solid ${isActive ? cfg.accent : isDone ? cfg.border + "cc" : "#ffffff12"}`,
          background: isActive ? cfg.bg : isDone ? "rgba(255,255,255,0.03)" : "rgba(10,10,16,0.7)",
          boxShadow: isActive ? cfg.glow : isDone ? "none" : "none",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          backdropFilter: "blur(12px)",
          transition: "border 0.4s, background 0.4s, box-shadow 0.4s",
          opacity: (!isActive && !isDone && data.active !== undefined) ? 0.35 : 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
            color: isActive || isDone ? cfg.accent : "#ffffff30",
            fontFamily: "monospace",
          }}>
            {cfg.label}
          </span>
          {isActive && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.accent, animation: "pulse 1s infinite" }} />}
          {isDone && !isActive && <span style={{ fontSize: 10, color: cfg.accent }}>✓</span>}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: isActive || isDone ? "#f0f0f0" : "#ffffff30", lineHeight: 1.3 }}>
          {data.label}
        </div>
        <div style={{ fontSize: 10, color: isActive ? "#8898aa" : "#ffffff18", lineHeight: 1.4 }}>
          {data.sub}
        </div>
      </motion.div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  )
}

const nodeTypes = {
  thought:      CinematicNode,
  tool:         CinematicNode,
  hallucination:CinematicNode,
  safeOutput:   CinematicNode,
}

// ─── Initial layout — Horizontally compressed column spacing for larger zoom scale
const X = [40, 310, 580, 850, 1120, 1390, 1660]
const MID_Y = 240
const HIGH_Y = 110
const LOW_Y  = 370

const BASE_NODES: Node[] = [
  { id:"1", type:"thought",       position:{ x:X[0], y:MID_Y }, data:{ label:"User Input",      sub:"Prune DevOps logs safely",           kind:"thought"       } as Record<string,unknown>, sourcePosition:Position.Right, targetPosition:Position.Left },
  { id:"2", type:"thought",       position:{ x:X[1], y:HIGH_Y}, data:{ label:"Plan Strategy",    sub:"Formulating log sweeping paths",      kind:"thought"       } as Record<string,unknown>, sourcePosition:Position.Right, targetPosition:Position.Left },
  { id:"3", type:"tool",          position:{ x:X[2], y:MID_Y }, data:{ label:"bash_run(find)",   sub:"Scanning /var/log directories",       kind:"tool"          } as Record<string,unknown>, sourcePosition:Position.Right, targetPosition:Position.Left },
  { id:"4", type:"thought",       position:{ x:X[3], y:HIGH_Y}, data:{ label:"Memory Lookup",    sub:"Checking environment rule safety",    kind:"thought"       } as Record<string,unknown>, sourcePosition:Position.Right, targetPosition:Position.Left },
  { id:"5", type:"hallucination", position:{ x:X[4], y:LOW_Y }, data:{ label:"Wildcard Risk",    sub:"rm -rf /var/log/* injected!",         kind:"hallucination" } as Record<string,unknown>, sourcePosition:Position.Right, targetPosition:Position.Left },
  { id:"6", type:"tool",          position:{ x:X[5], y:MID_Y }, data:{ label:"Sandbox Correct",  sub:"Bypassing malicious arguments",        kind:"tool"          } as Record<string,unknown>, sourcePosition:Position.Right, targetPosition:Position.Left },
  { id:"7", type:"safeOutput",    position:{ x:X[6], y:MID_Y }, data:{ label:"Safe Response",    sub:"Sweep done. 0 escapes. ✓",            kind:"safeOutput"    } as Record<string,unknown>, sourcePosition:Position.Right, targetPosition:Position.Left },
]

const edgeStyle = (active: boolean, color: string, width = 2) => ({
  stroke: active ? color : "rgba(255,255,255,0.08)",
  strokeWidth: active ? width : 1.5,
})

const BASE_EDGES: Edge[] = [
  { id:"e1-2", source:"1", target:"2", type:"smoothstep" },
  { id:"e2-3", source:"2", target:"3", type:"smoothstep" },
  { id:"e3-4", source:"3", target:"4", type:"smoothstep" },
  { id:"e4-5", source:"4", target:"5", type:"smoothstep" },
  { id:"e5-6", source:"5", target:"6", type:"smoothstep" },
  { id:"e6-7", source:"6", target:"7", type:"smoothstep" },
]

// ─── Telemetry log ────────────────────────────────────────────────────────────
const TELEMETRY = [
  { label:"User Input",     event:"Parsing task",                    t:"0.0s", type:"thought"       },
  { label:"Plan Strategy",  event:"Formulating paths",               t:"0.3s", type:"thought"       },
  { label:"bash_run(find)", event:"Scanning /var/log",               t:"0.7s", type:"tool"          },
  { label:"Memory Lookup",  event:"Rule check: environment safety",  t:"1.1s", type:"thought"       },
  { label:"Wildcard Risk",  event:"⚠ CRITICAL: rm -rf wildcard",     t:"1.4s", type:"hallucination" },
  { label:"Sandbox Correct",event:"Payload sanitised — bypass OK",   t:"1.7s", type:"tool"          },
  { label:"Safe Response",  event:"42 files removed. 0 escapes.",    t:"2.0s", type:"safeOutput"    },
]

const TEL_COLOR: Record<string, string> = {
  thought:       "text-cyan-400 border-cyan-500/30 bg-cyan-500/6",
  tool:          "text-purple-400 border-purple-500/30 bg-purple-500/6",
  hallucination: "text-red-400 border-red-500/40 bg-red-500/8",
  safeOutput:    "text-emerald-400 border-emerald-500/30 bg-emerald-500/6",
}

export function LiveCognitionReplay() {
  const [nodes, setNodes, onNodesChange] = useNodesState(BASE_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(BASE_EDGES)
  const [step,  setStep]  = useState(0)
  const [playing, setPlaying] = useState(true)
  const [showRiskAlert, setShowRiskAlert] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const total = BASE_NODES.length
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Memoised node/edge updater ──────────────────────────────────────────────
  const applyStep = useCallback((s: number) => {
    setNodes(prev => prev.map((n, i) => ({
      ...n,
      data: { ...n.data, active: i === s, completed: i < s },
    })))
    setEdges(prev => prev.map((e, i) => {
      const srcIdx = Number(e.source) - 1
      const active = srcIdx < s
      const isRisk  = e.source === "4" || e.target === "5"
      return {
        ...e,
        animated: srcIdx === s - 1,
        style: edgeStyle(active, isRisk && srcIdx >= 3 ? "oklch(0.577 0.245 27)" : "oklch(0.72 0.19 195)", active ? 2.5 : 1.5),
        markerEnd: active ? { type: MarkerType.ArrowClosed, color: "oklch(0.72 0.19 195)", width: 12, height: 12 } : undefined,
      }
    }))
    setShowRiskAlert(s === 4)
  }, [setNodes, setEdges])

  useEffect(() => { applyStep(step) }, [step, applyStep])

  // ── Playback timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) { if (timerRef.current) clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setStep(p => {
        const next = p + 1
        if (next >= total) { setPlaying(false); return p }
        return next
      })
    }, 1800)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing, total])

  // ── Drag & drop JSON ────────────────────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file?.name.endsWith(".json")) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        const arr = Array.isArray(data) ? data : data.nodes
        if (!Array.isArray(arr)) return
        const newNodes: Node[] = arr.map((item: any, idx: number) => ({
          id: String(idx + 1), type: item.type === "output" ? "safeOutput" : (item.type || "thought"),
          position: { x: 40 + idx * 280, y: 240 + (idx % 2 === 0 ? 0 : -100) },
          data: { label: item.label || `Node ${idx+1}`, sub: item.description || "Custom traced event", kind: (item.type === "output" ? "safeOutput" : item.type || "thought") as NodeKind },
          sourcePosition: Position.Right, targetPosition: Position.Left,
        }))
        const newEdges: Edge[] = newNodes.slice(0,-1).map((_,i) => ({
          id:`e${i+1}-${i+2}`, source:String(i+1), target:String(i+2), type:"smoothstep",
          style: edgeStyle(false, "oklch(0.72 0.19 195)"),
        }))
        setNodes(newNodes); setEdges(newEdges); setStep(0); setPlaying(true)
      } catch { alert("Invalid Aether Trace JSON") }
    }
    reader.readAsText(file)
  }, [setNodes, setEdges])

  return (
    <section className="py-24 relative" id="replay">
      <div className="site-container">
        {/* Section header */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-xs font-bold text-primary mb-4">
            Interactive Playback Sandbox
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive <span className="text-gradient-cyan">Cognition Replay</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch AI reasoning unfold step by step. Drag & drop your local agent trace JSON file directly onto the canvas to replay your own custom runs.
          </p>
        </motion.div>

        {/* Main panel */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}
          className="glass-panel rounded-2xl overflow-hidden relative border border-border/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-card/10 backdrop-blur-md"
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          {/* Rectangular Alert Box: Centered, compact, above the graph */}
          <AnimatePresence>
            {showRiskAlert && (
              <motion.div 
                initial={{ opacity:0, y:-12, x:"-50%" }} 
                animate={{ opacity:1, y:0, x:"-50%" }} 
                exit={{ opacity:0, y:-12, x:"-50%" }}
                className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-[300px] flex flex-col items-center justify-center p-4 gap-2.5 rounded-2xl border border-red-500/40 bg-red-500/12 backdrop-blur-md text-red-400 text-center shadow-[0_0_30px_oklch(0.577_0.245_27/_0.25)]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base animate-bounce">⚠</span>
                  <span className="text-[10px] font-mono tracking-widest font-black uppercase">Guardrails Intercepted</span>
                </div>
                <span className="text-[11px] leading-relaxed text-red-400/90 font-medium">
                  Wildcard payload block: unauthorized deletion proposed.
                </span>
                <span className="text-[9px] font-mono text-red-400/50 bg-red-500/10 px-2 py-0.5 rounded">
                  TIME DILATION 0.1× Active
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drag overlay */}
          <AnimatePresence>
            {isDragging && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/90 backdrop-blur-md border-4 border-dashed border-primary/50 rounded-2xl"
              >
                <Upload className="w-12 h-12 text-primary animate-bounce" />
                <div className="text-center"><p className="text-lg font-bold">Drop Aether Trace JSON</p><p className="text-sm text-muted-foreground">Reconstruct and replay instantly</p></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setPlaying(p => !p)} className="border-primary/30 hover:border-primary hover:bg-primary/10">
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setStep(0); setPlaying(true) }} className="border-border/40">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setStep(total-1); setPlaying(false) }} className="border-border/40">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground">Node {Math.min(step+1,total)} / {total}</span>
              <div className="w-52">
                <Slider value={[step]} max={total-1} step={1} onValueChange={([v]) => { setStep(v); setPlaying(false) }} className="cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Two-panel layout: graph + telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
            {/* Expanded Canvas Container Height: 620px */}
            <div className="h-[620px] relative" style={{ background:"rgba(5,5,12,0.6)" }}>
              <style>{`
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
                .react-flow__attribution { display:none; }
              `}</style>
              <ReactFlow
                nodes={nodes} edges={edges}
                onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView fitViewOptions={{ padding:0.08, minZoom:0.6, maxZoom:1.1 }}
                proOptions={{ hideAttribution:true }}
                panOnDrag zoomOnScroll zoomOnPinch
                nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
                minZoom={0.15} maxZoom={2}
              >
                <Background color="oklch(0.72 0.19 195 / 0.06)" gap={28} size={1} />
                <Controls className="!bg-card/80 !border-border/40 !rounded-xl" showInteractive={false} />
                <MiniMap nodeColor={(n) => {
                  const k = (n.data as any).kind as NodeKind
                  return { thought:"#00c8ff", tool:"#a855f7", hallucination:"#ef4444", safeOutput:"#22c55e" }[k] ?? "#888"
                }} className="!bg-card/80 !border-border/40 !rounded-xl" maskColor="rgba(5,5,12,0.7)" />
              </ReactFlow>
            </div>

            {/* Telemetry side panel */}
            <div className="border-l border-border/30 flex flex-col">
              <div className="px-4 py-3 border-b border-border/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left">Cognition Timeline</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {TELEMETRY.map((t, i) => {
                  const isActive = i === step
                  const isDone = i < step
                  return (
                    <motion.div key={i}
                      animate={{ opacity: isActive ? 1 : isDone ? 0.6 : 0.2, x: isActive ? 2 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-2.5 rounded-xl border text-xs transition-all text-left ${isActive || isDone ? TEL_COLOR[t.type] : "border-border/10 text-muted-foreground/20"}`}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-bold truncate">{t.label}</span>
                        <span className="font-mono opacity-50 shrink-0 ml-2 text-[9px]">{t.t}</span>
                      </div>
                      <div className="opacity-70 leading-snug font-mono text-[10px]">{t.event}</div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Timeline track */}
          <div className="px-6 py-4 border-t border-border/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Replay Trace Progress</span>
              <span className="text-[10px] font-mono text-primary/70">Premiere Replay Mode</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {BASE_NODES.map((n, i) => {
                const cfg = NODE_CFG[(n.data as any).kind as NodeKind]
                const isActive = i === step
                const isDone = i < step
                return (
                  <button key={n.id} onClick={() => { setStep(i); setPlaying(false) }}
                    className="flex flex-col items-center gap-1.5 min-w-[72px] group"
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] transition-all duration-300
                      ${isActive ? "scale-125" : "scale-100 opacity-50 group-hover:opacity-80"}`}
                      style={{ borderColor: isActive || isDone ? cfg.accent : "#ffffff15", background: isActive ? cfg.bg : "transparent", boxShadow: isActive ? cfg.glow : "none" }}
                    >
                      {isDone && !isActive ? "✓" : i+1}
                    </div>
                    <span className={`text-[9px] text-center leading-tight transition-colors ${isActive ? "text-foreground font-bold" : "text-muted-foreground/40"}`}>
                      {String(n.data.label ?? "").split(" ").slice(1).join(" ") || String(n.data.label ?? "")}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
