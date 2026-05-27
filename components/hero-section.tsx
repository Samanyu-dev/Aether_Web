"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Copy, Check, Terminal, Zap, GitBranch, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CognitionDAG } from "./cognition-dag"
import Link from "next/link"

const ECOSYSTEM_BADGES = [
  { label: "OpenAI SDK",color: "text-primary border-primary/30 bg-primary/8" },
  { label: "LangChain", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/8" },
  { label: "LangGraph", color: "text-purple-400 border-purple-500/30 bg-purple-500/8" },
  { label: "CrewAI",    color: "text-blue-400 border-blue-500/30 bg-blue-500/8" },
  { label: "AutoGen",   color: "text-accent border-accent/30 bg-accent/8" },
  { label: "LlamaIndex",color: "text-orange-400 border-orange-500/30 bg-orange-500/8" },
]

const FEATURE_PILLS = [
  { icon: Zap,       label: "Reasoning Replay" },
  { icon: GitBranch, label: "Cognition Branching" },
  { icon: Shield,    label: "Self-Correction Debug" },
]

export function HeroSection() {
  const [copied, setCopied] = useState(false)

  const handleCopyInstall = async () => {
    await navigator.clipboard.writeText("pip install aether-observe")
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section className="relative overflow-hidden pt-24 pb-16 min-h-screen flex items-center">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_20%,oklch(0.72_0.19_195_/_0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.72_0.19_195_/_0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.72_0.19_195_/_0.04)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none" />

      <div className="site-container relative z-10 w-full">
        {/* Two-column layout: 5-col text | 7-col graph */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

          {/* LEFT — Content column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-7 lg:col-span-5"
          >
            {/* Status badge */}
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Local-First AI Cognition Debugger
            </p>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
                AI reasoning,{" "}
                <span className="text-gradient-cyan">replayed</span>{" "}
                like a debugger.
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
                Step through thoughts, tool calls, memory retrieval, and self-correction in a timeline your engineering team can actually trust.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {FEATURE_PILLS.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/40 bg-card/40 text-xs text-muted-foreground">
                  <Icon className="h-3 w-3 text-primary" />
                  {label}
                </span>
              ))}
            </div>

            {/* Install command */}
            <div className="max-w-sm rounded-xl border border-border/50 bg-card/50 p-3">
              <div className="flex items-center justify-between gap-3 font-mono text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <Terminal className="h-4 w-4 text-primary shrink-0" />
                  pip install aether-observe
                </span>
                <Button variant="ghost" size="sm" className="h-8 px-2 shrink-0" onClick={handleCopyInstall}>
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a href="#replay">
                <Button size="lg" className="h-11 px-7 font-semibold">
                  <Play className="mr-2 h-4 w-4" />
                  Open Replay
                </Button>
              </a>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="h-11 px-7 border-border/60 hover:border-primary/50 font-semibold">
                  Start Beta
                </Button>
              </Link>
            </div>

            {/* Ecosystem badges */}
            <div>
              <p className="text-xs text-muted-foreground/60 mb-2 font-mono uppercase tracking-wider">Works with</p>
              <div className="flex flex-wrap gap-2">
                {ECOSYSTEM_BADGES.map(b => (
                  <span key={b.label} className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${b.color}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Cinematic graph engine */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-border/30 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                  <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">Live Session Replay</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-primary">Traversal 1.5s</span>
                  <div className="flex gap-1">
                    {["bg-red-500/60", "bg-yellow-500/60", "bg-emerald-500/60"].map((c, i) => (
                      <span key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Graph canvas — tall enough to show graph + stream row below */}
              <div className="h-[560px] relative bg-background/20">
                <CognitionDAG />
              </div>

              {/* Footer metrics */}
              <div className="grid grid-cols-3 gap-0 border-t border-border/30">
                {[
                  { label: "NODES", value: "7 active",       color: "text-primary" },
                  { label: "EDGE FLOW", value: "Animated",   color: "text-accent" },
                  { label: "STATUS", value: "Telemetry safe", color: "text-emerald-400" },
                ].map(({ label, value, color }, i) => (
                  <div key={label} className={`px-5 py-3.5 ${i < 2 ? "border-r border-border/30" : ""}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>{label}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
