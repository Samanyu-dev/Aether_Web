"use client"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { useAetherStore } from "@/lib/store/useAetherStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldAlert, Sparkles, Terminal, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function AuthFormContent() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const { signIn, signUp, isLoading, error, clearError, checkSession, session } = useAetherStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setTimeout(async () => {
      const success = await signIn("developer@aether.local", "password123")
      setIsGoogleLoading(false)
      if (success) {
        router.push(redirect)
      }
    }, 1200)
  }

  useEffect(() => {
    // Check if session already exists
    checkSession()
  }, [checkSession])

  useEffect(() => {
    if (session) {
      router.push(redirect)
    }
  }, [session, router, redirect])

  useEffect(() => {
    setFormError(null)
    clearError()
  }, [isLogin, clearError])

  const validate = () => {
    setFormError(null)
    if (!email || !password) {
      setFormError("All fields are required")
      return false
    }
    if (!email.includes("@")) {
      setFormError("Invalid email address")
      return false
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters")
      return false
    }
    if (!isLogin && password !== confirmPassword) {
      setFormError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (isLogin) {
      const success = await signIn(email, password)
      if (success) {
        router.push(redirect)
      }
    } else {
      const success = await signUp(email, password)
      if (success) {
        router.push(redirect)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="md:col-span-5 relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-8 shadow-2xl backdrop-blur-xl glow-cyan-subtle"
    >
      {/* Top border ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
          <Terminal className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          {isLogin ? "Welcome back" : "Early Access Portal"}
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border border-primary/30 text-primary bg-primary/5 uppercase tracking-widest font-bold">
            Beta
          </span>
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          {isLogin
            ? "Authenticate session to access Cloud Sync"
            : "Provision early-access licenses to sync traces"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Errors */}
        {(formError || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive-foreground"
          >
            <ShieldAlert className="h-4 w-4 shrink-0 text-destructive" />
            <div>{formError || error}</div>
          </motion.div>
        )}

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
            Developer Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="border-border/50 bg-background/20 text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-primary/50"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border-border/50 bg-background/20 text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-primary/50 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!isLogin && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Confirm Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="border-border/50 bg-background/20 text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-primary/50"
                disabled={isLoading}
              />
            </div>
          </motion.div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-5 rounded-xl border border-primary/20 glow-cyan-subtle relative overflow-hidden transition-all duration-300 group"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              Initializing Node Connection...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {isLogin ? "Authenticate Session" : "Provision Developer License"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>

      {/* Google OAuth Section */}
      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <div className="h-[1px] bg-border/40 flex-1" />
          <span>Or Connect via Auth-Node</span>
          <div className="h-[1px] bg-border/40 flex-1" />
        </div>

        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
          className="w-full bg-[#0b0b12]/60 hover:bg-[#0b0b12] text-foreground border border-border/50 hover:border-primary/50 py-5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group font-mono text-xs"
        >
          {isGoogleLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-foreground/30 border-t-foreground animate-spin" />
              Connecting Google Account...
            </span>
          ) : (
            <>
              <svg className="w-4 h-4 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Continue with Google Developer</span>
            </>
          )}
        </Button>
      </div>

      {/* Tab Swapping */}
      <div className="mt-6 text-center text-xs">
        <span className="text-muted-foreground">
          {isLogin ? "New to the developer preview?" : "Already have access?"}
        </span>{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin)
            setFormError(null)
            clearError()
          }}
          className="font-semibold text-primary hover:underline ml-1"
        >
          {isLogin ? "Request beta key" : "Sign in to profile"}
        </button>
      </div>

      {/* Bottom local-first disclaimer */}
      <div className="mt-8 pt-4 border-t border-border/10 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          Local-first trace sandbox
        </span>
        <span>Cloud Sync Optional</span>
      </div>
    </motion.div>
  )
}

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[#06060c] text-foreground relative overflow-hidden flex items-center justify-center p-6 antialiased">
      {/* Background Matrix/Node Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.25_0.15_220_/_0.15),transparent_60%)]" />
        {/* Glowing floating ambient light */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] left-[20%] w-[40vw] h-[40vh] rounded-full bg-primary/5 blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[10%] right-[20%] w-[35vw] h-[35vh] rounded-full bg-accent/5 blur-[120px] pointer-events-none"
        />
      </div>

      {/* Navigation Return Home */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Cinematic Copy & Code Terminal */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-6 pr-0 md:pr-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full border border-primary/20 text-primary bg-primary/5 text-xs font-mono tracking-widest uppercase mb-4">
              Developer Preview
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
              Observe AI Cognition in <span className="text-gradient-cyan">Realtime</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
              Aether is the premium local-first replay engine for agent reasoning. Step through trace DAGs, dissect LLM tool execution, audit hallucinations, and secure your systems completely offline.
            </p>
          </motion.div>

          {/* Minimal Terminal Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border border-border/40 rounded-xl overflow-hidden bg-black/40 backdrop-blur-md shadow-2xl"
          >
            <div className="bg-white/5 px-4 py-2 border-b border-border/20 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">aether --observe --local</span>
            </div>
            <pre className="p-5 font-mono text-[11px] leading-relaxed text-emerald-400 overflow-x-auto">
              <div><span className="text-primary">$</span> pip install aether-observe</div>
              <div className="text-muted-foreground">Installing dependencies... done.</div>
              <div><span className="text-primary">$</span> python</div>
              <div className="text-muted-foreground">{'>>>'} <span className="text-white">from aether import AgentTracer</span></div>
              <div className="text-muted-foreground">{'>>>'} <span className="text-white">tracer = AgentTracer(session="core-eval-1")</span></div>
              <div className="text-muted-foreground">{'>>>'} <span className="text-white">tracer.log_thought("Retrieve paper context")</span></div>
              <div><span className="text-cyan-400">[aether-observer] Connecting local server on port 8000...</span></div>
              <div><span className="text-emerald-400">[aether-observer] Session provisioned successfully. 60fps live stream active.</span></div>
            </pre>
          </motion.div>
        </div>

        {/* Right Side: Authentication Box (Wrapped in Suspense) */}
        <Suspense fallback={
          <div className="md:col-span-5 relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-8 shadow-2xl backdrop-blur-xl glow-cyan-subtle min-h-[400px] flex items-center justify-center font-mono text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-3">
              <span className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <span>Instantiating Auth Node...</span>
            </div>
          </div>
        }>
          <AuthFormContent />
        </Suspense>
      </div>
    </main>
  )
}
