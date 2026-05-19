import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

const supabaseUrlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKeyRaw = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabaseUrl = supabaseUrlRaw?.trim()
const supabaseAnonKey = supabaseAnonKeyRaw?.trim()

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let browserClient: SupabaseClient | null = null

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient()
  }

  return browserClient
}
