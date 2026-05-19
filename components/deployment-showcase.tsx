"use client"

import { motion } from "framer-motion"
import { Github, ExternalLink, Star, GitFork, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

const deploymentCards = [
  {
    title: "GitHub Package",
    icon: Github,
    description: "Open-source SDK with lightweight replay engine and modular architecture.",
    features: ["Lightweight SDK", "Replay Engine", "Modular Architecture", "TypeScript Support"],
    stats: { stars: "2.4k", forks: "180" },
    link: "#",
    accent: "primary",
  },
  {
    title: "Hugging Face Space",
    icon: Package,
    description: "Interactive demo with lightweight hosting for cognition visualization.",
    features: ["Live Demo", "Lightweight Hosting", "Interactive Graphs", "One-Click Deploy"],
    stats: { likes: "850", runs: "12k" },
    link: "#",
    accent: "accent",
  },
]

function DeploymentCard({ card, index }: { card: typeof deploymentCards[0]; index: number }) {
  const Icon = card.icon
  const isGitHub = card.title === "GitHub Package"
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -5 }}
      className={`glass-panel rounded-2xl p-8 border transition-all duration-300 ${
        card.accent === "primary" 
          ? "hover:border-primary/50 hover:glow-cyan-subtle" 
          : "hover:border-accent/50 hover:glow-purple"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className={`p-3 rounded-xl ${
          card.accent === "primary" ? "bg-primary/20" : "bg-accent/20"
        }`}>
          <Icon className={`w-6 h-6 ${
            card.accent === "primary" ? "text-primary" : "text-accent"
          }`} />
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4">
          {isGitHub ? (
            <>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="w-4 h-4" />
                {card.stats.stars}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <GitFork className="w-4 h-4" />
                {card.stats.forks}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {card.stats.likes}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {card.stats.runs}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
      <p className="text-muted-foreground text-sm mb-6">{card.description}</p>

      {/* Features */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {card.features.map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-1.5 h-1.5 rounded-full ${
              card.accent === "primary" ? "bg-primary" : "bg-accent"
            }`} />
            {feature}
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button 
        className={`w-full ${
          card.accent === "primary" 
            ? "bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30" 
            : "bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30"
        }`}
        variant="outline"
      >
        {isGitHub ? "View Repository" : "Launch Space"}
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  )
}

export function DeploymentShowcase() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-radial-purple opacity-10" />
      
      <div className="site-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-accent mb-4">
            Open Source
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Deploy <span className="text-gradient-purple">Anywhere</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From GitHub to Hugging Face, Aether fits seamlessly into your existing workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {deploymentCards.map((card, index) => (
            <DeploymentCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
