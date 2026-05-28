"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useAetherStore } from "@/lib/store/useAetherStore"
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
  Maximize2,
  Brain,
  AlertTriangle
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
    title: "COGNITION DEBUGGING & SAFETY",
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
  const { session, signOut, checkSession } = useAetherStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

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
            <Link href="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="Aether Logo" className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110" />
              <span className="font-mono text-sm font-black tracking-widest text-white group-hover:text-primary transition-colors">
                AETHER
              </span>
            </Link>
            
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
            {[
              { label: "Overview", href: "/#replay" },
              { label: "Quickstart", href: "/#sdk" },
              { label: "SDK", href: "/#sdk" },
              { label: "Pricing", href: "/pricing" },
              { label: "Dashboard", href: "/dashboard" },
            ].map(navItem => (
              <Link
                key={navItem.label}
                href={navItem.href}
                className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-white transition-colors relative hover:bg-white/5"
              >
                {navItem.label}
              </Link>
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

            {session ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button size="sm" className="glow-cyan-subtle font-mono text-[11px] font-bold h-8">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-[11px] font-mono h-8"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white text-[11px] font-mono h-8">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="glow-cyan-subtle font-mono text-[11px] font-bold h-8">
                    Start Beta
                  </Button>
                </Link>
              </>
            )}
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
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-purple-400 font-bold px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/5 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                      Chrome DevTools for AI Cognition
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight font-sans">
                      Inspect & debug AI reasoning <br />
                      <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">with real-time breakpoints</span>.
                    </h1>
                    <p className="text-xs md:text-sm text-white/60 leading-relaxed max-w-xl">
                      Aether is a production-grade, local-first AI agent debugger. Build secure, self-healing cognitive loops with visual timeline scrubber playback, dynamic trajectory patching, and glowing memory inspection panels.
                    </p>
                  </div>

                  {/* Moats Showcases Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#090710]/85 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.03)] flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-rose-400 w-4 h-4" />
                        <h4 className="text-xs font-mono font-bold text-white uppercase">Reasoning Breakpoints</h4>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Halt executions before catastrophic terminal failures. Program condition lambdas and dim the ReactFlow canvas for visual human-in-the-loop review.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#07090f]/85 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.03)] flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-emerald-400 w-4 h-4" />
                        <h4 className="text-xs font-mono font-bold text-white uppercase">Cognition Patching</h4>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Surgically inject corrected thoughts or modify tool arguments, causing the visualizer to dynamically fork and splice new emerald safe paths on the canvas.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#070712]/85 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.03)] flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Brain className="text-purple-400 w-4 h-4" />
                        <h4 className="text-xs font-mono font-bold text-white uppercase">Memory Inspector</h4>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Audit retrieved semantic vector embeddings, evaluate active sliding token windows, and filter out prompt injections before they compromise execution.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#06090a]/85 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.03)] flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Layers className="text-emerald-400 w-4 h-4" />
                        <h4 className="text-xs font-mono font-bold text-white uppercase">Magical Zero-Config</h4>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Drop Aether directly into OpenAI, LangChain, or CrewAI. Zero configurations required—SDK singles-out execution and logs context loops automatically.
                      </p>
                    </div>
                  </div>

                  {/* Navigation Shortcut button */}
                  <div className="pt-2">
                    <Button 
                      onClick={() => setActiveSection("quickstart")}
                      className="bg-purple-600 text-white font-mono font-bold hover:bg-purple-500 text-xs px-6 py-5 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
                    >
                      Explore Quickstart <ChevronRight className="w-4 h-4" />
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
                      <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                      Quickstart Onboarding
                    </h2>
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      Auto-instrument your AI agent logic in under 30 seconds. Zero config, fully responsive logs, and local-first execution.
                    </p>
                  </div>

                  {/* Language Selection Tabs */}
                  <div className="border-b border-white/10 flex gap-1">
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
                            ? "border-purple-500 text-purple-400 font-bold" 
                            : "border-transparent text-white/40 hover:text-white"
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
                          <h4 className="text-xs font-mono font-bold text-white">1. Install SDK via Pip</h4>
                          <div className="bg-[#050409]/90 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.05)] rounded-2xl p-4 flex items-center justify-between font-mono text-xs text-purple-300">
                            <code>pip install aether-observe</code>
                            <button
                              onClick={() => handleCopy("pip install aether-observe", "pip-py")}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95 border border-white/5"
                            >
                              {isCopied === "pip-py" ? <Check className="w-4 h-4 text-purple-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono font-bold text-white">2. Initialize Zero-Config OpenAI wrapper</h4>
                          <div className="relative rounded-2xl border border-purple-500/20 bg-[#050409]/90 p-4 font-mono text-xs text-white/70 leading-relaxed overflow-x-auto shadow-[0_0_10px_rgba(168,85,247,0.05)]">
                            <div className="absolute right-4 top-4 flex gap-2">
                              <button
                                onClick={() => handleCopy(`from aether.integrations.openai import instrument_openai\nfrom openai import OpenAI\n\n# Zero config - auto associates with global local-first tracer!\nclient = instrument_openai(OpenAI())`, "code-py")}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95 border border-white/5"
                              >
                                {isCopied === "code-py" ? <Check className="w-4 h-4 text-purple-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            
                            <div className="text-[10px] text-white/30 border-b border-white/5 pb-2 mb-2">python · agent.py</div>
                            
                            <div><span className="text-purple-400 font-bold">from</span> aether.integrations.openai <span className="text-purple-400 font-bold">import</span> instrument_openai</div>
                            <div><span className="text-purple-400 font-bold">from</span> openai <span className="text-purple-400 font-bold">import</span> OpenAI</div>
                            <div className="text-white/45 mt-2"># Zero-config wrappers automatically discover Aether default session!</div>
                            <div>client = instrument_openai(OpenAI())</div>
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
                          <div className="bg-[#050409]/90 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.05)] rounded-2xl p-4 flex items-center justify-between font-mono text-xs text-purple-300">
                            <code>npm install @aether/observe</code>
                            <button
                              onClick={() => handleCopy("npm install @aether/observe", "npm-ts")}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95 border border-white/5"
                            >
                              {isCopied === "npm-ts" ? <Check className="w-4 h-4 text-purple-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono font-bold text-white">2. Instrument TypeScript Runtime</h4>
                          <div className="relative rounded-2xl border border-purple-500/20 bg-[#050409]/90 p-4 font-mono text-xs text-white/70 leading-relaxed overflow-x-auto shadow-[0_0_10px_rgba(168,85,247,0.05)]">
                            <div className="absolute right-4 top-4 flex gap-2">
                              <button
                                onClick={() => handleCopy(`import { AetherTracer } from "@aether/observe";\n\nconst tracer = new AetherTracer({ agentName: "checkout-agent" });\ntracer.thought("Evaluating secure cache runtime");\ntracer.tool("CircuitBreaker", { threshold: 0.85 });`, "code-ts")}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95 border border-white/5"
                              >
                                {isCopied === "code-ts" ? <Check className="w-4 h-4 text-purple-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            
                            <div className="text-[10px] text-white/30 border-b border-white/5 pb-2 mb-2">typescript · agent.ts</div>
                            
                            <div><span className="text-purple-400 font-bold">import</span> &#123; AetherTracer &#125; <span className="text-purple-400 font-bold">from</span> <span className="text-emerald-400">"@aether/observe"</span>;</div>
                            <div className="text-white/45 mt-1">// Create high-performance TS trace client</div>
                            <div><span className="text-purple-400 font-bold">const</span> tracer = <span className="text-purple-400 font-bold">new</span> AetherTracer(&#123; agentName: <span className="text-emerald-400">"checkout-agent"</span> &#125;);</div>
                            
                            <div className="text-white/45 mt-3">// Log sequential thought matrices</div>
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
                          <div className="bg-[#050409]/90 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.05)] rounded-2xl p-4 flex items-center justify-between font-mono text-xs text-purple-300">
                            <code>curl -fsSL https://aether.sh/install | sh</code>
                            <button
                              onClick={() => handleCopy("curl -fsSL https://aether.sh/install | sh", "curl-cli")}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95 border border-white/5"
                            >
                              {isCopied === "curl-cli" ? <Check className="w-4 h-4 text-purple-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <h4 className="text-xs font-mono font-bold text-white">2. Debugger CLI commands</h4>
                          <ul className="space-y-2.5">
                            {[
                              { cmd: "aether init", desc: "Creates regional offline repository parameters." },
                              { cmd: "aether replay", desc: "Serves fully responsive web observer socket on local traces." },
                              { cmd: "aether doctor", desc: "Validates local JSON traces, environment, and permissions." },
                            ].map((command, cIdx) => (
                              <li key={cIdx} className="p-3 rounded-xl border border-white/5 bg-[#050409]/60 flex items-center justify-between">
                                <div className="font-mono text-xs text-white">
                                  <code className="text-purple-400 font-bold">$</code> {command.cmd}
                                  <div className="text-[10px] text-white/40 mt-1">{command.desc}</div>
                                </div>
                                <button
                                  onClick={() => handleCopy(command.cmd, `c-${cIdx}`)}
                                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95 border border-white/5"
                                >
                                  {isCopied === `c-${cIdx}` ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
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
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      Aether runs completely local-first inside your workspace shell environment. Secure, private, and lightning fast.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-mono font-bold text-white">Local-First Sandbox Integration</h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Telemetry data remains strictly isolated. The Aether SDK generates offline-ready trace structures inside the folder `.aether/traces/session_*.json` located in the root of your local project environment.
                    </p>
                    <div className="bg-[#050409]/90 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.05)] rounded-2xl p-4 flex flex-col gap-2 font-mono text-xs text-purple-300">
                      <div>.project_root/</div>
                      <div className="pl-4">├── .aether/</div>
                      <div className="pl-8 text-cyan-400">├── traces/   # Local-first JSON telemetry logs</div>
                      <div className="pl-8">└── cache/</div>
                      <div className="pl-4 text-emerald-400">└── main.py    # Your AI Agent logic runs here</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  4. CORE API REFERENCE SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "tracer" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                      <Code className="text-purple-400" /> AetherTracer Core API
                    </h2>
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      Control thread executions, evaluate logic patterns, and declare custom programmatic reasoning checkpoints.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        name: "@tracer.breakpoint(when='tool_call', condition=lambda ctx: ...)",
                        type: "PROGRAMMATIC HOOK",
                        desc: "Register a highly customized, thread-level breakpoint hook. If the condition lambda evaluates to true, the thread freezes instantly and dispatches a review request to the visual visualizer.",
                        args: "when: string event target ('tool_call' or 'thought'). condition: lambda expression evaluating the active BreakpointContext variables."
                      },
                      {
                        name: "with tracer.guardrails():",
                        type: "CONTEXT MANAGER",
                        desc: "Shorthand parameterless method to programmatically shield the inner scope of an agent execution block. Actively audits reasoning commands and catches unsafe system invocations.",
                        args: "Parameterless. Can be applied cleanly across OpenAI completion hooks or CrewAI execution layers."
                      }
                    ].map((api, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-purple-500/20 bg-[#090710]/90 space-y-2.5 shadow-[0_0_15px_rgba(168,85,247,0.02)]">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <code className="text-xs font-mono text-purple-300 font-bold">{api.name}</code>
                          <span className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/5 text-[9px] font-mono font-bold text-purple-400">
                            {api.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/60 pl-1.5 leading-relaxed">{api.desc}</p>
                        <div className="text-[10px] font-mono text-white/40 pl-1.5 leading-normal">
                          <strong className="text-white/60">Arguments:</strong> {api.args}
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
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                      <Cpu className="text-purple-400 animate-pulse" /> Thought Tracking & Hooking
                    </h2>
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      Surgically intercept the reasoning process before downstream tool commands are committed to your server infrastructure.
                    </p>
                  </div>

                  <div className="relative rounded-2xl border border-purple-500/20 bg-[#050409]/90 p-4 font-mono text-xs text-white/70 leading-relaxed overflow-x-auto shadow-[0_0_10px_rgba(168,85,247,0.05)]">
                    <div className="absolute right-4 top-4 flex gap-2">
                      <button
                        onClick={() => handleCopy(`@tracer.breakpoint(\n    when="tool_call",\n    condition=lambda ctx: ctx.args.get("cmd") == "danger"\n)\ndef approve_tool(ctx):\n    # Block execution if local variable risk is too high!\n    return ctx.args.get("confirmation") is True`, "thought-py")}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95 border border-white/5"
                      >
                        {isCopied === "thought-py" ? <Check className="w-4 h-4 text-purple-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="text-[10px] text-white/30 border-b border-white/5 pb-2 mb-2">python · custom_hooks.py</div>
                    
                    <div><span className="text-purple-400 font-bold">@tracer.breakpoint</span>(</div>
                    <div className="pl-4">when=<span className="text-emerald-400">"tool_call"</span>,</div>
                    <div className="pl-4">condition=<span className="text-purple-400">lambda</span> ctx: ctx.args.get(<span className="text-emerald-400">"cmd"</span>) == <span className="text-emerald-400">"danger"</span></div>
                    <div>)</div>
                    <div><span className="text-purple-400 font-bold">def</span> <span className="text-cyan-400">approve_tool</span>(ctx):</div>
                    <div className="pl-4 text-white/45"># The halted BreakpointContext lets you inspect active tool arguments</div>
                    <div className="pl-4"><span className="text-purple-400 font-bold">return</span> ctx.args.get(<span className="text-emerald-400">"confirmation"</span>) <span className="text-purple-400 font-bold">is</span> <span className="text-purple-400 font-bold">True</span></div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  6. TOOL LOGGING SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "tools" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                      <Settings className="text-purple-400" /> Tool Logging & Interception
                    </h2>
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      Surgically mutate tool parameters during active breakpoints, redirecting trajectories live inside the execution block.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#090710]/85 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.03)] space-y-3">
                    <h4 className="text-xs font-mono font-bold text-white uppercase">Live Argument Mutation</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      Because the Aether Python SDK clears and updates the local session `args` object with `event["metadata"]["args"]` returned from `_handle_breakpoint`, editing the tool arguments inside the local console or Pdb debugger shell directly mutates the actual live running Python variables of the developer's agent.
                    </p>
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
                      <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                      Visual Breakpoints & Forensics
                    </h2>
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      Observe how Aether Guardrails intercept high-risk, unstructured deletion requests before they compromise execution.
                    </p>
                  </div>

                  <div className="bg-[#0b0c16]/80 border border-purple-500/30 rounded-2xl p-5 flex items-start gap-4 shadow-[0_0_20px_rgba(168,85,247,0.05)]">
                    <ShieldAlert className="w-6 h-6 text-purple-400 shrink-0 mt-0.5 animate-bounce" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Aether Interception Paradigms</h4>
                      <p className="text-[11px] text-white/50 leading-normal">
                        When the python tracer registers `warn_hallucination` or logs an aggressive command payload (e.g. `rm -rf *`), Aether Guardrails immediately decelerate execution. Playback freezes instantly, the ReactFlow canvas dims with a crimson glowing border, and a Left-Side Forensics panel pops up detailing explicit indicator metrics:
                      </p>
                      <div className="pt-2 pl-4 flex flex-col gap-1.5 text-[10px] text-white/40 font-mono">
                        <div>• <strong className="text-rose-400">Wildcard Scope:</strong> Root directory or massive wildcard file deletion detected.</div>
                        <div>• <strong className="text-rose-400">Unsafe Mutation:</strong> Execution bypasses system boundaries.</div>
                        <div>• <strong className="text-rose-400">Confirmation Deficit:</strong> Zero verification steps provided.</div>
                      </div>
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
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                      <Layers className="text-purple-400" /> Trajectory Forking & Patching
                    </h2>
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      Surgically slice and patch the agent's thought context to redirect its downstream trajectory away from the failure vector.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#090710]/85 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.03)] space-y-3">
                    <h4 className="text-xs font-mono font-bold text-white uppercase">Visual Splicing & Sibling Nodes</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      Upon clicking "Fork Trajectory" in the debugger bottom actions toolbar, the visualizer surgically splices the events tree. The dangerous hallucination branch is dynamically hidden, and three new emerald-green correction nodes {"(Thought -> Tool -> Result)"} are generated curving staggered off the parent thought card, showing a visually distinct corrected cognition branch.
                    </p>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────
                  9. LOCAL-FIRST ARCHITECTURE SECTION
                  ────────────────────────────────────────────────── */}
              {activeSection === "local-first" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                      <Database className="text-purple-400" /> Glowing Memory Inspector
                    </h2>
                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      Evaluate active sliding token windows, analyze semantic similarities, and prevent vector context leaks.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-purple-500/20 bg-[#090710]/50 text-xs text-white/55 leading-relaxed flex gap-3 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                    <Database className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <strong className="text-white">Active Dual-Pane Sidebar:</strong> Click "Memory Inspector" inside the debugger toolbar to trigger a glowing secondary sidebar. Audit semantic similarity scores for retrieved vector store chunks, check Cosine Similarity ratings, detect blocked prompt injections, and track FIFO context window token limits.
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
