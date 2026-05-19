import { create } from "zustand"
import { getSupabaseClient, isSupabaseConfigured, type Trace } from "../supabase"

interface AetherState {
  user: any | null
  session: any | null
  isLoading: boolean
  isSyncing: boolean
  traces: Trace[]
  activeReplayTrace: Trace | null
  error: string | null
  isCloudSyncEnabled: boolean

  // Auth actions
  checkSession: () => Promise<void>
  signUp: (email: string, password: string) => Promise<boolean>
  signIn: (email: string, password: string) => Promise<boolean>
  signInWithGoogle: (redirectTo?: string) => Promise<boolean>
  signOut: () => Promise<void>
  resetPassword: (email: string, redirectTo?: string) => Promise<boolean>
  clearError: () => void

  // Trace actions
  fetchTraces: () => Promise<void>
  uploadTrace: (title: string, description: string, nodes: any[], edges: any[], durationMs?: number) => Promise<Trace | null>
  deleteTrace: (id: string) => Promise<boolean>
  setActiveReplayTrace: (trace: Trace | null) => void
  getPublicTrace: (id: string) => Promise<Trace | null>
}

let authListenerBound = false

export const useAetherStore = create<AetherState>((set, get) => {
  const bindAuthListener = () => {
    if (authListenerBound || !isSupabaseConfigured || typeof window === "undefined") return

    const supabase = getSupabaseClient()
    authListenerBound = true

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user || null,
        isCloudSyncEnabled: true,
      })

      if (session?.user) {
        get().fetchTraces()
      } else {
        set({ traces: [], activeReplayTrace: null })
      }
    })
  }

  return {
    user: null,
    session: null,
    isLoading: false,
    isSyncing: false,
    traces: [],
    activeReplayTrace: null,
    error: null,
    isCloudSyncEnabled: isSupabaseConfigured,

    clearError: () => set({ error: null }),

    checkSession: async () => {
      set({ isLoading: true, error: null })

      if (!isSupabaseConfigured) {
        set({
          isLoading: false,
          isCloudSyncEnabled: false,
          error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        })
        return
      }

      try {
        bindAuthListener()
        const supabase = getSupabaseClient()
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error

        set({
          session,
          user: session?.user || null,
          isLoading: false,
          isCloudSyncEnabled: true,
        })

        if (session?.user) {
          await get().fetchTraces()
        }
      } catch (err: any) {
        set({ error: err.message || "Unable to check session", isLoading: false })
      }
    },

    signUp: async (email, password) => {
      set({ isLoading: true, error: null })

      if (!isSupabaseConfigured) {
        set({
          isLoading: false,
          error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        })
        return false
      }

      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        set({
          session: data.session ?? null,
          user: data.user ?? null,
          isLoading: false,
        })

        if (data.session?.user) {
          await get().fetchTraces()
        }

        return true
      } catch (err: any) {
        set({ error: err.message || "Sign-up failed", isLoading: false })
        return false
      }
    },

    signIn: async (email, password) => {
      set({ isLoading: true, error: null })

      if (!isSupabaseConfigured) {
        set({
          isLoading: false,
          error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        })
        return false
      }

      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        set({
          session: data.session,
          user: data.user,
          isLoading: false,
        })

        if (data.session?.user) {
          await get().fetchTraces()
        }

        return true
      } catch (err: any) {
        set({ error: err.message || "Sign-in failed", isLoading: false })
        return false
      }
    },

    signInWithGoogle: async (redirectTo) => {
      set({ isLoading: true, error: null })

      if (!isSupabaseConfigured) {
        set({
          isLoading: false,
          error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        })
        return false
      }

      try {
        const supabase = getSupabaseClient()
        const callbackUrl = `${window.location.origin}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ""}`

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: callbackUrl },
        })

        if (error) throw error

        set({ isLoading: false })
        return true
      } catch (err: any) {
        set({ error: err.message || "Google sign-in failed", isLoading: false })
        return false
      }
    },

    signOut: async () => {
      set({ isLoading: true, error: null })

      if (!isSupabaseConfigured) {
        set({
          session: null,
          user: null,
          traces: [],
          activeReplayTrace: null,
          isLoading: false,
          isCloudSyncEnabled: false,
        })
        return
      }

      try {
        const supabase = getSupabaseClient()
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        set({
          session: null,
          user: null,
          traces: [],
          activeReplayTrace: null,
          isLoading: false,
        })
      } catch (err: any) {
        set({ error: err.message || "Sign-out failed", isLoading: false })
      }
    },

    resetPassword: async (email, redirectTo) => {
      set({ isLoading: true, error: null })

      if (!isSupabaseConfigured) {
        set({
          isLoading: false,
          error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        })
        return false
      }

      try {
        const supabase = getSupabaseClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback?type=recovery`,
        })

        if (error) throw error

        set({ isLoading: false })
        return true
      } catch (err: any) {
        set({ error: err.message || "Password reset failed", isLoading: false })
        return false
      }
    },

    fetchTraces: async () => {
      if (get().isSyncing || !isSupabaseConfigured) return

      const user = get().user
      set({ isSyncing: true, error: null })

      try {
        const supabase = getSupabaseClient()
        let query = supabase.from("traces").select("*")

        if (user?.id) {
          query = query.eq("user_id", user.id)
        } else {
          query = query.eq("is_public", true)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) throw error

        set({ traces: data || [], isSyncing: false })
      } catch (err: any) {
        set({ error: err.message || "Failed to fetch traces", isSyncing: false })
      }
    },

    uploadTrace: async (title, description, nodes, edges, durationMs = 0) => {
      if (!isSupabaseConfigured) {
        set({ error: "Supabase is not configured." })
        return null
      }

      const user = get().user
      set({ isSyncing: true, error: null })

      try {
        const supabase = getSupabaseClient()
        const confidenceScores = nodes
          .map((n: any) => n.data?.confidence || (n.type === "hallucination" ? 0.3 : 1.0))
          .filter((c: any) => typeof c === "number")

        const maxConfidence = confidenceScores.length > 0 ? Math.min(...confidenceScores) : 1.0

        const payload = {
          user_id: user?.id || null,
          title,
          description,
          nodes,
          edges,
          event_count: nodes.length,
          max_confidence: maxConfidence,
          is_public: !user,
          duration_ms: durationMs,
        }

        const { data, error } = await supabase.from("traces").insert(payload).select().single()
        if (error) throw error

        set((state) => ({
          traces: [data as Trace, ...state.traces],
          isSyncing: false,
        }))

        return data as Trace
      } catch (err: any) {
        set({ error: err.message || "Failed to upload trace", isSyncing: false })
        return null
      }
    },

    deleteTrace: async (id) => {
      if (!isSupabaseConfigured) {
        set({ error: "Supabase is not configured." })
        return false
      }

      set({ isSyncing: true, error: null })

      try {
        const supabase = getSupabaseClient()
        const { error } = await supabase.from("traces").delete().eq("id", id)
        if (error) throw error

        set((state) => ({
          traces: state.traces.filter((trace) => trace.id !== id),
          activeReplayTrace: state.activeReplayTrace?.id === id ? null : state.activeReplayTrace,
          isSyncing: false,
        }))

        return true
      } catch (err: any) {
        set({ error: err.message || "Failed to delete trace", isSyncing: false })
        return false
      }
    },

    setActiveReplayTrace: (trace) => set({ activeReplayTrace: trace }),

    getPublicTrace: async (id) => {
      set({ isLoading: true, error: null })

      if (!isSupabaseConfigured) {
        set({ isLoading: false, error: "Supabase is not configured." })
        return null
      }

      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("traces")
          .select("*")
          .eq("id", id)
          .single()

        if (error) throw error

        set({ isLoading: false })
        return data as Trace
      } catch (err: any) {
        set({ error: err.message || "Trace not found", isLoading: false })
        return null
      }
    },
  }
})
