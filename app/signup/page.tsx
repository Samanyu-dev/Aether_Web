import { Suspense } from "react"
import { AuthForm } from "@/components/auth/auth-form"

function AuthSkeleton() {
  return <div className="mx-auto h-[560px] w-full max-w-md rounded-2xl border border-border/40 bg-card/30 animate-pulse" />
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="site-container py-space-120">
        <Suspense fallback={<AuthSkeleton />}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
    </main>
  )
}
