"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, Star, GitFork, GitPullRequest, MessageSquare, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

const roadmapItems = [
  { status: "done", label: "Core SDK Release" },
  { status: "done", label: "React Flow Integration" },
  { status: "current", label: "VS Code Extension" },
  { status: "upcoming", label: "LangChain Plugin" },
  { status: "upcoming", label: "CrewAI Integration" },
]



export function CommunitySection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-radial-cyan opacity-10" />
      
      <div className="site-container relative z-10">
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
            Built for the <span className="text-gradient-cyan">Community</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aether is open source and community-driven. Join thousands of developers shaping the future of AI observability.
          </p>
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
                onClick={() => window.open("https://github.com/Samanyu-dev/Aether_Web/issues", "_blank")}
              >
                <MessageSquare className="w-4 h-4 mr-3 text-chart-3" />
                Report Issues & Request Features
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
