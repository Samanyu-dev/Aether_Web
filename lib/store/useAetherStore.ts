import { create } from "zustand"
import { supabase, isSupabaseConfigured, type Trace } from "../supabase"

// Client-side cookie helper for local-first middleware coordination
const setSessionCookie = (active: boolean) => {
  if (typeof document !== "undefined") {
    if (active) {
      document.cookie = "aether_session_active=true; path=/; max-age=31536000; SameSite=Lax"
    } else {
      document.cookie = "aether_session_active=; path=/; max-age=0; SameSite=Lax"
    }
  }
}

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
  signOut: () => Promise<void>
  clearError: () => void

  // Trace actions
  fetchTraces: () => Promise<void>
  uploadTrace: (title: string, description: string, nodes: any[], edges: any[], durationMs?: number) => Promise<Trace | null>
  deleteTrace: (id: string) => Promise<boolean>
  setActiveReplayTrace: (trace: Trace | null) => void
  getPublicTrace: (id: string) => Promise<Trace | null>
}

export const useAetherStore = create<AetherState>((set, get) => {
  // Set up auth state change listener in the background on the client side
  if (typeof window !== "undefined") {
    supabase.auth.onAuthStateChange((event: string, session: any) => {
      const hasSession = !!session
      setSessionCookie(hasSession)
      set({ 
        session, 
        user: session?.user || null,
        isCloudSyncEnabled: isSupabaseConfigured
      })
      if (session) {
        get().fetchTraces()
      } else {
        set({ traces: [] })
      }
    })
  }

  return {
    user: null,
    session: null,
    isLoading: true,
    isSyncing: false,
    traces: [],
    activeReplayTrace: null,
    error: null,
    isCloudSyncEnabled: isSupabaseConfigured,

    clearError: () => set({ error: null }),

    checkSession: async () => {
      set({ isLoading: true, error: null })
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        const hasSession = !!session
        setSessionCookie(hasSession)
        set({ 
          session, 
          user: session?.user || null, 
          isLoading: false,
          isCloudSyncEnabled: isSupabaseConfigured
        })
        if (session) {
          await get().fetchTraces()
        }
      } catch (err: any) {
        set({ error: err.message, isLoading: false })
      }
    },

    signUp: async (email, password) => {
      set({ isLoading: true, error: null })
      try {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        
        // Mock client auto-signs in, but real client might require email verification depending on supabase settings.
        // We set session based on what was returned.
        if (data.session) {
          setSessionCookie(true)
          set({ 
            session: data.session, 
            user: data.session.user, 
            isLoading: false 
          })
          await get().fetchTraces()
          return true
        }
        
        set({ isLoading: false })
        return true
      } catch (err: any) {
        set({ error: err.message, isLoading: false })
        return false
      }
    },

    signIn: async (email, password) => {
      set({ isLoading: true, error: null })
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        
        const hasSession = !!data.session
        setSessionCookie(hasSession)
        set({ 
          session: data.session, 
          user: data.session?.user || null, 
          isLoading: false 
        })
        if (data.session) {
          await get().fetchTraces()
        }
        return true
      } catch (err: any) {
        set({ error: err.message, isLoading: false })
        return false
      }
    },

    signOut: async () => {
      set({ isLoading: true, error: null })
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setSessionCookie(false)
        set({ 
          session: null, 
          user: null, 
          traces: [], 
          activeReplayTrace: null, 
          isLoading: false 
        })
      } catch (err: any) {
        set({ error: err.message, isLoading: false })
      }
    },

    fetchTraces: async () => {
      const user = get().user
      set({ isSyncing: true, error: null })
      try {
        let query = supabase.from("traces").select("*")
        
        if (user) {
          query = query.eq("user_id", user.id)
        } else {
          // If not logged in, only fetch public traces
          query = query.eq("is_public", true)
        }
        
        const { data, error } = await query.order("created_at", { ascending: false })
        if (error) throw error
        
        set({ traces: data || [], isSyncing: false })
      } catch (err: any) {
        set({ error: err.message, isSyncing: false })
      }
    },

    uploadTrace: async (title, description, nodes, edges, durationMs = 0) => {
      const user = get().user
      set({ isSyncing: true, error: null })
      try {
        const confidenceScores = nodes
          .map(n => n.data?.confidence || (n.type === "hallucination" ? 0.3 : 1.0))
          .filter(c => typeof c === "number")
        
        const maxConfidence = confidenceScores.length > 0 
          ? Math.min(...confidenceScores) // Let's treat the lowest confidence score as our bottleneck (observability metric)
          : 1.0

        const newTraceData = {
          user_id: user?.id || null,
          title,
          description,
          nodes,
          edges,
          event_count: nodes.length,
          max_confidence: maxConfidence,
          is_public: !user, // Traces created when logged out are public simulation traces
          duration_ms: durationMs
        }

        const { data, error } = await supabase.from("traces").insert(newTraceData).select()
        if (error) throw error
        
        const savedTrace = data?.[0] || null
        if (savedTrace) {
          set(state => ({
            traces: [savedTrace, ...state.traces],
            isSyncing: false
          }))
          return savedTrace
        }
        set({ isSyncing: false })
        return null
      } catch (err: any) {
        set({ error: err.message, isSyncing: false })
        return null
      }
    },

    deleteTrace: async (id) => {
      set({ isSyncing: true, error: null })
      try {
        const { error } = await supabase.from("traces").delete().eq("id", id)
        if (error) throw error
        
        set(state => ({
          traces: state.traces.filter(t => t.id !== id),
          activeReplayTrace: state.activeReplayTrace?.id === id ? null : state.activeReplayTrace,
          isSyncing: false
        }))
        return true
      } catch (err: any) {
        set({ error: err.message, isSyncing: false })
        return false
      }
    },

    setActiveReplayTrace: (trace) => {
      set({ activeReplayTrace: trace })
    },

    getPublicTrace: async (id) => {
      set({ isLoading: true, error: null })
      try {
        const { data, error } = await supabase
          .from("traces")
          .select("*")
          .eq("id", id)
          .single()
        
        set({ isLoading: false })
        if (error) throw error
        return data as Trace
      } catch (err: any) {
        set({ error: err.message, isLoading: false })
        return null
      }
    }
  }
})
