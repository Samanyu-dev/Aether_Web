"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAetherStore } from "@/lib/store/useAetherStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, ShieldAlert, Sparkles, Terminal, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "signup"
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(defaultTab === "login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { signIn, signUp, isLoading, error, clearError } = useAetherStore()
  const router = useRouter()

  useEffect(() => {
    setIsLogin(defaultTab === "login")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setFormError(null)
    clearError()
  }, [isOpen, defaultTab, clearError])

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
        onClose()
        router.push("/dashboard")
      }
    } else {
      const success = await signUp(email, password)
      if (success) {
        onClose()
        router.push("/dashboard")
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-8 shadow-2xl backdrop-blur-xl glow-cyan-subtle"
          >
            {/* Top border ambient glow */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
                {isLogin ? "Welcome back to Aether" : "Request early access"}
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border border-primary/30 text-primary bg-primary/5 uppercase tracking-widest font-bold">
                  Beta
                </span>
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                {isLogin
                  ? "Initialize your session and observe local-first agent cognition"
                  : "Join the developer preview of our AI observability engine"}
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
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="border-border/50 bg-background/20 text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-primary/50"
                    disabled={isLoading}
                  />
                </div>
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
                >
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
        </div>
      )}
    </AnimatePresence>
  )
}
