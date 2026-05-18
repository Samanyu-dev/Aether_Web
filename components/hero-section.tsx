"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Copy, Check, Terminal, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CognitionDAG } from "./cognition-dag"
import { CognitionStream } from "./cognition-stream"

export function HeroSection() {
  const [copied, setCopied] = useState(false)

  const handleCopyInstall = async () => {
    await navigator.clipboard.writeText("pip install aether-observe")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Premium dark-mode radial gradients */}
      <div className="absolute inset-0 bg-gradient-radial-cyan opacity-[0.15] z-0 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-radial-purple opacity-[0.08] z-0 pointer-events-none" />

      {/* Apple-style background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(oklch(0.72 0.19 195 / 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, oklch(0.72 0.19 195 / 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* LEFT: Headline, subheadline, copyable pip command, CTAs (7 cols on large screens for ample text breathing room) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Open Source announcement badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider select-none"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              100% Local-First AI Observability
            </motion.div>

            {/* Main Hero Headline - See AI reasoning unfold visually */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6.5xl lg:text-7.5xl font-bold tracking-tight text-foreground leading-[1.02] text-balance"
            >
              See AI reasoning <br />
              <span className="text-gradient-cyan">unfold visually</span>.
            </motion.h1>

            {/* Subheadline - Replay thoughts, tool calls, hallucinations like source code */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed text-balance"
            >
              Replay thoughts, tool calls, hallucinations, and self correction like source code execution. Aether is a lightweight, zero dependency, local-first cognition replay engine.
            </motion.p>

            {/* Inline Copyable CLI Terminal Command - pip install aether-observe */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center max-w-md bg-card/60 backdrop-blur-md border border-border/40 rounded-xl p-3 justify-between font-mono text-xs text-muted-foreground select-none"
            >
              <span className="flex items-center gap-2 text-foreground/90 pl-1">
                <Terminal className="w-4 h-4 text-primary" />
                pip install aether-observe
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyInstall}
                className="h-8 text-[11px] hover:bg-muted/40 font-semibold flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </motion.div>

            {/* Dominant Hero CTA & Secondary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a href="#hallucination-showcase">
                <Button size="lg" className="glow-cyan text-sm px-8 py-6 group font-semibold uppercase tracking-wider">
                  <Play className="w-4 h-4 mr-2.5 group-hover:scale-110 transition-transform" />
                  Launch Hallucination Replay
                </Button>
              </a>

              <a href="#sdk">
                <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/40 hover:bg-primary/5 text-sm px-6 py-6 font-semibold uppercase tracking-wider">
                  Install SDK
                </Button>
              </a>
            </motion.div>

            {/* Social Proof Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="pt-6 border-t border-border/20 max-w-xl"
            >
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Native Agent Orchestrations
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-mono text-muted-foreground/80">
                <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> LangChain
                </span>
                <span className="flex items-center gap-1.5 hover:text-accent transition-colors cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60" /> CrewAI
                </span>
                <span className="flex items-center gap-1.5 hover:text-chart-3 transition-colors cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-chart-3/60" /> OpenAI SDK
                </span>
                <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> LangGraph
                </span>
                <span className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" /> Python Agents
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Live replay preview containing traversing DAG and token streams (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            {/* The Live Reconstructed Visualizer Mock */}
            <div className="relative rounded-3xl overflow-hidden glass-panel p-2 bg-card/40 border border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl" />

              {/* Header inside mockup */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    Live Session Replay
                  </span>
                </div>
                <span className="text-[9px] font-mono text-primary font-bold">
                  traversal_rate: 1.5s
                </span>
              </div>

              {/* DAG Canvas */}
              <CognitionDAG />
            </div>

            {/* Floating Live Event Stream Sidebar Overlay */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute -right-6 top-1/3 w-64 hidden xl:block z-20"
            >
              <CognitionStream />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Elegant bottom gradient fade to main body */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  )
}
