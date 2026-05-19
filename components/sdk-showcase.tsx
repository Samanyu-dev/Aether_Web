"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Copy, 
  Check, 
  Terminal, 
  Play, 
  RefreshCw, 
  Layers, 
  ExternalLink,
  Cpu,
  Globe,
  Settings,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

const codeExamples = {
  openai: `from aether import AetherTracer

# Initialize minimal reasoning logger
tracer = AetherTracer(agent_name="research-agent")

# Log sequential thoughts, tool calls, and results
tracer.thought("Planning approach")
tracer.tool("web_search", query="best fine tuning methods")
tracer.result("Retrieved 5 papers")`,
  langchain: `from aether.integrations import LangChainTracer
from langchain.agents import AgentExecutor

# Initialize automatic callback integration
tracer = LangChainTracer(
    project="agent-executor",
    local=True
)

# Run AgentExecutor with automatic session callbacks
agent = AgentExecutor(
    agent=your_agent,
    tools=your_tools,
    callbacks=[tracer]
)

# Observe fully detailed visual logs locally
result = agent.run("Safely evaluate DevOps folder")`,
  crewai: `from aether.integrations import CrewAITracer
from crewai import Crew

# Initialize multi-agent orchestration observer
tracer = CrewAITracer(project="hiring-crew")

crew = Crew(
    agents=[recruiter, reviewer],
    tasks=[screen_candidates, schedule_calls],
    callbacks=[tracer.crew_callback]
)

# Replay full multi-agent collaborative trace
result = crew.kickoff()`,
}

type TabKey = keyof typeof codeExamples

const tabs: { id: TabKey; label: string }[] = [
  { id: "openai", label: "Pure Python SDK" },
  { id: "langchain", label: "LangChain integration" },
  { id: "crewai", label: "CrewAI Orchestration" },
]

export function SDKShowcase() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>("openai")
  
  // Interactive Onboarding Steps: 0: Install, 1: Instrument, 2: Run CLI, 3: Observe
  const [onboardStep, setOnboardStep] = useState(0)
  
  // CLI Command simulation states
  const [cliInput, setCliInput] = useState("")
  const [cliLogs, setCliLogs] = useState<string[]>([])
  const [isCliRunning, setIsCliRunning] = useState(false)
  
  // Graph reconstruction mock state
  const [reconstructedNodes, setReconstructedNodes] = useState<{ id: string; type: string; label: string; status: string }[]>([])
  const [reconstructedStep, setReconstructedStep] = useState(0)

  const terminalBottomRef = useRef<HTMLDivElement | null>(null)

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Trigger CLI execution simulation
  const startCliReplay = () => {
    if (isCliRunning) return
    setIsCliRunning(true)
    setCliLogs([])
    setOnboardStep(2) // Move to terminal view
    
    const logs = [
      "$ aether replay",
      "🧠 [Aether CLI] Initializing diagnostics on .aether/traces/*.json",
      "🩺 Running doctor checks... All local folders found & writable.",
      "🌌 Aether Observatory Replay Server starting...",
      "==================================================",
      "Address:      \u001b[92mhttp://localhost:3000\u001b[0m",
      "UI Directory: UI precompiled assets [OK]",
      "Trace Source: .aether/traces/*.json",
      "==================================================",
      "✨ [Aether CLI] Loaded latest session: assistant-chat-agent-8f3b21c4",
      "⚡ Reconstructing DAG tree structure... Done in 0.4ms.",
      "Press CTRL+C to stop the replay server safely.",
      "🚀 Visualizer opened in browser window..."
    ]

    let logIndex = 0
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setCliLogs((prev) => [...prev, logs[logIndex]])
        logIndex++
      } else {
        clearInterval(interval)
        setIsCliRunning(false)
        setOnboardStep(3) // Auto transition to observation stage
      }
    }, 450)
  }

  // Reconstructed graph node builder simulation
  useEffect(() => {
    if (onboardStep === 3) {
      setReconstructedNodes([])
      setReconstructedStep(0)
      
      const nodesData = [
        { id: "1", type: "thought", label: "DevOpsGPT.thought()", status: "completed" },
        { id: "2", type: "tool", label: "bash_run(find)", status: "completed" },
        { id: "3", type: "output", label: "Safe Output Complete", status: "completed" }
      ]

      let idx = 0
      const graphInterval = setInterval(() => {
        if (idx < nodesData.length) {
          setReconstructedNodes((prev) => [...prev, nodesData[idx]])
          idx++
          setReconstructedStep(idx)
        } else {
          clearInterval(graphInterval)
        }
      }, 1500)

      return () => clearInterval(graphInterval)
    }
  }, [onboardStep])

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [cliLogs])

  return (
    <section className="py-28 relative overflow-hidden bg-background" id="sdk">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial-purple opacity-[0.04]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial-cyan opacity-[0.04]" />
      </div>

      <div className="site-container relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary uppercase tracking-wider mb-4"
          >
            Zero Cloud Dependency
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Real SDK <span className="text-gradient-cyan">Onboarding</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            No fake install cards or mocked mockups. Discover the exact workflow to install the SDK, instrument your agent, run the replay server, and visualize cognition graphs locally.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 mb-12 max-w-4xl mx-auto">
          {[
            { step: 0, label: "1. pip install aether-observe" },
            { step: 1, label: "2. Add Instrumentation" },
            { step: 2, label: "3. Run 'aether replay'" },
            { step: 3, label: "4. Animate Cognition Graph" }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => {
                if (!isCliRunning) setOnboardStep(item.step)
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                onboardStep === item.step
                  ? "bg-primary/20 text-primary border-primary/40 shadow-[0_0_15px_oklch(0.72_0.19_195/0.1)]"
                  : "bg-card/40 text-muted-foreground border-border/30 hover:border-border/60"
              }`}
              disabled={isCliRunning}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Dynamic Sandbox Display Board */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="glass-panel rounded-3xl overflow-hidden border border-border/40 bg-card/60 relative">
            
            {/* Terminal Window Chrome bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/70" />
                <div className="w-3 h-3 rounded-full bg-amber-400/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
              </div>
              <span className="text-xs font-mono text-muted-foreground select-none">
                {onboardStep === 3 ? "observatory.aether.local" : "devops-session - terminal"}
              </span>
              <div className="w-12" />
            </div>

            {/* Content Display based on active step */}
            <div className="p-8 min-h-[340px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Installation */}
                {onboardStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 flex-1 flex flex-col justify-center"
                  >
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">
                        Step 1: Get the package
                      </span>
                      <h3 className="text-2xl font-bold">pip install aether-observe</h3>
                      <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                        Aether is fully open-source and structured as a lightweight Python library. Instantly bring the visualizer core into your dev environment.
                      </p>
                    </div>

                    <div className="bg-background/80 border border-border/30 rounded-xl p-4 flex items-center justify-between font-mono text-sm max-w-xl">
                      <span className="text-foreground">
                        <span className="text-accent">$</span> pip install aether-observe
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy("pip install aether-observe")}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="pt-4">
                      <Button
                        className="glow-cyan"
                        onClick={() => setOnboardStep(1)}
                      >
                        Move to Instrumentation <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Instrument */}
                {onboardStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">
                        Step 2: Instrument Your Agent
                      </span>
                      <h3 className="text-2xl font-bold">Drop in AgentTracer</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                        Import `AgentTracer` to observe your agent. Use contextual blocks to trace thoughts and tool invocations dynamically. Traces are automatically flushed to local `.json` storage.
                      </p>
                    </div>

                    <div className="bg-background/80 border border-border/30 rounded-xl p-4 overflow-x-auto font-mono text-xs leading-relaxed max-w-2xl text-muted-foreground">
                      <pre>
                        <code>
                          <span className="text-accent">from</span> aether <span className="text-accent">import</span> AgentTracer{"\n"}{"\n"}
                          tracer = <span className="text-primary">AgentTracer</span>(project=<span className="text-emerald-400">"assistant"</span>){"\n"}{"\n"}
                          <span className="text-accent">with</span> tracer.<span className="text-primary">session</span>(<span className="text-emerald-400">"chat-agent"</span>) <span className="text-accent">as</span> session:{"\n"}
                          {"    "}root = session.<span className="text-primary">thought</span>(<span className="text-emerald-400">"Analyzing request..."</span>){"\n"}
                          {"    "}session.<span className="text-primary">tool_call</span>(<span className="text-emerald-400">"web_search"</span>, {"{"}<span className="text-emerald-400">"query"</span>: <span className="text-emerald-400">"observability"</span>{"}"})
                        </code>
                      </pre>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        className="glow-cyan"
                        onClick={startCliReplay}
                        disabled={isCliRunning}
                      >
                        {isCliRunning ? "Initializing..." : "Launch Replay Server"}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: CLI Terminal Run */}
                {onboardStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pb-2 border-b border-border/20">
                        <span>Terminal Console</span>
                        <span className="text-primary font-bold">aether replay --port 3000</span>
                      </div>
                      
                      <div className="bg-background/95 border border-border/30 rounded-xl p-4 font-mono text-[10px] leading-relaxed overflow-y-auto max-h-[220px] text-foreground/80 space-y-1">
                        {cliLogs.map((log, i) => (
                          <div key={i}>{log}</div>
                        ))}
                        <div ref={terminalBottomRef} />
                      </div>
                    </div>

                    <div className="pt-4 text-xs text-muted-foreground flex items-center justify-between">
                      <span>Server status: live connection detected</span>
                      <span>127.0.0.1:3000</span>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Graph Playback Observation */}
                {onboardStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                          Step 4: Reconstructed Playback UI
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Replay Sequence Loaded
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">Observe Replay Reconstruction</h3>
                      <p className="text-xs text-muted-foreground max-w-xl">
                        Aether parses the local session trace file, automatically binds child-to-parent UUIDs, and draws the cognitive reasoning nodes with glowing edge traversal pulses.
                      </p>
                    </div>

                    {/* Animated browser mock drawing graph */}
                    <div className="bg-background/90 border border-border/30 rounded-xl p-6 flex flex-col md:flex-row justify-around items-center gap-6 relative min-h-[160px]">
                      
                      {/* SVGs linking these mock nodes */}
                      <div className="absolute inset-0 pointer-events-none z-0">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          {reconstructedStep >= 2 && (
                            <path 
                              d="M 170 80 L 290 80"
                              stroke="var(--color-primary)"
                              strokeWidth="2"
                              fill="none"
                            />
                          )}
                          {reconstructedStep >= 3 && (
                            <path 
                              d="M 410 80 L 530 80"
                              stroke="oklch(0.75 0.18 180)"
                              strokeWidth="2"
                              fill="none"
                            />
                          )}
                        </svg>
                      </div>

                      {/* Mock Node 1 */}
                      {reconstructedStep >= 1 ? (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="z-10 px-4 py-3 rounded-lg border border-primary/30 bg-card text-xs flex flex-col w-[120px]"
                        >
                          <span className="text-[9px] font-bold uppercase text-primary">Thought</span>
                          <span className="font-bold truncate mt-1">Analyzing...</span>
                        </motion.div>
                      ) : (
                        <div className="w-[120px] h-10 border border-border/20 rounded-lg border-dashed" />
                      )}

                      {/* Mock Node 2 */}
                      {reconstructedStep >= 2 ? (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="z-10 px-4 py-3 rounded-lg border border-accent/30 bg-card text-xs flex flex-col w-[120px]"
                        >
                          <span className="text-[9px] font-bold uppercase text-accent">Tool Call</span>
                          <span className="font-bold truncate mt-1">web_search</span>
                        </motion.div>
                      ) : (
                        <div className="w-[120px] h-10 border border-border/20 rounded-lg border-dashed" />
                      )}

                      {/* Mock Node 3 */}
                      {reconstructedStep >= 3 ? (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="z-10 px-4 py-3 rounded-lg border border-emerald-500/30 bg-card text-xs flex flex-col w-[120px]"
                        >
                          <span className="text-[9px] font-bold uppercase text-emerald-400">Output</span>
                          <span className="font-bold truncate mt-1">Success</span>
                        </motion.div>
                      ) : (
                        <div className="w-[120px] h-10 border border-border/20 rounded-lg border-dashed" />
                      )}

                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setOnboardStep(1)
                          setReconstructedNodes([])
                          setReconstructedStep(0)
                        }}
                      >
                        Reset Walkthrough
                      </Button>
                      <a href="#replay">
                        <Button
                          size="sm"
                          className="glow-cyan"
                        >
                          Try Interactive Replay <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </a>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Framework Integrations Tabs (Retained original functionality, elevated visual) */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-xl font-bold">Framework Integrations</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Clean integrations for popular developer agent platforms, wrapping executors in zero-effort callbacks.
            </p>
          </motion.div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-border/30 bg-card/25">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-6 py-3 bg-card/85 border-b border-border/30">
              <div className="flex items-center gap-1.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <span className="text-[10px] font-mono text-muted-foreground uppercase hidden sm:block">
                callbacks.py
              </span>
            </div>

            {/* Code content */}
            <div className="p-6">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground z-10"
                  onClick={() => handleCopy(codeExamples[activeTab])}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
                
                <div className="bg-background/80 rounded-xl p-5 overflow-x-auto border border-border/20 font-mono text-xs leading-relaxed text-muted-foreground">
                  <pre>
                    <code>
                      {codeExamples[activeTab]}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
