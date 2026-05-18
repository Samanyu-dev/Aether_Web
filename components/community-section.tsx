"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, Star, GitFork, GitPullRequest } from "lucide-react"
import { Button } from "@/components/ui/button"

const roadmapItems = [
  { status: "done", label: "Core SDK Release" },
  { status: "done", label: "React Flow Integration" },
  { status: "current", label: "VS Code Extension" },
  { status: "upcoming", label: "LangChain Plugin" },
  { status: "upcoming", label: "CrewAI Integration" },
]

const stats = [
  { icon: Star, label: "GitHub Stars", value: "2.4k" },
  { icon: GitFork, label: "Forks", value: "180" },
  { icon: GitPullRequest, label: "Contributors", value: "47" },
  { icon: Users, label: "Discord Members", value: "1.2k" },
]

export function CommunitySection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-radial-cyan opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-primary mb-4">
            Join Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built by the <span className="text-gradient-cyan">Community</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aether is open source and community-driven. Join thousands of developers shaping the future of AI observability.
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-panel rounded-xl p-6 text-center hover:border-primary/30 transition-colors"
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Roadmap */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel rounded-2xl p-8"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Roadmap
            </h3>
            
            <div className="space-y-4">
              {roadmapItems.map((item, index) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`relative w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    item.status === "done" 
                      ? "bg-primary border-primary"
                      : item.status === "current"
                      ? "border-primary bg-primary/20"
                      : "border-muted-foreground/30"
                  }`}>
                    {item.status === "done" && (
                      <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {item.status === "current" && (
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  
                  {/* Connector line */}
                  {index < roadmapItems.length - 1 && (
                    <div className={`absolute ml-[7px] mt-8 w-0.5 h-6 ${
                      item.status === "done" ? "bg-primary/50" : "bg-muted-foreground/20"
                    }`} />
                  )}
                  
                  <span className={`text-sm ${
                    item.status === "done" 
                      ? "text-foreground"
                      : item.status === "current"
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}>
                    {item.label}
                    {item.status === "current" && (
                      <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Get involved */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-panel rounded-2xl p-8"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Get Involved
            </h3>
            
            <div className="space-y-4">
              <Button 
                className="w-full justify-start bg-card hover:bg-card/80 border border-border/50 hover:border-primary/50"
                variant="outline"
              >
                <svg className="w-4 h-4 mr-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                Star on GitHub
              </Button>
              
              <Button 
                className="w-full justify-start bg-card hover:bg-card/80 border border-border/50 hover:border-accent/50"
                variant="outline"
              >
                <BookOpen className="w-4 h-4 mr-3" />
                Read Documentation
              </Button>
              
              <Button 
                className="w-full justify-start bg-card hover:bg-card/80 border border-border/50 hover:border-chart-3/50"
                variant="outline"
              >
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                </svg>
                Join Discord
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                Contributions welcome! Check out our{" "}
                <a href="#" className="text-primary hover:underline">contribution guide</a>
                {" "}to get started.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
