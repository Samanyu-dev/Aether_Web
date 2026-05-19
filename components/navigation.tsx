"use client"

import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useAetherStore } from "@/lib/store/useAetherStore"
import Link from "next/link"

const navLinks = [
  { label: "Replay", href: "/#replay" },
  { label: "SDK", href: "/#sdk" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { session, signOut, checkSession } = useAetherStore()
  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="site-container pt-space-24">
        <nav className="glass-panel rounded-2xl px-6 py-4 border border-border/20 backdrop-blur-md bg-background/40">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Aether Logo" className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110" />
              <span className="text-lg font-bold text-foreground font-mono">Aether</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 font-mono relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
                >
                  {link.label}
                </a>
              ))}
            </div>
 
            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.open("https://github.com/Samanyu-dev/Aether", "_blank")}
                className="text-muted-foreground hover:text-foreground font-mono"
              >
                <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </Button>
              {session ? (
                <div className="flex items-center gap-3">
                  {/* Dynamic Developer Profile Avatar */}
                  <div className="hidden sm:flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/30 rounded-xl pl-2 pr-3 py-1 font-mono text-xs text-primary select-none max-w-[180px] shadow-[0_0_15px_oklch(0.72_0.19_195_/_0.1)] hover:shadow-[0_0_20px_oklch(0.72_0.19_195_/_0.2)] transition-all duration-300">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-[10px] text-primary-foreground shrink-0 uppercase shadow-md">
                      {session?.user?.email?.charAt(0) || "D"}
                    </div>
                    <span className="truncate max-w-[100px] font-semibold text-foreground/90 transition-colors">
                      {session?.user?.email?.split("@")[0]}
                    </span>
                  </div>
                  
                  <Link href="/dashboard">
                    <Button size="sm" className="glow-cyan-subtle font-mono text-xs">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs font-mono px-2">
                      Settings
                    </Button>
                  </Link>
                  <Link href="/usage">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs font-mono px-2">
                      Usage
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-xs font-mono px-2"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-mono text-xs">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="glow-cyan-subtle font-mono text-xs">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 mt-4 border-t border-border/30"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                {session && (
                  <Link
                    href="/dashboard"
                    className="text-sm text-primary font-mono"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {session && (
                  <>
                    <Link
                      href="/settings"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href="/usage"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
                      onClick={() => setIsOpen(false)}
                    >
                      Usage
                    </Link>
                  </>
                )}
                <div className="flex flex-col gap-3 pt-4 border-t border-border/30">
                  {session ? (
                    <>
                      <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full">
                        <Button size="sm" className="w-full glow-cyan-subtle font-mono">
                          Dashboard
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { signOut(); setIsOpen(false); }}
                        className="w-full border-destructive/20 text-destructive-foreground font-mono"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                        <Button variant="ghost" size="sm" className="w-full font-mono text-muted-foreground">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
                        <Button size="sm" className="w-full glow-cyan-subtle font-mono">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </nav>
      </div>
    </motion.header>
  )
}
