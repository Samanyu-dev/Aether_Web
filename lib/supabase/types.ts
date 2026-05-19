export interface Trace {
  id: string
  created_at: string
  user_id?: string | null
  title: string
  description?: string | null
  nodes: any[]
  edges: any[]
  event_count: number
  max_confidence?: number | null
  is_public: boolean
  duration_ms?: number | null
}

export interface UsageSnapshot {
  traces_synced: number
  events_processed: number
  storage_mb: number
}
