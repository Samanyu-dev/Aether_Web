"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldCheck, Sparkles, Terminal, Copy, Check, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BetaPage() {
  const [inviteCode, setInviteCode] = useState("")
  const [isApproved, setIsApproved] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedText, setCopiedText] = useState(false)

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      const cleanCode = inviteCode.trim().toUpperCase()
      if (cleanCode === "AETHER-BETA-2026") {
        setIsApproved(true)
      } else {
        setErrorMsg("INVALID BETA LICENSE KEY: provisioning node handshake failed.")
      }
    }, 1200)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText("AETHER-BETA-2026")
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-foreground relative overflow-hidden flex flex-col justify-between antialiased selection:bg-primary/20">
      <Navigation />

      {/* Background Matrix/Node Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] bg-gradient-radial-cyan opacity-[0.06]" />
        <div className="absolute bottom-[20%] left-[15%] w-[500px] h-[500px] bg-gradient-radial-purple opacity-[0.05]" />
      </div>

      <div className="site-container pt-36 pb-20 relative z-10 flex-grow max-w-xl">
        <AnimatePresence mode="wait">
          {!isApproved ? (
            <motion.div
              key="verification"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel bg-card/25 border border-border/30 rounded-2xl p-8 relative overflow-hidden text-center glow-cyan-subtle"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 text-primary">
                <Terminal className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Early Access Portal</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                Enter your provisioned beta credentials to activate full cloud synchronizations and telemetry sandboxing limits.
              </p>

              {/* Sandbox notice / Copy code */}
              <div className="bg-[#0b0b12] border border-border/30 rounded-xl p-3.5 flex items-center justify-between mb-6 text-left">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-primary font-bold">Public Demo Invite Key</span>
                  <p className="text-[11px] font-mono text-emerald-400 font-bold">AETHER-BETA-2026</p>
                </div>
                <Button
                  onClick={handleCopyCode}
                  variant="outline"
                  size="sm"
                  className="border-primary/20 hover:border-primary/50 text-[10px] font-mono h-8"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedText ? "Copied" : "Copy Key"}
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleVerify} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Early Access Invite License
                  </label>
                  <Input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="XXXX-XXXX-XXXX"
                    className="border-border/50 bg-background/20 text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-primary/50 text-center font-mono uppercase"
                    disabled={isLoading}
                  />
                </div>

                {errorMsg && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-mono text-destructive"
                  >
                    {errorMsg}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !inviteCode}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-5 rounded-xl border border-primary/20 glow-cyan-subtle relative overflow-hidden transition-all duration-300 group"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                      Provisioning beta node...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 font-mono text-xs">
                      Activate Developer License
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel bg-card/25 border border-primary/30 rounded-2xl p-8 relative overflow-hidden text-center glow-cyan"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-primary/20 border border-emerald-500/30 text-emerald-400 animate-bounce">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Access Node Activated!</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                Developer license provisioned successfully. Your profile has been white-listed on local IPC port 8000 and Cloud-Sync modules.
              </p>

              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-5 rounded-xl border border-primary/20 glow-cyan-subtle font-mono text-xs">
                    Sign In to Profile
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="ghost" className="w-full hover:bg-white/5 text-muted-foreground hover:text-white font-mono text-xs">
                    Read SDK Setup Manual
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  )
}
