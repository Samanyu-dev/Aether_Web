"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface StreamEvent {
  id: string
  type: "thought" | "tool" | "memory" | "output" | "hallucination"
  content: string
  timestamp: string
}

const sampleEvents: StreamEvent[] = [
  { id: "1", type: "thought", content: "Analyzing user query...", timestamp: "0.0s" },
  { id: "2", type: "thought", content: "Breaking down request", timestamp: "0.2s" },
  { id: "3", type: "tool", content: "web_search(\"AI observability\")", timestamp: "0.5s" },
  { id: "4", type: "memory", content: "Retrieving context", timestamp: "0.8s" },
  { id: "5", type: "thought", content: "Synthesizing results", timestamp: "1.2s" },
  { id: "6", type: "hallucination", content: "Low confidence region", timestamp: "1.5s" },
  { id: "7", type: "output", content: "Generating response", timestamp: "1.8s" },
]

const typeColors = {
  thought: "text-primary border-primary/50 bg-primary/10",
  tool: "text-accent border-accent/50 bg-accent/10",
  memory: "text-chart-3 border-chart-3/50 bg-chart-3/10",
  output: "text-chart-4 border-chart-4/50 bg-chart-4/10",
  hallucination: "text-destructive border-destructive/50 bg-destructive/10",
}

const typeIcons = {
  thought: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  tool: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
  ),
  memory: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7" />
    </svg>
  ),
  output: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  hallucination: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
}

export function CognitionStream() {
  const [visibleEvents, setVisibleEvents] = useState<StreamEvent[]>([])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < sampleEvents.length) {
        const eventCopy = {
          ...sampleEvents[index],
          id: `${sampleEvents[index].id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
        setVisibleEvents((prev) => [...prev, eventCopy])
        index++
      } else {
        // Reset and start over
        setVisibleEvents([])
        index = 0
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass-panel rounded-lg p-4 max-h-[300px] overflow-hidden">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Live Stream
        </span>
      </div>
      
      <div className="space-y-2 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {visibleEvents.slice(-5).map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-2 p-2 rounded border text-xs ${typeColors[event.type]}`}
            >
              <span className="mt-0.5">{typeIcons[event.type]}</span>
              <div className="flex-1 min-w-0">
                <span className="block truncate">{event.content}</span>
              </div>
              <span className="text-[10px] opacity-60 shrink-0">{event.timestamp}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
