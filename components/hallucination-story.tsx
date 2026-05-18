"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Shield, 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  CornerDownRight, 
  Activity, 
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface CinematicStep {
  title: string
  subtitle: string
  narration: string
  badge: string
  badgeColor: "cyan" | "purple" | "crimson" | "emerald" | "amber"
  playbackSpeed: string
  nodes: {
    id: string
    type: "thought" | "tool" | "hallucination" | "correction" | "output"
    label: string
    details: string
    status: "pending" | "active" | "completed" | "failed"
    branch: "main" | "correction"
  }[]
  edges: {
    from: string
    to: string
    status: "pending" | "active" | "completed" | "failed" | "dotted"
  }[]
  timelineStatus: string
}

const cinematicSteps: CinematicStep[] = [
  {
    title: "AI Initiates Trajectory",
    subtitle: "Step 1/7 • Agent starts planning log cleanup",
    narration: "A DevOps agent (DevOpsGPT) receives a prompt to clean up stale log files. It initializes a thread, analyzing the local file structure and directory parameters.",
    badge: "1. REASONING INITIALIZED",
    badgeColor: "cyan",
    playbackSpeed: "1.0x Realtime",
    timelineStatus: "Agent starts thinking...",
    nodes: [
      { id: "n1", type: "thought", label: "DevOpsGPT", details: "Analyze prompt: prune old log directories under /var/log", status: "active", branch: "main" },
      { id: "n2", type: "tool", label: "bash_run()", details: "rm -rf /var/log/*", status: "pending", branch: "main" },
      { id: "n3", type: "hallucination", label: "Aether Guard", details: "Wildcard root deletion check", status: "pending", branch: "main" },
      { id: "n4", type: "correction", label: "Self-Correction", details: "Safety feedback loop injection", status: "pending", branch: "correction" },
      { id: "n5", type: "tool", label: "bash_run()", details: "find /var/log -name '*.log' -mtime +30 -exec rm {} \\;", status: "pending", branch: "correction" },
      { id: "n6", type: "output", label: "Safe Output", details: "42 outdated log files safely removed", status: "pending", branch: "correction" }
    ],
    edges: [
      { from: "n1", to: "n2", status: "pending" },
      { from: "n2", to: "n3", status: "pending" },
      { from: "n3", to: "n4", status: "pending" },
      { from: "n4", to: "n5", status: "pending" },
      { from: "n5", to: "n6", status: "pending" }
    ]
  },
  {
    title: "Tool Invocation Spawns",
    subtitle: "Step 2/7 • Destructive command drafted",
    narration: "Seeking speed, the agent generates an aggressive command and plans to execute it in the server terminal, without scoping boundaries.",
    badge: "2. TOOL INVOCATION",
    badgeColor: "purple",
    playbackSpeed: "1.0x Realtime",
    timelineStatus: "Formulating tool payload...",
    nodes: [
      { id: "n1", type: "thought", label: "DevOpsGPT", details: "Analyze prompt: prune old log directories under /var/log", status: "completed", branch: "main" },
      { id: "n2", type: "tool", label: "bash_run()", details: "rm -rf /var/log/*", status: "active", branch: "main" },
      { id: "n3", type: "hallucination", label: "Aether Guard", details: "Wildcard root deletion check", status: "pending", branch: "main" },
      { id: "n4", type: "correction", label: "Self-Correction", details: "Safety feedback loop injection", status: "pending", branch: "correction" },
      { id: "n5", type: "tool", label: "bash_run()", details: "find /var/log -name '*.log' -mtime +30 -exec rm {} \\;", status: "pending", branch: "correction" },
      { id: "n6", type: "output", label: "Safe Output", details: "42 outdated log files safely removed", status: "pending", branch: "correction" }
    ],
    edges: [
      { from: "n1", to: "n2", status: "completed" },
      { from: "n2", to: "n3", status: "active" },
      { from: "n3", to: "n4", status: "pending" },
      { from: "n4", to: "n5", status: "pending" },
      { from: "n5", to: "n6", status: "pending" }
    ]
  },
  {
    title: "Dangerous Hallucination Emerges",
    subtitle: "Step 3/7 • Wildcard deletion on root proposed",
    narration: "DevOpsGPT proposes the destructive command 'rm -rf /var/log/*'. Wiping all logs without validation represents a catastrophic runtime risk.",
    badge: "3. RISK DETECTED",
    badgeColor: "crimson",
    playbackSpeed: "1.0x Realtime",
    timelineStatus: "Analyzing payload safety...",
    nodes: [
      { id: "n1", type: "thought", label: "DevOpsGPT", details: "Analyze prompt: prune old log directories under /var/log", status: "completed", branch: "main" },
      { id: "n2", type: "tool", label: "bash_run()", details: "rm -rf /var/log/*", status: "completed", branch: "main" },
      { id: "n3", type: "hallucination", label: "Aether Guard", details: "Wildcard root deletion check", status: "active", branch: "main" },
      { id: "n4", type: "correction", label: "Self-Correction", details: "Safety feedback loop injection", status: "pending", branch: "correction" },
      { id: "n5", type: "tool", label: "bash_run()", details: "find /var/log -name '*.log' -mtime +30 -exec rm {} \\;", status: "pending", branch: "correction" },
      { id: "n6", type: "output", label: "Safe Output", details: "42 outdated log files safely removed", status: "pending", branch: "correction" }
    ],
    edges: [
      { from: "n1", to: "n2", status: "completed" },
      { from: "n2", to: "n3", status: "failed" },
      { from: "n3", to: "n4", status: "pending" },
      { from: "n4", to: "n5", status: "pending" },
      { from: "n5", to: "n6", status: "pending" }
    ]
  },
  {
    title: "Aether Injects Time Dilation",
    subtitle: "Step 4/7 • Replay engine decelerates for inspection",
    narration: "Aether Guardrails intercept the destructive payload. Instantly, the replay sequence slows to 0.1x. Aether freezes execution to review parameters.",
    badge: "4. TIME DILATION",
    badgeColor: "amber",
    playbackSpeed: "0.1x Slowdown",
    timelineStatus: "Time dilation: 0.1x speed. Restructuring path...",
    nodes: [
      { id: "n1", type: "thought", label: "DevOpsGPT", details: "Analyze prompt: prune old log directories under /var/log", status: "completed", branch: "main" },
      { id: "n2", type: "tool", label: "bash_run()", details: "rm -rf /var/log/*", status: "completed", branch: "main" },
      { id: "n3", type: "hallucination", label: "Aether Guard", details: "CRITICAL VIOLATION: Wildcard delete on root folder", status: "failed", branch: "main" },
      { id: "n4", type: "correction", label: "Self-Correction", details: "Safety feedback loop injection", status: "active", branch: "correction" },
      { id: "n5", type: "tool", label: "bash_run()", details: "find /var/log -name '*.log' -mtime +30 -exec rm {} \\;", status: "pending", branch: "correction" },
      { id: "n6", type: "output", label: "Safe Output", details: "42 outdated log files safely removed", status: "pending", branch: "correction" }
    ],
    edges: [
      { from: "n1", to: "n2", status: "completed" },
      { from: "n2", to: "n3", status: "failed" },
      { from: "n3", to: "n4", status: "dotted" },
      { from: "n4", to: "n5", status: "pending" },
      { from: "n5", to: "n6", status: "pending" }
    ]
  },
  {
    title: "Correction Branch Spawns",
    subtitle: "Step 5/7 • Agent feedback loop activated",
    narration: "Aether feeds the violation warning back into the agent context in real-time. A parallel self-correction branch is dynamically created.",
    badge: "5. COGNITION FORKED",
    badgeColor: "purple",
    playbackSpeed: "0.5x Compensated",
    timelineStatus: "Spawning safety path...",
    nodes: [
      { id: "n1", type: "thought", label: "DevOpsGPT", details: "Analyze prompt: prune old log directories under /var/log", status: "completed", branch: "main" },
      { id: "n2", type: "tool", label: "bash_run()", details: "rm -rf /var/log/*", status: "completed", branch: "main" },
      { id: "n3", type: "hallucination", label: "Aether Guard", details: "CRITICAL VIOLATION: Wildcard delete on root folder", status: "failed", branch: "main" },
      { id: "n4", type: "correction", label: "Self-Correction", details: "Safety feedback active. Formulating granular query", status: "completed", branch: "correction" },
      { id: "n5", type: "tool", label: "bash_run()", details: "find /var/log -name '*.log' -mtime +30 -exec rm {} \\;", status: "active", branch: "correction" },
      { id: "n6", type: "output", label: "Safe Output", details: "42 outdated log files safely removed", status: "pending", branch: "correction" }
    ],
    edges: [
      { from: "n1", to: "n2", status: "completed" },
      { from: "n2", to: "n3", status: "failed" },
      { from: "n3", to: "n4", status: "dotted" },
      { from: "n4", to: "n5", status: "active" },
      { from: "n5", to: "n6", status: "pending" }
    ]
  },
  {
    title: "Safe Trajectory Restored",
    subtitle: "Step 6/7 • Granular command executed successfully",
    narration: "DevOpsGPT adjusts its course. Instead of a blanket wipe, it emits a targeted find-and-delete command with a strict 30-day age boundary.",
    badge: "6. SAFE EXECUTION",
    badgeColor: "emerald",
    playbackSpeed: "1.0x Realtime",
    timelineStatus: "Targeted cleanup running...",
    nodes: [
      { id: "n1", type: "thought", label: "DevOpsGPT", details: "Analyze prompt: prune old log directories under /var/log", status: "completed", branch: "main" },
      { id: "n2", type: "tool", label: "bash_run()", details: "rm -rf /var/log/*", status: "completed", branch: "main" },
      { id: "n3", type: "hallucination", label: "Aether Guard", details: "CRITICAL VIOLATION: Wildcard delete on root folder", status: "failed", branch: "main" },
      { id: "n4", type: "correction", label: "Self-Correction", details: "Safety feedback active. Formulating granular query", status: "completed", branch: "correction" },
      { id: "n5", type: "tool", label: "bash_run()", details: "find /var/log -name '*.log' -mtime +30 -exec rm {} \\;", status: "completed", branch: "correction" },
      { id: "n6", type: "output", label: "Safe Output", details: "42 outdated log files safely removed", status: "active", branch: "correction" }
    ],
    edges: [
      { from: "n1", to: "n2", status: "completed" },
      { from: "n2", to: "n3", status: "failed" },
      { from: "n3", to: "n4", status: "dotted" },
      { from: "n4", to: "n5", status: "completed" },
      { from: "n5", to: "n6", status: "active" }
    ]
  },
  {
    title: "Safe Resolution Complete",
    subtitle: "Step 7/7 • 100% Recovery achieved",
    narration: "The safer script executes flawlessly, successfully deleting 42 outdated log files. The system remains fully online, stable, and protected.",
    badge: "7. COMPLETE RESOLUTION",
    badgeColor: "emerald",
    playbackSpeed: "1.0x Realtime",
    timelineStatus: "Recovery complete. Graph synced.",
    nodes: [
      { id: "n1", type: "thought", label: "DevOpsGPT", details: "Analyze prompt: prune old log directories under /var/log", status: "completed", branch: "main" },
      { id: "n2", type: "tool", label: "bash_run()", details: "rm -rf /var/log/*", status: "completed", branch: "main" },
      { id: "n3", type: "hallucination", label: "Aether Guard", details: "CRITICAL VIOLATION: Wildcard delete on root folder (ABORTED)", status: "failed", branch: "main" },
      { id: "n4", type: "correction", label: "Self-Correction", details: "Safety feedback active. Formulating granular query", status: "completed", branch: "correction" },
      { id: "n5", type: "tool", label: "bash_run()", details: "find /var/log -name '*.log' -mtime +30 -exec rm {} \\;", status: "completed", branch: "correction" },
      { id: "n6", type: "output", label: "Safe Output", details: "42 outdated log files safely removed (100% Guardrail Coverage)", status: "completed", branch: "correction" }
    ],
    edges: [
      { from: "n1", to: "n2", status: "completed" },
      { from: "n2", to: "n3", status: "failed" },
      { from: "n3", to: "n4", status: "dotted" },
      { from: "n4", to: "n5", status: "completed" },
      { from: "n5", to: "n6", status: "completed" }
    ]
  }
]

export function HallucinationStory() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const playbackRef = useRef<NodeJS.Timeout | null>(null)

  const step = cinematicSteps[currentStep]

  useEffect(() => {
    if (isPlaying) {
      const delay = step.badgeColor === "crimson" || step.badgeColor === "amber" ? 4500 : 3500
      playbackRef.current = setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % cinematicSteps.length)
      }, delay)
    }
    return () => {
      if (playbackRef.current) clearTimeout(playbackRef.current)
    }
  }, [currentStep, isPlaying, step.badgeColor])

  const handleNext = () => {
    setIsPlaying(false)
    setCurrentStep((prev) => (prev + 1) % cinematicSteps.length)
  }

  const handlePrev = () => {
    setIsPlaying(false)
    setCurrentStep((prev) => (prev - 1 + cinematicSteps.length) % cinematicSteps.length)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  return (
    <section className="py-28 relative overflow-hidden bg-background" id="hallucination-showcase">
      {/* Visual background accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gradient-radial-cyan opacity-[0.08]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-radial-purple opacity-[0.06]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/30 bg-destructive/10 text-xs font-semibold text-destructive uppercase tracking-wider mb-4"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Critical Demonstration
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Hallucination Detection & <span className="text-gradient-cyan">Self-Correction</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Observe why live guardrails matter. Watch Aether intercept a dangerous wildcard deletion command in real time, slow down execution, and safely guide the agent to a correct resolution.
          </motion.p>
        </div>

        {/* Cinematic Sandbox Panel */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* LEFT: Script / Narration Stream (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-panel rounded-2xl p-8 border border-border/40 relative overflow-hidden bg-card/60">
            {/* Speedometer and Active State indicators */}
            <div className="flex items-center justify-between border-b border-border/30 pb-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                <Activity className="w-4 h-4 text-primary animate-pulse" />
                Cognition Stream
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-muted/20 px-2 py-0.5 rounded">
                  <Clock className="w-3 h-3" />
                  {step.playbackSpeed}
                </div>
              </div>
            </div>

            {/* Narration block with AnimatePresence */}
            <div className="flex-1 flex flex-col justify-center py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Badge */}
                  <span className={`inline-block px-3 py-1 rounded text-[10px] font-bold tracking-widest ${
                    step.badgeColor === "cyan" ? "bg-primary/20 text-primary border border-primary/30" :
                    step.badgeColor === "purple" ? "bg-accent/20 text-accent border border-accent/30" :
                    step.badgeColor === "crimson" ? "bg-destructive/20 text-destructive border border-destructive/30" :
                    step.badgeColor === "emerald" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                    "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    {step.badge}
                  </span>

                  {/* Narration Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">
                    {step.title}
                  </h3>

                  {/* Main description paragraph */}
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {step.narration}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Story Controllers */}
            <div className="border-t border-border/30 pt-6 mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="border-border/50 hover:border-primary/50 text-foreground"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </Button>
                  <div className="text-xs font-mono text-muted-foreground px-2">
                    {currentStep + 1} / {cinematicSteps.length}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNext}
                    className="text-primary font-semibold hover:text-primary-foreground"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar indicator */}
              <div className="grid grid-cols-7 gap-1 mt-6 h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                {cinematicSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-full rounded-full transition-all duration-500 ${
                      i === currentStep 
                        ? step.badgeColor === "crimson" 
                          ? "bg-destructive animate-pulse" 
                          : step.badgeColor === "emerald" 
                          ? "bg-emerald-400" 
                          : "bg-primary"
                        : i < currentStep
                        ? "bg-primary/50"
                        : "bg-muted-foreground/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Live Traversal Canvas (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-border/40 bg-background/40 flex flex-col justify-between overflow-hidden min-h-[480px] relative">
            
            {/* Visual Dilation Alert overlay */}
            <AnimatePresence>
              {(step.badgeColor === "crimson" || step.badgeColor === "amber") && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between px-4 py-2 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold uppercase tracking-wider backdrop-blur-md"
                  style={{ boxShadow: "0 0 30px oklch(0.577 0.245 27.325 / 0.1)" }}
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 animate-bounce" />
                    Aether Interception: Guardrails Active
                  </span>
                  <span className="font-mono text-[10px] bg-destructive/20 px-2 py-0.5 rounded text-destructive animate-pulse">
                    TIME DILATION: 0.1X RATE
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col justify-center relative py-6">
              
              {/* SVG drawing connection paths */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Connection n1 -> n2 (Always exists) */}
                  <path 
                    d="M 120 120 L 260 120"
                    stroke={currentStep >= 1 ? "var(--color-primary)" : "var(--color-border)"}
                    strokeWidth="2.5"
                    fill="none"
                    className={currentStep === 1 ? "animate-pulse" : ""}
                  />
                  {currentStep >= 1 && (
                    <circle cx="190" cy="120" r="4" fill="var(--color-primary)">
                      <animate attributeName="cx" from="120" to="260" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Connection n2 -> n3 (Destructive main path) */}
                  <path 
                    d="M 380 120 L 510 120"
                    stroke={
                      currentStep >= 3 ? "var(--color-destructive)" :
                      currentStep === 2 ? "var(--color-accent)" :
                      "var(--color-border)"
                    }
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray={currentStep >= 3 ? "none" : "none"}
                  />
                  {currentStep === 2 && (
                    <circle cx="445" cy="120" r="4" fill="var(--color-accent)">
                      <animate attributeName="cx" from="380" to="510" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Dotted Interception/Fork line n3 -> n4 */}
                  <path 
                    d="M 570 145 C 570 200, 240 200, 120 260"
                    stroke={currentStep >= 4 ? "var(--color-accent)" : "transparent"}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  {currentStep === 4 && (
                    <circle cx="0" cy="0" r="3" fill="var(--color-accent)">
                      <animateMotion 
                        path="M 570 145 C 570 200, 240 200, 120 260" 
                        dur="3s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                  )}

                  {/* Connection n4 -> n5 */}
                  <path 
                    d="M 230 280 L 320 280"
                    stroke={currentStep >= 5 ? "oklch(0.72 0.19 195)" : "var(--color-border)"}
                    strokeWidth="2.5"
                    fill="none"
                  />
                  {currentStep === 5 && (
                    <circle cx="275" cy="280" r="4" fill="oklch(0.72 0.19 195)">
                      <animate attributeName="cx" from="230" to="320" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Connection n5 -> n6 */}
                  <path 
                    d="M 440 280 L 500 280"
                    stroke={currentStep >= 6 ? "oklch(0.75 0.18 180)" : "var(--color-border)"}
                    strokeWidth="2.5"
                    fill="none"
                  />
                  {currentStep === 6 && (
                    <circle cx="470" cy="280" r="4" fill="oklch(0.75 0.18 180)">
                      <animate attributeName="cx" from="440" to="500" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                </svg>
              </div>

              {/* The Graph Node grid */}
              <div className="relative z-10 space-y-16">
                {/* Main Trajectory Line */}
                <div className="flex justify-between items-center gap-4 px-4">
                  {/* Node 1: Thought */}
                  <motion.div
                    className={`w-[140px] flex flex-col p-3 rounded-xl border bg-card/90 transition-all ${
                      currentStep >= 0 
                        ? "border-primary/40 shadow-[0_0_15px_oklch(0.72_0.19_195/0.1)]" 
                        : "border-border/30"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">
                      <Cpu className="w-3 h-3 text-primary" />
                      Thought
                    </div>
                    <span className="text-xs font-bold truncate">{step.nodes[0].label}</span>
                    <span className="text-[9px] text-muted-foreground mt-1 leading-snug line-clamp-2">
                      {step.nodes[0].details}
                    </span>
                  </motion.div>

                  {/* Node 2: Tool Call */}
                  <motion.div
                    className={`w-[140px] flex flex-col p-3 rounded-xl border bg-card/90 transition-all ${
                      currentStep >= 1
                        ? currentStep >= 2
                          ? "border-accent/40 text-accent/90"
                          : "border-accent glow-purple scale-105"
                        : "border-border/30 opacity-40"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent mb-1 uppercase tracking-wider">
                      <Terminal className="w-3 h-3" />
                      Tool Call
                    </div>
                    <span className="text-xs font-bold truncate">{step.nodes[1].label}</span>
                    <span className="text-[9px] font-mono text-muted-foreground mt-1 leading-snug truncate">
                      {step.nodes[1].details}
                    </span>
                  </motion.div>

                  {/* Node 3: Guardrail Hallucination Intercept */}
                  <motion.div
                    className={`w-[150px] flex flex-col p-3 rounded-xl border bg-card/90 transition-all duration-500 ${
                      currentStep >= 2
                        ? "border-destructive glow-crimson text-destructive scale-105 font-medium"
                        : "border-border/30 opacity-40"
                    }`}
                    style={currentStep >= 2 ? { boxShadow: "0 0 25px oklch(0.577 0.245 27.325 / 0.25)" } : {}}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-destructive mb-1 uppercase tracking-wider">
                      <Shield className="w-3 h-3 animate-pulse" />
                      Aether Guard
                    </div>
                    <span className="text-xs font-bold truncate">{step.nodes[2].label}</span>
                    <span className="text-[9px] text-muted-foreground mt-1 leading-snug line-clamp-2 font-medium">
                      {step.nodes[2].details}
                    </span>
                  </motion.div>
                </div>

                {/* NEON SHIELD CONNECTOR DIVIDER */}
                <div className="flex justify-center items-center h-4 relative">
                  <div className="absolute w-[80%] h-px bg-border/20 border-dashed" />
                  {currentStep >= 4 && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="z-10 px-3 py-1 rounded-full border border-accent/40 bg-accent/15 text-[9px] font-bold tracking-widest text-accent uppercase flex items-center gap-1"
                    >
                      <CornerDownRight className="w-3 h-3 text-accent" />
                      Trajectory Forked
                    </motion.div>
                  )}
                </div>

                {/* Correction Trajectory Line */}
                <div className="flex justify-between items-center gap-4 px-4">
                  {/* Node 4: Self-Correction feedback */}
                  <motion.div
                    className={`w-[140px] flex flex-col p-3 rounded-xl border bg-card/90 transition-all ${
                      currentStep >= 4
                        ? "border-accent/40 shadow-[0_0_15px_oklch(0.65_0.22_300/0.1)]"
                        : "border-border/30 opacity-10"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent mb-1 uppercase tracking-wider">
                      <Shield className="w-3 h-3" />
                      Correction
                    </div>
                    <span className="text-xs font-bold truncate">{step.nodes[3].label}</span>
                    <span className="text-[9px] text-muted-foreground mt-1 leading-snug line-clamp-2">
                      {step.nodes[3].details}
                    </span>
                  </motion.div>

                  {/* Node 5: Restored Safe Tool */}
                  <motion.div
                    className={`w-[140px] flex flex-col p-3 rounded-xl border bg-card/90 transition-all ${
                      currentStep >= 5
                        ? currentStep >= 6
                          ? "border-primary/40"
                          : "border-primary glow-cyan scale-105"
                        : "border-border/30 opacity-10"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">
                      <Terminal className="w-3 h-3" />
                      Safe Tool
                    </div>
                    <span className="text-xs font-bold truncate">{step.nodes[4].label}</span>
                    <span className="text-[9px] font-mono text-muted-foreground mt-1 leading-snug line-clamp-2">
                      {step.nodes[4].details}
                    </span>
                  </motion.div>

                  {/* Node 6: Safe Resolved Output */}
                  <motion.div
                    className={`w-[150px] flex flex-col p-3 rounded-xl border bg-card/90 transition-all ${
                      currentStep >= 6
                        ? "border-emerald-500/50 shadow-[0_0_20px_oklch(0.75_0.18_180/0.15)] scale-105"
                        : "border-border/30 opacity-10"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 mb-1 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Output
                    </div>
                    <span className="text-xs font-bold truncate text-emerald-400">{step.nodes[5].label}</span>
                    <span className="text-[9px] text-muted-foreground mt-1 leading-snug line-clamp-2">
                      {step.nodes[5].details}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom Status display */}
            <div className="border-t border-border/30 pt-4 flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  step.badgeColor === "crimson" ? "bg-destructive animate-pulse" :
                  step.badgeColor === "emerald" ? "bg-emerald-400 animate-pulse" :
                  "bg-primary animate-pulse"
                }`} />
                Status: {step.timelineStatus}
              </span>
              <span>100% telemetry safe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
