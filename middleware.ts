import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check for real Supabase session cookies or our local first simulated session cookie
  const hasSupabaseCookie = request.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") || c.name.includes("supabase")
  )
  const hasSimulatedCookie = request.cookies.has("aether_session_active")

  const isAuthenticated = hasSupabaseCookie || hasSimulatedCookie

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard")
  const isAuthRoute = request.nextUrl.pathname === "/auth"

  if (isDashboardRoute && !isAuthenticated) {
    // Redirect unauthenticated requests to the authentication page
    const redirectUrl = new URL("/auth", request.url)
    // Save original path as a redirect parameter
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && isAuthenticated) {
    // Redirect authenticated users trying to access auth page directly to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
}
