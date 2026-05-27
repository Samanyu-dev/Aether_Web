"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowRight, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  Settings, 
  Terminal, 
  ChevronDown, 
  Check, 
  Copy, 
  AlertCircle 
} from "lucide-react"
import { useAetherStore } from "@/lib/store/useAetherStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

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
    signInMockGoogle,
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
  
  // Custom Google OAuth configuration helpers
  const [showGoogleOauthWizard, setShowGoogleOauthWizard] = useState(false)
  const [showOAuthSteps, setShowOAuthSteps] = useState(false)
  const [copiedRedirectUri, setCopiedRedirectUri] = useState(false)

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

  const onGoogle = () => {
    clearError()
    setLocalMessage(null)
    setShowGoogleOauthWizard(true)
  }

  return (
    <>
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

      {/* Google OAuth Setup & Demo Wizard */}
      <AnimatePresence>
        {showGoogleOauthWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#06060c] border border-border/45 rounded-2xl overflow-hidden shadow-2xl font-mono text-left"
            >
              {/* Header */}
              <div className="bg-white/5 border-b border-border/20 p-5 flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  🌐 GOOGLE OAUTH INTERCEPT SYSTEM
                </span>
                <button 
                  onClick={() => setShowGoogleOauthWizard(false)}
                  className="text-xs text-muted-foreground hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">Select Authentication Mode</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Google OAuth client credentials are required for live cloud database synchronization. Select your target environment:
                  </p>
                </div>

                {/* Option Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Mock Developer sandbox */}
                  <div className="border border-primary/20 bg-primary/5 rounded-xl p-5 flex flex-col justify-between hover:border-primary/45 transition-colors relative overflow-hidden group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          <Terminal className="w-3.5 h-3.5" />
                          DEV SANDBOX
                        </span>
                        <span className="text-[8px] bg-primary/10 border border-primary/20 text-primary font-bold px-1.5 py-0.5 rounded uppercase">
                          INSTANT
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">Local Demo Session</h4>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Access full diagnostic visualizer timelines instantly offline using simulated Google developer tokens. Preloaded with high-fidelity agent replays.
                      </p>
                    </div>
                    <Button 
                      onClick={async () => {
                        const ok = await signInMockGoogle()
                        if (ok) {
                          setShowGoogleOauthWizard(false)
                          router.push(redirect)
                        }
                      }}
                      className="mt-6 w-full text-xs font-bold bg-primary text-primary-foreground"
                    >
                      Launch Sandbox Mode
                    </Button>
                  </div>

                  {/* Option 2: Connect real credentials */}
                  <div className="border border-border/40 bg-card/25 rounded-xl p-5 flex flex-col justify-between hover:border-border/60 transition-colors relative overflow-hidden group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                          PRODUCTION
                        </span>
                        <span className="text-[8px] bg-white/5 border border-border/20 text-muted-foreground font-bold px-1.5 py-0.5 rounded uppercase">
                          SUPABASE
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">OAuth Integration</h4>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Link real Google Cloud Console keys via your Supabase project console to stream active workspace reasoning traces to the cloud.
                      </p>
                    </div>
                    <Button 
                      onClick={async () => {
                        setShowGoogleOauthWizard(false)
                        await signInWithGoogle(redirect)
                      }}
                      className="mt-6 w-full text-xs font-bold bg-white/5 border border-border/50 text-white hover:bg-white/10"
                    >
                      Initiate Supabase Auth
                    </Button>
                  </div>
                </div>

                {/* Dropdown setup instructions */}
                <div className="border-t border-border/20 pt-4 font-mono">
                  <button 
                    type="button"
                    onClick={() => setShowOAuthSteps(!showOAuthSteps)}
                    className="flex items-center justify-between w-full text-xs text-muted-foreground hover:text-white"
                  >
                    <span>🛠️ View step-by-step Google Cloud credential creation instructions</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showOAuthSteps ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showOAuthSteps && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3 text-[10px] text-muted-foreground space-y-3 leading-relaxed border border-border/20 bg-black/40 rounded-lg p-4 max-h-56 overflow-y-auto"
                      >
                        <p className="text-white font-bold uppercase">1. Google Cloud Console Setup:</p>
                        <ol className="list-decimal list-inside space-y-1 pl-1">
                          <li>Create a new project at <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>.</li>
                          <li>Navigate to **OAuth consent screen**, choose **External**, and input your App Name.</li>
                          <li>Go to **Credentials** {"→"} **Create Credentials** {"→"} **OAuth client ID**.</li>
                          <li>Set Application Type to **Web application** and Authorized JavaScript origins to `http://localhost:3000`.</li>
                          <li>Set Authorized redirect URIs to the Supabase endpoint:
                            <div className="flex items-center gap-2 bg-black/60 border border-border/10 p-2 rounded mt-1.5 font-mono select-all text-emerald-400">
                              <span>https://mmxpmeccczijvrsgvsdz.supabase.co/auth/v1/callback</span>
                              <button 
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText("https://mmxpmeccczijvrsgvsdz.supabase.co/auth/v1/callback")
                                  setCopiedRedirectUri(true)
                                  setTimeout(() => setCopiedRedirectUri(false), 2000)
                                }}
                                className="text-muted-foreground hover:text-white ml-auto"
                              >
                                {copiedRedirectUri ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </li>
                        </ol>

                        <p className="text-white font-bold uppercase mt-3">2. Supabase Integration Setup:</p>
                        <ol className="list-decimal list-inside space-y-1 pl-1">
                          <li>Open the <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase Dashboard</a>.</li>
                          <li>Navigate to **Authentication** {"→"} **Providers** {"→"} **Google**.</li>
                          <li>Toggle Google Enabled to **ON**, paste your **Client ID** and **Client Secret**, and click **Save**.</li>
                        </ol>

                        <p className="text-primary font-bold mt-2">💡 Integration details successfully saved in `GOOGLE_OAUTH_SETUP.md` inside your project directory root!</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
