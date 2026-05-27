import { NextRequest, NextResponse } from "next/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Supabase environment variables not configured" },
      { status: 500 }
    )
  }

  let supabase: any
  let user: any = null

  // 1. Try to authenticate via Authorization: Bearer <token> (Extension authentication)
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    const { data: { user: authUser }, error: userError } = await supabase.auth.getUser()
    if (!userError && authUser) {
      user = authUser
    }
  }

  // 2. Try cookie-based session if Bearer fails (Dashboard context)
  if (!user) {
    try {
      supabase = await createServerClient()
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser()
      if (!userError && authUser) {
        user = authUser
      }
    } catch (e) {
      // Cookies might not be readable in some serverless request contexts
    }
  }

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Valid session token or cookies required." },
      { status: 401 }
    )
  }

  try {
    // Fetch profile details
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    // Get count of actually used traces
    const { count: actualTraceCount, error: countError } = await supabase
      .from("traces")
      .select("*", { count: "exact", head: true })

    const quota_traces_used = typeof actualTraceCount === "number" ? actualTraceCount : 0

    // Provide robust, production-grade fallbacks if profile row is not found or has issues
    if (profileError || !profile) {
      const isOwner = user.email === "allipuramsamanyu@gmail.com"
      profile = {
        id: user.id,
        email: user.email,
        role: isOwner ? "owner" : "free_user",
        plan: isOwner ? "enterprise" : "free",
        quota_traces_limit: isOwner ? 999999 : 25,
        quota_traces_used,
        created_at: user.created_at || new Date().toISOString(),
      }
    } else {
      // Inject live trace count dynamically
      profile.quota_traces_used = quota_traces_used
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      profile: {
        role: profile.role,
        plan: profile.plan,
        quota_traces_limit: profile.quota_traces_limit,
        quota_traces_used: profile.quota_traces_used,
        quota_remaining: Math.max(0, profile.quota_traces_limit - profile.quota_traces_used),
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to retrieve profile metadata" },
      { status: 500 }
    )
  }
}
