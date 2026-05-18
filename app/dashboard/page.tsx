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
  ChevronRight
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
  const [activeDir, setActiveDir] = useState<string | null>("traces/")
  const [selectedLocalFile, setSelectedLocalFile] = useState<LocalFile | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isCopiedSDK, setIsCopiedSDK] = useState(false)
  const [shareToast, setShareToast] = useState<string | null>(null)
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "INITIALIZING LOCAL Observatorio GRAPH ENGINE...",
    "CONNECTED local socket at .aether/sessions/live_ipc_8000.sock",
    "WATCHING .aether/traces/ for new telemetry data..."
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  // Automatically select first trace if available
  useEffect(() => {
    if (traces.length > 0 && !activeReplayTrace) {
      setActiveReplayTrace(traces[0])
    }
  }, [traces, activeReplayTrace, setActiveReplayTrace])

  // Handlers
  const handleSignOut = async () => {
    await signOut()
    router.push("/auth")
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
    setTimeout(() => setIsCopiedSDK(false), 2000)
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
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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
                Cloud sync active (mock client)
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

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
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

            <pre className="p-3 bg-black/40 border border-border/10 rounded-lg text-[10px] font-mono text-muted-foreground overflow-x-auto">
              <div><span className="text-primary">from</span> aether <span className="text-primary">import</span> AgentTracer</div>
              <div className="text-muted-foreground mt-1.5"># Initialize tracer session</div>
              <div>tracer = AgentTracer(session=<span className="text-emerald-400">"agent_1"</span>)</div>
              <div className="text-muted-foreground mt-1.5"># Track decision points</div>
              <div>tracer.log_thought(<span className="text-emerald-400">"Query vectorDB"</span>)</div>
              <div>tracer.log_tool(<span className="text-emerald-400">"web_search"</span>, query=<span className="text-emerald-400">"..."</span>)</div>
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
                          {trace.max_confidence !== undefined && (
                            <>
                              <span>•</span>
                              <span className={isLowConfidence ? "text-destructive" : "text-emerald-400"}>
                                Bottleneck: {(trace.max_confidence * 100).toFixed(0)}%
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
              <span className="text-white font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                AETHER OBSERVER DAEMON TELEMETRY CONSOLE
              </span>
              <span className="text-primary font-bold">PORT 8000</span>
            </div>
            <div className="space-y-1 leading-relaxed">
              {systemLogs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-primary shrink-0">{'>>>'}</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
