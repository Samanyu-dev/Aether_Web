"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Terminal, 
  Cpu, 
  Settings, 
  Layers, 
  ShieldAlert, 
  Copy, 
  Check, 
  BookOpen, 
  Search, 
  Github, 
  ExternalLink,
  ChevronRight,
  Compass,
  Play,
  CheckCircle,
  HelpCircle,
  Database,
  ArrowRight,
  Code,
  List,
  Sparkles,
  Command,
  Activity,
  Maximize2
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Types
interface SidebarItem {
  id: string
  label: string
  icon?: any
}

interface SidebarGroup {
  title: string
  items: SidebarItem[]
}

// Sidebar Structure
const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    title: "GETTING STARTED",
    items: [
      { id: "intro", label: "Introduction", icon: Compass },
      { id: "quickstart", label: "Quickstart Onboarding", icon: Sparkles },
      { id: "install", label: "Installation Guide", icon: Terminal },
    ]
  },
  {
    title: "CORE SDK",
    items: [
      { id: "tracer", label: "AetherTracer Core API", icon: Code },
      { id: "thoughts", label: "Thought Tracking", icon: Cpu },
      { id: "tools", label: "Tool Logging", icon: Settings },
    ]
  },
  {
    title: "OBSERVABILITY & SAFETY",
    items: [
      { id: "hallucination", label: "Hallucination Detection", icon: ShieldAlert },
      { id: "safety", label: "Safety & Correction", icon: Layers },
      { id: "local-first", label: "Local-First Architecture", icon: Database },
    ]
  }
]

// Available Languages for Code Block Tabs
type CodeLang = "python" | "typescript" | "bash"

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>("intro")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeLang, setActiveLang] = useState<CodeLang>("python")
  const [isCopied, setIsCopied] = useState<string | null>(null)
  
  // Interactive Onboarding Checklist State
  const [checklist, setChecklist] = useState({
    install: true,
    init: false,
    trace: false,
    view: false
  })

  // Dynamic Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0)
  const contentContainerRef = useRef<HTMLDivElement>(null)

  // Command Palette Cmd+K Trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
      if (e.key === "Escape") {
        setSearchOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Scroll Tracking for Right Table of Contents Panel
  useEffect(() => {
    const handleScroll = () => {
      if (!contentContainerRef.current) return
      const element = contentContainerRef.current
      const totalHeight = element.scrollHeight - element.clientHeight
      if (totalHeight > 0) {
        setScrollProgress(Math.min((element.scrollTop / totalHeight) * 100, 100))
      }
    }
    const container = contentContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [activeSection])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(id)
    setTimeout(() => setIsCopied(null), 2000)
  }

  // Filter items in command search palette
  const allSearchItems = SIDEBAR_GROUPS.flatMap(g => g.items)
  const filteredSearchItems = allSearchItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-[#02040A] text-foreground relative overflow-hidden flex flex-col antialiased selection:bg-primary/20">
      
      {/* Background Matrix/Dotted Aesthetics */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(oklch(0.72 0.19 195) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial-purple opacity-[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-radial-cyan opacity-[0.03] blur-3xl" />
      </div>

      {/* ──────────────────────────────────────────────────
          TOP NAVBAR REDESIGN (Translucent Glassmorphism)
          ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-border/30 bg-[#02040A]/75 backdrop-blur-md transition-all duration-300">
        <div className="max-w-[1536px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="Aether Logo" className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110" />
              <span className="font-mono text-sm font-black tracking-widest text-white group-hover:text-primary transition-colors">
                AETHER
              </span>
            </a>
            
            {/* Version Badges & Beta */}
            <div className="hidden sm:flex items-center gap-2 select-none">
              <span className="px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-[9px] font-mono font-bold text-primary tracking-wider uppercase">
                v1.2.6
              </span>
              <span className="px-1.5 py-0.5 rounded-md border border-accent/20 bg-accent/5 text-[8.5px] font-mono font-bold text-accent">
                BETA
              </span>
            </div>
          </div>

          {/* Center: Sticky Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-mono">
            {["Overview", "Quickstart", "SDK", "Replay Engine", "Integrations", "API", "Pricing"].map(navItem => (
              <a
                key={navItem}
                href={`#${navItem.toLowerCase()}`}
                className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-white transition-colors relative hover:bg-white/5"
              >
                {navItem}
              </a>
            ))}
          </nav>

          {/* Right: Quick Search, Github and CTA */}
          <div className="flex items-center gap-3">
            {/* Command Search Trigger Pill */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-border/30 bg-[#070913] hover:border-primary/40 hover:bg-[#0c0f20]/90 text-xs text-muted-foreground font-mono transition-all group max-w-[200px]"
            >
              <Search className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
              <span className="hidden sm:inline text-[10px]">Search docs...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border/30 bg-muted/20 text-[9px] text-muted-foreground">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>

            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-full border border-border/30 bg-[#070913] hover:border-primary/40 text-muted-foreground hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>

            <button 
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-white/90 text-black text-[11px] font-bold font-mono transition-all active:scale-95"
            >
              Start Beta
            </button>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────
          DESKTOP THREE-COLUMN OBSERVER LAYOUT SYSTEM
          ────────────────────────────────────────────────── */}
      <div className="flex-grow max-w-[1536px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[calc(100vh-4rem)]">
        
        {/* SIDEBAR: Left column (Col-span 3) */}
        <aside className="hidden lg:block lg:col-span-3 border-r border-border/15 pr-6 py-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin">
          <div className="space-y-8">
            
            {/* Quick Status Check Card */}
            <div className="p-3.5 rounded-2xl border border-primary/20 bg-primary/5 font-mono text-[10px] space-y-2">
              <div className="flex items-center justify-between text-primary font-bold">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse" /> Telemetry Connection
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-muted-foreground/80 leading-normal text-[9px]">
                Offline Sandbox active. Tracking events locally inside `.aether/traces`
              </p>
            </div>

            {/* Sidebar Navigation Links */}
            {SIDEBAR_GROUPS.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-2">
                <h4 className="text-[9.5px] font-mono font-bold tracking-widest text-muted-foreground/60 uppercase">
                  {group.title}
                </h4>
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const Icon = item.icon
                    const isActive = activeSection === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-mono text-xs transition-all duration-200 border ${
                          isActive 
                            ? "bg-primary/10 border-primary/40 text-primary font-bold shadow-[0_0_12px_oklch(0.72_0.19_195_/_0.08)]" 
                            : "bg-transparent border-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {Icon && <Icon className="w-4 h-4 shrink-0" />}
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT AREA: Middle column (Col-span 6) */}
        <section 
          ref={contentContainerRef}
          className="col-span-12 lg:col-span-6 py-8 lg:px-4 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-10 max-w-[820px] mx-auto text-left"
            >
              {/* ──────────────────────────────────────────────────
                  1. INTRODUCTION SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "intro" && (
                <div className="space-y-6">
                  {/* Hero Intro */}
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-primary font-bold px-2 py-0.5 rounded border border-primary/20 bg-primary/5">
                      Documentation Platform
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight font-mono">
                      Observe AI cognition <br />
                      <span className="text-gradient-cyan">like a debugger</span>.
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                      Aether is a production-grade, local-first AI observability platform designed for engineering autonomous agents. Capture logic paths, tool invocations, and live hallucinations completely offline.
                    </p>
                  </div>

                  {/* Visual Onboarding Progression */}
                  <div className="p-5 rounded-3xl border border-border/30 bg-[#070913]/60 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/10 pb-3">
                      <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                        <List className="w-4 h-4 text-primary" /> Onboarding Checklist
                      </h3>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {Object.values(checklist).filter(Boolean).length} / 4 Completed
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {[
                        { key: "install", label: "Install minimal CLI telemetry tool", desc: "Run python package manager setup." },
                        { key: "init", label: "Initialize AetherTracer inside code", desc: "Configure agent framework session metadata." },
                        { key: "trace", label: "Emit trace telemetry streams", desc: "Capture thought chains, tools, and result payloads." },
                        { key: "view", label: "View visual reasoning timeline", desc: "Access gorgeous live playback observer sandbox." },
                      ].map((item) => {
                        const isDone = checklist[item.key as keyof typeof checklist]
                        return (
                          <button
                            key={item.key}
                            onClick={() => setChecklist(p => ({ ...p, [item.key]: !isDone }))}
                            className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 ${
                              isDone 
                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                                : "bg-[#0b0d18] border-border/20 hover:border-primary/30 text-muted-foreground"
                            }`}
                          >
                            <span className="mt-0.5">
                              {isDone 
                                ? <CheckCircle className="w-4 h-4 text-emerald-400" /> 
                                : <div className="w-4 h-4 rounded-full border border-muted-foreground/30 hover:border-primary shrink-0" />
                              }
                            </span>
                            <div>
                              <div className={`text-xs font-mono font-bold ${isDone ? "text-emerald-300" : "text-white"}`}>
                                {item.label}
                              </div>
                              <div className="text-[10px] text-muted-foreground/75 mt-0.5">{item.desc}</div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Real developer architecture explain */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-mono font-bold text-white">Why AI Observability Matters</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Unlike traditional microservices, autonomous agents propagate logic using unstructured cognitive decisions, tool loops, and dynamic corrections. Standard logs cannot capture the trajectory of an agent's reasoning. Aether parses unstructured decision contexts into deterministic, high-performance traces.
                    </p>
                  </div>

                  {/* Navigation Shortcut button */}
                  <div className="pt-2">
                    <Button 
                      onClick={() => setActiveSection("quickstart")}
                      className="bg-primary text-black font-mono font-bold hover:bg-primary/95 text-xs px-6 py-5 rounded-full flex items-center gap-2"
                    >
                      Go to Quickstart <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  2. QUICKSTART ONBOARDING SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "quickstart" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      Quickstart Onboarding
                    </h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Initialize trace instrumentation inside your autonomous agent code in under 30 seconds. Support Python, TypeScript, and full terminal CLI execution.
                    </p>
                  </div>

                  {/* Dynamic Tabs for language select */}
                  <div className="border-b border-border/10 flex gap-1">
                    {[
                      { id: "python", label: "Python SDK" },
                      { id: "typescript", label: "TypeScript SDK" },
                      { id: "bash", label: "Aether CLI" },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveLang(tab.id as CodeLang)}
                        className={`px-4 py-2 border-b-2 font-mono text-xs transition-all ${
                          activeLang === tab.id 
                            ? "border-primary text-white font-bold" 
                            : "border-transparent text-muted-foreground hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content conditional rendering */}
                  <AnimatePresence mode="wait">
                    {activeLang === "python" && (
                      <motion.div 
                        key="py" 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono font-bold text-white">1. Install telemetry package</h4>
                          <div className="bg-[#040409] border border-border/20 rounded-2xl p-4 flex items-center justify-between font-mono text-xs text-emerald-400">
                            <code>pip install aether-observe</code>
                            <button
                              onClick={() => handleCopy("pip install aether-observe", "pip-py")}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all active:scale-95"
                            >
                              {isCopied === "pip-py" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono font-bold text-white">2. Initialize AetherTracer</h4>
                          <div className="relative rounded-2xl border border-border/20 bg-[#040409]/90 p-4 font-mono text-xs text-muted-foreground leading-relaxed overflow-x-auto">
                            <div className="absolute right-4 top-4 flex gap-2">
                              <button
                                onClick={() => handleCopy(`from aether import AetherTracer\n\ntracer = AetherTracer(agent_name="checkout-agent")\n\ntracer.thought("Resolving lock coordinates")\ntracer.tool("getIdempotent", key="checkout_251")`, "code-py")}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all active:scale-95"
                              >
                                {isCopied === "code-py" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            
                            <div className="text-[10px] text-muted-foreground/40 border-b border-border/10 pb-2 mb-2">python · agent.py</div>
                            
                            <div><span className="text-primary font-bold">from</span> aether <span className="text-primary font-bold">import</span> AetherTracer</div>
                            <div className="text-muted-foreground/50 mt-1"># Create instrumentation tracer</div>
                            <div>tracer = AetherTracer(agent_name=<span className="text-emerald-400">"checkout-agent"</span>)</div>
                            
                            <div className="text-muted-foreground/50 mt-3"># Track internal thoughts, tool coordinates and metadata</div>
                            <div>tracer.thought(<span className="text-emerald-400">"Resolving lock coordinates"</span>)</div>
                            <div>tracer.tool(<span className="text-emerald-400">"getIdempotent"</span>, key=<span className="text-emerald-400">"checkout_251"</span>)</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeLang === "typescript" && (
                      <motion.div 
                        key="ts" 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono font-bold text-white">1. Add node packages</h4>
                          <div className="bg-[#040409] border border-border/20 rounded-2xl p-4 flex items-center justify-between font-mono text-xs text-emerald-400">
                            <code>npm install @aether/observe</code>
                            <button
                              onClick={() => handleCopy("npm install @aether/observe", "npm-ts")}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all active:scale-95"
                            >
                              {isCopied === "npm-ts" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono font-bold text-white">2. Instrument TypeScript Runtime</h4>
                          <div className="relative rounded-2xl border border-border/20 bg-[#040409]/90 p-4 font-mono text-xs text-muted-foreground leading-relaxed overflow-x-auto">
                            <div className="absolute right-4 top-4 flex gap-2">
                              <button
                                onClick={() => handleCopy(`import { AetherTracer } from "@aether/observe";\n\nconst tracer = new AetherTracer({ agentName: "checkout-agent" });\ntracer.thought("Evaluating secure cache runtime");\ntracer.tool("CircuitBreaker", { threshold: 0.85 });`, "code-ts")}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all active:scale-95"
                              >
                                {isCopied === "code-ts" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            
                            <div className="text-[10px] text-muted-foreground/40 border-b border-border/10 pb-2 mb-2">typescript · agent.ts</div>
                            
                            <div><span className="text-primary font-bold">import</span> &#123; AetherTracer &#125; <span className="text-primary font-bold">from</span> <span className="text-emerald-400">"@aether/observe"</span>;</div>
                            <div className="text-muted-foreground/50 mt-1">// Create high-performance trace client</div>
                            <div><span className="text-primary font-bold">const</span> tracer = <span className="text-primary font-bold">new</span> AetherTracer(&#123; agentName: <span className="text-emerald-400">"checkout-agent"</span> &#125;);</div>
                            
                            <div className="text-muted-foreground/50 mt-3">// Log sequential thought matrices</div>
                            <div>tracer.thought(<span className="text-emerald-400">"Evaluating secure cache runtime"</span>);</div>
                            <div>tracer.tool(<span className="text-emerald-400">"CircuitBreaker"</span>, &#123; threshold: <span className="text-amber-400">0.85</span> &#125;);</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeLang === "bash" && (
                      <motion.div 
                        key="cli" 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono font-bold text-white">1. Global curl installation</h4>
                          <div className="bg-[#040409] border border-border/20 rounded-2xl p-4 flex items-center justify-between font-mono text-xs text-emerald-400">
                            <code>curl -fsSL https://aether.sh/install | sh</code>
                            <button
                              onClick={() => handleCopy("curl -fsSL https://aether.sh/install | sh", "curl-cli")}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all active:scale-95"
                            >
                              {isCopied === "curl-cli" ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono font-bold text-white">2. CLI command examples</h4>
                          <ul className="space-y-2.5">
                            {[
                              { cmd: "aether init", desc: "Creates regional offline repository parameters." },
                              { cmd: "aether replay", desc: "Serves fully responsive web observer socket on local traces." },
                              { cmd: "aether doctor", desc: "Validates local JSON traces, environment, and permissions." },
                            ].map((command, cIdx) => (
                              <li key={cIdx} className="p-3 rounded-xl border border-border/20 bg-[#040409]/60 flex items-center justify-between">
                                <div className="font-mono text-xs text-white">
                                  <code className="text-primary font-bold">$</code> {command.cmd}
                                  <div className="text-[10px] text-muted-foreground mt-1">{command.desc}</div>
                                </div>
                                <button
                                  onClick={() => handleCopy(command.cmd, `c-${cIdx}`)}
                                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-muted-foreground transition-all active:scale-95"
                                >
                                  {isCopied === `c-${cIdx}` ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  3. INSTALLATION GUIDE SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "install" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white">Installation Guide</h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Aether runs locally on virtual systems. Follow the instructions to install the SDK environment and verify setup integrity.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-mono font-bold text-white">System Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border border-border/20 bg-[#070913]/60 font-mono text-[10px] space-y-1">
                        <div className="text-white font-bold">Python Environment</div>
                        <div className="text-muted-foreground">Python v3.8 or greater</div>
                        <div className="text-muted-foreground">Pip package installer package</div>
                      </div>
                      <div className="p-4 rounded-2xl border border-border/20 bg-[#070913]/60 font-mono text-[10px] space-y-1">
                        <div className="text-white font-bold">Node.js Environment</div>
                        <div className="text-muted-foreground">Node v18.0 or greater</div>
                        <div className="text-muted-foreground">NPM or PNPM package manager</div>
                      </div>
                    </div>
                  </div>

                  {/* Step-by-step check code */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-mono font-bold text-white">Verification Steps</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Verify that your package compiler has write access to create the hidden trace folder `.aether` inside your repository directory root. Aether will attempt to dump offline execution schemas inside `.aether/traces/playback.json` on runtime.
                    </p>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  4. CORE API REFERENCE SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "tracer" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white">AetherTracer Core API</h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      AetherTracer is the primary hook interface used to instrument and propagate trace segments.
                    </p>
                  </div>

                  {/* Complete detailed functions descriptions */}
                  <div className="space-y-4">
                    {[
                      {
                        name: "tracer.thought(message: str)",
                        type: "COGNITION",
                        desc: "Registers a sequential cognitive thought block inside the agent thread. Injected straight into the DAG visual graph traversal layer.",
                        args: "message: The narrative explanation representing what the LLM agent is currently planning or formulating."
                      },
                      {
                        name: "tracer.tool(name: str, **arguments)",
                        type: "TOOL CALL",
                        desc: "Logs execution of internal functions, environment operations, or LLM tool invocations. Automatically updates status badges.",
                        args: "name: Name of tool function. arguments: Named dictionary containing parameters provided to the tool call."
                      },
                      {
                        name: "tracer.warn_hallucination(description: str, confidence: float)",
                        type: "GUARDRAIL",
                        desc: "Dispatches threat warnings or confidence drops to Aether's runtime monitor. Intercepts wildcard deletion parameters in real-time.",
                        args: "description: Guardrail violation summary. confidence: Numeric probability parameter (0.0 to 1.0) assessing cognitive hallucination risk."
                      }
                    ].map((api, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-border/20 bg-[#070913]/60 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-border/10 pb-2">
                          <code className="text-xs font-mono text-primary font-bold">{api.name}</code>
                          <span className="px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-[9px] font-mono font-bold text-primary">
                            {api.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground pl-1.5 leading-relaxed">{api.desc}</p>
                        <div className="text-[10px] font-mono text-muted-foreground/60 pl-1.5 leading-normal">
                          <strong className="text-white">Parameters:</strong> {api.args}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  5. THOUGHT TRACKING SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "thoughts" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white">Thought Tracking</h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      AI systems represent unstructured trajectory paths. Tracking thought progressions provides critical debugger maps for agent logic.
                    </p>
                  </div>

                  {/* Responsive SDK Flow Visualization SVG with animated pulses */}
                  <div className="p-5 rounded-3xl border border-border/30 bg-[#04050a]/90 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-border/10 pb-3 mb-4">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-primary animate-pulse" /> Live SDK Trajectory Flow
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Pulse Traversal Active
                      </span>
                    </div>

                    {/* Responsive SVG diagram */}
                    <div className="relative w-full h-[320px] bg-[#020306] rounded-2xl border border-border/10 overflow-hidden flex flex-col justify-between p-4">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
                        {/* Animated pulses traversing down */}
                        <g>
                          <path d="M 60 70 L 60 140" fill="none" stroke="oklch(0.72 0.19 195 / 0.15)" strokeWidth="1.5" />
                          <circle r="3" fill="oklch(0.72 0.19 195)">
                            <animateMotion path="M 60 70 L 60 140" dur="2s" repeatCount="indefinite" />
                          </circle>
                        </g>
                        <g>
                          <path d="M 60 170 L 60 240" fill="none" stroke="oklch(0.72 0.19 195 / 0.15)" strokeWidth="1.5" />
                          <circle r="3" fill="oklch(0.72 0.19 195)">
                            <animateMotion path="M 60 170 L 60 240" dur="2s" repeatCount="indefinite" />
                          </circle>
                        </g>
                        {/* Branch paths to right */}
                        <g>
                          <path d="M 60 170 C 120 170, 180 140, 220 100" fill="none" stroke="oklch(0.65 0.22 300 / 0.15)" strokeWidth="1.5" strokeDasharray="3 3" />
                          <circle r="3" fill="oklch(0.65 0.22 300)">
                            <animateMotion path="M 60 170 C 120 170, 180 140, 220 100" dur="2.4s" repeatCount="indefinite" />
                          </circle>
                        </g>
                      </svg>

                      {/* Flex/Responsive Layout coordinates mapping inside UI */}
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        {/* Top: User Prompt */}
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-xl border border-primary/20 bg-[#070913] w-[140px] text-left font-mono">
                            <div className="text-[8px] font-bold text-primary">01. INGESTION</div>
                            <div className="text-[10px] text-white font-bold truncate">User Prompt</div>
                          </div>
                          <div className="text-[9px] font-mono text-muted-foreground/60 max-w-[160px] text-right">
                            Agent initializes thread trajectory path parameters
                          </div>
                        </div>

                        {/* Middle: Reasoning node and correction branch */}
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-xl border border-accent/20 bg-[#070913] w-[140px] text-left font-mono">
                            <div className="text-[8px] font-bold text-accent">02. COGNITION</div>
                            <div className="text-[10px] text-white font-bold truncate">Thought Loop</div>
                          </div>

                          <div className="p-3 rounded-xl border border-red-500/20 bg-[#070913] w-[140px] text-left font-mono shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                            <div className="text-[8px] font-bold text-red-400">02.B GUARDRAIL</div>
                            <div className="text-[10px] text-white font-bold truncate">Risk Intercepted</div>
                          </div>
                        </div>

                        {/* Bottom: Executed Safe Output */}
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-xl border border-emerald-500/20 bg-[#070913] w-[140px] text-left font-mono">
                            <div className="text-[8px] font-bold text-emerald-400">03. EXECUTION</div>
                            <div className="text-[10px] text-white font-bold truncate">Safe Output</div>
                          </div>
                          <div className="text-[9px] font-mono text-muted-foreground/60 max-w-[160px] text-right">
                            Resolved successfully with targeted safe cleanup action
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  6. TOOL LOGGING SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "tools" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white">Tool Logging</h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Tools represent dynamic actions where an agent interacts with external environments, local filesystems, or databases.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-white">Tip:</strong> Always declare the raw input arguments provided to your agent tools. Aether will parse the values and automatically format directory wildcards or security issues.
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  7. HALLUCINATION DETECTION SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "hallucination" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                      Hallucination Detection
                    </h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Observe how Aether Guardrails intercept high-risk, unstructured deletion requests before they hit the terminal.
                    </p>
                  </div>

                  <div className="bg-[#0b0c16]/80 border border-primary/30 rounded-2xl p-5 flex items-start gap-4">
                    <ShieldAlert className="w-6 h-6 text-primary shrink-0 mt-0.5 animate-bounce" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Aether Interception paradigms</h4>
                      <p className="text-[11px] font-mono text-muted-foreground leading-normal">
                        When the python tracer registers `warn_hallucination` or logs an aggressive command payload (e.g. `rm -rf /var/log/*`), Aether Guardrails immediately decelerate execution (Time Dilation) to 0.1× speed, review parameter values, and inject corrective feedback loops straight back into the agent prompt context.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  8. SAFETY & CORRECTION SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "safety" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white">Safety & Correction</h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Restructuring trajectory paths on the fly turns hallucination boundaries into resolved outcomes.
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By intercepting the prompt context, DevOpsGPT can pivot away from full wildcard deletions to targeted age-restricted removals (e.g. `find /var/log -name "*.log" -mtime +30 -exec rm {} \;`). The system recovers securely completely offline without terminal catastrophic failures.
                  </p>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  9. LOCAL-FIRST ARCHITECTURE SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "local-first" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white">Local-First Architecture</h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Privacy-first instrumentation ensures zero token leaks or code telemetry exfiltration.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-[#00FFA3]/20 bg-[#00FFA3]/5 text-xs text-muted-foreground leading-relaxed flex gap-3">
                    <Database className="w-5 h-5 text-[#00FFA3] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Zero Telemetry Isolation:</strong> Traces execute inside local loopbacks, saving variables straight to humans-readable JSON structures in the hidden directory `.aether/traces`. No external server handshakes occur.
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </section>

        {/* RIGHT CONTEXT PANEL: Right column (Col-span 3) */}
        <aside className="hidden lg:block lg:col-span-3 border-l border-border/15 pl-6 py-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin">
          <div className="space-y-8 text-left font-mono">
            
            {/* Action Card: Copy Install command */}
            <div className="p-4 rounded-2xl border border-border/30 bg-[#050816]/70 space-y-3">
              <span className="text-[9.5px] font-bold text-muted-foreground/60 uppercase tracking-wider block">
                Quick Install
              </span>
              <div className="bg-black/50 border border-border/10 p-2 rounded-xl flex items-center justify-between text-[11px] text-emerald-400">
                <code>pip install aether</code>
                <button
                  onClick={() => handleCopy("pip install aether", "quick-install")}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all active:scale-95"
                >
                  {isCopied === "quick-install" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Document progress indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                <span>Reading Progress</span>
                <span className="text-white font-bold">{Math.round(scrollProgress)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#0d1020] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-2">
              <span className="text-[9.5px] font-bold text-muted-foreground/60 uppercase tracking-wider block">
                Quick Links
              </span>
              <div className="grid gap-2">
                {[
                  { label: "Open CLI Reference", url: "#cli", icon: Terminal },
                  { label: "View Event Schemas", url: "#schemas", icon: Layers },
                  { label: "GitHub Repository", url: "https://github.com", icon: Github, external: true },
                ].map((action, actionIdx) => {
                  const Icon = action.icon
                  return (
                    <a
                      key={actionIdx}
                      href={action.url}
                      target={action.external ? "_blank" : undefined}
                      rel={action.external ? "noreferrer" : undefined}
                      className="p-2.5 rounded-xl border border-border/20 bg-transparent hover:border-primary/40 hover:bg-[#0c0f20]/50 transition-all flex items-center justify-between text-xs text-muted-foreground hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" /> {action.label}
                      </span>
                      {action.external && <ExternalLink className="w-3 h-3 text-muted-foreground/45" />}
                    </a>
                  )
                })}
              </div>
            </div>

            {/* API Status Badge */}
            <div className="pt-2 border-t border-border/10 space-y-1 text-[10px]">
              <div className="flex items-center justify-between text-muted-foreground/50">
                <span>API Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground/50">
                <span>Trace Ingress</span>
                <span className="text-white font-bold">12 ms response</span>
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* ──────────────────────────────────────────────────
          RAYCAST-STYLE FUZZY SEARCH COMMAND PALETTE MODAL
          ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-xl rounded-2xl border border-border/40 bg-[#070914] shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Search input field */}
              <div className="p-4 border-b border-border/10 flex items-center gap-3">
                <Search className="w-4 h-4 text-primary shrink-0 animate-pulse" />
                <input
                  type="text"
                  placeholder="Type to search Aether manual..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-xs font-mono w-full placeholder-muted-foreground/60"
                  autoFocus
                />
                <span className="text-[9px] font-mono text-muted-foreground/40 bg-muted/10 px-1.5 py-0.5 rounded select-none">ESC</span>
              </div>

              {/* Search results lists */}
              <div className="max-h-[320px] overflow-y-auto p-2 space-y-1">
                {filteredSearchItems.length > 0 ? (
                  filteredSearchItems.map(item => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id)
                          setSearchOpen(false)
                          setSearchQuery("")
                        }}
                        className="w-full p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-primary/20 text-left flex items-center justify-between font-mono transition-all group"
                      >
                        <span className="flex items-center gap-2.5 text-xs text-muted-foreground group-hover:text-white">
                          {Icon && <Icon className="w-4 h-4 text-primary shrink-0" />}
                          <span>{item.label}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/45 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </button>
                    )
                  })
                ) : (
                  <div className="p-8 text-center text-xs font-mono text-muted-foreground/50">
                    <HelpCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    No trace results matched "{searchQuery}"
                  </div>
                )}
              </div>

              {/* Search footer */}
              <div className="p-3.5 border-t border-border/10 bg-[#03050c] flex items-center justify-between text-[9px] font-mono text-muted-foreground/60 select-none">
                <span className="flex items-center gap-1">
                  <Command className="w-3 h-3" /> Navigation shortcuts
                </span>
                <span>↑↓ navigate · ↵ select</span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}
