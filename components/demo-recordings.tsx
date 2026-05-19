"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Play, ShieldCheck, Terminal, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StoryReplayGraph } from "@/components/story-replay-graph"

const stories = [
  {
    id: 1,
    title: "Multi-Tool Research Agent",
    duration: "25 events",
    intro: {
      metrics: "25 cognition events • 2 retrieval systems • 1 synthesis phase",
      role: "Performs deep-dive retrieval across memory stores"
    },
    narrations: [
      "Agent retrieved LoRA configuration memory.",
      "External GPU profiler activated.",
      "Correction branch restored deployment safety."
    ],
    summary: "Replay Complete • Hallucination Prevented • 0 Unsafe Executions",
    preview: [
      { type: "thought", label: "Retrieve" },
      { type: "tool", label: "GPU Profiler" },
      { type: "hallucination", label: "Safety Alert" },
      { type: "output", label: "Resolve" }
    ]
  },
  {
    id: 2,
    title: "Autonomous DevOps Assistant",
    duration: "18 events",
    intro: {
      metrics: "18 steps • 4 bash executions • 1 container sandbox",
      role: "Instruments and monitors production containers"
    },
    narrations: [
      "Analyzing log directory scope under /var/log.",
      "Sandbox threat isolation triggered.",
      "Correction branch bypassed malicious bash arguments."
    ],
    summary: "Replay Complete • Sandbox Restored • 0 Unsafe Executions",
    preview: [
      { type: "thought", label: "Inspect" },
      { type: "tool", label: "Bash Run" },
      { type: "hallucination", label: "Argument Injection" },
      { type: "output", label: "Pruned Output" }
    ]
  },
  {
    id: 3,
    title: "Multi-Agent Coordinator",
    duration: "32 events",
    intro: {
      metrics: "3 collaborative agents • 32 parallel thoughts • 4 web searches",
      role: "Orchestrates complex multi-agent debates"
    },
    narrations: [
      "Recruiter triggered screen_candidates.",
      "Agent reviewer spotted profile discrepancy.",
      "Debate resolved via strict consensus protocols."
    ],
    summary: "Replay Complete • Consensus Formed • 0 Unsafe Executions",
    preview: [
      { type: "thought", label: "Debate" },
      { type: "tool", label: "Consensus" },
      { type: "thought", label: "Recheck" },
      { type: "output", label: "Consensus Complete" }
    ]
  }
]

const typeStyles = {
  thought: "bg-primary/20 border-primary/40 text-primary",
  tool: "bg-accent/20 border-accent/40 text-accent",
  hallucination: "bg-destructive/20 border-destructive/40 text-destructive",
  output: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
}

const typeDots = {
  thought: "bg-primary",
  tool: "bg-accent",
  hallucination: "bg-destructive",
  output: "bg-emerald-400"
}

export function DemoRecordings() {
  const [activeStory, setActiveStory] = useState<typeof stories[0] | null>(null)

  return (
    <section className="py-24 relative overflow-hidden bg-background border-t border-border/10" id="replay-stories">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-radial-purple opacity-[0.04]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gradient-radial-cyan opacity-[0.04]" />
      </div>

      <div className="site-container max-w-6xl relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-wider">
            Curated Scenarios
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Curated <span className="text-gradient-cyan">Replay Stories</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Discover real agent execution stories. Watch how opaque thought sequences transform into structured replay timelines.
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -4 }}
              className="group glass-panel rounded-2xl overflow-hidden border border-border/30 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top half: Preview graph */}
              <div className="p-6 bg-gradient-to-br from-card/85 to-card/40 border-b border-border/20 flex flex-col justify-center min-h-[140px] relative">
                {/* Intro overlay metrics */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground/80">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-primary" />
                    {story.duration}
                  </span>
                  <span>curated case</span>
                </div>

                <div className="flex items-center justify-center gap-2.5 pt-4">
                  {story.preview.map((node, i) => (
                    <div
                      key={i}
                      className={`relative px-2.5 py-1.5 rounded-lg border text-[10px] font-mono ${typeStyles[node.type as keyof typeof typeStyles]}`}
                    >
                      <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${typeDots[node.type as keyof typeof typeDots]} animate-pulse`} />
                      {node.label}
                      {i < story.preview.length - 1 && (
                        <div className="absolute top-1/2 -right-2.5 w-2 h-0.5 bg-border/40" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom half: Curated Story Narration logs */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Story Title & Role */}
                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1 font-mono leading-relaxed">
                      {story.intro.role}
                    </p>
                  </div>

                  {/* Intro Overlay Badge */}
                  <div className="bg-card/40 border border-border/30 rounded-lg p-2.5 font-mono text-[9px] text-primary/95 font-semibold text-center select-none">
                    OVERLAY: {story.intro.metrics}
                  </div>

                  {/* Mid-Replay Narration Logs */}
                  <div className="bg-background/80 border border-border/30 rounded-lg p-3 space-y-1.5 font-mono text-[9px] text-muted-foreground/90">
                    <div className="text-[8px] uppercase tracking-wider text-muted-foreground/60 mb-1 flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-primary" /> Mid-Replay Logs
                    </div>
                    {story.narrations.map((log, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-1">
                        <span className="text-primary font-bold">{`>`}</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Replay Summary Status */}
                <div className="space-y-4 pt-3 border-t border-border/10">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/20 rounded-lg py-2 px-3 justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {story.summary}
                  </div>

                  <Button variant="outline" className="w-full text-xs border-border/50 hover:border-primary/50 hover:bg-primary/5 font-semibold uppercase tracking-wider" onClick={() => setActiveStory(story)}>
                      <Play className="w-3 h-3 mr-2" /> Launch Story Replay
                  </Button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
      <Dialog open={!!activeStory} onOpenChange={(open) => !open && setActiveStory(null)}>
        <DialogContent className="max-w-[95vw] lg:max-w-7xl bg-[#06060c] border-border/30 p-0 overflow-hidden" showCloseButton={true}>
          <DialogHeader className="px-6 py-4 border-b border-border/20 bg-card/40">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              {activeStory?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="p-0">
            {activeStory && <StoryReplayGraph story={activeStory} />}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
