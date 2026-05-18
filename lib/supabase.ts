import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http"))

// Define typescript interfaces for the traces table
export interface Trace {
  id: string
  created_at: string
  user_id?: string
  title: string
  description?: string
  nodes: any[]
  edges: any[]
  event_count: number
  max_confidence?: number
  is_public: boolean
  duration_ms?: number
}

// ----------------------------------------------------
// LOCAL STORAGE SIMULATION CLIENT (FALLBACK & LOCAL-FIRST)
// ----------------------------------------------------
const SIMULATED_USERS_KEY = "aether_simulated_users"
const SIMULATED_SESSION_KEY = "aether_simulated_session"
const SIMULATED_TRACES_KEY = "aether_simulated_traces"

const getSimulatedUsers = () => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(SIMULATED_USERS_KEY) || "[]")
}

const getSimulatedSession = () => {
  if (typeof window === "undefined") return null
  return JSON.parse(localStorage.getItem(SIMULATED_SESSION_KEY) || "null")
}

const getSimulatedTraces = (): Trace[] => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(SIMULATED_TRACES_KEY) || "[]")
}

const saveSimulatedTraces = (traces: Trace[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(SIMULATED_TRACES_KEY, JSON.stringify(traces))
}

const DEFAULT_DEMO_TRACES: Trace[] = [
  {
    id: "demo-web-search",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    title: "Product Search Reasoning Stream",
    description: "Multi-turn tool execution trace using web_search() for comparing GPU benchmarks.",
    nodes: [
      { id: "1", type: "thought", position: { x: 50, y: 100 }, data: { label: "Parse Input", description: "Tokenizing query: 'Compare RTX 4090 vs RX 7900 XTX'", active: false, completed: true } },
      { id: "2", type: "thought", position: { x: 280, y: 30 }, data: { label: "Plan Search Query", description: "Formulating queries: 'RTX 4090 specs', 'RX 7900 XTX specs'", active: false, completed: true } },
      { id: "3", type: "tool", position: { x: 280, y: 170 }, data: { label: "web_search()", description: "Querying benchmark tables and hardware databases", active: false, completed: true } },
      { id: "4", type: "thought", position: { x: 520, y: 100 }, data: { label: "Synthesize Results", description: "RTX 4090 has 24GB VRAM and DLSS 3.0. RX 7900 XTX has 24GB VRAM and is cheaper.", active: false, completed: true } },
      { id: "5", type: "output", position: { x: 750, y: 100 }, data: { label: "Final Synthesis", description: "Render detailed markdown table with performance charts", active: false, completed: true } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2 } },
      { id: "e1-3", source: "1", target: "3", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2 } },
      { id: "e2-4", source: "2", target: "4", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2 } },
      { id: "e3-4", source: "3", target: "4", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2 } },
      { id: "e4-5", source: "4", target: "5", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2 } }
    ],
    event_count: 5,
    max_confidence: 0.96,
    is_public: true,
    duration_ms: 1840
  },
  {
    id: "demo-hallucination",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    title: "RAG Hallucination Self-Correction",
    description: "Trace showing automatic detection and correction of hallucinated citations in medical query.",
    nodes: [
      { id: "1", type: "thought", position: { x: 50, y: 100 }, data: { label: "Retrieve Context", description: "Searching medical database for 'dosage recommendations'", active: false, completed: true } },
      { id: "2", type: "thought", position: { x: 280, y: 30 }, data: { label: "Formulate Advice", description: "Proposing dosage limits based on retrieved documents", active: false, completed: true } },
      { id: "3", type: "hallucination", position: { x: 280, y: 170 }, data: { label: "Citations Hallucination", description: "Uncertainty detected: citation 'Dr. Smith (2023)' not in context", active: false, completed: true } },
      { id: "4", type: "thought", position: { x: 520, y: 100 }, data: { label: "Auto-Correction", description: "Re-writing sentence to use valid papers only", active: false, completed: true } },
      { id: "5", type: "output", position: { x: 750, y: 100 }, data: { label: "Correct Response", description: "Approved medically verified advice without hallucinations", active: false, completed: true } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2 } },
      { id: "e1-3", source: "1", target: "3", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2 } },
      { id: "e2-4", source: "2", target: "4", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2 } },
      { id: "e3-4", source: "3", target: "4", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2 } },
      { id: "e4-5", source: "4", target: "5", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2 } }
    ],
    event_count: 5,
    max_confidence: 0.42,
    is_public: true,
    duration_ms: 2450
  }
]

// Initialize default traces if local storage is empty
if (typeof window !== "undefined" && getSimulatedTraces().length === 0) {
  saveSimulatedTraces(DEFAULT_DEMO_TRACES)
}

// ----------------------------------------------------
// MOCK SUPABASE CLIENT IMPLEMENTATION
// ----------------------------------------------------
const mockSupabase: any = {
  auth: {
    signUp: async ({ email, password }: any) => {
      const users = getSimulatedUsers()
      if (users.find((u: any) => u.email === email)) {
        return { data: { user: null }, error: { message: "User already exists." } }
      }
      const newUser = { id: Math.random().toString(36).substring(2, 11), email, created_at: new Date().toISOString() }
      users.push({ ...newUser, password })
      localStorage.setItem(SIMULATED_USERS_KEY, JSON.stringify(users))

      const session = { user: newUser, access_token: "mock-token-" + Math.random(), expires_at: Date.now() + 3600000 }
      localStorage.setItem(SIMULATED_SESSION_KEY, JSON.stringify(session))

      // Trigger auth state change
      if (mockSupabase.auth._authCallback) {
        mockSupabase.auth._authCallback("SIGNED_IN", session)
      }

      return { data: { user: newUser, session }, error: null }
    },
    signInWithPassword: async ({ email, password }: any) => {
      const users = getSimulatedUsers()
      const user = users.find((u: any) => u.email === email && u.password === password)
      if (!user) {
        return { data: { user: null, session: null }, error: { message: "Invalid email or password." } }
      }
      const safeUser = { id: user.id, email: user.email, created_at: user.created_at }
      const session = { user: safeUser, access_token: "mock-token-" + Math.random(), expires_at: Date.now() + 3600000 }
      localStorage.setItem(SIMULATED_SESSION_KEY, JSON.stringify(session))

      if (mockSupabase.auth._authCallback) {
        mockSupabase.auth._authCallback("SIGNED_IN", session)
      }

      return { data: { user: safeUser, session }, error: null }
    },
    signOut: async () => {
      localStorage.removeItem(SIMULATED_SESSION_KEY)
      if (mockSupabase.auth._authCallback) {
        mockSupabase.auth._authCallback("SIGNED_OUT", null)
      }
      return { error: null }
    },
    getSession: async () => {
      const session = getSimulatedSession()
      return { data: { session }, error: null }
    },
    onAuthStateChange: (callback: any) => {
      mockSupabase.auth._authCallback = callback
      const session = getSimulatedSession()
      if (session) {
        callback("SIGNED_IN", session)
      } else {
        callback("SIGNED_OUT", null)
      }
      return { data: { subscription: { unsubscribe: () => { mockSupabase.auth._authCallback = null } } } }
    },
    _authCallback: null as any
  },

  from: (table: string) => {
    return {
      select: (columns?: string) => {
        const session = getSimulatedSession()
        const allTraces = getSimulatedTraces()

        // Chainable filter state
        let data = [...allTraces]
        let currentError: any = null

        const chain = {
          eq: (field: string, value: any) => {
            if (field === "user_id") {
              data = data.filter(t => t.user_id === value)
            } else if (field === "is_public") {
              data = data.filter(t => t.is_public === value)
            } else if (field === "id") {
              data = data.filter(t => t.id === value)
            }
            return chain
          },
          order: (field: string, { ascending = true } = {}) => {
            data.sort((a: any, b: any) => {
              const valA = a[field]
              const valB = b[field]
              if (valA < valB) return ascending ? -1 : 1
              if (valA > valB) return ascending ? 1 : -1
              return 0
            })
            return chain
          },
          single: async () => {
            if (data.length === 0) {
              return { data: null, error: { message: "No row found" } }
            }
            return { data: data[0], error: null }
          },
          then: async (onfulfilled: any) => {
            return onfulfilled({ data, error: currentError })
          }
        }

        return chain as any
      },

      insert: (record: any) => {
        const records = Array.isArray(record) ? record : [record]
        const allTraces = getSimulatedTraces()
        const session = getSimulatedSession()

        const newRecords = records.map(r => {
          const newTrace: Trace = {
            id: r.id || "trace-" + Math.random().toString(36).substring(2, 11),
            created_at: new Date().toISOString(),
            user_id: r.user_id || session?.user?.id || "anonymous",
            title: r.title || "Untitled Trace",
            description: r.description || "",
            nodes: r.nodes || [],
            edges: r.edges || [],
            event_count: r.event_count || r.nodes?.length || 0,
            max_confidence: r.max_confidence !== undefined ? r.max_confidence : 1.0,
            is_public: r.is_public || false,
            duration_ms: r.duration_ms || 0
          }
          allTraces.push(newTrace)
          return newTrace
        })

        saveSimulatedTraces(allTraces)

        return {
          select: () => ({
            single: async () => ({ data: newRecords[0], error: null }),
            then: async (onfulfilled: any) => onfulfilled({ data: newRecords, error: null })
          }),
          then: async (onfulfilled: any) => onfulfilled({ data: newRecords, error: null })
        } as any
      },

      delete: () => {
        let fieldToDelete: string = ""
        let valToDelete: any = null

        const chain = {
          eq: (field: string, value: any) => {
            fieldToDelete = field
            valToDelete = value
            return chain
          },
          then: async (onfulfilled: any) => {
            const allTraces = getSimulatedTraces()
            let filtered: Trace[] = []
            let deleted: Trace[] = []

            if (fieldToDelete === "id") {
              filtered = allTraces.filter(t => t.id !== valToDelete)
              deleted = allTraces.filter(t => t.id === valToDelete)
            } else if (fieldToDelete === "user_id") {
              filtered = allTraces.filter(t => t.user_id !== valToDelete)
              deleted = allTraces.filter(t => t.user_id === valToDelete)
            } else {
              filtered = [...allTraces]
            }

            saveSimulatedTraces(filtered)
            return onfulfilled({ data: deleted, error: null })
          }
        }
        return chain as any
      },

      update: (updates: any) => {
        let fieldToMatch: string = ""
        let valToMatch: any = null

        const chain = {
          eq: (field: string, value: any) => {
            fieldToMatch = field
            valToMatch = value
            return chain
          },
          then: async (onfulfilled: any) => {
            const allTraces = getSimulatedTraces()
            let updated: Trace[] = []

            const newTraces = allTraces.map(t => {
              if ((fieldToMatch === "id" && t.id === valToMatch)) {
                const item = { ...t, ...updates }
                updated.push(item)
                return item
              }
              return t
            })

            saveSimulatedTraces(newTraces)
            return onfulfilled({ data: updated, error: null })
          }
        }
        return chain as any
      }
    }
  }
}

// ----------------------------------------------------
// EXPORTING CLIENT
// ----------------------------------------------------
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (mockSupabase as any)
