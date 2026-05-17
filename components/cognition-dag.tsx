"use client"

import { useCallback, useEffect, useState } from "react"
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  type Node,
  type Edge,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { motion } from "framer-motion"

const nodeTypes = {
  thought: ThoughtNode,
  tool: ToolNode,
  memory: MemoryNode,
  output: OutputNode,
  hallucination: HallucinationNode,
}

function ThoughtNode({ data }: { data: { label: string; active?: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
        data.active 
          ? "bg-primary/20 border-primary glow-cyan-subtle" 
          : "bg-card/80 border-border/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${data.active ? "bg-primary animate-pulse" : "bg-muted-foreground/50"}`} />
        <span className="text-sm font-medium text-foreground">{data.label}</span>
      </div>
    </motion.div>
  )
}

function ToolNode({ data }: { data: { label: string; active?: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
        data.active 
          ? "bg-accent/20 border-accent glow-purple" 
          : "bg-card/80 border-border/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-medium text-foreground">{data.label}</span>
      </div>
    </motion.div>
  )
}

function MemoryNode({ data }: { data: { label: string; active?: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
        data.active 
          ? "bg-chart-3/20 border-chart-3" 
          : "bg-card/80 border-border/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-chart-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
        <span className="text-sm font-medium text-foreground">{data.label}</span>
      </div>
    </motion.div>
  )
}

function OutputNode({ data }: { data: { label: string; active?: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
        data.active 
          ? "bg-chart-4/20 border-chart-4" 
          : "bg-card/80 border-border/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-foreground">{data.label}</span>
      </div>
    </motion.div>
  )
}

function HallucinationNode({ data }: { data: { label: string; active?: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
        data.active 
          ? "bg-destructive/20 border-destructive animate-pulse" 
          : "bg-card/80 border-border/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-sm font-medium text-foreground">{data.label}</span>
      </div>
    </motion.div>
  )
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "thought",
    position: { x: 50, y: 50 },
    data: { label: "Analyzing request", active: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "2",
    type: "thought",
    position: { x: 250, y: 20 },
    data: { label: "Planning approach", active: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "3",
    type: "tool",
    position: { x: 250, y: 100 },
    data: { label: "web_search()", active: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "4",
    type: "memory",
    position: { x: 450, y: 20 },
    data: { label: "Context retrieval", active: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "5",
    type: "thought",
    position: { x: 450, y: 100 },
    data: { label: "Synthesizing", active: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "6",
    type: "hallucination",
    position: { x: 450, y: 180 },
    data: { label: "Uncertainty detected", active: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "7",
    type: "output",
    position: { x: 650, y: 80 },
    data: { label: "Final response", active: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: false },
  { id: "e1-3", source: "1", target: "3", animated: false },
  { id: "e2-4", source: "2", target: "4", animated: false },
  { id: "e3-5", source: "3", target: "5", animated: false },
  { id: "e4-5", source: "4", target: "5", animated: false },
  { id: "e5-6", source: "5", target: "6", animated: false },
  { id: "e5-7", source: "5", target: "7", animated: false },
  { id: "e6-7", source: "6", target: "7", animated: false },
]

export function CognitionDAG() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [activeIndex, setActiveIndex] = useState(0)

  // Animate through nodes sequentially
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (nodes.length + 1))
    }, 1500)
    return () => clearInterval(interval)
  }, [nodes.length])

  // Update node active states and edge animations
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node, index) => ({
        ...node,
        data: { ...node.data, active: index < activeIndex },
      }))
    )
    
    setEdges((eds) =>
      eds.map((edge) => {
        const sourceIndex = nodes.findIndex((n) => n.id === edge.source)
        return {
          ...edge,
          animated: sourceIndex < activeIndex && sourceIndex >= activeIndex - 1,
        }
      })
    )
  }, [activeIndex, setNodes, setEdges, nodes])

  return (
    <div className="h-[350px] w-full rounded-lg overflow-hidden bg-background/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
      >
        <Background color="oklch(0.72 0.19 195 / 0.1)" gap={20} size={1} />
      </ReactFlow>
    </div>
  )
}
