"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Terminal, 
  Settings, 
  Layers, 
  ShieldAlert, 
  Copy, 
  Check, 
  Cpu, 
  CornerDownRight,
  Database
} from "lucide-react"

const DOC_TOPICS = [
  { id: "quickstart", label: "Quickstart Onboarding", icon: Cpu },
  { id: "api", label: "AetherTracer Core API", icon: Settings },
  { id: "cli", label: "CLI commands", icon: Terminal },
  { id: "vscode", label: "VS Code Integration", icon: Layers },
  { id: "privacy", label: "Local Privacy assurance", icon: Database },
]

export default function DocsPage() {
  const [activeTopic, setActiveTopic] = useState("quickstart")
  const [isCopied, setIsCopied] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(id)
    setTimeout(() => setIsCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-foreground relative overflow-hidden flex flex-col justify-between antialiased selection:bg-primary/20">
      <Navigation />

      {/* Ambient background blur */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[450px] h-[450px] bg-gradient-radial-cyan opacity-[0.06]" />
        <div className="absolute bottom-[20%] left-[5%] w-[500px] h-[500px] bg-gradient-radial-purple opacity-[0.05]" />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10 flex-grow max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Topics Navigator */}
          <div className="lg:col-span-3 space-y-3">
            <div className="px-3 pb-2 border-b border-border/10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Developer Manual</span>
            </div>
            <div className="space-y-1">
              {DOC_TOPICS.map(topic => {
                const Icon = topic.icon
                const isActive = activeTopic === topic.id
                return (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopic(topic.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs text-left transition-all duration-300 border ${
                      isActive 
                        ? "bg-primary/10 border-primary text-white font-bold glow-cyan-subtle" 
                        : "bg-transparent border-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-primary" />
                    <span>{topic.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Central Documentation Viewport */}
          <div className="lg:col-span-9 glass-panel bg-card/15 border border-border/30 rounded-2xl p-8 min-h-[500px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <AnimatePresence mode="wait">
              {activeTopic === "quickstart" && (
                <motion.div
                  key="quickstart"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                      Quickstart Onboarding
                    </h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Aether observations execute in your agent local runtime. You can setup instrumentation in under 30 seconds.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold font-mono text-white">1. Install telemetry runtime</h3>
                    <div className="bg-black/50 border border-border/20 rounded-xl p-3 flex items-center justify-between">
                      <code className="text-xs font-mono text-emerald-400">pip install aether-observe</code>
                      <button
                        onClick={() => handleCopy("pip install aether-observe", "pip")}
                        className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                      >
                        {isCopied === "pip" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold font-mono text-white">2. Instrument agent flow</h3>
                    <p className="text-xs text-muted-foreground">
                      Initialize `AetherTracer` to observe reasoning, tool parameters, and hallucinated boundaries:
                    </p>
                    <div className="relative rounded-xl overflow-hidden border border-border/20 bg-black/40 p-4">
                      <button
                        onClick={() => handleCopy(`from aether import AetherTracer\n\ntracer = AetherTracer(agent_name="research-agent")\n\ntracer.thought("Planning approach")\ntracer.tool("web_search", query="best fine tuning methods")\ntracer.result("Retrieved 5 papers")`, "code1")}
                        className="absolute right-4 top-4 p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                      >
                        {isCopied === "code1" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <pre className="font-mono text-xs text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre">
                        <div><span className="text-primary">from</span> aether <span className="text-primary">import</span> AetherTracer</div>
                        <div className="text-muted-foreground mt-2"># Initialize minimal reasoning logger</div>
                        <div>tracer = AetherTracer(agent_name=<span className="text-emerald-400">"research-agent"</span>)</div>
                        <div className="text-muted-foreground mt-2"># Log sequential thoughts, tool calls, and results</div>
                        <div>tracer.thought(<span className="text-emerald-400">"Planning approach"</span>)</div>
                        <div>tracer.tool(<span className="text-emerald-400">"web_search"</span>, query=<span className="text-emerald-400">"best fine tuning methods"</span>)</div>
                        <div>tracer.result(<span className="text-emerald-400">"Retrieved 5 papers"</span>)</div>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTopic === "api" && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold font-mono text-white">AetherTracer Core API Reference</h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      API hooks supported by the python observability runtime for capturing reasoning events.
                    </p>
                  </div>

                  <div className="space-y-6 pt-2">
                    
                    {/* API 1 */}
                    <div className="border-b border-border/10 pb-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-primary font-bold">tracer.thought(message: str)</code>
                        <span className="text-[9px] font-mono border border-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">COG</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed pl-4">
                        Registers a sequential cognitive reasoning block. Highlights as blue custom card nodes in the React Flow DAG timeline viewer.
                      </p>
                    </div>

                    {/* API 2 */}
                    <div className="border-b border-border/10 pb-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-accent font-bold">tracer.tool(name: str, **arguments)</code>
                        <span className="text-[9px] font-mono border border-accent/20 text-accent px-1.5 py-0.5 rounded font-bold">TOOL</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed pl-4">
                        Logs execution of custom functions or LLM tool interfaces. Automatically draws purple spinning CPU node cards detailing raw arguments in metadata lists.
                      </p>
                    </div>

                    {/* API 3 */}
                    <div className="border-b border-border/10 pb-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-destructive font-bold">tracer.warn_hallucination(description: str, confidence: float)</code>
                        <span className="text-[9px] font-mono border border-destructive/20 text-destructive px-1.5 py-0.5 rounded font-bold">ALERT</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed pl-4">
                        Intercepts high-risk parameters, formatting wildcards, or low confidence levels. Flashes expanding neon-red ripples on active DAG coordinates.
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}

              {activeTopic === "cli" && (
                <motion.div
                  key="cli"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold font-mono text-white">Observability CLI Terminal</h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Control pipelines, watch local folders, and serve trace visualizers completely offline.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold font-mono text-white">Serve Replay Dashboard locally</h3>
                    <p className="text-xs text-muted-foreground">
                      Reads `.aether/traces/` directory and compiles a local visualizer socket:
                    </p>
                    <div className="bg-black/50 border border-border/20 rounded-xl p-3 flex items-center justify-between">
                      <code className="text-xs font-mono text-emerald-400">aether replay</code>
                      <button
                        onClick={() => handleCopy("aether replay", "cli1")}
                        className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                      >
                        {isCopied === "cli1" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold font-mono text-white">Diagnostic doctor checks</h3>
                    <p className="text-xs text-muted-foreground">
                      Checks workspace files, write permissions, and port connectivity:
                    </p>
                    <div className="bg-black/50 border border-border/20 rounded-xl p-3 flex items-center justify-between">
                      <code className="text-xs font-mono text-emerald-400">aether doctor</code>
                      <button
                        onClick={() => handleCopy("aether doctor", "cli2")}
                        className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                      >
                        {isCopied === "cli2" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTopic === "vscode" && (
                <motion.div
                  key="vscode"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold font-mono text-white">Aether VS Code Extension</h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Observe agent reasoning directly inside your code editor layout. The main user experience for daily developers.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                      <CornerDownRight className="w-4 h-4 text-primary" />
                      Visual Features
                    </h3>
                    <ul className="space-y-3.5 pl-6">
                      <li className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                        <strong className="text-white">File watcher:</strong> Watches the hidden local directory `.aether/traces/` to hot-reload graphs on trace updates.
                      </li>
                      <li className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                        <strong className="text-white">Active highlighting:</strong> Selects and highlights node code lines in VS Code tabs as timeline steps traverse on the visual canvas.
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTopic === "privacy" && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                      Local-First Privacy Assurance
                    </h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Aether operates locally under zero-telemetry paradigms. We never harvest agent models, tokens, weights, or reasoning vectors.
                    </p>
                  </div>

                  <div className="bg-[#0b0b12] border border-border/30 rounded-xl p-5 flex items-start gap-4">
                    <ShieldAlert className="w-6 h-6 text-primary shrink-0 animate-pulse mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold font-mono text-white uppercase">Secure Offline Isolation</h4>
                      <p className="text-[11px] font-mono text-muted-foreground leading-normal mt-1.5">
                        Your telemetry trace files are saved locally inside human-readable JSON formats in `.aether/traces`. No network handshakes occur unless you opt to upload a cloud sync trace or configure a public shared playback route.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
