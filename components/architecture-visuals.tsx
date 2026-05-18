"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Binary,
  Rss,
  Network,
  ArrowRight,
  Zap
} from "lucide-react"

interface PipelineStep {
  title: string
  sub: string
  description: string
  icon: any
  details: string[]
}

const pipelineSteps: PipelineStep[] = [
  {
    title: "SDK Instrumentation Flow",
    sub: "Drop-in context capture",
    description: "The lightweight AgentTracer library automatically instruments agent cognitive loops, tracing nested thoughts, tool arguments, and results with zero overhead.",
    icon: Binary,
    details: ["Context Managers", "@observe Decorators", "Parent-Child UUID linking"]
  },
  {
    title: "Local-First Replay Runtime",
    sub: "100% offline and secure",
    description: "Data never leaves your machine. Trace files are saved as lightweight JSON files locally, streaming over fast IPC sockets directly to the visualizer.",
    icon: Rss,
    details: ["Atomic Trace Files", "Zero cloud telemetry", "Sub-millisecond local sockets"]
  },
  {
    title: "Replay Reconstruction Pipeline",
    sub: "Cognitive DAG assembly",
    description: "Orders incoming events by nanosecond timestamp, mapping nested parent/child branches in memory into a Directed Acyclic Graph (DAG).",
    icon: Network,
    details: ["Dependency parsing", "Dynamic graph layout", "Visual self correction trees"]
  }
]

export function ArchitectureVisuals() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-28 relative overflow-hidden bg-background" id="architecture">
      {/* Background radial effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-radial-purple opacity-[0.05]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-radial-cyan opacity-[0.05]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary uppercase tracking-wider mb-4"
          >
            Replay Engine Walkthrough
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Behind the Replay: <span className="text-gradient-cyan">How it Flows</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Understand the complete lifecycle of AI observability. Trace how cognition events flow from the core agent to a cinematic playback UI in six lightweight steps.
          </motion.p>
        </div>

        {/* The Pipeline Visual Flow Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">

          {/* Left panel: Interactive Step-List (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {pipelineSteps.map((step, idx) => {
              const StepIcon = step.icon
              const isActive = idx === activeStep

              return (
                <motion.div
                  key={step.title}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${isActive
                      ? "bg-card border-primary/40 shadow-[0_0_20px_oklch(0.72_0.19_195/0.05)] text-foreground"
                      : "bg-card/30 border-border/30 hover:border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  whileHover={{ x: 4 }}
                >
                  {/* Glowing active bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                    />
                  )}

                  {/* Step Number Badge */}
                  <div className={`mt-0.5 text-xs font-mono font-bold px-2 py-1 rounded ${isActive ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground"
                    }`}>
                    0{idx + 1}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <StepIcon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <h3 className="font-bold text-base">{step.title}</h3>
                      <span className="text-[11px] font-mono opacity-60">• {step.sub}</span>
                    </div>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-muted-foreground leading-relaxed pt-1"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Right panel: Active Step Live Console Debug Card (5 cols) */}
          <div className="lg:col-span-5 h-full min-h-[420px] flex flex-col justify-between glass-panel rounded-3xl p-6 border border-border/40 bg-card/60 relative overflow-hidden">
            {/* Ambient backdrop glow */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-br from-primary/10 to-accent/10" />

            <div className="relative z-10 flex-1 flex flex-col justify-between">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/30 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[11px] font-mono tracking-widest text-muted-foreground uppercase">
                    Stage Pipeline Active
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted/40 text-[10px] font-mono text-muted-foreground">
                  <Zap className="w-3 h-3 text-primary animate-pulse" />
                  Latency: ~0.5ms
                </div>
              </div>

              {/* Central Visual: Big Icon with Pulsing Waves */}
              <div className="my-10 flex flex-col items-center justify-center relative py-6">
                <div className="relative flex items-center justify-center">
                  {/* Glowing Pulse Rings */}
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.4, 0.15] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-32 h-32 rounded-full border border-primary/20"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.05, 0.2, 0.05] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute w-32 h-32 rounded-full border border-primary/10"
                  />

                  {/* Icon Card */}
                  <motion.div
                    key={activeStep}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center text-primary"
                    style={{ boxShadow: "0 0 30px oklch(0.72 0.19 195 / 0.15)" }}
                  >
                    {(() => {
                      const ActiveIcon = pipelineSteps[activeStep].icon
                      return <ActiveIcon className="w-10 h-10" />
                    })()}
                  </motion.div>
                </div>

                <h4 className="text-xl font-bold mt-6 text-foreground">
                  {pipelineSteps[activeStep].title}
                </h4>
                <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-widest">
                  {pipelineSteps[activeStep].sub}
                </p>
              </div>

              {/* Bottom: Schema Attributes Details */}
              <div className="bg-background/80 rounded-xl p-4 border border-border/30 font-mono text-[11px] leading-relaxed relative">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-primary" />
                  Captured Datatypes
                </div>
                <ul className="space-y-1.5 text-foreground/80">
                  {pipelineSteps[activeStep].details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
