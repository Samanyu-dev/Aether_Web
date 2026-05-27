"use client"

import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  Coins, 
  WifiOff, 
  FileJson, 
  HardDrive, 
  Lock
} from "lucide-react"

const localFeatures = [
  {
    title: "100% Privacy Sealed",
    description: "No cloud telemetry or external logging. Your reasoning loops, logs, API payloads, and prompt histories never leave your machine.",
    icon: ShieldCheck,
    badge: "No Telemetry"
  },
  {
    title: "Zero Infrastructure Cost",
    description: "Zero external databases to provision, scale, or fund. Pure client-side calculations mean zero hosting overhead.",
    icon: Coins,
    badge: "0$ Overhead"
  },
  {
    title: "True Offline Execution",
    description: "Run diagnostic replays in isolated local containers, offline sandbox setups, or secure air-gapped corporate subnets.",
    icon: WifiOff,
    badge: "100% Offline"
  },
  {
    title: "Human-Readable JSON Traces",
    description: "Traces are stored as standard JSON schema files inside `.aether/traces/`. Fully queryable, portable, and git-shareable.",
    icon: FileJson,
    badge: "Raw Schema"
  },
  {
    title: "Local folder-system",
    description: "Integrates directly with a clean, local `.aether/` hidden directory. Auto-provisions logs, cached sessions, and diagnostic traces.",
    icon: HardDrive,
    badge: ".aether Folder"
  },
  {
    title: "Privacy-Safe Debugging",
    description: "Fully compliant with enterprise data protection constraints. Debug agent loops containing proprietary customer PII safely.",
    icon: Lock,
    badge: "PII Compliant"
  }
]

export function LocalFirstShowcase() {
  return (
    <section className="py-space-120 relative overflow-hidden bg-background" id="local-first">
      {/* Visual background details */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(oklch(0.72 0.19 195 / 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, oklch(0.72 0.19 195 / 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-radial-cyan opacity-[0.04] blur-3xl pointer-events-none" />

      <div className="site-container relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-space-80">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-label font-semibold text-primary mb-4"
          >
            Zero-Infra Philosophy
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-display-md font-semibold tracking-tight mb-6"
          >
            Debugging <span className="text-gradient-cyan">Fully Local-First</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-body-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Aether runs entirely inside your development space. No databases to host, no cloud credentials to configure, and absolutely no external telemetry.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localFeatures.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-panel rounded-2xl p-8 border border-border/30 hover:border-primary/30 bg-card/40 flex h-full flex-col justify-between transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Icon and Badge */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-label font-mono font-bold text-muted-foreground bg-muted/40 px-2.5 py-0.5 rounded">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-feature font-semibold text-foreground">{feat.title}</h3>
                    <p className="text-body-sm text-muted-foreground">
                      {feat.description}
                    </p>
                  </div>
                </div>

                {/* Minimalist decorative line */}
                <div className="h-px w-full bg-border/20 mt-6" />
              </motion.div>
            )
          })}
        </div>

        {/* Local Folder Visual Showcase Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-space-48 glass-panel rounded-2xl p-8 border border-border/40 bg-card/30 flex flex-col md:flex-row gap-6 items-center justify-between"
        >
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="font-semibold text-foreground text-feature">Git-Friendly & Zero Overhead</h4>
            </div>
            <p className="text-body-sm text-muted-foreground max-w-xl">
              Because Aether saves raw event dumps inside standard JSON files, you can commit trace streams directly to Git to trace reasoning regressions alongside source code diffs.
            </p>
          </div>

          <pre className="font-mono text-[10px] leading-relaxed text-muted-foreground bg-background/60 p-4 rounded-xl border border-border/30 w-full md:w-auto shrink-0 select-none whitespace-pre-wrap">
            <span className="text-accent">~ project-root/</span>{"\n"}
            <span>├── <span className="text-primary font-bold">.aether/</span></span>{"\n"}
            <span>│   ├── <span className="text-primary">traces/</span></span>{"\n"}
            <span>│   │   ├── <span className="text-foreground/80">session_research-agent.json</span></span>{"\n"}
            <span>│   │   └── <span className="text-foreground/80">session_chat-agent.json</span></span>{"\n"}
            <span>│   ├── <span className="text-primary">sessions/</span></span>{"\n"}
            <span>│   └── <span className="text-primary">cache/</span></span>{"\n"}
            <span>└── main.py</span>
          </pre>
        </motion.div>

      </div>
    </section>
  )
}
