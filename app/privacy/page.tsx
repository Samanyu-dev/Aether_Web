"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ShieldAlert, Database, CloudOff, Globe } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-foreground relative overflow-hidden flex flex-col justify-between antialiased selection:bg-primary/20">
      <Navigation />

      {/* Ambient blurs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[15%] right-[10%] w-[450px] h-[450px] bg-gradient-radial-cyan opacity-[0.05]" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-gradient-radial-purple opacity-[0.04]" />
      </div>

      <div className="container mx-auto px-6 pt-36 pb-20 relative z-10 flex-grow max-w-3xl">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="border-b border-border/10 pb-6">
            <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[9px] font-mono font-bold tracking-widest text-primary uppercase mb-3">
              Telemetry Protocol
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white font-mono">Privacy Telemetry Policy</h1>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Effective Date: May 18, 2026. Plain English offline-first guarantees for local telemetry isolation.
            </p>
          </div>

          {/* Value cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel bg-card/10 border border-border/30 rounded-xl p-5 flex flex-col items-start gap-3">
              <CloudOff className="w-5 h-5 text-primary shrink-0 animate-pulse" />
              <h3 className="text-xs font-bold font-mono text-white uppercase">100% Offline</h3>
              <p className="text-[10px] font-mono text-muted-foreground leading-normal">
                By default, Aether stores reasoning data directly in your workspace under `.aether/`. No packets cross the web.
              </p>
            </div>
            <div className="glass-panel bg-card/10 border border-border/30 rounded-xl p-5 flex flex-col items-start gap-3">
              <Database className="w-5 h-5 text-primary shrink-0" />
              <h3 className="text-xs font-bold font-mono text-white uppercase">No Data Farming</h3>
              <p className="text-[10px] font-mono text-muted-foreground leading-normal">
                We never harvest LLM weights, response values, thought prompt strings, or local file trees.
              </p>
            </div>
            <div className="glass-panel bg-card/10 border border-border/30 rounded-xl p-5 flex flex-col items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
              <h3 className="text-xs font-bold font-mono text-white uppercase">Zero Cookies</h3>
              <p className="text-[10px] font-mono text-muted-foreground leading-normal">
                No third-party advertising cookies, analytics scripts, or tracker networks exist on this platform.
              </p>
            </div>
          </div>

          {/* Legal Text content */}
          <div className="space-y-6 pt-4 text-xs text-muted-foreground font-mono leading-relaxed">
            <h2 className="text-sm font-bold text-white uppercase font-mono">1. Local Telemetry Bounds</h2>
            <p>
              Aether Observe is architected as an offline developer utility. When installing our Python library (<code className="text-white bg-white/5 px-1 py-0.5 rounded">pip install aether-observe</code>), telemetry vectors representing LLM steps are written exclusively to local JSON database indices. We have no backend capability to listen, parse, or mirror this runtime data remotely.
            </p>

            <h2 className="text-sm font-bold text-white uppercase font-mono">2. Cloud Sync (Consent-Only)</h2>
            <p>
              If you explicitly authenticate to the Aether Early Access portal and choose to create a public shared replay url (<code className="text-white">Create Shared Link</code>), only the specific node trace selected will compile onto our gateway servers. Your uploaded trace is hashed, encrypted, and isolated in private database sandboxes. You retain complete ownership and can delete synced traces at any second.
            </p>

            <h2 className="text-sm font-bold text-white uppercase font-mono">3. Auditable Telemetry</h2>
            <p>
              Because your telemetry resides in human-readable JSON formats locally, you can open, modify, or audit any logged event before pushing to production or syncing. Your data belongs strictly to you.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
