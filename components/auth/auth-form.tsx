"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react"
import { useAetherStore } from "@/lib/store/useAetherStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AuthMode = "login" | "signup" | "forgot"

interface AuthFormProps {
  mode: AuthMode
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.04 5.04 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" fill="#34A853" />
      <path d="M5.84 14.09A6.96 6.96 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" fill="#EA4335" />
    </svg>
  )
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get("redirect") || "/dashboard"

  const {
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    isLoading,
    error,
    clearError,
    isCloudSyncEnabled,
  } = useAetherStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [localMessage, setLocalMessage] = useState<string | null>(null)

  const heading = useMemo(() => {
    if (mode === "signup") return "Create your Aether account"
    if (mode === "forgot") return "Reset your password"
    return "Sign in to Aether"
  }, [mode])

  const description = useMemo(() => {
    if (mode === "signup") return "Set up your beta account to start capturing and replaying cognition traces."
    if (mode === "forgot") return "We will send a password reset link to your developer email."
    return "Use your account to access dashboard replay history and SDK onboarding."
  }, [mode])

  const validate = () => {
    clearError()
    setLocalMessage(null)

    if (!email.trim()) {
      setLocalMessage("Email is required.")
      return false
    }

    if (!email.includes("@")) {
      setLocalMessage("Enter a valid email address.")
      return false
    }

    if (mode === "forgot") return true

    if (password.length < 6) {
      setLocalMessage("Password must be at least 6 characters.")
      return false
    }

    if (mode === "signup" && password !== confirmPassword) {
      setLocalMessage("Passwords do not match.")
      return false
    }

    return true
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (mode === "forgot") {
      const ok = await resetPassword(email)
      if (ok) {
        setLocalMessage("Password reset link sent. Check your email inbox.")
      }
      return
    }

    if (mode === "login") {
      const ok = await signIn(email, password)
      if (ok) router.push(redirect)
      return
    }

    const ok = await signUp(email, password)
    if (ok) router.push(redirect)
  }

  const onGoogle = async () => {
    clearError()
    setLocalMessage(null)
    await signInWithGoogle(redirect)
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border/50 bg-card/40 p-8 shadow-xl backdrop-blur-md">
      <div className="mb-6">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest text-primary">
          <ShieldCheck className="h-3 w-3" />
          Beta Access
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      {!isCloudSyncEnabled && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          Supabase env is missing. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
        </div>
      )}

      {(localMessage || error) && (
        <div className={`mb-4 rounded-lg border p-3 text-xs ${error ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-primary/30 bg-primary/10 text-primary"}`}>
          {error || localMessage}
        </div>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="pl-9"
              disabled={isLoading}
            />
          </div>
        </label>

        {mode !== "forgot" && (
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Password</span>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
        )}

        {mode === "signup" && (
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Confirm Password</span>
            <Input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </label>
        )}

        <Button type="submit" disabled={isLoading || !isCloudSyncEnabled} className="h-11 w-full">
          {isLoading ? "Working..." : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>

        {mode !== "forgot" && (
          <Button
            type="button"
            variant="outline"
            onClick={onGoogle}
            disabled={isLoading || !isCloudSyncEnabled}
            className="h-11 w-full"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        )}
      </form>

      <div className="mt-6 space-y-2 text-sm text-muted-foreground">
        {mode === "login" && (
          <>
            <p>
              Need an account?{" "}
              <Link href={`/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-primary hover:underline">
                Create one
              </Link>
            </p>
            <p>
              Forgot password?{" "}
              <Link href="/forgot-password" className="text-primary hover:underline">
                Reset it
              </Link>
            </p>
          </>
        )}
        {mode === "signup" && (
          <p>
            Already have an account?{" "}
            <Link href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        )}
        {mode === "forgot" && (
          <p>
            Back to{" "}
            <Link href="/login" className="text-primary hover:underline">
              sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
