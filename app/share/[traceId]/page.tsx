"use client"

import { useState, useEffect } from "react"
import { useAetherStore } from "@/lib/store/useAetherStore"
import { DashboardReplay } from "@/components/dashboard-replay"
import { type Trace } from "@/lib/supabase"
import { Terminal, ShieldAlert, Sparkles, Cpu, HardDrive, Compass, ArrowRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ShareTracePage() {
  const params = useParams()
  const traceId = params.traceId as string
  
  const { getPublicTrace, isLoading, error } = useAetherStore()
  const [trace, setTrace] = useState<Trace | null>(null)

  useEffect(() => {
    if (traceId) {
      getPublicTrace(traceId).then(data => {
        if (data) {
          setTrace(data)
        }
      })
    }
  }, [traceId, getPublicTrace])

  // Loading page layout
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#06060c] text-foreground flex flex-col items-center justify-center p-8 antialiased">
        <div className="w-full max-w-sm bg-black/40 border border-primary/20 rounded-xl p-6 font-mono text-xs backdrop-blur-md glow-cyan-subtle">
          <div className="flex justify-between items-center border-b border-border/40 pb-3 mb-4">
            <span className="text-primary font-bold">AETHER DECODER</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
          <div className="space-y-2 text-muted-foreground">
            <p className="text-primary animate-pulse">DECRYPTION SEQUENCE RUNNING...</p>
            <p className="text-white">Retrieving public node credentials...</p>
            <p className="text-white">Mapping vector streams...</p>
          </div>
        </div>
      </main>
    )
  }

  // Error/Not Found state
  if (error || !trace) {
    return (
      <main className="min-h-screen bg-[#06060c] text-foreground flex flex-col items-center justify-center p-8 antialiased">
        <div className="w-full max-w-md bg-black/40 border border-destructive/20 rounded-xl p-8 text-center backdrop-blur-md">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4 animate-bounce" />
          <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Trace Not Found</h3>
          <p className="text-xs text-muted-foreground mt-2 font-mono leading-relaxed">
            The trace ID <code className="text-white bg-white/5 px-1 py-0.5 rounded">{traceId}</code> could not be found or has been deleted by its owner.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/">
              <Button size="sm" variant="outline" className="border-border/50 text-xs font-mono">
                <Home className="w-3.5 h-3.5 mr-1.5" />
                Return Home
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="sm" className="glow-cyan-subtle text-xs font-mono">
                Join Beta Access
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const isLowConfidence = typeof trace.max_confidence === "number" && trace.max_confidence < 0.5

  return (
    <main className="min-h-screen bg-[#05050a] text-foreground pb-12 antialiased selection:bg-primary/20">
      
      {/* Top Banner Navigation Header */}
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
              Shared replay
            </div>
          </div>

          <div>
            <Link href="/auth">
              <Button size="sm" className="glow-cyan-subtle text-xs font-mono h-8">
                Observe Your Agents
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Replayer Viewport */}
      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-6">
        
        {/* Info Banner */}
        <div className="bg-card/20 border border-border/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono border border-primary/30 text-primary bg-primary/5 uppercase tracking-widest font-bold">
                Public Shared Trace
              </span>
              {isLowConfidence && (
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono border border-destructive/30 text-destructive bg-destructive/5 uppercase font-bold tracking-widest shrink-0">
                  Hallucination Corrected
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white font-mono tracking-tight mt-1">
              {trace.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {trace.description || "No description provided."}
            </p>
          </div>

          <div className="flex gap-4 shrink-0 text-right md:flex-col justify-end md:gap-1 text-[11px] font-mono text-muted-foreground">
            <div>
              Date: <span className="text-white font-bold">{new Date(trace.created_at).toLocaleDateString()}</span>
            </div>
            <div>
              Size: <span className="text-white font-bold">{trace.event_count || trace.nodes?.length || 0} Nodes</span>
            </div>
            <div>
              Duration: <span className="text-white font-bold">{trace.duration_ms ? `${(trace.duration_ms / 1000).toFixed(2)}s` : "0s"}</span>
            </div>
          </div>
        </div>

        {/* Observatory Canvas */}
        <DashboardReplay trace={trace} />

        {/* Call to Action details */}
        <div className="bg-gradient-to-r from-primary/10 via-transparent to-accent/10 border border-border/30 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-primary/5 blur-xl" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-accent/5 blur-xl" />
          
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse" />
          <h2 className="text-lg font-bold text-white font-mono">Observe local-first AI reasoning at 60fps</h2>
          <p className="text-xs text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
            Stop guessing what your LLMs are thinking. Trace tool loops, memory search graphs, and retrieve citations completely locally using the open-source Aether python framework.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/">
              <Button size="sm" variant="outline" className="border-border/50 text-xs font-mono h-9">
                Explore Features
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="sm" className="glow-cyan text-xs font-mono h-9">
                Request Early Access
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
