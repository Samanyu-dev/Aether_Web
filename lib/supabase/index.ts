import { getSupabaseBrowserClient, isSupabaseConfigured } from "./client"

export type { Trace } from "./types"
export { isSupabaseConfigured }

export function getSupabaseClient() {
  return getSupabaseBrowserClient()
}
