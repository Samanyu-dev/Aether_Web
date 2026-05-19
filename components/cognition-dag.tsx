"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ─────────────────────────────────────────────────────────────────────
interface CognitionNode {
  id: string
  type: "thought" | "tool" | "memory" | "hallucination" | "output"
  label: string
  sublabel: string
  x: number
  y: number
}

interface StreamEvent {
  id: string
  type: "thought" | "tool" | "memory" | "hallucination" | "output"
  content: string
  ts: string
}

// ─── Progressive Left-to-Right layout — No Backward Lines ──────────────────────
// Column 0: n1 (x: 20)
// Column 1: n2 (x: 230), n3 (x: 230)
// Column 2: n4 (x: 440)
// Column 3: n5 (x: 650)
// Column 4: n6 (x: 860)
// Column 5: n7 (x: 1070)
const NODE_W = 196
const NODE_H = 76
const NODES: CognitionNode[] = [
  { id: "n1", type: "thought",       label: "Analyzing request",    sublabel: "Parse intent & scope",       x: 20,   y: 172 },
  { id: "n2", type: "thought",       label: "Planning approach",    sublabel: "Strategy formulation",        x: 230,  y: 40  },
  { id: "n3", type: "tool",          label: "web_search()",         sublabel: "External retrieval",          x: 230,  y: 300 },
  { id: "n4", type: "memory",        label: "Context retrieval",    sublabel: "Vector store lookup",         x: 440,  y: 40  },
  { id: "n5", type: "thought",       label: "Synthesizing",         sublabel: "Multi-source reasoning",      x: 650,  y: 172 },
  { id: "n6", type: "hallucination", label: "Uncertainty detected", sublabel: "Confidence: 0.31",            x: 860,  y: 300 },
  { id: "n7", type: "output",        label: "Final response",       sublabel: "Guardrail verified ✓",        x: 1070, y: 172 },
]

const EDGES = [
  { id: "e1-2", from: "n1", to: "n2" },
  { id: "e1-3", from: "n1", to: "n3" },
  { id: "e2-4", from: "n2", to: "n4" },
  { id: "e3-5", from: "n3", to: "n5" },
  { id: "e4-5", from: "n4", to: "n5" },
  { id: "e5-6", from: "n5", to: "n6" },
  { id: "e5-7", from: "n5", to: "n7" },
  { id: "e6-7", from: "n6", to: "n7" },
]

// ─── Visual config per type ────────────────────────────────────────────────────
const CFG = {
  thought:       { label: "THOUGHT",      borderColor: "#1a6077", activeColor: "oklch(0.72 0.19 195)",  glow: "0 0 24px oklch(0.72 0.19 195 / 0.45)",  dotClass: "bg-primary",       textClass: "text-primary"      },
  tool:          { label: "TOOL CALL",    borderColor: "#3d1f5c", activeColor: "oklch(0.65 0.22 300)",  glow: "0 0 24px oklch(0.65 0.22 300 / 0.45)",  dotClass: "bg-accent",        textClass: "text-accent"       },
  memory:        { label: "MEMORY",       borderColor: "#1a5c3d", activeColor: "oklch(0.7 0.19 150)",   glow: "0 0 24px oklch(0.7 0.19 150 / 0.4)",    dotClass: "bg-emerald-400",   textClass: "text-emerald-400"  },
  hallucination: { label: "RISK",         borderColor: "#5c1a1a", activeColor: "oklch(0.577 0.245 27)", glow: "0 0 30px oklch(0.577 0.245 27 / 0.6)",  dotClass: "bg-destructive",   textClass: "text-destructive"  },
  output:        { label: "OUTPUT",       borderColor: "#1a4a35", activeColor: "oklch(0.75 0.18 150)",  glow: "0 0 24px oklch(0.75 0.18 150 / 0.4)",   dotClass: "bg-emerald-400",   textClass: "text-emerald-400"  },
} as const

// ─── Stream event data ─────────────────────────────────────────────────────────
const STREAM_DATA: StreamEvent[] = [
  { id: "s1", type: "thought",       content: "Analyzing request parameters...",  ts: "0.0s" },
  { id: "s2", type: "thought",       content: "Formulating sweeping strategy",    ts: "0.3s" },
  { id: "s3", type: "tool",          content: 'Invoking local sweeps...',         ts: "0.6s" },
  { id: "s4", type: "memory",        content: "Checking system context store",    ts: "0.9s" },
  { id: "s5", type: "thought",       content: "Evaluating safety guardrails",     ts: "1.2s" },
  { id: "s6", type: "hallucination", content: "⚠ Confidence anomaly: 0.31",       ts: "1.5s" },
  { id: "s7", type: "output",        content: "Response complete. Guardrail pass", ts: "1.8s" },
]

const STREAM_STYLE: Record<string, string> = {
  thought:       "text-primary border-primary/25 bg-primary/5",
  tool:          "text-accent border-accent/25 bg-accent/5",
  memory:        "text-emerald-400 border-emerald-500/25 bg-emerald-500/5",
  hallucination: "text-red-400 border-red-500/35 bg-red-500/8",
  output:        "text-emerald-400 border-emerald-500/25 bg-emerald-500/5",
}

// ─── Edge path: right-center of source → left-center of target ─────────────────
function edgePath(from: CognitionNode, to: CognitionNode) {
  const x1 = from.x + NODE_W
  const y1 = from.y + NODE_H / 2
  const x2 = to.x
  const y2 = to.y + NODE_H / 2
  const cx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`
}

const SVG_W = 1295
const SVG_H = 420

export function CognitionDAG() {
  const [activeIdx, setActiveIdx]   = useState(-1)
  const [streamLog, setStreamLog]   = useState<StreamEvent[]>([])
  const [showAlert, setShowAlert]   = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamCursor = useRef(0)
  const resetting = useRef(false)

  const nodeMap = useMemo(() => {
    const m: Record<string, CognitionNode> = {}
    NODES.forEach(n => { m[n.id] = n })
    return m
  }, [])

  const activeEdgeIds = useMemo(() => {
    const s = new Set<string>()
    EDGES.forEach(e => {
      const srcIdx = NODES.findIndex(n => n.id === e.from)
      if (srcIdx >= 0 && srcIdx <= activeIdx) s.add(e.id)
    })
    return s
  }, [activeIdx])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (resetting.current) return

      setActiveIdx(prev => {
        const next = prev + 1
        if (next >= NODES.length) {
          resetting.current = true
          setTimeout(() => {
            setActiveIdx(-1)
            setStreamLog([])
            streamCursor.current = 0
            setShowAlert(false)
            resetting.current = false
          }, 2500)
          return prev
        }
        setShowAlert(next === 5)
        return next
      })

      const cursor = streamCursor.current
      if (cursor >= 0 && cursor < STREAM_DATA.length) {
        const event = STREAM_DATA[cursor]
        if (event && event.id) {
          setStreamLog(prev => [...prev, event])
        }
        streamCursor.current = cursor + 1
      }
    }, 1800)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    // Side-by-Side responsive 2-column layout: Graph on Left (80%), Vertical Live Stream on Right (20%)
    <div className="flex flex-col md:flex-row w-full h-full min-h-0 bg-[#06060c]/85 border border-border/30 rounded-2xl overflow-hidden backdrop-blur-xl relative">
      
      {/* ── Left: SVG graph canvas ─────────────────────────────────────────── */}
      <div className="flex-1 relative min-h-0 overflow-hidden p-4">
        {/* Floating rectangular alert above the graph */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              key="alert"
              initial={{ opacity: 0, y: -16, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -16, x: "-50%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[320px] flex flex-col items-center justify-center p-4 gap-2 rounded-2xl border border-red-500/40 bg-red-500/12 backdrop-blur-md text-red-400 text-center shadow-[0_0_35px_oklch(0.577_0.245_27/_0.25)]"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base animate-pulse">⚠</span>
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase">Guardrail Intercept Active</span>
              </div>
              <span className="text-[11px] leading-relaxed text-red-400/90 font-medium">
                Catastrophic wildcard system deletion proposed and blocked.
              </span>
              <span className="text-[9px] font-mono text-red-400/50 bg-red-500/10 px-2 py-0.5 rounded mt-0.5">
                confidence: 0.31 · time dilation 0.1×
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        >
          <defs>
            <filter id="dag-glow">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Connected horizontal edges */}
          {EDGES.map(edge => {
            const from = nodeMap[edge.from]
            const to   = nodeMap[edge.to]
            if (!from || !to) return null
            const path    = edgePath(from, to)
            const active  = activeEdgeIds.has(edge.id)
            const isRisk  = to.type === "hallucination" || from.type === "hallucination"
            const color   = active ? (isRisk ? "oklch(0.577 0.245 27)" : "oklch(0.72 0.19 195)") : "rgba(255,255,255,0.06)"

            return (
              <g key={edge.id}>
                <path d={path} fill="none" stroke={color} strokeWidth={active ? 2.5 : 1.5}
                  filter={active ? "url(#dag-glow)" : undefined}
                  style={{ transition: "stroke 0.4s ease, stroke-width 0.3s ease" }}
                />
                {active && (
                  <circle r="4.5" fill={color}>
                    <animateMotion path={path} dur="1.7s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            )
          })}

          {/* Interactive Node Cards */}
          {NODES.map((node, idx) => {
            const cfg        = CFG[node.type]
            const isActive   = idx === activeIdx
            const isDone     = idx < activeIdx
            const isDimmed   = activeIdx >= 0 && !isActive && !isDone
            const borderCol  = isActive ? cfg.activeColor : isDone ? cfg.borderColor + "cc" : "rgba(255,255,255,0.07)"
            const fillCol    = isActive ? "rgba(255,255,255,0.06)" : isDone ? "rgba(255,255,255,0.02)" : "rgba(10,10,18,0.6)"
            const textAlpha  = isActive || isDone ? 1 : 0.22
            const scale      = isActive ? 1.04 : 1
            const cx         = node.x + NODE_W / 2
            const cy         = node.y + NODE_H / 2

            return (
              <g key={node.id} transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}
                style={{ transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
                opacity={isDimmed ? 0.3 : 1}
              >
                {/* Neon Aura */}
                {isActive && (
                  <rect
                    x={node.x - 4} y={node.y - 4}
                    width={NODE_W + 8} height={NODE_H + 8}
                    rx={14} ry={14}
                    fill="none"
                    stroke={cfg.activeColor}
                    strokeWidth={1}
                    opacity={0.35}
                    filter="url(#dag-glow)"
                  />
                )}
                {/* Node Card */}
                <rect
                  x={node.x} y={node.y}
                  width={NODE_W} height={NODE_H}
                  rx={12} ry={12}
                  fill={fillCol}
                  stroke={borderCol}
                  strokeWidth={isActive ? 2 : 1.5}
                  style={{ transition: "fill 0.3s, stroke 0.3s" }}
                />
                {/* Node Type Label */}
                <text
                  x={node.x + 14} y={node.y + 22}
                  fontFamily="monospace" fontSize={8.5} fontWeight={800}
                  letterSpacing={1.3}
                  fill={isActive ? cfg.activeColor : isDone ? cfg.activeColor : "rgba(255,255,255,0.2)"}
                  style={{ transition: "fill 0.3s", textTransform: "uppercase" }}
                  opacity={textAlpha}
                >
                  {cfg.label}
                </text>
                {/* Blink indicator */}
                {isActive && (
                  <circle cx={node.x + NODE_W - 14} cy={node.y + 14} r={3} fill={cfg.activeColor}>
                    <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Checked marker */}
                {isDone && !isActive && (
                  <text x={node.x + NODE_W - 14} y={node.y + 17} fontSize={9.5} fill={cfg.activeColor} opacity={0.7} textAnchor="middle">✓</text>
                )}
                {/* Main Node Label */}
                <text
                  x={node.x + 14} y={node.y + 42}
                  fontFamily="system-ui, sans-serif" fontSize={12.5} fontWeight={700}
                  fill={isActive || isDone ? "rgba(245,245,250,0.95)" : "rgba(255,255,255,0.2)"}
                  style={{ transition: "fill 0.3s" }}
                >
                  {node.label}
                </text>
                {/* Node Sublabel */}
                <text
                  x={node.x + 14} y={node.y + 59}
                  fontFamily="monospace" fontSize={9.5} fontWeight={400}
                  fill={isActive ? "rgba(155,165,180,0.85)" : "rgba(255,255,255,0.15)"}
                  style={{ transition: "fill 0.3s" }}
                >
                  {node.sublabel.length > 25 ? node.sublabel.slice(0, 25) + "…" : node.sublabel}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* ── Right: Vertical Live Stream panel — ZERO overlap ───────────────── */}
      <div className="w-full md:w-[260px] border-t md:border-t-0 md:border-l border-border/20 bg-[#030307]/70 flex flex-col shrink-0 min-h-0">
        <div className="px-4 py-3.5 border-b border-border/20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Live Stream Feed
          </span>
          <span className="ml-auto text-[9px] font-mono text-muted-foreground/30">
            {streamLog.length} active
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none max-h-[160px] md:max-h-none">
          <AnimatePresence mode="popLayout">
            {streamLog.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: 12, y: 4 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={`p-2.5 rounded-xl border text-[11px] font-medium leading-relaxed ${STREAM_STYLE[ev.type] ?? "border-border/10 text-muted-foreground"}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold uppercase tracking-wide opacity-80 text-[9px]">
                    {ev.type}
                  </span>
                  <span className="opacity-40 font-mono text-[9px]">{ev.ts}</span>
                </div>
                <div className="text-foreground/90 font-mono text-[10px] break-words">
                  {ev.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {streamLog.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-8 text-center">
              <span className="text-[10px] text-muted-foreground/30 italic">Waiting for events…</span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
