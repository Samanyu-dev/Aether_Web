"use client"

import { motion } from "framer-motion"
import { Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const demos = [
  {
    id: 1,
    title: "Simple Agent Replay",
    description: "Watch a basic AI agent analyze a query and generate a response with full cognition visibility.",
    duration: "2:34",
    type: "thought",
    preview: [
      { type: "thought", label: "Parse" },
      { type: "thought", label: "Plan" },
      { type: "thought", label: "Generate" },
      { type: "output", label: "Output" },
    ],
  },
  {
    id: 2,
    title: "Tool-Using Agent",
    description: "Observe how an AI agent calls external tools, processes results, and integrates data.",
    duration: "4:12",
    type: "tool",
    preview: [
      { type: "thought", label: "Analyze" },
      { type: "tool", label: "API Call" },
      { type: "tool", label: "Search" },
      { type: "output", label: "Synthesize" },
    ],
  },
  {
    id: 3,
    title: "Hallucination Detection",
    description: "See how Aether identifies and highlights low-confidence regions in AI reasoning.",
    duration: "3:45",
    type: "hallucination",
    preview: [
      { type: "thought", label: "Process" },
      { type: "hallucination", label: "Warning" },
      { type: "thought", label: "Verify" },
      { type: "output", label: "Safe Output" },
    ],
  },
]

const typeStyles = {
  thought: "bg-primary/20 border-primary/40",
  tool: "bg-accent/20 border-accent/40",
  hallucination: "bg-destructive/20 border-destructive/40",
  output: "bg-chart-4/20 border-chart-4/40",
}

const typeDots = {
  thought: "bg-primary",
  tool: "bg-accent",
  hallucination: "bg-destructive",
  output: "bg-chart-4",
}

function DemoCard({ demo, index }: { demo: typeof demos[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -5 }}
      className="group glass-panel rounded-2xl overflow-hidden border border-border/30 hover:border-primary/40 transition-all duration-300"
    >
      {/* Preview area */}
      <div className="relative p-6 bg-gradient-to-br from-card/80 to-card/40">
        {/* Animated preview nodes */}
        <div className="flex items-center justify-center gap-3 h-32">
          {demo.preview.map((node, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`relative px-3 py-2 rounded-lg border text-xs font-medium ${typeStyles[node.type as keyof typeof typeStyles]}`}
            >
              <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${typeDots[node.type as keyof typeof typeDots]} animate-pulse`} />
              {node.label}
              
              {/* Connector */}
              {i < demo.preview.length - 1 && (
                <div className="absolute top-1/2 -right-3 w-3 h-0.5 bg-gradient-to-r from-primary/60 to-accent/40" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Play button overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Button size="lg" className="glow-cyan">
            <Play className="w-5 h-5 mr-2" />
            Watch Replay
          </Button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {demo.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {demo.duration}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {demo.description}
        </p>

        <Button variant="outline" className="w-full border-border/50 hover:border-primary/50 hover:bg-primary/5 group-hover:border-primary/50">
          <Play className="w-4 h-4 mr-2" />
          Watch Replay
        </Button>
      </div>
    </motion.div>
  )
}

export function DemoRecordings() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-primary mb-4">
            Demo Library
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="text-gradient-cyan">Cognition</span> Replays
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch real AI agents in action. See exactly how they think, decide, and respond.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {demos.map((demo, index) => (
            <DemoCard key={demo.id} demo={demo} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
