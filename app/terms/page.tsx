"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Check, ShieldCheck } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-foreground relative overflow-hidden flex flex-col justify-between antialiased selection:bg-primary/20">
      <Navigation />

      {/* Ambient blurs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-[450px] h-[450px] bg-gradient-radial-cyan opacity-[0.05]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-radial-purple opacity-[0.04]" />
      </div>

      <div className="container mx-auto px-6 pt-36 pb-20 relative z-10 flex-grow max-w-3xl">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="border-b border-border/10 pb-6">
            <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[9px] font-mono font-bold tracking-widest text-primary uppercase mb-3">
              Developer License
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white font-mono">Developer Terms of Service</h1>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Effective Date: May 18, 2026. Standard MIT and Beta Service Level parameters.
            </p>
          </div>

          {/* Key points list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Operational Parameters</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-[11px] font-mono text-muted-foreground leading-normal">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>You retain 100% intellectual property, rights, and keys to any code logged or synced.</span>
              </li>
              <li className="flex items-start gap-2.5 text-[11px] font-mono text-muted-foreground leading-normal">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>The Aether core SDK operates locally under standard MIT open source license schemas.</span>
              </li>
              <li className="flex items-start gap-2.5 text-[11px] font-mono text-muted-foreground leading-normal">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>Beta cloud components are supplied "as is" with zero operational guarantees.</span>
              </li>
            </ul>
          </div>

          {/* Legal Text content */}
          <div className="space-y-6 pt-4 text-xs text-muted-foreground font-mono leading-relaxed">
            <h2 className="text-sm font-bold text-white uppercase font-mono">1. Platform Scope</h2>
            <p>
              Aether Observatory is designed for local-first testing of artificial intelligence reasoning trees and multi-agent loops. You agree not to use the visualizer engine to log intentionally malicious binaries, malware execution patterns, or copyrighted trace models without authorization.
            </p>

            <h2 className="text-sm font-bold text-white uppercase font-mono">2. MIT Open Source Core</h2>
            <p>
              The core Python telemetry SDK (<code className="text-white">aether-observe</code>) is supplied open source under the MIT License. You are free to bundle, modify, fork, or run local iterations inside private commercial environments with zero fee liabilities.
            </p>

            <h2 className="text-sm font-bold text-white uppercase font-mono">3. Liability Disclaimer</h2>
            <p>
              Under no circumstances shall Aether or its developers be held liable for any data leakage, agent visual looping errors, storage crashes, or hardware faults resulting from local database socket pipelines on port 8000. Use of local telemetry scripts is entirely at your own risk.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
