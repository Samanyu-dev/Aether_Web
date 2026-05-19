"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { ReactFlow, Background, Handle, Position, MarkerType, useNodesState, useEdgesState, type Node, type Edge, MiniMap, Controls } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { motion, AnimatePresence } from "framer-motion"

// ─── Shared Styles ────────────────────────────────────────────────────────
const CFG = {
  thought:       { label: "THOUGHT",      border: "#1a6077", active: "oklch(0.72 0.19 195)", bg: "rgba(0,180,255,0.04)" },
  tool:          { label: "TOOL CALL",    border: "#3d1f5c", active: "oklch(0.65 0.22 300)", bg: "rgba(160,50,255,0.04)" },
  memory:        { label: "MEMORY",       border: "#1a5c3d", active: "oklch(0.7 0.19 150)",  bg: "rgba(0,255,100,0.04)" },
  hallucination: { label: "RISK DETECTED",border: "#5c1a1a", active: "oklch(0.577 0.245 27)", bg: "rgba(255,50,50,0.05)" },
  output:        { label: "OUTPUT",       border: "#1a4a35", active: "oklch(0.75 0.18 150)", bg: "rgba(50,220,120,0.04)" },
} as const

type NodeKind = keyof typeof CFG

function ReplayNode({ data }: { data: { label: string; kind: NodeKind; isActive?: boolean; isDone?: boolean } }) {
  const cfg = CFG[data.kind] || CFG.thought
  const isActive = !!data.isActive
  const isDone = !!data.isDone

  return (
    <div style={{ position: "relative", width: 220 }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <motion.div
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          width: 220,
          minHeight: 70,
          borderRadius: 12,
          border: `1.5px solid ${isActive ? cfg.active : isDone ? cfg.border : "#ffffff0a"}`,
          background: isActive ? cfg.bg : isDone ? "rgba(255,255,255,0.02)" : "rgba(5,5,10,0.6)",
          boxShadow: isActive ? `0 0 20px ${cfg.active}40` : "none",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          backdropFilter: "blur(8px)",
          opacity: (!isActive && !isDone && data.isActive !== undefined) ? 0.4 : 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: isActive || isDone ? cfg.active : "#ffffff30", fontFamily: "monospace" }}>
            {cfg.label}
          </span>
          {isActive && <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.active, animation: "pulse 1s infinite" }} />}
          {isDone && !isActive && <span style={{ fontSize: 10, color: cfg.active }}>✓</span>}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: isActive || isDone ? "#fff" : "#ffffff40" }}>
          {data.label}
        </div>
      </motion.div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  )
}

const nodeTypes = { replay: ReplayNode }

export function StoryReplayGraph({ story }: { story: any }) {
  // Dynamically generate a massive trace based on the duration metric (e.g., "25 events")
  const initialNodes: Node[] = useMemo(() => {
    const totalEvents = parseInt(story.duration.split(" ")[0]) || 12
    const nodes: Node[] = []
    const previewNodes = story.preview
    
    // We want the final preview node to be at the very end
    const gap = Math.max(1, Math.floor((totalEvents - 1) / (previewNodes.length - 1)))

    for (let i = 0; i < totalEvents; i++) {
      let nodeData = { type: "thought", label: `Process_0x${i.toString(16).padStart(4, '0')}` }
      let isPreview = false

      if (i === totalEvents - 1) {
        nodeData = previewNodes[previewNodes.length - 1]
        isPreview = true
      } else if (i % gap === 0 && (i / gap) < previewNodes.length - 1) {
        nodeData = previewNodes[i / gap]
        isPreview = true
      } else {
        const types = ["thought", "memory", "tool"]
        nodeData.type = types[i % 3]
      }

      nodes.push({
        id: `n${i}`,
        type: "replay",
        position: { 
          x: i * 260 + 40, 
          y: (i % 2 === 0 ? 80 : 180) + (Math.sin(i) * 40) // Create a cinematic wave layout
        },
        data: {
          label: nodeData.label,
          kind: nodeData.type,
          isPreview
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })
    }
    return nodes
  }, [story])

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = []
    for (let i = 0; i < initialNodes.length - 1; i++) {
      edges.push({
        id: `e${i}-${i+1}`,
        source: `n${i}`,
        target: `n${i+1}`,
        type: "smoothstep",
      })
    }
    return edges
  }, [initialNodes])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  const [activeIdx, setActiveIdx] = useState(-1)
  const [logs, setLogs] = useState<string[]>([])
  
  const exeOrder = useMemo(() => initialNodes.map(n => n.id), [initialNodes])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let cursor = 0
    let isResetting = false

    intervalRef.current = setInterval(() => {
      if (isResetting) return

      setActiveIdx(prev => {
        const next = prev + 1
        if (next >= exeOrder.length) {
          isResetting = true
          setTimeout(() => {
            setActiveIdx(-1)
            setLogs([])
            cursor = 0
            isResetting = false
          }, 4000)
          return prev
        }
        
        // Push logs dynamically when we hit key 'preview' milestones
        const currentNode = initialNodes[next]
        if (currentNode?.data?.isPreview && cursor < story.narrations.length) {
          const log = story.narrations[cursor]
          if (log) setLogs(logsPrev => [...logsPrev, log])
          cursor++
        } else if (!currentNode?.data?.isPreview) {
          // Push subtle trace logs for intermediate steps
          setLogs(logsPrev => [...logsPrev, `[TRACE] Executing ${currentNode?.data?.label}...`])
        }

        return next
      })
    }, 450) // Faster 450ms animation speed for large graphs

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [exeOrder, story.narrations, initialNodes])

  // Sync graph states
  useEffect(() => {
    const activeIds = new Set(exeOrder.slice(0, activeIdx + 1))
    const currentId = exeOrder[activeIdx]

    setNodes(prev => prev.map(n => ({
      ...n,
      data: { ...n.data, isActive: n.id === currentId, isDone: activeIds.has(n.id) && n.id !== currentId }
    })))

    setEdges(prev => prev.map(e => {
      const isSrcActive = activeIds.has(e.source)
      const isAnimated = e.source === currentId || (e.target === currentId && activeIds.has(e.source))
      const targetNode = initialNodes.find(n => n.id === e.target)
      const isRisk = targetNode?.data.kind === "hallucination"
      
      return {
        ...e,
        animated: isAnimated,
        style: {
          stroke: isSrcActive ? (isRisk ? "oklch(0.577 0.245 27)" : "oklch(0.72 0.19 195)") : "rgba(255,255,255,0.06)",
          strokeWidth: isSrcActive ? 2.5 : 1.5,
          transition: "stroke 0.4s ease"
        },
        markerEnd: isSrcActive ? { type: MarkerType.ArrowClosed, color: isRisk ? "oklch(0.577 0.245 27)" : "oklch(0.72 0.19 195)", width: 12, height: 12 } : undefined
      }
    }))
  }, [activeIdx, exeOrder, initialNodes, setNodes, setEdges])

  return (
    <div className="flex flex-col md:flex-row w-full h-[400px] bg-[#06060c] border border-border/20 rounded-xl overflow-hidden">
      
      {/* ── Left: React Flow Graph Canvas ──────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden bg-[#040409]">
        <style>{`
          .react-flow__attribution { display:none; }
          .react-flow__minimap { background-color: rgba(5,5,10,0.8) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 8px !important; }
        `}</style>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          panOnDrag zoomOnScroll nodesDraggable={false} elementsSelectable={false}
        >
          <Background color="oklch(0.72 0.19 195 / 0.05)" gap={20} size={1} />
        </ReactFlow>
      </div>

      {/* ── Right: Live Feed ────────────────────────────────── */}
      <div className="w-[260px] border-l border-border/20 bg-[#030307]/90 flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-border/20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Logs</span>
        </div>
        
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-[11px] font-mono text-primary/80 border-l-2 border-primary/30 pl-3 leading-relaxed"
              >
                <span className="text-primary font-bold">{">"}</span> {log}
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground/30 font-mono italic">
              Waiting for telemetry...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
