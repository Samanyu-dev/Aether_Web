"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAetherStore } from "@/lib/store/useAetherStore"
import { DashboardReplay } from "@/components/dashboard-replay"
import Link from "next/link"
import {
  Terminal,
  LogOut,
  Folder,
  FolderOpen,
  FileJson,
  Upload,
  AlertCircle,
  FileCode,
  Copy,
  Check,
  Share2,
  Play,
  Trash2,
  Sparkles,
  Layers,
  Database,
  CloudLightning,
  ExternalLink,
  ChevronRight,
  KeyRound,
  Settings,
  User,
  ShieldCheck,
  ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// Simulated local directories structure
interface LocalFile {
  name: string
  size: string
  type: string
  content: string
}

interface LocalDir {
  name: string
  files: LocalFile[]
}

const LOCAL_SYSTEM_DIRS: Record<string, LocalDir> = {
  "traces/": {
    name: "traces/",
    files: [
      { name: "benchmarks_gpu.json", size: "12 KB", type: "JSON Trace", content: '{\n  "title": "GPU Benchmarks Analysis",\n  "version": "1.0.0",\n  "nodes_count": 5,\n  "duration_ms": 1840,\n  "status": "COMPLETED"\n}' },
      { name: "rag_medical.json", size: "18 KB", type: "JSON Trace", content: '{\n  "title": "Medical Diagnosis RAG",\n  "version": "1.0.0",\n  "nodes_count": 5,\n  "duration_ms": 2450,\n  "hallucination_detected": true\n}' }
    ]
  },
  "sessions/": {
    name: "sessions/",
    files: [
      { name: "live_ipc_8000.sock", size: "0 B", type: "Active Socket", content: "[Aether Unix Socket] Listening on port 8000...\nStream: 60fps Realtime\nStatus: ACTIVE" },
      { name: "session_cache.db", size: "2.4 MB", type: "SQLite DB", content: "SQLite Format 3\n[Table: runs] - 14 entries\n[Table: thoughts] - 78 entries\n[Table: tools] - 22 entries" }
    ]
  },
  "cache/": {
    name: "cache/",
    files: [
      { name: "gpt4_embeddings.idx", size: "4.8 MB", type: "Binary Index", content: "[Vector Cache Index]\nDimensions: 1536\nVectors: 1,420\nLast modified: Just now" },
      { name: "llm_responses.bin", size: "850 KB", type: "Checkpoint", content: "[LLM Checkpoints Bin]\nSaved requests: 312\nHit rate: 84.6%\nProvider: local-first" }
    ]
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const {
    session,
    user,
    isLoading,
    traces,
    activeReplayTrace,
    isSyncing,
    error,
    signOut,
    checkSession,
    uploadTrace,
    deleteTrace,
    setActiveReplayTrace
  } = useAetherStore()

  // State Management
  const [activeTab, setActiveTab] = useState("overview")
  const [activeDir, setActiveDir] = useState<string | null>("traces/")
  const [selectedLocalFile, setSelectedLocalFile] = useState<LocalFile | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isCopiedSDK, setIsCopiedSDK] = useState(false)
  const [shareToast, setShareToast] = useState<string | null>(null)
  const [inviteCode, setInviteCode] = useState("")
  const [inviteResult, setInviteResult] = useState<string | null>(null)
  const [waitlistEmail, setWaitlistEmail] = useState("")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [syncToken, setSyncToken] = useState<string | null>(null)
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; created: string }[]>([
    { id: "1", name: "Production Gateway Ingest Key", key: "aether_sk_live_28ad3ef90812b", created: "2026-05-18" }
  ])
  const [newKeyName, setNewKeyName] = useState("")

  const [onboardingChecklist, setOnboardingChecklist] = useState({
    sdkInstalled: false,
    extensionInstalled: false,
    firstTraceUploaded: false,
    replayShared: false,
  })
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "INITIALIZING LOCAL Observatorio GRAPH ENGINE...",
    "CONNECTED local socket at .aether/sessions/live_ipc_8000.sock",
    "WATCHING .aether/traces/ for new telemetry data..."
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkSession().then(() => {
      const currentSession = useAetherStore.getState().session
      if (!useAetherStore.getState().isLoading && !currentSession) {
        router.push("/login?redirect=/dashboard")
      }
    })
  }, [checkSession, router])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      const tabParam = searchParams.get("tab")
      if (tabParam && ["overview", "workspace", "billing", "api-keys", "settings"].includes(tabParam)) {
        setActiveTab(tabParam)
      }
    }
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("tab", tab)
      window.history.pushState(null, "", url.toString())
    }
  }

  // Automatically select first trace if available
  useEffect(() => {
    if (traces.length > 0 && !activeReplayTrace) {
      setActiveReplayTrace(traces[0])
    }
  }, [traces, activeReplayTrace, setActiveReplayTrace])

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem("aether_onboarding_checklist")
    if (saved) {
      try {
        setOnboardingChecklist(JSON.parse(saved))
      } catch {
        // ignore invalid local data
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("aether_onboarding_checklist", JSON.stringify(onboardingChecklist))
  }, [onboardingChecklist])

  // Handlers
  const handleGenerateApiKey = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) return
    const randomHex = Math.random().toString(16).substring(2, 16)
    const newKey = {
      id: String(apiKeys.length + 1),
      name: newKeyName.trim(),
      key: `aether_sk_live_${randomHex}`,
      created: new Date().toISOString().split("T")[0]
    }
    setApiKeys([...apiKeys, newKey])
    setNewKeyName("")
    setSystemLogs(prev => [`Generated new API Ingest Key: "${newKey.name}"`, ...prev])
  }

  const handleDeleteApiKey = (id: string) => {
    const deletedKey = apiKeys.find(k => k.id === id)
    setApiKeys(apiKeys.filter(k => k.id !== id))
    if (deletedKey) {
      setSystemLogs(prev => [`Revoked API Key: "${deletedKey.name}"`, ...prev])
    }
  }

  const handleGenerateSyncToken = () => {
    const randomHex = Math.random().toString(16).substring(2, 18)
    const tok = `aether_sync_tok_${randomHex}`
    setSyncToken(tok)
    setOnboardingChecklist(prev => ({ ...prev, extensionInstalled: true }))
    setSystemLogs(prev => ["Generated temporary VS Code extension pairing token", ...prev])
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(id)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const handleShare = (traceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/share/${traceId}`
    navigator.clipboard.writeText(shareUrl)
    setOnboardingChecklist((prev) => ({ ...prev, replayShared: true }))
    setShareToast(traceId)
    setTimeout(() => setShareToast(null), 3000)
  }

  // Drag and Drop validation
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const processFile = (file: File) => {
    setUploadError(null)

    // 1. Max Size Validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("COMPILER LIMIT EXCEEDED: File size exceeds 5MB beta threshold.")
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        let nodes: any[] = []
        let edges: any[] = []
        let title = file.name.replace(".json", "")

        // Support both linear array and ReactFlow structures
        if (Array.isArray(parsed)) {
          nodes = parsed.map((item, idx) => ({
            id: String(idx + 1),
            type: item.type || "thought",
            data: {
              label: item.label || item.title || `Step ${idx + 1}`,
              description: item.description || item.subtext || "Custom local trace node",
              confidence: typeof item.confidence === "number" ? item.confidence : 1.0
            }
          }))
        } else if (parsed.nodes && Array.isArray(parsed.nodes)) {
          nodes = parsed.nodes
          edges = parsed.edges || []
          if (parsed.title) title = parsed.title
        } else {
          setUploadError("PARSING ERROR: JSON does not conform to Aether Trace standard (requires steps array or nodes/edges map).")
          return
        }

        // 2. Max Nodes Validation (50 nodes limit for Beta Tier)
        if (nodes.length > 50) {
          setUploadError(`BETA COMPILER LIMIT: Trace contains ${nodes.length} nodes (maximum 50 permitted on Free Developer license).`)
          return
        }

        // Ingest
        const newTrace = await uploadTrace(title, `Uploaded via sandbox client - ${file.name}`, nodes, edges, parsed.duration_ms || 1200)
        if (newTrace) {
          setActiveReplayTrace(newTrace)
          setOnboardingChecklist((prev) => ({ ...prev, firstTraceUploaded: true }))
          setSystemLogs(prev => [`Telemetry ingested: ${title} (${nodes.length} nodes)`, ...prev])
        }
      } catch (err) {
        setUploadError("MALFORMED TELEMETRY: Invalid JSON syntax. Check bracket structures.")
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleCopySDK = () => {
    navigator.clipboard.writeText("pip install aether-observe")
    setIsCopiedSDK(true)
    setOnboardingChecklist((prev) => ({ ...prev, sdkInstalled: true }))
    setTimeout(() => setIsCopiedSDK(false), 2000)
  }

  const handleInviteCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteCode.trim()) {
      setInviteResult("Enter your invite code.")
      return
    }

    const normalized = inviteCode.trim().toUpperCase()
    if (normalized.startsWith("AETHER-")) {
      setInviteResult("Invite accepted. Beta features unlocked for this workspace.")
      setSystemLogs((prev) => [`Invite code accepted: ${normalized}`, ...prev])
    } else {
      setInviteResult("Invalid invite code format. Expected prefix: AETHER-")
    }
  }

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!waitlistEmail.includes("@")) {
      setInviteResult("Enter a valid waitlist email.")
      return
    }
    setInviteResult(`Waitlist request captured for ${waitlistEmail}.`)
    setSystemLogs((prev) => [`Waitlist signup: ${waitlistEmail}`, ...prev])
    setWaitlistEmail("")
  }

  // Loader state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#06060c] text-foreground flex flex-col items-center justify-center p-8 antialiased">
        <div className="w-full max-w-md bg-black/40 border border-primary/20 rounded-xl p-6 font-mono text-xs backdrop-blur-md glow-cyan-subtle">
          <div className="flex justify-between items-center border-b border-border/40 pb-3 mb-4">
            <span className="text-primary font-bold">AETHER observation DAEMON</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
          <div className="space-y-2 text-muted-foreground">
            <p className="text-primary animate-pulse">CONNECTING PORT 8080...</p>
            <p className="text-white">{'[OK]'} Local IPC client established</p>
            <p className="text-white">{'[OK]'} SQLite telemetry index mapped</p>
            <p className="text-white">{'[OK]'} Querying cloud-sync coordinates...</p>
            <div className="w-full bg-white/5 rounded-full h-1 mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: "100%" }} 
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="bg-primary h-full" 
              />
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-foreground pb-12 antialiased selection:bg-primary/20">
      
      {/* Top Banner Navigation */}
      <nav className="border-b border-border/20 bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <div className="site-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="font-bold text-white tracking-wide text-sm font-mono">Aether.obs</span>
            </Link>
            <div className="h-4 w-[1px] bg-border/40" />
            <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-primary tracking-widest uppercase">
              Beta Access
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right font-mono text-[10px]">
              <span className="text-white font-bold">{user?.email || "Offline Developer"}</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <CloudLightning className="w-3 h-3 text-primary" />
                Cloud sync active
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-destructive/20 hover:border-destructive hover:bg-destructive/10 text-xs font-mono text-destructive-foreground"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Platform Analytics Dashboard Command Center */}
      <div className="site-container mt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-border/10">
          <div>
            <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Observability Command Center
            </h1>
            <p className="text-xs text-muted-foreground mt-1 font-mono">Real-time LLM telemetry streams, trace capacities, and reasoning metrics</p>
          </div>
          
          {/* Tab selectors */}
          <div className="flex flex-wrap items-center gap-1 bg-[#09090f] border border-border/30 rounded-xl p-1 mt-4 md:mt-0 font-mono text-xs">
            {[
              { id: "overview", label: "Overview", icon: Database },
              { id: "workspace", label: "VS Code & SDK", icon: Terminal },
              { id: "api-keys", label: "API Keys", icon: KeyRound },
              { id: "billing", label: "Plans & Quotas", icon: Layers },
              { id: "settings", label: "Preferences", icon: Settings }
            ].map(tab => {
              const TabIcon = tab.icon
              const isTabActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all duration-300 ${
                    isTabActive 
                      ? "bg-primary/10 border border-primary/30 text-primary glow-cyan-subtle" 
                      : "border border-transparent text-muted-foreground hover:text-white"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 1. OVERVIEW TAB SHEET */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* 4-Stat Metric Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Plan */}
              <div className="glass-panel bg-card/10 border border-border/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-primary/45 transition-colors">
                <div className="space-y-1 relative z-10 font-mono">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Current Plan</span>
                  <h3 className="text-base font-bold text-white">Developer Beta</h3>
                  <button onClick={() => handleTabChange("billing")} className="text-[9px] text-primary/80 hover:underline text-left">View limits & tiers →</button>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Local Connection */}
              <div className="glass-panel bg-card/10 border border-border/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-accent/45 transition-colors">
                <div className="space-y-1 relative z-10 font-mono">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Local Agent Connected</span>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    Active 
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[9px] text-accent/80">Unix socket port 8000</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                  <CloudLightning className="w-5 h-5 animate-bounce" />
                </div>
              </div>

              {/* Card 3: Storage */}
              <div className="glass-panel bg-card/10 border border-border/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-primary/45 transition-colors">
                <div className="space-y-1 relative z-10 font-mono">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Sync Storage</span>
                  <h3 className="text-base font-bold text-white">1.4 MB / 5.0 MB</h3>
                  <p className="text-[9px] text-primary/80">7.2 MB local cache offline</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <FolderOpen className="w-5 h-5" />
                </div>
              </div>

              {/* Card 4: Replay Launches */}
              <div className="glass-panel bg-card/10 border border-border/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-accent/45 transition-colors">
                <div className="space-y-1 relative z-10 font-mono">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Replay Launches</span>
                  <h3 className="text-base font-bold text-white">48 Sessions</h3>
                  <p className="text-[9px] text-accent/80">24 active local listeners</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                  <Terminal className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Dynamic Activity bar chart */}
            <div className="glass-panel bg-card/10 border border-border/30 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary animate-pulse" />
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">LLM Reasoning Ingestion Activity</h4>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground">Updates live (60fps)</span>
              </div>

              {/* Styled chart bars representation */}
              <div className="flex items-end justify-between gap-2 h-20 pt-4 px-2 border-b border-border/20">
                {[45, 80, 55, 30, 95, 70, 40, 60, 85, 50, 75, 90, 65, 35, 80, 55].map((val, idx) => (
                  <div key={idx} className="flex-1 group relative flex justify-center">
                    <div 
                      className={`w-full rounded-t transition-all duration-500 hover:scale-x-110 ${
                        val > 75 
                          ? "bg-destructive/60 hover:bg-destructive" 
                          : val > 50 
                          ? "bg-accent/60 hover:bg-accent" 
                          : "bg-primary/60 hover:bg-primary"
                      }`} 
                      style={{ height: `${val}%` }} 
                    />
                    {/* Popover value */}
                    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-[#08080f] border border-border/40 text-[8px] font-mono text-white px-1.5 py-0.5 rounded shadow-xl pointer-events-none">
                      {val}% Confidence
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-2 px-1">
                <span>2 hours ago</span>
                <span>1 hour ago</span>
                <span>Just now</span>
              </div>
            </div>

            {/* Layout split view: local directories vs trace replayer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Local runtime, SDK controls, tiering (4 columns) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Local-first banner */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/20 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-2 translate-x-2 w-12 h-12 rounded-full bg-primary/5 blur-lg" />
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 animate-pulse mt-0.5" />
              <div>
                <h4 className="text-xs font-bold font-mono text-white">Privacy Sealed Local-First</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Aether is independent of cloud services. Traces are stored in your project directory at <code className="text-white font-bold">.aether/</code>. Cloud Sync is optional and end-to-end encrypted.
                </p>
              </div>
            </div>
          </div>

          {/* 1. Local Runtime File Inspector */}
          <div className="bg-card/20 border border-border/30 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/10">
              <Database className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Local Workspace Runtime</h3>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">
              Aether logs runtime telemetry into these folders in your active codebase workspace:
            </p>

            {/* Folder Explorer */}
            <div className="space-y-2">
              {Object.keys(LOCAL_SYSTEM_DIRS).map(dirKey => {
                const folder = LOCAL_SYSTEM_DIRS[dirKey]
                const isSelected = activeDir === dirKey
                return (
                  <div key={dirKey} className="rounded-lg overflow-hidden border border-border/10 bg-black/10">
                    <button
                      onClick={() => {
                        setActiveDir(isSelected ? null : dirKey)
                        setSelectedLocalFile(null)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs font-mono transition-colors ${
                        isSelected ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected ? <FolderOpen className="w-4 h-4 text-primary" /> : <Folder className="w-4 h-4 text-muted-foreground/80" />}
                        <span className="font-semibold">{folder.name}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isSelected ? "rotate-90 text-primary" : "text-muted-foreground/45"}`} />
                    </button>

                    {/* Render Files inside folder if expanded */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-2 pt-1 border-t border-border/5 space-y-1">
                            {folder.files.map(file => {
                              const isFileSelected = selectedLocalFile?.name === file.name
                              return (
                                <button
                                  key={file.name}
                                  onClick={() => setSelectedLocalFile(file)}
                                  className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded text-[11px] font-mono text-left transition-colors ${
                                    isFileSelected ? "text-white bg-white/5 border border-primary/20" : "text-muted-foreground hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <FileJson className="w-3.5 h-3.5 shrink-0 text-muted-foreground/75" />
                                    <span className="truncate">{file.name}</span>
                                  </div>
                                  <span className="text-[9px] text-muted-foreground/40 shrink-0 font-mono">{file.size}</span>
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Simulated file display code console */}
            <AnimatePresence>
              {selectedLocalFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 border border-border/30 rounded-lg overflow-hidden bg-black/50"
                >
                  <div className="bg-white/5 border-b border-border/20 px-3 py-1.5 flex items-center justify-between text-[9px] font-mono">
                    <span className="text-white font-bold">{selectedLocalFile.name} ({selectedLocalFile.type})</span>
                    <button
                      onClick={() => setSelectedLocalFile(null)}
                      className="text-muted-foreground hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                  <pre className="p-3 text-[10px] font-mono text-primary leading-normal overflow-x-auto whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {selectedLocalFile.content}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. SDK Quickstart copyable widget */}
          <div className="bg-card/20 border border-border/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/10">
              <FileCode className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">SDK Integration</h3>
            </div>
            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
              Inject telemetry directly into Aether's 60fps viewer inside your Python agents:
            </p>

            <div className="bg-black/50 border border-border/20 rounded-lg p-2.5 flex items-center justify-between mb-4">
              <code className="text-[10px] font-mono text-emerald-400">pip install aether-observe</code>
              <button
                onClick={handleCopySDK}
                className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                title="Copy install command"
              >
                {isCopiedSDK ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <pre className="p-3 bg-black/40 border border-border/10 rounded-lg text-[10px] font-mono text-muted-foreground overflow-x-auto leading-normal">
              <div><span className="text-primary">from</span> aether <span className="text-primary">import</span> AetherTracer</div>
              <div className="text-muted-foreground mt-1"># Setup minimal logger</div>
              <div>tracer = AetherTracer(agent_name=<span className="text-emerald-400">"research-agent"</span>)</div>
              <div className="text-muted-foreground mt-1.5"># Log thoughts, tools, and results</div>
              <div>tracer.thought(<span className="text-emerald-400">"Planning approach"</span>)</div>
              <div>tracer.tool(<span className="text-emerald-400">"web_search"</span>, query=<span className="text-emerald-400">"best fine tuning methods"</span>)</div>
              <div>tracer.result(<span className="text-emerald-400">"Retrieved 5 papers"</span>)</div>
            </pre>
          </div>

          {/* 3. Future Support Tier Limits Widget */}
          <div className="bg-card/20 border border-border/30 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider font-mono">Dev Tier Architecture</h3>
              </div>
              <span className="text-[9px] font-mono border border-primary/20 text-primary px-1.5 py-0.5 rounded font-bold uppercase">FREE</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
                  <span>Cloud Trace Synchronization</span>
                  <span className="text-white font-bold">{traces.length} / 10 traces</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((traces.length / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
                  <span>Maximum Graph Size</span>
                  <span className="text-white font-bold">50 nodes limit</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div className="bg-primary h-full rounded-full w-full" />
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground leading-relaxed pt-2 border-t border-border/10">
                <span className="text-white font-semibold">Offline Limits: </span>
                Local traces cache has <span className="text-emerald-400 font-bold">unlimited storage</span> and supports full 60fps replays. Cloud limit applies to synced profiles only.
              </div>
              
              <div className="pt-2">
                <Button 
                  disabled 
                  variant="outline" 
                  className="w-full border-primary/10 hover:border-primary/20 text-muted-foreground text-[10px] font-mono h-8 cursor-not-allowed opacity-50"
                >
                  Pro & Enterprise Upgrade Coming Soon
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Replayer Widget + Trace uploads + trace histories (8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Share/Sync Toast Alerts */}
          <AnimatePresence>
            {shareToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-primary/20 border border-primary text-primary-foreground font-mono text-xs px-4 py-3 rounded-lg flex items-center justify-between shadow-lg"
              >
                <span>LINK COPIED: Public share link copied to clipboard successfully! (/share/{shareToast})</span>
                <span className="text-[9px] bg-primary/20 border border-primary px-1.5 py-0.5 rounded font-bold">PUBLIC</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. Active Observatory - Main Replay library viewport */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Active Observatory Canvas
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              {activeReplayTrace && (
                <button
                  onClick={() => handleShare(activeReplayTrace.id, {} as any)}
                  className="text-xs text-primary font-mono hover:underline flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Public Share Link
                </button>
              )}
            </div>

            {activeReplayTrace ? (
              <DashboardReplay trace={activeReplayTrace} />
            ) : (
              <div className="h-[400px] border border-dashed border-border/40 bg-black/20 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <Terminal className="w-12 h-12 text-muted-foreground/35 animate-pulse mb-3" />
                <h4 className="text-sm font-bold text-white font-mono">No Trace Selected for Observation</h4>
                <p className="text-xs text-muted-foreground mt-2 max-w-sm">
                  Select a trace from the Replay Library below or drag and drop a telemetry JSON into the sandbox to instantiate playback.
                </p>
              </div>
            )}
          </div>

          {/* 5. Upload Telemetry Sandbox Drop Area */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden bg-black/10 ${
              dragActive 
                ? "border-primary bg-primary/5 glow-cyan-subtle" 
                : "border-border/30 hover:border-border/60 hover:bg-white/5"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-border/30 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-mono">
                  Drag & Drop Telemetry Trace JSON
                </h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Compatible with standard <code className="text-white font-bold">.json</code> logs containing agent node execution sequences. Max file size: 5MB.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={triggerFileInput}
                className="mt-2 border-border/40 hover:border-primary/50 text-xs font-mono h-8 px-4"
              >
                Browse File System
              </Button>
            </div>

            {/* compiler debug errors */}
            <AnimatePresence>
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 border border-destructive/20 bg-destructive/10 rounded-lg p-3 flex gap-3 text-left"
                >
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-destructive uppercase font-mono">Compiler Alert</h5>
                    <p className="text-[10px] text-destructive-foreground mt-0.5 font-mono">{uploadError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 6. Recent Traces & Replay Library */}
          <div className="bg-card/10 border border-border/30 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="bg-white/5 border-b border-border/20 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-white font-mono">Telemetry Replay Library</h3>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                Total Traces: {traces.length}
              </span>
            </div>

            {traces.length > 0 ? (
              <div className="divide-y divide-border/10">
                {traces.map((trace) => {
                  const isActive = activeReplayTrace?.id === trace.id
                  const isLowConfidence = typeof trace.max_confidence === "number" && trace.max_confidence < 0.5
                  
                  return (
                    <div 
                      key={trace.id}
                      onClick={() => setActiveReplayTrace(trace)}
                      className={`px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors ${
                        isActive ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-white/5"
                      }`}
                    >
                      {/* Left: Info */}
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-white font-mono truncate max-w-[280px]">
                            {trace.title}
                          </h4>
                          {isLowConfidence && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-mono border border-destructive/30 text-destructive bg-destructive/5 uppercase font-bold tracking-widest shrink-0">
                              Hallucination Detected
                            </span>
                          )}
                          {trace.is_public && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-mono border border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest shrink-0">
                              Public
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {trace.description || "No description provided."}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/60 flex-wrap">
                          <span>{new Date(trace.created_at).toLocaleDateString()} at {new Date(trace.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span>•</span>
                          <span>{trace.event_count || trace.nodes?.length || 0} nodes</span>
                          <span>•</span>
                          <span>{trace.duration_ms ? `${(trace.duration_ms / 1000).toFixed(2)}s` : "0.00s"}</span>
                          {trace.max_confidence !== undefined && trace.max_confidence !== null && (
                            <>
                              <span>•</span>
                              <span className={isLowConfidence ? "text-destructive" : "text-emerald-400"}>
                                Bottleneck: {((trace.max_confidence ?? 0) * 100).toFixed(0)}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 md:justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveReplayTrace(trace)
                          }}
                          className={`text-xs font-mono h-8 px-3 ${
                            isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-white"
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 mr-1.5" />
                          Load
                        </Button>

                        <button
                          onClick={(e) => handleShare(trace.id, e)}
                          className="p-2 rounded hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors"
                          title="Generate public share link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTrace(trace.id)
                          }}
                          className="p-2 rounded hover:bg-white/5 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete trace"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground font-mono">
                No traces available inside telemetry library. Sync traces locally or upload JSON logs.
              </div>
            )}
          </div>

          {/* 7. Live Terminal Logger output */}
          <div className="bg-black/80 border border-border/30 rounded-2xl overflow-hidden p-6 font-mono text-[10px] text-muted-foreground">
            <div className="flex justify-between items-center border-b border-border/10 pb-3 mb-3">
              <span className="text-white font-bold flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                AETHER OBSERVER DAEMON TELEMETRY CONSOLE
              </span>
              <span className="text-primary font-bold font-mono">PORT 8000</span>
            </div>
            <div className="space-y-1 leading-relaxed">
              {systemLogs.map((log, i) => (
                <div key={i} className="flex gap-2 font-mono">
                  <span className="text-primary shrink-0">{'>>>'}</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )}

  {/* 2. VS CODE & SDK TAB SHEET */}
  {activeTab === "workspace" && (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono">
      {/* Left Column: VS Code Auth Connection */}
      <div className="glass-panel bg-card/10 border border-border/30 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/10">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-white">VS Code Extension Auth Linker</h3>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
            session ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 animate-pulse" : "bg-primary/10 border border-primary/20 text-primary animate-pulse"
          }`}>
            {session ? "SECURE SaaS ACTIVE" : "UNAUTHENTICATED"}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground leading-relaxed">
          Connect your local VS Code extension to stream logic loops, neural pathways, and live observations into your premium SaaS cloud workspace.
        </p>

        <div className="space-y-4">
          <Button 
            onClick={() => {
              if (!session) {
                setSystemLogs(prev => ["Cannot sync session: Please log in to your Aether Cloud account first", ...prev])
                return
              }
              const url = `vscode://aether.aether-vscode/auth-callback?accessToken=${session.access_token}&refreshToken=${session.refresh_token || ''}&email=${user?.email || ''}&userId=${user?.id || ''}`;
              window.open(url, "_self");
              setSystemLogs(prev => ["Triggered automatic deep link session synchronizer to VS Code...", ...prev]);
            }}
            disabled={!session}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:opacity-90 shadow-md flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Sync Session with VS Code
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              if (!session) return
              const url = `vscode://aether.aether-vscode/auth-callback?accessToken=${session.access_token}&refreshToken=${session.refresh_token || ''}&email=${user?.email || ''}&userId=${user?.id || ''}`;
              copyToClipboard(url, "sync_link");
              setSystemLogs(prev => ["Copied full auth deep link to clipboard.", ...prev]);
            }}
            disabled={!session}
            className="w-full border-border/30 hover:bg-white/5 text-muted-foreground hover:text-white font-semibold text-xs py-2"
          >
            {copiedText === "sync_link" ? "Copied Deep Link!" : "Copy Auth Deep Link (Manual)"}
          </Button>
        </div>

        <div className="border-t border-border/20 pt-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase">One-Click Pairing:</h4>
          <ol className="list-decimal list-inside text-[11px] text-muted-foreground space-y-2 leading-relaxed">
            <li>Install <strong className="text-white">Aether Observability Platform</strong> in VS Code.</li>
            <li>Click the <strong className="text-emerald-400">"Sync Session with VS Code"</strong> button above.</li>
            <li>Approve the VS Code prompt to open the custom URI callback.</li>
            <li>The extension will securely persist tokens in OS <strong className="text-white">SecretStorage</strong> and unlock Premium cloud sync!</li>
          </ol>
        </div>
      </div>

      {/* Right Column: SDK Quickstart & Onboarding Checklist */}
      <div className="space-y-8">
        {/* Python SDK quickstart */}
        <div className="bg-[#09090f]/60 border border-border/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/10">
            <FileCode className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">SDK Integration</h3>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
            Inject telemetry directly into Aether's 60fps viewer inside your Python agents:
          </p>

          <div className="bg-black/50 border border-border/20 rounded-lg p-2.5 flex items-center justify-between mb-4">
            <code className="text-[10px] text-emerald-400">pip install aether-observe</code>
            <button
              onClick={handleCopySDK}
              className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
              title="Copy install command"
            >
              {isCopiedSDK ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <pre className="p-3 bg-black/40 border border-border/10 rounded-lg text-[10px] text-muted-foreground overflow-x-auto leading-normal">
            <div><span className="text-primary">from</span> aether <span className="text-primary">import</span> AetherTracer</div>
            <div className="text-muted-foreground mt-1"># Setup minimal logger</div>
            <div>tracer = AetherTracer(agent_name=<span className="text-emerald-400">"research-agent"</span>)</div>
            <div className="text-muted-foreground mt-1.5"># Log thoughts, tools, and results</div>
            <div>tracer.thought(<span className="text-emerald-400">"Planning approach"</span>)</div>
            <div>tracer.tool(<span className="text-emerald-400">"web_search"</span>, query=<span className="text-emerald-400">"best fine tuning methods"</span>)</div>
            <div>tracer.result(<span className="text-emerald-400">"Retrieved 5 papers"</span>)</div>
          </pre>
        </div>

        {/* Interactive Onboarding Checklist */}
        <div className="bg-[#09090f]/60 border border-border/30 rounded-xl p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Onboarding Checklist</h4>
          <div className="space-y-3">
            {[
              { key: "sdkInstalled", label: "Install SDK package" },
              { key: "extensionInstalled", label: "Install VS Code extension" },
              { key: "firstTraceUploaded", label: "Upload first trace JSON" },
              { key: "replayShared", label: "Share replay link" },
            ].map((item) => {
              const checked = onboardingChecklist[item.key as keyof typeof onboardingChecklist]
              return (
                <button
                  key={item.key}
                  onClick={() =>
                    setOnboardingChecklist((prev) => ({ ...prev, [item.key]: !checked }))
                  }
                  className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition-colors flex items-center justify-between ${
                    checked
                      ? "border-primary/40 bg-primary/10 text-primary animate-pulse"
                      : "border-border/40 bg-background/40 text-muted-foreground hover:border-border/70"
                  }`}
                >
                  <span>{item.label}</span>
                  <span>{checked ? "✓ Complete" : "○ Pending"}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )}

  {/* 3. API KEYS TAB SHEET */}
  {activeTab === "api-keys" && (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono">
      {/* Left: Key Generator form */}
      <div className="lg:col-span-1 glass-panel bg-card/10 border border-border/30 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-border/10">
          <KeyRound className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-white">Create Secret API Key</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Secret keys permit your backend servers, docker orchestrators, and AI agents to sync telemetry directly into Aether's observability databases.
        </p>
        
        <form onSubmit={handleGenerateApiKey} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">API Key Name</label>
            <input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Production Agent Server"
              className="h-9 w-full rounded-md border border-border/40 bg-background/40 px-3 text-xs text-foreground outline-none focus:border-primary/50"
              required
            />
          </div>
          <Button type="submit" className="w-full text-xs bg-primary text-primary-foreground font-semibold hover:opacity-90">
            Generate Ingest API Key
          </Button>
        </form>

        <div className="border-t border-border/20 pt-4">
          <h4 className="text-[10px] font-bold text-white uppercase mb-2">Scope Permissions:</h4>
          <ul className="text-[10px] text-muted-foreground space-y-1 list-disc list-inside">
            <li><code className="text-white font-bold">trace:write</code> (Ingest nodes & loops)</li>
            <li><code className="text-white font-bold">trace:read</code> (Query history timeline)</li>
          </ul>
        </div>
      </div>

      {/* Right: Key Listings & Instructions */}
      <div className="lg:col-span-2 space-y-8">
        {/* Active API keys List */}
        <div className="bg-card/10 border border-border/30 rounded-2xl overflow-hidden">
          <div className="bg-white/5 border-b border-border/20 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-white">Active Secret Keys</h3>
            </div>
            <span className="text-[10px] text-muted-foreground">Keys: {apiKeys.length}</span>
          </div>

          <div className="divide-y divide-border/10">
            {apiKeys.map(keyObj => (
              <div key={keyObj.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{keyObj.name}</h4>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] text-emerald-400 select-all font-semibold">{keyObj.key}</code>
                    <button
                      onClick={() => copyToClipboard(keyObj.key, `apikey_${keyObj.id}`)}
                      className="p-1 text-muted-foreground hover:text-white transition-colors"
                    >
                      {copiedText === `apikey_${keyObj.id}` ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[9px] text-muted-foreground/60">Generated: {keyObj.created} • Scope: trace:write</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteApiKey(keyObj.id)}
                  className="text-xs text-destructive hover:bg-destructive/10 h-8 font-semibold"
                >
                  Revoke Key
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Developer integration tutorial */}
        <div className="bg-[#09090f]/60 border border-border/30 rounded-xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase">Backend Shell Authentication</h4>
          <p className="text-xs text-muted-foreground font-mono">
            Authenticate your server logs using simple JSON headers inside custom Python/JS parsers:
          </p>
          <pre className="p-3 bg-black/40 border border-border/15 rounded-lg text-[10px] text-muted-foreground overflow-x-auto leading-normal">
            <div>curl -X POST https://api.aether.obs/v1/traces \</div>
            <div>  -H <span className="text-emerald-400">"Authorization: Bearer aether_sk_live_28ad3ef90812b"</span> \</div>
            <div>  -H <span className="text-emerald-400">"Content-Type: application/json"</span> \</div>
            <div>  -d <span className="text-primary">'{"{ title: \"Server Task Execution\", nodes: [...] }"}'</span></div>
          </pre>
        </div>
      </div>
    </div>
  )}

  {/* 4. PLANS & BILLING TAB SHEET */}
  {activeTab === "billing" && (
    <div className="space-y-8 font-mono">
      {/* Active Quota Usage meters */}
      <div className="glass-panel bg-card/10 border border-border/30 rounded-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/10 mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-white">Active Plan Limits & Telemetry Consumption</h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary font-bold uppercase rounded">
            Free Developer License
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5 font-mono">
              <span>Traces Cloud Sync Capacity</span>
              <span className="text-white font-bold">{traces.length} / 25 monthly</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${Math.min((traces.length / 25) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground/60 mt-1 block font-mono">Resets on {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}</span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5 font-mono">
              <span>Node Count per Graph</span>
              <span className="text-white font-bold">50 nodes maximum</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden font-mono">
              <div className="bg-primary h-full w-full" />
            </div>
            <span className="text-[9px] text-muted-foreground/60 mt-1 block font-mono">Free local visualizer handles unlimited nodes offline</span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5 font-mono">
              <span>Encrypted Cloud Storage</span>
              <span className="text-white font-bold font-mono">1.4 MB / 5.0 MB</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-primary h-full animate-pulse" 
                style={{ width: "28%" }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground/60 mt-1 block font-mono">Watermark added to public replayer shared links</span>
          </div>
        </div>
      </div>

      {/* Price tiers cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            name: "Free Core Offline",
            price: "$0",
            description: "Full diagnostic visualizer sandbox environment.",
            features: [
              "100% Offline diagnostics",
              "25 Synced traces / month",
              "Max 50 nodes per trace",
              "Shared links contain watermark",
              "Standard local SQLite database"
            ],
            cta: "Free Active Plan",
            active: true
          },
          {
            name: "Beta Pro Team",
            price: "$29",
            description: "Secure synchronization, infinite timelines, team sharing.",
            features: [
              "Everything in Free Core",
              "Unlimited synced traces",
              "Unlimited nodes & timelines",
              "Watermark fully disabled",
              "Advanced exit-code agent checks",
              "Priority developer support"
            ],
            cta: "Upgrade to Pro Team",
            active: false,
            popular: true
          },
          {
            name: "Enterprise Core",
            price: "Custom",
            description: "Custom compliance gateways, SOC2-ready isolated cluster systems.",
            features: [
              "Everything in Pro Team",
              "Team workspace permissions",
              "SAML / SSO Authenticator integration",
              "On-premise air-gapped installation",
              "SOC2-ready custom data audit logs",
              "Dedicated uptime SLA gateway"
            ],
            cta: "Contact Architecture Team",
            active: false
          }
        ].map(tier => (
          <div 
            key={tier.name}
            className={`glass-panel bg-card/25 border border-border/30 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
              tier.popular ? "border-primary glow-cyan scale-[1.02]" : "hover:border-primary/40"
            }`}
          >
            {tier.popular && (
              <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-[9px] text-primary-foreground font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}
            
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">{tier.name}</h4>
              <p className="text-[11px] text-muted-foreground">{tier.description}</p>
              <div className="py-2">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                <span className="text-xs text-muted-foreground/60 ml-2 font-mono">/ month</span>
              </div>

              <ul className="space-y-2 border-t border-border/10 pt-4">
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[10px] text-muted-foreground leading-normal font-mono">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-border/10">
              <Button 
                disabled={tier.active}
                onClick={() => setShowUpgradeModal(true)}
                className={`w-full text-xs font-bold ${
                  tier.active 
                    ? "bg-white/5 border border-border/40 text-muted-foreground" 
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {tier.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* 5. PREFERENCES TAB SHEET */}
  {activeTab === "settings" && (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono">
      {/* Left: Personal Profile */}
      <div className="lg:col-span-1 glass-panel bg-card/10 border border-border/30 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-border/10">
          <User className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-white">Developer Profile</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[9px] text-muted-foreground uppercase">Email Coordinate</label>
            <p className="text-xs text-white font-bold">{user?.email || "Offline Local Developer"}</p>
          </div>
          <div>
            <label className="text-[9px] text-muted-foreground uppercase font-bold">Session Provider ID</label>
            <p className="text-xs text-white break-all">{user?.id || "local-runtime-db-session"}</p>
          </div>
          <div>
            <label className="text-[9px] text-muted-foreground uppercase font-bold">OAuth Federation</label>
            <p className="text-xs text-emerald-400 font-bold">{session ? "Federated Supabase Token" : "Local Sandbox Core"}</p>
          </div>
        </div>
      </div>

      {/* Right: Waitlist & Beta activations */}
      <div className="lg:col-span-2 space-y-8">
        <div className="glass-panel bg-card/10 border border-border/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 pb-3 border-b border-border/10 mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-white">Beta Workspace Codes Activation</h3>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold text-white uppercase mb-2">Invite Code Validation</h4>
              <form onSubmit={handleInviteCodeSubmit} className="flex flex-col gap-3 font-mono">
                <input
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="AETHER-XXXX-XXXX"
                  className="h-9 rounded-md border border-border/40 bg-background/40 px-3 text-xs text-foreground outline-none focus:border-primary/50"
                />
                <Button size="sm" className="h-8 w-fit px-4 text-xs font-mono">
                  Validate Code
                </Button>
              </form>
            </div>

            <div className="border-t lg:border-t-0 lg:border-l border-border/20 pt-4 lg:pt-0 lg:pl-6">
              <h4 className="text-xs font-bold text-white uppercase mb-2">Request Beta Expansion</h4>
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-3 font-mono">
                <input
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="team@company.com"
                  className="h-9 rounded-md border border-border/40 bg-background/40 px-3 text-xs text-foreground outline-none focus:border-primary/50"
                />
                <Button size="sm" variant="outline" className="h-8 w-fit px-4 text-xs font-mono border-border/50">
                  Join Platform Waitlist
                </Button>
              </form>
            </div>
          </div>

          {inviteResult && (
            <p className="mt-6 text-xs text-primary font-bold border border-primary/20 bg-primary/10 rounded-lg p-2.5 w-fit font-mono">
              {inviteResult}
            </p>
          )}
        </div>
      </div>
    </div>
  )}

  </div>

  {/* 6. GLOWING STRIPE-READY SUBSCRIPTION REDIRECT MODAL */}
  <AnimatePresence>
    {showUpgradeModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-[#06060c] border border-border/45 rounded-2xl overflow-hidden shadow-2xl font-mono"
        >
          <div className="bg-white/5 border-b border-border/20 p-5 flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              PRO BETA TELEMETRY EXPANSION
            </span>
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="text-xs text-muted-foreground hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="p-6 space-y-6 font-mono">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white">Redirection to Stripe Gateway</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                You are subscribing to Aether Pro Team Cloud Beta at <strong className="text-white">$29/month</strong>. Secure invoice processing handled via Stripe.
              </p>
            </div>

            <div className="bg-black/50 border border-border/25 rounded-xl p-4 space-y-3 text-[11px] text-muted-foreground font-mono">
              <div className="flex justify-between">
                <span>Secure end-to-end cloud storage sync</span>
                <span className="text-emerald-400 font-bold">UNLIMITED</span>
              </div>
              <div className="flex justify-between">
                <span>Diagnostic nodes capability</span>
                <span className="text-emerald-400 font-bold">UNLIMITED</span>
              </div>
              <div className="flex justify-between">
                <span>Exportable timelines support</span>
                <span className="text-emerald-400 font-bold">ENABLED</span>
              </div>
              <div className="flex justify-between">
                <span>Priority developer chat gateways</span>
                <span className="text-emerald-400 font-bold">24/7 SLA</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setSystemLogs(prev => ["Redirection trigger sent to billing dashboard payload...", ...prev])
                  alert("Stripe Checkout Sandbox: Redeeming Beta Pro trial. Subscribing account...")
                  setShowUpgradeModal(false)
                }}
                className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-95 text-xs py-5"
              >
                Redeem Sandbox Beta Trial
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUpgradeModal(false)}
                className="border-border/50 text-xs text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
</main>
)
}
