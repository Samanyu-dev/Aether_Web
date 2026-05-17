"use client"

import { motion } from "framer-motion"
import { Github, Play, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial-cyan opacity-20" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-radial-purple opacity-15" />
      </div>
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.72 0.19 195 / 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, oklch(0.72 0.19 195 / 0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance"
          >
            <span className="text-gradient-cyan">The invisible</span>
            <br />
            <span className="text-foreground">made visible.</span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Aether helps developers visualize and debug AI cognition in realtime.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" className="glow-cyan text-lg px-8 py-6">
              <Play className="w-5 h-5 mr-2" />
              Start Exploring
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-border/50 hover:border-primary/50 hover:bg-primary/5 text-lg px-8 py-6"
            >
              <Github className="w-5 h-5 mr-2" />
              View GitHub
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="text-muted-foreground hover:text-primary text-lg px-8 py-6"
            >
              Launch Demo
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Bottom decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 flex justify-center"
          >
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Open Source</span>
              <div className="w-1 h-1 rounded-full bg-primary" />
              <span>Lightweight</span>
              <div className="w-1 h-1 rounded-full bg-accent" />
              <span>Developer First</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
