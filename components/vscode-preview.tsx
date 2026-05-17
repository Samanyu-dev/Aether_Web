"use client"

import { motion } from "framer-motion"

export function VSCodePreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-primary mb-4">
            Coming Soon
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI Debugging in <span className="text-gradient-cyan">Your Editor</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The future of AI development. Observe cognition graphs directly inside VS Code.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* VS Code window mock */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-border/50">
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-card/80 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-chart-4/80" />
                <div className="w-3 h-3 rounded-full bg-chart-3/80" />
              </div>
              <span className="text-xs text-muted-foreground">agent.py - VS Code</span>
              <div className="w-16" />
            </div>

            {/* Main content area */}
            <div className="flex h-[400px]">
              {/* Sidebar */}
              <div className="w-12 bg-card/60 border-r border-border/30 flex flex-col items-center py-4 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-6 rounded ${
                      i === 4 ? "bg-primary/30 text-primary" : "bg-muted/30 text-muted-foreground"
                    } flex items-center justify-center`}
                  >
                    {i === 4 ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 rounded-sm bg-current opacity-50" />
                    )}
                  </div>
                ))}
              </div>

              {/* Code editor */}
              <div className="flex-1 p-4 bg-background/50 overflow-hidden">
                <pre className="text-sm font-mono text-muted-foreground">
                  <code>
                    <span className="text-muted-foreground/50">1  </span><span className="text-accent">from</span> aether <span className="text-accent">import</span> AgentTracer{"\n"}
                    <span className="text-muted-foreground/50">2  </span>{"\n"}
                    <span className="text-muted-foreground/50">3  </span>tracer = <span className="text-primary">AgentTracer</span>(){"\n"}
                    <span className="text-muted-foreground/50">4  </span>{"\n"}
                    <span className="text-muted-foreground/50">5  </span><span className="text-accent">with</span> tracer.<span className="text-primary">session</span>(<span className="text-chart-4">"research"</span>):{"\n"}
                    <span className="text-muted-foreground/50">6  </span>    thought = tracer.<span className="text-primary">thought</span>(<span className="text-chart-4">"Analyzing"</span>){"\n"}
                    <span className="text-muted-foreground/50">7  </span>    tool = tracer.<span className="text-primary">tool_call</span>(<span className="text-chart-4">"search"</span>){"\n"}
                    <span className="text-muted-foreground/50">8  </span>    output = tracer.<span className="text-primary">output</span>(<span className="text-chart-4">"Result"</span>){"\n"}
                  </code>
                </pre>
              </div>

              {/* Aether sidebar panel */}
              <div className="w-72 bg-card/60 border-l border-border/30 p-4">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-foreground">Aether Cognition</span>
                </div>

                {/* Mini graph */}
                <div className="space-y-3">
                  {[
                    { label: "Analyzing", type: "thought", active: true },
                    { label: "search()", type: "tool", active: false },
                    { label: "Result", type: "output", active: false },
                  ].map((node, i) => (
                    <motion.div
                      key={node.label}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                      className={`relative px-3 py-2 rounded-lg border text-xs ${
                        node.type === "thought" 
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : node.type === "tool"
                          ? "bg-accent/10 border-accent/30 text-accent"
                          : "bg-chart-4/10 border-chart-4/30 text-chart-4"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          node.active ? "bg-current animate-pulse" : "bg-current/50"
                        }`} />
                        {node.label}
                      </div>
                      
                      {/* Connector */}
                      {i < 2 && (
                        <div className="absolute left-1/2 -bottom-3 w-0.5 h-3 bg-border/50" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Token stream */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <span className="text-xs text-muted-foreground mb-2 block">Live Token Stream</span>
                  <div className="bg-background/50 rounded-lg p-2 h-20 overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-[10px] font-mono text-primary/80 leading-relaxed"
                    >
                      {"Analyzing the request to understand..."}{"\n"}
                      {"Looking for relevant information..."}{"\n"}
                      {"Processing search results..."}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-primary/10 border-t border-border/30">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-primary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Aether Active
                </span>
                <span className="text-[10px] text-muted-foreground">Session: research-agent</span>
              </div>
              <span className="text-[10px] text-muted-foreground">3 nodes • 127 tokens</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
