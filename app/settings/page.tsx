"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  useEffect(() => {
    router.push("/dashboard?tab=settings")
  }, [router])

  return (
    <main className="min-h-screen bg-[#05050a] flex items-center justify-center font-mono text-xs text-primary">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
        <span>Redirecting to workspace controls...</span>
      </div>
    </main>
  )
}
