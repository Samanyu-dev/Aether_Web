"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Layers, Shield, Cpu, Database } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Local Core",
    price: "Free",
    period: "forever",
    description: "The complete offline reasoning runtime for solo engineers.",
    icon: Cpu,
    features: [
      "100% Offline execution",
      "Unlimited local traces",
      "Full 60fps React Flow visualizer",
      "Human-readable trace schemas",
      "git-friendly .aether directory",
      "Community support",
    ],
    cta: "Start Free Locally",
    href: "/signup",
    highlight: false,
    glowClass: "hover:border-primary/50",
  },
  {
    name: "Pro Team Cloud",
    price: "$29",
    period: "developer / mo",
    description: "Secure cloud sync, collaboration, and agent looping diagnostics.",
    icon: Sparkles,
    features: [
      "Everything in Local Core",
      "500 Synced cloud traces",
      "Up to 200 nodes per trace",
      "E2E Encrypted shared replay links",
      "Agent loop & exit-code warnings",
      "Priority Developer Support",
    ],
    cta: "Join Pro Beta",
    href: "/signup",
    highlight: true,
    glowClass: "border-primary glow-cyan scale-105",
  },
  {
    name: "Enterprise Core",
    price: "Custom",
    period: "volume discount",
    description: "Private cloud gateways, custom parsers, and strict security compliance.",
    icon: Shield,
    features: [
      "Everything in Pro Team",
      "Unlimited synced traces & nodes",
      "SAML / SSO Authentication",
      "On-premise isolated cluster gateway",
      "Custom telemetry JSON parsers",
      "Dedicated 24/7 uptime SLA",
    ],
    cta: "Contact Architecture Team",
    href: "mailto:architecture@aether.local",
    highlight: false,
    glowClass: "hover:border-accent/50",
  }
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-foreground relative overflow-hidden flex flex-col justify-between antialiased selection:bg-primary/20">
      <Navigation />

      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-gradient-radial-cyan opacity-[0.08]" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-gradient-radial-purple opacity-[0.06]" />
      </div>

      <div className="site-container pt-32 pb-20 relative z-10 flex-grow">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-mono font-bold tracking-widest text-primary uppercase mb-4"
          >
            Observability Licensing
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Honest, Developer-First <span className="text-gradient-cyan">Pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed"
          >
            Aether is local-first. We believe solo engineers should have complete observability runtime diagnostic power offline, forever, for free. Upgrade only when you sync or collaborate.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {tiers.map((tier, idx) => {
            const Icon = tier.icon
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`glass-panel bg-card/25 border border-border/30 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${tier.glowClass}`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent border border-primary/20 text-[9px] font-mono uppercase tracking-widest text-primary-foreground font-bold px-3 py-1 rounded-full shadow-2xl">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  {/* Card Title & Icon */}
                  <div className="flex items-center justify-between pb-4 border-b border-border/10">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white font-mono">{tier.name}</h3>
                      <p className="text-xs text-muted-foreground">{tier.description}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Pricing Value */}
                  <div className="py-2">
                    <span className="text-4xl font-bold font-mono text-white">{tier.price}</span>
                    <span className="text-xs font-mono text-muted-foreground/60 ml-2">/ {tier.period}</span>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-3 pt-2">
                    {tier.features.map(feat => (
                      <li key={feat} className="flex items-start gap-2.5 text-[11px] font-mono text-muted-foreground leading-normal">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Action Button */}
                <div className="mt-8 pt-6 border-t border-border/10">
                  <Link href={tier.href}>
                    <Button 
                      className={`w-full py-5 rounded-xl font-mono text-xs font-bold transition-all duration-300 ${
                        tier.highlight 
                          ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground border border-primary/20 glow-cyan-subtle" 
                          : "bg-white/5 hover:bg-white/10 text-white border border-border/60 hover:border-primary/50"
                      }`}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>

              </motion.div>
            )
          })}
        </div>

        {/* Local disclaimer notice */}
        <div className="max-w-md mx-auto text-center mt-12 bg-black/35 border border-border/30 rounded-xl p-4 flex items-center justify-center gap-3 relative overflow-hidden">
          <Database className="w-5 h-5 text-primary shrink-0 animate-pulse" />
          <p className="text-[10px] font-mono text-muted-foreground leading-normal text-left">
            <span className="text-white font-bold">Offline telemetry assurance:</span> Aether never aggregates or uploads metadata to our gateway without your explicit consent. Your intellectual property is completely isolated locally.
          </p>
        </div>

      </div>

      <Footer />
    </main>
  )
}
