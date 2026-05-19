import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKeyRaw = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabaseUrl = supabaseUrlRaw?.trim()
const supabaseAnonKey = supabaseAnonKeyRaw?.trim()

export async function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from Server Component where writing cookies is not allowed.
        }
      },
    },
  })
}
