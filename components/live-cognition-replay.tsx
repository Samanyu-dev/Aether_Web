"use client"

import { useState, useCallback, useEffect } from "react"
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  type Node,
  type Edge,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

// Node components
function ReplayThoughtNode({ data }: { data: { label: string; description: string; active?: boolean; completed?: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-5 py-4 rounded-xl border-2 transition-all duration-500 min-w-[180px] ${
        data.active 
          ? "bg-primary/20 border-primary glow-cyan scale-105" 
          : data.completed
          ? "bg-primary/10 border-primary/50"
          : "bg-card/60 border-border/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full transition-colors ${
          data.active ? "bg-primary animate-pulse" : data.completed ? "bg-primary/70" : "bg-muted-foreground/30"
        }`} />
        <span className="text-sm font-semibold text-foreground">{data.label}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2 pl-6">{data.description}</p>
    </motion.div>
  )
}

function ReplayToolNode({ data }: { data: { label: string; description: string; active?: boolean; completed?: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-5 py-4 rounded-xl border-2 transition-all duration-500 min-w-[180px] ${
        data.active 
          ? "bg-accent/20 border-accent glow-purple scale-105" 
          : data.completed
          ? "bg-accent/10 border-accent/50"
          : "bg-card/60 border-border/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <svg className={`w-4 h-4 transition-colors ${data.active || data.completed ? "text-accent" : "text-muted-foreground/50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-semibold text-foreground">{data.label}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2 pl-7">{data.description}</p>
    </motion.div>
  )
}

function ReplayHallucinationNode({ data }: { data: { label: string; description: string; active?: boolean; completed?: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-5 py-4 rounded-xl border-2 transition-all duration-500 min-w-[180px] ${
        data.active 
          ? "bg-destructive/20 border-destructive scale-105" 
          : data.completed
          ? "bg-destructive/10 border-destructive/50"
          : "bg-card/60 border-border/30"
      }`}
      style={data.active ? { boxShadow: "0 0 30px oklch(0.577 0.245 27.325 / 0.3)" } : {}}
    >
      <div className="flex items-center gap-3">
        <svg className={`w-4 h-4 transition-colors ${data.active ? "text-destructive animate-pulse" : data.completed ? "text-destructive/70" : "text-muted-foreground/50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-sm font-semibold text-foreground">{data.label}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2 pl-7">{data.description}</p>
    </motion.div>
  )
}

function ReplayOutputNode({ data }: { data: { label: string; description: string; active?: boolean; completed?: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-5 py-4 rounded-xl border-2 transition-all duration-500 min-w-[180px] ${
        data.active 
          ? "bg-chart-4/20 border-chart-4 scale-105" 
          : data.completed
          ? "bg-chart-4/10 border-chart-4/50"
          : "bg-card/60 border-border/30"
      }`}
      style={data.active ? { boxShadow: "0 0 30px oklch(0.75 0.18 180 / 0.3)" } : {}}
    >
      <div className="flex items-center gap-3">
        <svg className={`w-4 h-4 transition-colors ${data.active || data.completed ? "text-chart-4" : "text-muted-foreground/50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-semibold text-foreground">{data.label}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2 pl-7">{data.description}</p>
    </motion.div>
  )
}

const nodeTypes = {
  thought: ReplayThoughtNode,
  tool: ReplayToolNode,
  hallucination: ReplayHallucinationNode,
  output: ReplayOutputNode,
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "thought",
    position: { x: 50, y: 100 },
    data: { label: "Parse Input", description: "Tokenizing user request", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "2",
    type: "thought",
    position: { x: 300, y: 30 },
    data: { label: "Plan Strategy", description: "Determining approach", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "3",
    type: "tool",
    position: { x: 300, y: 170 },
    data: { label: "web_search()", description: "Fetching external data", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "4",
    type: "thought",
    position: { x: 550, y: 30 },
    data: { label: "Analyze Results", description: "Processing search data", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "5",
    type: "hallucination",
    position: { x: 550, y: 170 },
    data: { label: "Uncertainty Zone", description: "Low confidence detected", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "6",
    type: "output",
    position: { x: 800, y: 100 },
    data: { label: "Generate Output", description: "Composing final response", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.4)", strokeWidth: 2 } },
  { id: "e1-3", source: "1", target: "3", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.4)", strokeWidth: 2 } },
  { id: "e2-4", source: "2", target: "4", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.4)", strokeWidth: 2 } },
  { id: "e3-5", source: "3", target: "5", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.4)", strokeWidth: 2 } },
  { id: "e4-6", source: "4", target: "6", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.4)", strokeWidth: 2 } },
  { id: "e5-6", source: "5", target: "6", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.4)", strokeWidth: 2 } },
]

export function LiveCognitionReplay() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = nodes.length

  const updateGraph = useCallback((step: number) => {
    setNodes((nds) =>
      nds.map((node, index) => ({
        ...node,
        data: { 
          ...node.data, 
          active: index === step,
          completed: index < step
        },
      }))
    )
    
    setEdges((eds) =>
      eds.map((edge) => {
        const sourceIndex = initialNodes.findIndex((n) => n.id === edge.source)
        const targetIndex = initialNodes.findIndex((n) => n.id === edge.target)
        return {
          ...edge,
          animated: sourceIndex < step && targetIndex <= step,
          style: {
            ...edge.style,
            stroke: sourceIndex < step ? "oklch(0.72 0.19 195 / 0.8)" : "oklch(0.72 0.19 195 / 0.4)",
          },
        }
      })
    )
  }, [setNodes, setEdges])

  useEffect(() => {
    updateGraph(currentStep)
  }, [currentStep, updateGraph])

  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps) {
          return 0
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isPlaying, totalSteps])

  const handleRestart = () => {
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const handleJumpToEnd = () => {
    setCurrentStep(totalSteps)
    setIsPlaying(false)
  }

  return (
    <section className="py-24 relative" id="replay">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-primary mb-4">
            Interactive Demo
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-cyan">Live Cognition</span> Replay
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch AI reasoning unfold step by step. Pause, rewind, and explore every decision node.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel rounded-2xl p-6 max-w-5xl mx-auto"
        >
          {/* Controls */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="border-border/50 hover:border-primary/50"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleJumpToEnd}
                className="border-border/50 hover:border-primary/50"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Step {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
              </span>
              <div className="w-48">
                <Slider
                  value={[currentStep]}
                  max={totalSteps}
                  step={1}
                  onValueChange={([value]) => {
                    setCurrentStep(value)
                    setIsPlaying(false)
                  }}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Graph */}
          <div className="h-[400px] rounded-xl overflow-hidden bg-background/30">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              proOptions={{ hideAttribution: true }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
            >
              <Background color="oklch(0.72 0.19 195 / 0.08)" gap={25} size={1} />
            </ReactFlow>
          </div>

          {/* Timeline */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center">
              {initialNodes.map((node, index) => (
                <button
                  key={node.id}
                  onClick={() => {
                    setCurrentStep(index)
                    setIsPlaying(false)
                  }}
                  className={`flex-1 py-2 px-3 text-xs transition-all ${
                    index === currentStep
                      ? "text-primary font-medium"
                      : index < currentStep
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1 transition-colors ${
                    index === currentStep
                      ? "bg-primary"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted-foreground/30"
                  }`} />
                  {node.data.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
