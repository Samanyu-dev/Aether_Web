"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const architectureDiagrams = [
  {
    id: "system-flow",
    title: "System Flow",
    nodes: [
      { label: "User Agent", icon: "user" },
      { label: "Aether SDK", icon: "code" },
      { label: "WebSocket Stream", icon: "stream" },
      { label: "Replay Engine", icon: "play" },
      { label: "Cognition Graph", icon: "graph" },
      { label: "Timeline + Analytics", icon: "chart" },
    ],
  },
  {
    id: "replay-engine",
    title: "Replay Engine",
    nodes: [
      { label: "Events", icon: "lightning" },
      { label: "Event Buffer", icon: "buffer" },
      { label: "Replay Controller", icon: "controller" },
      { label: "Node Sequencer", icon: "sequence" },
      { label: "Graph Renderer", icon: "render" },
    ],
  },
  {
    id: "ai-lifecycle",
    title: "AI Session Lifecycle",
    nodes: [
      { label: "Prompt", icon: "input" },
      { label: "Thoughts", icon: "brain" },
      { label: "Tools", icon: "tool" },
      { label: "Memory Retrieval", icon: "database" },
      { label: "Hallucination Detection", icon: "warning" },
      { label: "Final Output", icon: "output" },
    ],
  },
]

const icons: Record<string, JSX.Element> = {
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  stream: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  play: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  graph: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  lightning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  buffer: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  ),
  controller: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  sequence: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  render: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  input: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  brain: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  tool: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
  ),
  database: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  output: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

function ArchitectureDiagram({ diagram, isActive }: { diagram: typeof architectureDiagrams[0]; isActive: boolean }) {
  return (
    <div className="relative py-8">
      <div className="flex flex-col items-center gap-4">
        {diagram.nodes.map((node, index) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0.5, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative"
          >
            {/* Node */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                isActive 
                  ? "bg-card/80 border-primary/40 glow-cyan-subtle" 
                  : "bg-card/40 border-border/30"
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"}`}>
                {icons[node.icon]}
              </div>
              <span className="text-sm font-medium">{node.label}</span>
            </motion.div>

            {/* Connector line */}
            {index < diagram.nodes.length - 1 && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isActive ? 1 : 0.5 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                className="absolute left-1/2 -translate-x-1/2 w-0.5 h-8 -bottom-8"
                style={{
                  background: isActive 
                    ? "linear-gradient(to bottom, oklch(0.72 0.19 195 / 0.6), oklch(0.65 0.22 300 / 0.4))"
                    : "oklch(0.3 0.02 260 / 0.3)",
                  transformOrigin: "top",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function ArchitectureVisuals() {
  const [activeDiagram, setActiveDiagram] = useState(0)

  return (
    <section className="py-24 relative" id="architecture">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial-purple opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-accent mb-4">
            Technical Architecture
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-gradient-purple">Aether</span> Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Elegant architecture designed for realtime AI observability at scale.
          </p>
        </motion.div>

        {/* Diagram tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {architectureDiagrams.map((diagram, index) => (
            <button
              key={diagram.id}
              onClick={() => setActiveDiagram(index)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeDiagram === index
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-card/40 text-muted-foreground border border-border/30 hover:bg-card/60 hover:text-foreground"
              }`}
            >
              {diagram.title}
            </button>
          ))}
        </div>

        {/* Diagram display */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto glass-panel rounded-2xl p-8"
        >
          {architectureDiagrams.map((diagram, index) => (
            <div
              key={diagram.id}
              className={activeDiagram === index ? "block" : "hidden"}
            >
              <ArchitectureDiagram diagram={diagram} isActive={activeDiagram === index} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
