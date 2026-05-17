"use client"

import { motion } from "framer-motion"
import { Github, ExternalLink, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CognitionDAG } from "./cognition-dag"
import { CognitionStream } from "./cognition-stream"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-radial-cyan opacity-30" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-radial-purple opacity-20" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.72 0.19 195 / 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, oklch(0.72 0.19 195 / 0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-muted-foreground"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Open Source AI Observability
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
            >
              <span className="text-gradient-cyan">See How</span>
              <br />
              <span className="text-foreground">AI Thinks.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Aether visualizes AI reasoning, tool usage, memory retrieval, and hallucinations in realtime through lightweight cinematic cognition replay.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="glow-cyan-subtle group">
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                View Demo
              </Button>
              <Button size="lg" variant="outline" className="border-border/50 hover:border-primary/50 hover:bg-primary/5">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-primary">
                Hugging Face Demo
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <a 
                href="#architecture" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Explore Architecture
                <svg className="w-4 h-4 ml-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* Right content - DAG Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden glass-panel p-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-xl" />
              <CognitionDAG />
            </div>
            
            {/* Floating stream sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -right-4 top-1/4 w-64 hidden xl:block"
            >
              <CognitionStream />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
