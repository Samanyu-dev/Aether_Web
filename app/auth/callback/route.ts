import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const supabaseUrlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKeyRaw = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabaseUrl = supabaseUrlRaw?.trim()
const supabaseAnonKey = supabaseAnonKeyRaw?.trim()

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const nextRaw = requestUrl.searchParams.get("next") || "/dashboard"
  const next = nextRaw.startsWith("/") ? nextRaw : "/dashboard"

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/login?error=supabase_not_configured", request.url))
  }

  const response = NextResponse.redirect(new URL(next, request.url))

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_auth_code", request.url))
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL("/login?error=oauth_exchange_failed", request.url))
  }

  return response
}
