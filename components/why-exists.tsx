"use client"

import { motion } from "framer-motion"
import { ShieldAlert, Map, AlertCircle, Sparkles } from "lucide-react"

export function WhyExists() {
  return (
    <section className="py-24 relative overflow-hidden bg-background border-t border-b border-border/10">
      {/* Visual background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-radial-cyan opacity-[0.04]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <div className="grid md:grid-cols-12 gap-12 items-center">

          {/* LEFT: Core Emotional Hook (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Paradigm Shift
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight"
            >
              AI agents are becoming <br />
              <span className="text-gradient-cyan">impossible to debug</span> <br />
              with logs alone.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Linear stdout logs were built for deterministic, sequential software. But AI agents think in multi-step branches, parallel tools, and dynamic hallucinations. Aether turns opaque, chaotic reasoning trees into visual, replayable cognition maps.
            </motion.p>
          </div>

          {/* RIGHT: High-fidelity Comparison Grid (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            {/* The Opaque Log Cave */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel rounded-xl p-5 border border-border/30 bg-card/20 relative"
            >
              <div className="flex items-center gap-2.5 text-xs font-mono font-semibold text-muted-foreground mb-3">
                <AlertCircle className="w-4 h-4 text-destructive/80" />
                THE OLD WAY: LINEAR LOGGING
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Endless JSON streams, hard-to-parse terminal stacktraces, and opaque nested dictionaries. Zero visual context on agent decisions.
              </p>
            </motion.div>

            {/* The Spatial Replay map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="glass-panel rounded-xl p-5 border border-primary/30 bg-primary/5 relative"
              style={{ boxShadow: "0 0 25px oklch(0.72 0.19 195 / 0.05)" }}
            >
              <div className="flex items-center gap-2.5 text-xs font-mono font-semibold text-primary mb-3">
                <Map className="w-4 h-4" />
                THE AETHER WAY: COGNITION REPLAY
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                Cinematic traversal trees mapping thoughts, parallel tools, and real-time self correction branches. Spot security issues in 1 second.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
