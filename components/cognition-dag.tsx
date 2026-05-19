"use client"

import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ReactFlow, Background, Controls, MiniMap, Handle, Position, MarkerType, useNodesState, useEdgesState, type Node, type Edge } from "@xyflow/react"
import "@xyflow/react/dist/style.css"

// ─── Node Config ────────────────────────────────────────────────────────
const CFG = {
  thought:       { label: "THOUGHT",      border: "#1a6077", active: "oklch(0.72 0.19 195)", bg: "rgba(0,180,255,0.04)" },
  tool:          { label: "TOOL CALL",    border: "#3d1f5c", active: "oklch(0.65 0.22 300)", bg: "rgba(160,50,255,0.04)" },
  memory:        { label: "MEMORY",       border: "#1a5c3d", active: "oklch(0.7 0.19 150)",  bg: "rgba(0,255,100,0.04)" },
  hallucination: { label: "RISK DETECTED",border: "#5c1a1a", active: "oklch(0.577 0.245 27)", bg: "rgba(255,50,50,0.05)" },
  output:        { label: "OUTPUT",       border: "#1a4a35", active: "oklch(0.75 0.18 150)", bg: "rgba(50,220,120,0.04)" },
} as const

type NodeKind = keyof typeof CFG

// ─── Custom Node Component ───────────────────────────────────────────────
function PremiumDAGNode({ data }: { data: { label: string; sub: string; kind: NodeKind; isActive?: boolean; isDone?: boolean } }) {
  const cfg = CFG[data.kind]
  const isActive = !!data.isActive
  const isDone = !!data.isDone

  return (
    <div style={{ position: "relative", width: 220 }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: "none" }} />
      
      <motion.div
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          width: 220,
          minHeight: 80,
          borderRadius: 16,
          border: `1.5px solid ${isActive ? cfg.active : isDone ? cfg.border : "#ffffff0a"}`,
          background: isActive ? cfg.bg : isDone ? "rgba(255,255,255,0.02)" : "rgba(5,5,10,0.6)",
          boxShadow: isActive ? `0 0 25px ${cfg.active}40` : "none",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          backdropFilter: "blur(12px)",
          opacity: (!isActive && !isDone && data.isActive !== undefined) ? 0.3 : 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase",
            color: isActive || isDone ? cfg.active : "#ffffff30", fontFamily: "monospace"
          }}>
            {cfg.label}
          </span>
          {isActive && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.active, animation: "pulse 1s infinite" }} />}
          {isDone && !isActive && <span style={{ fontSize: 10, color: cfg.active }}>✓</span>}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: isActive || isDone ? "#f0f0f0" : "#ffffff40", lineHeight: 1.3 }}>
          {data.label}
        </div>
        <div style={{ fontSize: 10, color: isActive ? "#8898aa" : "#ffffff20", lineHeight: 1.4 }}>
          {data.sub}
        </div>
      </motion.div>
      
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: "none" }} />
    </div>
  )
}

const nodeTypes = { premium: PremiumDAGNode }

// ─── Initial Layout ───────────────────────────────────────────────────────
const X = [40, 320, 600, 880, 1160]
const MID_Y = 160
const HIGH_Y = 40
const LOW_Y = 280

const INITIAL_NODES: Node[] = [
  { id: "1", type: "premium", position: { x: X[0], y: MID_Y }, data: { label: "Analyzing request", sub: "Parse intent & scope", kind: "thought" } as Record<string,unknown>, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: "2", type: "premium", position: { x: X[1], y: HIGH_Y}, data: { label: "Planning approach", sub: "Strategy formulation", kind: "thought" } as Record<string,unknown>, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: "3", type: "premium", position: { x: X[1], y: LOW_Y }, data: { label: "web_search()", sub: "External retrieval", kind: "tool" } as Record<string,unknown>, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: "4", type: "premium", position: { x: X[2], y: HIGH_Y}, data: { label: "Context retrieval", sub: "Vector store lookup", kind: "memory" } as Record<string,unknown>, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: "5", type: "premium", position: { x: X[3], y: MID_Y }, data: { label: "Synthesizing", sub: "Multi-source reasoning", kind: "thought" } as Record<string,unknown>, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: "6", type: "premium", position: { x: X[4], y: LOW_Y }, data: { label: "Uncertainty detected", sub: "Confidence: 0.31", kind: "hallucination" } as Record<string,unknown>, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: "7", type: "premium", position: { x: X[4], y: HIGH_Y}, data: { label: "Final response", sub: "Guardrail verified ✓", kind: "output" } as Record<string,unknown>, sourcePosition: Position.Right, targetPosition: Position.Left },
]

const INITIAL_EDGES: Edge[] = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
  { id: "e1-3", source: "1", target: "3", type: "smoothstep" },
  { id: "e2-4", source: "2", target: "4", type: "smoothstep" },
  { id: "e3-5", source: "3", target: "5", type: "smoothstep" },
  { id: "e4-5", source: "4", target: "5", type: "smoothstep" },
  { id: "e5-6", source: "5", target: "6", type: "smoothstep" },
  { id: "e5-7", source: "5", target: "7", type: "smoothstep" },
]

// ─── Stream Events ────────────────────────────────────────────────────────
const STREAM_DATA = [
  { id: "s1", type: "thought",       content: "Analyzing request parameters...",  ts: "0.0s" },
  { id: "s2", type: "thought",       content: "Formulating sweeping strategy",    ts: "0.3s" },
  { id: "s3", type: "tool",          content: 'Invoking local sweeps...',         ts: "0.6s" },
  { id: "s4", type: "memory",        content: "Checking system context store",    ts: "0.9s" },
  { id: "s5", type: "thought",       content: "Evaluating safety guardrails",     ts: "1.2s" },
  { id: "s6", type: "hallucination", content: "⚠ Confidence anomaly: 0.31",       ts: "1.5s" },
  { id: "s7", type: "output",        content: "Response complete. Guardrail pass", ts: "1.8s" },
]

const STREAM_STYLE: Record<string, string> = {
  thought:       "text-cyan-400 border-cyan-500/25 bg-cyan-500/5",
  tool:          "text-purple-400 border-purple-500/25 bg-purple-500/5",
  memory:        "text-emerald-400 border-emerald-500/25 bg-emerald-500/5",
  hallucination: "text-red-400 border-red-500/35 bg-red-500/8",
  output:        "text-emerald-400 border-emerald-500/25 bg-emerald-500/5",
}

const EXE_ORDER = ["1", "2", "3", "4", "5", "6", "7"]

export function CognitionDAG() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [streamLog, setStreamLog] = useState<typeof STREAM_DATA>([])
  const [showAlert, setShowAlert] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let cursor = 0
    let isResetting = false

    intervalRef.current = setInterval(() => {
      if (isResetting) return

      setActiveIdx(prev => {
        const next = prev + 1
        if (next >= EXE_ORDER.length) {
          isResetting = true
          setTimeout(() => {
            setActiveIdx(-1)
            setStreamLog([])
            cursor = 0
            setShowAlert(false)
            isResetting = false
          }, 2500)
          return prev
        }
        setShowAlert(EXE_ORDER[next] === "6")
        return next
      })

      if (cursor < STREAM_DATA.length) {
        const ev = STREAM_DATA[cursor]
        if (ev) setStreamLog(prev => [...prev, ev])
        cursor++
      }
    }, 1500)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [EXE_ORDER.length])

  // Sync graph state with activeIdx
  useEffect(() => {
    const activeIds = new Set(EXE_ORDER.slice(0, activeIdx + 1))
    const currentId = EXE_ORDER[activeIdx]

    setNodes(prev => prev.map(n => ({
      ...n,
      data: {
        ...n.data,
        isActive: n.id === currentId,
        isDone: activeIds.has(n.id) && n.id !== currentId
      }
    })))

    setEdges(prev => prev.map(e => {
      const isSrcActive = activeIds.has(e.source)
      const isAnimated = e.source === currentId || (e.target === currentId && activeIds.has(e.source))
      const isRisk = e.target === "6"
      
      return {
        ...e,
        animated: isAnimated,
        style: {
          stroke: isSrcActive ? (isRisk ? "oklch(0.577 0.245 27)" : "oklch(0.72 0.19 195)") : "rgba(255,255,255,0.06)",
          strokeWidth: isSrcActive ? 2.5 : 1.5,
          transition: "stroke 0.4s ease, stroke-width 0.4s ease"
        },
        markerEnd: isSrcActive ? { type: MarkerType.ArrowClosed, color: isRisk ? "oklch(0.577 0.245 27)" : "oklch(0.72 0.19 195)", width: 12, height: 12 } : undefined
      }
    }))
  }, [activeIdx, setNodes, setEdges])

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-0 bg-[#06060c]/85 border border-border/30 rounded-2xl overflow-hidden backdrop-blur-xl relative">
      
      {/* ── Left: React Flow Graph Canvas ──────────────────────────────────────── */}
      <div className="flex-1 relative min-h-0 overflow-hidden bg-[#040409]">
        
        {/* Floating risk alert */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -16, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -16, x: "-50%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[340px] flex flex-col items-center justify-center p-4 gap-2 rounded-2xl border border-red-500/40 bg-red-500/12 backdrop-blur-md text-red-400 text-center shadow-[0_0_35px_oklch(0.577_0.245_27/_0.3)] pointer-events-none"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base animate-pulse">⚠</span>
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase">Guardrail Intercept</span>
              </div>
              <span className="text-[11px] leading-relaxed text-red-400/90 font-medium">
                Uncertainty threshold breached. Execution halted.
              </span>
              <span className="text-[9px] font-mono text-red-400/50 bg-red-500/10 px-2 py-0.5 rounded mt-0.5">
                confidence: 0.31 · intercepting
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .react-flow__attribution { display:none; }
          .react-flow__minimap { background-color: rgba(5,5,10,0.8) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 12px !important; overflow: hidden; }
          .react-flow__controls { background-color: rgba(5,5,10,0.8) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 8px !important; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; }
          .react-flow__controls-button { border-bottom: 1px solid rgba(255,255,255,0.05) !important; color: white !important; fill: white !important; }
          .react-flow__controls-button:hover { background-color: rgba(255,255,255,0.1) !important; }
        `}</style>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: true }}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background color="oklch(0.72 0.19 195 / 0.05)" gap={24} size={1} />
          <Controls showInteractive={false} position="bottom-left" />
          <MiniMap 
            position="top-right"
            nodeColor={(n) => {
              const k = (n.data as any).kind as NodeKind
              return CFG[k]?.border || "#888"
            }} 
            maskColor="rgba(5,5,12,0.85)" 
          />
        </ReactFlow>
      </div>

      {/* ── Right: Vertical Live Stream panel ────────────────────────────────── */}
      <div className="w-full md:w-[280px] border-t md:border-t-0 md:border-l border-border/20 bg-[#030307]/80 flex flex-col shrink-0 min-h-0 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="px-5 py-4 border-b border-border/20 flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Live Execution Feed
          </span>
          <span className="ml-auto text-[9px] font-mono text-muted-foreground/30">
            {streamLog.length} events
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-none max-h-[200px] md:max-h-none">
          <AnimatePresence mode="popLayout">
            {streamLog.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: 15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`p-3 rounded-xl border text-[11px] font-medium leading-relaxed shadow-lg ${STREAM_STYLE[ev.type] ?? "border-border/10 text-muted-foreground"}`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-extrabold uppercase tracking-widest opacity-90 text-[9px] font-mono">
                    {ev.type}
                  </span>
                  <span className="opacity-50 font-mono text-[9px]">{ev.ts}</span>
                </div>
                <div className="text-foreground/95 font-mono text-[10.5px] break-words">
                  {ev.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {streamLog.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <span className="text-[11px] text-muted-foreground/30 italic font-mono">Waiting for payload…</span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

