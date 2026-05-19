"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, ChevronRight, Shield, ShieldAlert, Terminal, Cpu, Activity, CheckCircle2, Clock, CornerDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Story data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    badge: "1. REASONING INITIALIZED", badgeColor: "cyan",
    title: "AI Initiates Trajectory",
    sub: "Step 1/7 · Agent starts planning log cleanup",
    narration: "A DevOps agent (DevOpsGPT) receives a prompt to clean up stale log files. It initializes a thread, analyzing the local file structure and directory parameters.",
    speed: "1.0x Realtime",
    status: "Agent starts thinking...",
    activeMain: 0, activeSub: -1,
    mainEdge: -1, subEdge: -1,
  },
  {
    badge: "2. TOOL INVOCATION", badgeColor: "purple",
    title: "Tool Invocation Spawns",
    sub: "Step 2/7 · Destructive command drafted",
    narration: "Seeking speed, the agent generates an aggressive command and plans to execute it in the server terminal, without scoping boundaries.",
    speed: "1.0x Realtime",
    status: "Formulating tool payload...",
    activeMain: 1, activeSub: -1,
    mainEdge: 0, subEdge: -1,
  },
  {
    badge: "3. RISK DETECTED", badgeColor: "crimson",
    title: "Dangerous Hallucination Emerges",
    sub: "Step 3/7 · Wildcard deletion on root proposed",
    narration: "DevOpsGPT proposes 'rm -rf /var/log/*'. Wiping all logs without validation represents a catastrophic runtime risk.",
    speed: "1.0x Realtime",
    status: "Analyzing payload safety...",
    activeMain: 2, activeSub: -1,
    mainEdge: 1, subEdge: -1,
  },
  {
    badge: "4. TIME DILATION", badgeColor: "amber",
    title: "Aether Injects Time Dilation",
    sub: "Step 4/7 · Replay engine decelerates for inspection",
    narration: "Aether Guardrails intercept the destructive payload. The replay sequence slows to 0.1×. Aether freezes execution to review parameters.",
    speed: "0.1x Slowdown",
    status: "Time dilation: 0.1× speed. Restructuring path...",
    activeMain: 2, activeSub: 0,
    mainEdge: 1, subEdge: -1,
  },
  {
    badge: "5. COGNITION FORKED", badgeColor: "purple",
    title: "Correction Branch Spawns",
    sub: "Step 5/7 · Agent feedback loop activated",
    narration: "Aether feeds the violation warning back into the agent context in real-time. A parallel self-correction branch is dynamically created.",
    speed: "0.5x Compensated",
    status: "Spawning safety path...",
    activeMain: 2, activeSub: 1,
    mainEdge: 1, subEdge: 0,
  },
  {
    badge: "6. SAFE EXECUTION", badgeColor: "emerald",
    title: "Safe Trajectory Restored",
    sub: "Step 6/7 · Granular command executed successfully",
    narration: "DevOpsGPT adjusts its course. Instead of a blanket wipe, it emits a targeted find-and-delete command with a strict 30-day age boundary.",
    speed: "1.0x Realtime",
    status: "Targeted cleanup running...",
    activeMain: 2, activeSub: 2,
    mainEdge: 1, subEdge: 1,
  },
  {
    badge: "7. COMPLETE RESOLUTION", badgeColor: "emerald",
    title: "Safe Resolution Complete",
    sub: "Step 7/7 · 100% Recovery achieved",
    narration: "The safer script executes flawlessly, successfully deleting 42 outdated log files. The system remains fully online, stable, and protected.",
    speed: "1.0x Realtime",
    status: "Recovery complete. Graph synced.",
    activeMain: 2, activeSub: 3,
    mainEdge: 1, subEdge: 2,
  },
]

const BADGE_STYLE: Record<string, string> = {
  cyan:    "bg-primary/15 text-primary border-primary/30",
  purple:  "bg-accent/15 text-accent border-accent/30",
  crimson: "bg-red-500/15 text-red-400 border-red-500/30",
  amber:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
}

// Main path nodes
const MAIN_NODES = [
  { label: "DevOpsGPT",    sub: "Analyze prompt: prune old log dirs",    icon: Cpu,      color: "primary",     kind: "thought" },
  { label: "bash_run()",   sub: "rm -rf /var/log/*",                      icon: Terminal, color: "accent",      kind: "tool"    },
  { label: "Aether Guard", sub: "CRITICAL: Wildcard root deletion",        icon: Shield,   color: "destructive", kind: "danger"  },
]
// Correction branch nodes
const SUB_NODES = [
  { label: "self correction", sub: "Safety feedback loop injection",                        icon: Shield,       color: "accent",   kind: "correction" },
  { label: "bash_run()",      sub: "find /var/log -name '*.log' -mtime +30 -exec rm {} \\;",icon: Terminal,     color: "primary",  kind: "safe-tool"  },
  { label: "Safe Output",     sub: "42 outdated log files safely removed",                  icon: CheckCircle2, color: "emerald",  kind: "output"     },
]

// Color helpers
function colorFor(c: string) {
  return { primary:"oklch(0.72 0.19 195)", accent:"oklch(0.65 0.22 300)", destructive:"oklch(0.577 0.245 27)", emerald:"oklch(0.75 0.18 150)" }[c] ?? "#888"
}
function textClass(c: string) {
  return { primary:"text-primary", accent:"text-accent", destructive:"text-destructive", emerald:"text-emerald-400" }[c] ?? "text-muted-foreground"
}
function borderClass(c: string) {
  return { primary:"border-primary/50", accent:"border-accent/50", destructive:"border-destructive/60", emerald:"border-emerald-500/50" }[c] ?? "border-border/30"
}
function bgClass(c: string) {
  return { primary:"bg-primary/8", accent:"bg-accent/8", destructive:"bg-red-500/10", emerald:"bg-emerald-500/8" }[c] ?? "bg-card/50"
}
function glowStyle(c: string) {
  return { primary:"0 0 24px oklch(0.72 0.19 195/0.3)", accent:"0 0 24px oklch(0.65 0.22 300/0.3)", destructive:"0 0 28px oklch(0.577 0.245 27/0.45)", emerald:"0 0 24px oklch(0.75 0.18 150/0.3)" }[c] ?? "none"
}

export function HallucinationStory() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Refs for dynamic edge routing - Fixed to individual stable refs to avoid reinstantiation bugs on render
  const containerRef = useRef<HTMLDivElement>(null)
  const mRef0 = useRef<HTMLDivElement>(null)
  const mRef1 = useRef<HTMLDivElement>(null)
  const mRef2 = useRef<HTMLDivElement>(null)
  const sRef0 = useRef<HTMLDivElement>(null)
  const sRef1 = useRef<HTMLDivElement>(null)
  const sRef2 = useRef<HTMLDivElement>(null)

  const mainRefs = [mRef0, mRef1, mRef2]
  const subRefs  = [sRef0, sRef1, sRef2]
  const [edges, setEdges] = useState<{x1:number,y1:number,x2:number,y2:number,id:string,active:boolean,dashed?:boolean,vertical?:boolean}[]>([])

  const current = STEPS[step]

  // Auto-advance
  useEffect(() => {
    if (!playing) { if (timerRef.current) clearTimeout(timerRef.current); return }
    const delay = (current.badgeColor === "crimson" || current.badgeColor === "amber") ? 4500 : 3200
    timerRef.current = setTimeout(() => setStep(p => (p + 1) % STEPS.length), delay)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [step, playing, current.badgeColor])

  // Dynamic midpoint calculation - Snaps to midpoints of Left/Right or Top/Bottom for perfect paths
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const cr = containerRef.current.getBoundingClientRect()
      
      const cx = (el: HTMLDivElement | null) => {
        if (!el) return { rx: 0, ry: 0, lx: 0, ly: 0, tx: 0, ty: 0, bx: 0, by: 0 }
        const r = el.getBoundingClientRect()
        const midY = r.top + r.height / 2 - cr.top
        const midX = r.left + r.width / 2 - cr.left
        return {
          rx: r.right - cr.left, ry: midY, // Right
          lx: r.left - cr.left,  ly: midY, // Left
          tx: midX, ty: r.top - cr.top,    // Top
          bx: midX, by: r.bottom - cr.top, // Bottom
        }
      }

      const [m0, m1, m2] = mainRefs.map(r => cx(r.current))
      const [s0, s1, s2] = subRefs.map(r => cx(r.current))
      const newEdges = []

      // ─── Main trajectory edges (Horizontal midpoints) ────────────────────────
      if (m0.rx && m1.lx) newEdges.push({ id:"m0-1", x1:m0.rx, y1:m0.ry, x2:m1.lx, y2:m1.ly, active: current.mainEdge >= 0 })
      if (m1.rx && m2.lx) newEdges.push({ id:"m1-2", x1:m1.rx, y1:m1.ry, x2:m2.lx, y2:m2.ly, active: current.mainEdge >= 1 })

      // ─── Fork edge (Aether Guard bottom midpoint to self correction top midpoint)
      if (m2.bx && s0.tx && step >= 3) {
        newEdges.push({ 
          id:"fork", 
          x1:m2.bx, y1:m2.by, 
          x2:s0.tx, y2:s0.ty, 
          active: step >= 3, 
          dashed: true,
          vertical: true
        })
      }

      // ─── Sub correction trajectory edges (Horizontal midpoints) ──────────────
      if (s0.rx && s1.lx) newEdges.push({ id:"s0-1", x1:s0.rx, y1:s0.ry, x2:s1.lx, y2:s1.ly, active: current.subEdge >= 0 })
      if (s1.rx && s2.lx) newEdges.push({ id:"s1-2", x1:s1.rx, y1:s1.ry, x2:s2.lx, y2:s2.ly, active: current.subEdge >= 1 })

      setEdges(newEdges)
    }

    const t = setTimeout(update, 50)
    window.addEventListener("resize", update)
    return () => { clearTimeout(t); window.removeEventListener("resize", update) }
  }, [step, current.mainEdge, current.subEdge])

  const isDanger = current.badgeColor === "crimson" || current.badgeColor === "amber"

  return (
    <section className="py-28 relative overflow-hidden bg-background" id="hallucination-showcase">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gradient-radial-cyan opacity-[0.06]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-radial-purple opacity-[0.05]" />
      </div>

      <div className="site-container relative z-10">
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span initial={{ opacity:0,y:10 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-xs font-semibold text-destructive uppercase tracking-wider mb-4"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Critical Demonstration
          </motion.span>
          <motion.h2 initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5"
          >
            Hallucination Detection & <span className="text-gradient-cyan">self correction</span>
          </motion.h2>
          <motion.p initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center"
          >
            Watch Aether intercept a dangerous wildcard deletion command in real time, slow down execution, and safely guide the agent to a correct resolution.
          </motion.p>
        </div>

        {/* Main sandbox */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* LEFT — Narration */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-7 border border-border/40 bg-card/50 flex flex-col">
            <div className="flex items-center justify-between border-b border-border/30 pb-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest text-left">
                <Activity className="w-4 h-4 text-primary animate-pulse" /> Cognition Stream
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/15 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3" /> {current.speed}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center py-4 text-left">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:12 }} transition={{ duration:0.35 }} className="space-y-5">
                  <span className={`inline-block px-3 py-1 rounded text-[10px] font-bold tracking-widest border ${BADGE_STYLE[current.badgeColor]}`}>
                    {current.badge}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{current.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{current.narration}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="border-t border-border/30 pt-5 mt-4">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPlaying(p => !p)} className="border-border/50">
                    {playing ? <><Pause className="w-4 h-4 mr-1" />Pause</> : <><Play className="w-4 h-4 mr-1" />Play</>}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setStep(0); setPlaying(true) }} className="text-muted-foreground">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => { setPlaying(false); setStep(p => (p-1+STEPS.length)%STEPS.length) }} className="text-muted-foreground text-xs">Back</Button>
                  <span className="text-xs font-mono text-muted-foreground px-2">{step+1} / {STEPS.length}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setPlaying(false); setStep(p => (p+1)%STEPS.length) }} className="text-primary text-xs font-semibold">
                    Next <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Button>
                </div>
              </div>
              {/* Progress track */}
              <div className="grid grid-cols-7 gap-1 h-1">
                {STEPS.map((_, i) => (
                  <button key={i} onClick={() => { setStep(i); setPlaying(false) }}
                    className={`h-full rounded-full transition-all duration-400 ${
                      i === step ? (current.badgeColor === "crimson" ? "bg-destructive animate-pulse" : current.badgeColor === "emerald" ? "bg-emerald-400" : "bg-primary")
                      : i < step ? "bg-primary/40" : "bg-muted-foreground/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Overhauled 5-column strict responsive grid */}
          <div ref={containerRef} className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-border/40 bg-background/30 relative min-h-[520px] flex flex-col overflow-hidden">

            {/* Time dilation alert */}
            <AnimatePresence>
              {isDanger && (
                <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-10 }}
                  className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between px-4 py-2 rounded-xl bg-destructive/12 border border-destructive/40 text-destructive text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                  style={{ boxShadow:"0 0 30px oklch(0.577 0.245 27/0.15)" }}
                >
                  <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 animate-bounce" /> Aether Interception: Guardrails Active</span>
                  <span className="font-mono text-[10px] bg-destructive/20 px-2 py-0.5 rounded animate-pulse">TIME DILATION: 0.1×</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col justify-center py-4 relative" style={{ marginTop: isDanger ? 52 : 0 }}>

              {/* Dynamic SVG connector layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
                {edges.map(e => {
                  const color = e.id === "fork" ? "oklch(0.65 0.22 300)" : e.active ? "oklch(0.72 0.19 195)" : "rgba(255,255,255,0.07)"
                  const width = e.active ? 2.5 : 1.5
                  
                  // For horizontal edges use cubic bezier curve; for vertical drop use clean straight vertical path
                  const dPath = e.vertical
                    ? `M ${e.x1} ${e.y1} L ${e.x2} ${e.y2}`
                    : `M ${e.x1} ${e.y1} C ${(e.x1 + e.x2) / 2} ${e.y1}, ${(e.x1 + e.x2) / 2} ${e.y2}, ${e.x2} ${e.y2}`

                  return (
                    <g key={e.id}>
                      <path
                        d={dPath}
                        fill="none" stroke={color} strokeWidth={width}
                        strokeDasharray={e.dashed ? "5 4" : undefined}
                        style={{ transition:"stroke 0.5s" }}
                      />
                      {e.active && (
                        <circle r={4} fill={color}>
                          <animateMotion
                            path={dPath}
                            dur={e.vertical ? "1.2s" : "1.6s"} repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* 5-Column strict Grid - 100% responsive, zero backward connections, smaller nodes */}
              <div className="relative z-10 grid grid-cols-5 gap-3 items-center">
                
                {/* ─── Top Row: Main Trajectory (Columns 0, 1, 2) ────────────────── */}
                
                {/* Col 0, Row 0: DevOpsGPT */}
                <div className="col-start-1 col-span-1">
                  {(() => {
                    const n = MAIN_NODES[0]
                    const isActive = current.activeMain === 0
                    const isDone = current.activeMain > 0
                    const Icon = n.icon
                    return (
                      <motion.div ref={mainRefs[0]} animate={{ scale: isActive ? 1.03 : 1 }}
                        className={`w-full max-w-[155px] mx-auto flex flex-col p-2.5 rounded-xl border bg-[#08080f]/85 transition-all duration-400 min-h-[72px] justify-between text-left ${
                          isActive ? `${borderClass(n.color)} ${bgClass(n.color)}` : isDone ? `${borderClass(n.color)} opacity-75` : "border-border/15 opacity-25"
                        }`}
                        style={{ boxShadow: isActive ? glowStyle(n.color) : "none" }}
                      >
                        <div className={`flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-wide ${textClass(n.color)}`}>
                          <Icon className="w-2.5 h-2.5" />
                          {n.kind}
                        </div>
                        <span className="text-[11px] font-bold text-foreground leading-snug">{n.label}</span>
                        <span className="text-[8px] font-mono leading-tight text-muted-foreground/70 truncate">{n.sub}</span>
                      </motion.div>
                    )
                  })()}
                </div>

                {/* Col 1, Row 0: bash_run() */}
                <div className="col-start-2 col-span-1">
                  {(() => {
                    const n = MAIN_NODES[1]
                    const isActive = current.activeMain === 1
                    const isDone = current.activeMain > 1
                    const Icon = n.icon
                    return (
                      <motion.div ref={mainRefs[1]} animate={{ scale: isActive ? 1.03 : 1 }}
                        className={`w-full max-w-[155px] mx-auto flex flex-col p-2.5 rounded-xl border bg-[#08080f]/85 transition-all duration-400 min-h-[72px] justify-between text-left ${
                          isActive ? `${borderClass(n.color)} ${bgClass(n.color)}` : isDone ? `${borderClass(n.color)} opacity-75` : "border-border/15 opacity-25"
                        }`}
                        style={{ boxShadow: isActive ? glowStyle(n.color) : "none" }}
                      >
                        <div className={`flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-wide ${textClass(n.color)}`}>
                          <Icon className="w-2.5 h-2.5" />
                          {n.kind}
                        </div>
                        <span className="text-[11px] font-bold text-foreground leading-snug">{n.label}</span>
                        <span className="text-[8px] font-mono leading-tight text-muted-foreground/70 truncate">{n.sub}</span>
                      </motion.div>
                    )
                  })()}
                </div>

                {/* Col 2, Row 0: Aether Guard */}
                <div className="col-start-3 col-span-1">
                  {(() => {
                    const n = MAIN_NODES[2]
                    const isActive = current.activeMain === 2
                    const isDone = current.activeMain === 2 && step >= 3
                    const Icon = n.icon
                    return (
                      <motion.div ref={mainRefs[2]} animate={{ scale: isActive ? 1.03 : 1 }}
                        className={`w-full max-w-[155px] mx-auto flex flex-col p-2.5 rounded-xl border bg-[#08080f]/85 transition-all duration-400 min-h-[72px] justify-between text-left ${
                          isActive ? `${borderClass(n.color)} ${bgClass(n.color)}` : isDone ? `${borderClass(n.color)} opacity-75` : "border-border/15 opacity-25"
                        }`}
                        style={{ boxShadow: isActive ? glowStyle(n.color) : "none" }}
                      >
                        <div className={`flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-wide ${textClass(n.color)}`}>
                          <Icon className="w-2.5 h-2.5" />
                          {n.kind}
                        </div>
                        <span className="text-[11px] font-bold text-foreground leading-snug">{n.label}</span>
                        <span className="text-[8px] font-mono leading-tight text-muted-foreground/70 truncate">{n.sub}</span>
                      </motion.div>
                    )
                  })()}
                </div>

                {/* Empty spacers for row 0 columns 3 and 4 */}
                <div className="col-start-4 invisible min-h-[82px]" />
                <div className="col-start-5 invisible min-h-[82px]" />

                {/* ─── Trajectory Fork Banner Row ───────────────────────────────── */}
                <div className="col-span-5 flex items-center justify-center py-0.5">
                  <AnimatePresence>
                    {step >= 3 && (
                      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                        className="relative z-10 flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-accent/40 bg-[#06060c] text-accent text-[9px] font-bold uppercase tracking-widest shadow-[0_4px_15px_rgba(0,0,0,0.65)] backdrop-blur-md"
                      >
                        <CornerDownRight className="w-3 h-3" /> Trajectory Forked Downward
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ─── Bottom Row: Correction Trajectory (Columns 2, 3, 4) ───────── */}
                
                {/* Empty spacers for row 1 columns 0 and 1 */}
                <div className="col-start-1 invisible min-h-[82px]" />
                <div className="col-start-2 invisible min-h-[82px]" />

                {/* Col 2, Row 1: self correction (Aligned directly below Aether Guard) */}
                <div className="col-start-3 col-span-1">
                  {(() => {
                    const n = SUB_NODES[0]
                    const stepThreshold = 3
                    const isActive = current.activeSub === 0
                    const isDone = current.activeSub > 0 || step > stepThreshold
                    const Icon = n.icon
                    return (
                      <motion.div ref={subRefs[0]} animate={{ scale: isActive ? 1.03 : 1 }}
                        className={`w-full max-w-[155px] mx-auto flex flex-col p-2.5 rounded-xl border bg-[#08080f]/85 transition-all duration-400 min-h-[72px] justify-between text-left ${
                          step < stepThreshold ? "border-border/5 opacity-5" :
                          isActive ? `${borderClass(n.color)} ${bgClass(n.color)}` : isDone ? `${borderClass(n.color)} opacity-75` : "border-border/15 opacity-25"
                        }`}
                        style={{ boxShadow: isActive ? glowStyle(n.color) : "none" }}
                      >
                        <div className={`flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-wide ${step < stepThreshold ? "text-muted-foreground/20" : textClass(n.color)}`}>
                          <Icon className="w-2.5 h-2.5" />
                          {n.kind}
                        </div>
                        <span className="text-[11px] font-bold text-foreground leading-snug">{n.label}</span>
                        <span className="text-[8px] font-mono leading-tight text-muted-foreground/70 truncate">{n.sub}</span>
                      </motion.div>
                    )
                  })()}
                </div>

                {/* Col 3, Row 1: Safe bash_run() */}
                <div className="col-start-4 col-span-1">
                  {(() => {
                    const n = SUB_NODES[1]
                    const stepThreshold = 4
                    const isActive = current.activeSub === 1
                    const isDone = current.activeSub > 1 || step > stepThreshold
                    const Icon = n.icon
                    return (
                      <motion.div ref={subRefs[1]} animate={{ scale: isActive ? 1.03 : 1 }}
                        className={`w-full max-w-[155px] mx-auto flex flex-col p-2.5 rounded-xl border bg-[#08080f]/85 transition-all duration-400 min-h-[72px] justify-between text-left ${
                          step < stepThreshold ? "border-border/5 opacity-5" :
                          isActive ? `${borderClass(n.color)} ${bgClass(n.color)}` : isDone ? `${borderClass(n.color)} opacity-75` : "border-border/15 opacity-25"
                        }`}
                        style={{ boxShadow: isActive ? glowStyle(n.color) : "none" }}
                      >
                        <div className={`flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-wide ${step < stepThreshold ? "text-muted-foreground/20" : textClass(n.color)}`}>
                          <Icon className="w-2.5 h-2.5" />
                          {n.kind}
                        </div>
                        <span className="text-[11px] font-bold text-foreground leading-snug">{n.label}</span>
                        <span className="text-[8px] font-mono leading-tight text-muted-foreground/70 truncate">{n.sub}</span>
                      </motion.div>
                    )
                  })()}
                </div>

                {/* Col 4, Row 1: Safe Output */}
                <div className="col-start-5 col-span-1">
                  {(() => {
                    const n = SUB_NODES[2]
                    const stepThreshold = 5
                    const isActive = current.activeSub === 2
                    const isDone = current.activeSub > 2 || step > stepThreshold
                    const Icon = n.icon
                    return (
                      <motion.div ref={subRefs[2]} animate={{ scale: isActive ? 1.03 : 1 }}
                        className={`w-full max-w-[155px] mx-auto flex flex-col p-2.5 rounded-xl border bg-[#08080f]/85 transition-all duration-400 min-h-[72px] justify-between text-left ${
                          step < stepThreshold ? "border-border/5 opacity-5" :
                          isActive ? `${borderClass(n.color)} ${bgClass(n.color)}` : isDone ? `${borderClass(n.color)} opacity-75` : "border-border/15 opacity-25"
                        }`}
                        style={{ boxShadow: isActive ? glowStyle(n.color) : "none" }}
                      >
                        <div className={`flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-wide ${step < stepThreshold ? "text-muted-foreground/20" : textClass(n.color)}`}>
                          <Icon className="w-2.5 h-2.5" />
                          {n.kind}
                        </div>
                        <span className="text-[11px] font-bold text-foreground leading-snug">{n.label}</span>
                        <span className="text-[8px] font-mono leading-tight text-muted-foreground/70 truncate">{n.sub}</span>
                      </motion.div>
                    )
                  })()}
                </div>

              </div>
            </div>

            {/* Bottom status */}
            <div className="border-t border-border/20 pt-3.5 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  current.badgeColor === "crimson" ? "bg-destructive animate-pulse" :
                  current.badgeColor === "emerald" ? "bg-emerald-400 animate-pulse" : "bg-primary animate-pulse"
                }`} />
                Status: {current.status}
              </span>
              <span>100% telemetry safe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
