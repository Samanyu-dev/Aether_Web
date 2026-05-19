"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Handle,
  type Node,
  type Edge,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, SkipForward, Cpu, Compass, HardDrive, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { type Trace } from "@/lib/supabase"

// Custom Node Components
function ThoughtNode({ data }: any) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} isConnectable={false} className="!opacity-0 !pointer-events-none" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`px-4 py-3 rounded-lg border text-left transition-all duration-300 min-w-[170px] ${
          data.active 
            ? "bg-primary/20 border-primary glow-cyan scale-105" 
            : data.completed
            ? "bg-primary/5 border-primary/40 opacity-80"
            : "bg-card/40 border-border/20 opacity-50"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${data.active ? "bg-primary animate-pulse" : data.completed ? "bg-primary/75" : "bg-muted-foreground/30"}`} />
          <span className="text-xs font-semibold text-foreground font-mono truncate max-w-[130px]">{data.label}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 pl-4 line-clamp-2">{data.description}</p>
      </motion.div>
      <Handle type="source" position={Position.Right} isConnectable={false} className="!opacity-0 !pointer-events-none" />
    </div>
  )
}

function ToolNode({ data }: any) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} isConnectable={false} className="!opacity-0 !pointer-events-none" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`px-4 py-3 rounded-lg border text-left transition-all duration-300 min-w-[170px] ${
          data.active 
            ? "bg-accent/20 border-accent glow-purple scale-105" 
            : data.completed
            ? "bg-accent/5 border-accent/40 opacity-80"
            : "bg-card/40 border-border/20 opacity-50"
        }`}
      >
        <div className="flex items-center gap-2">
          <Cpu className={`w-3.5 h-3.5 ${data.active ? "text-accent animate-spin" : data.completed ? "text-accent/80" : "text-muted-foreground/30"}`} />
          <span className="text-xs font-semibold text-foreground font-mono truncate max-w-[130px]">{data.label}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 pl-5 line-clamp-2">{data.description}</p>
      </motion.div>
      <Handle type="source" position={Position.Right} isConnectable={false} className="!opacity-0 !pointer-events-none" />
    </div>
  )
}

function HallucinationNode({ data }: any) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} isConnectable={false} className="!opacity-0 !pointer-events-none" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`px-4 py-3 rounded-lg border text-left transition-all duration-300 min-w-[170px] ${
          data.active 
            ? "bg-destructive/20 border-destructive scale-105" 
            : data.completed
            ? "bg-destructive/5 border-destructive/40 opacity-80"
            : "bg-card/40 border-border/20 opacity-50"
        }`}
        style={data.active ? { boxShadow: "0 0 15px oklch(0.577 0.245 27.325 / 0.2)" } : {}}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${data.active ? "bg-destructive" : "bg-destructive/50"}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${data.active ? "bg-destructive" : "bg-destructive/60"}`} />
          </span>
          <span className="text-xs font-semibold text-foreground font-mono truncate max-w-[130px]">{data.label}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 pl-4 line-clamp-2">{data.description}</p>
      </motion.div>
      <Handle type="source" position={Position.Right} isConnectable={false} className="!opacity-0 !pointer-events-none" />
    </div>
  )
}

function OutputNode({ data }: any) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} isConnectable={false} className="!opacity-0 !pointer-events-none" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`px-4 py-3 rounded-lg border text-left transition-all duration-300 min-w-[170px] ${
          data.active 
            ? "bg-chart-4/20 border-chart-4 scale-105" 
            : data.completed
            ? "bg-chart-4/5 border-chart-4/40 opacity-80"
            : "bg-card/40 border-border/20 opacity-50"
        }`}
      >
        <div className="flex items-center gap-2">
          <Compass className={`w-3.5 h-3.5 ${data.active ? "text-chart-4 animate-bounce" : data.completed ? "text-chart-4/80" : "text-muted-foreground/30"}`} />
          <span className="text-xs font-semibold text-foreground font-mono truncate max-w-[130px]">{data.label}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 pl-5 line-clamp-2">{data.description}</p>
      </motion.div>
      <Handle type="source" position={Position.Right} isConnectable={false} className="!opacity-0 !pointer-events-none" />
    </div>
  )
}

const nodeTypes = {
  thought: ThoughtNode,
  tool: ToolNode,
  hallucination: HallucinationNode,
  safeOutput: OutputNode,
}

interface DashboardReplayProps {
  trace: Trace
}

export function DashboardReplay({ trace }: DashboardReplayProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [speed, setSpeed] = useState(1500) // ms interval

  // Keep a ref of nodes to prevent recreate loop of updateGraph
  const nodesRef = useRef<Node[]>([])
  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  // Re-generate nodes and edges if the trace changes
  useEffect(() => {
    if (!trace) return

    // Ensure positions are valid, calculate clean tree layout if positions are missing
    const generatedNodes = trace.nodes.map((n: any, idx: number) => ({
      ...n,
      type: n.type === "output" ? "safeOutput" : n.type,
      position: n.position || { x: 50 + idx * 220, y: 100 + (idx % 2) * 50 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        ...n.data,
        active: idx === 0,
        completed: false
      }
    }))

    const generatedEdges = trace.edges.length > 0
      ? trace.edges.map((e: any) => ({
          ...e,
          animated: false,
          style: { stroke: "oklch(0.72 0.19 195 / 0.2)", strokeWidth: 1.5 }
        }))
      : generatedNodes.slice(0, -1).map((n, idx) => ({
          id: `e${n.id}-${generatedNodes[idx+1].id}`,
          source: n.id,
          target: generatedNodes[idx+1].id,
          animated: false,
          style: { stroke: "oklch(0.72 0.19 195 / 0.2)", strokeWidth: 1.5 }
        }))

    setNodes(generatedNodes)
    setEdges(generatedEdges)
    setCurrentStep(0)
    setIsPlaying(true)
  }, [trace, setNodes, setEdges])

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
        const sourceIndex = nodesRef.current.findIndex((n) => n.id === edge.source)
        const targetIndex = nodesRef.current.findIndex((n) => n.id === edge.target)
        return {
          ...edge,
          animated: sourceIndex < step && targetIndex <= step,
          style: {
            ...edge.style,
            stroke: sourceIndex < step ? "oklch(0.72 0.19 195 / 0.7)" : "oklch(0.72 0.19 195 / 0.2)",
            strokeWidth: sourceIndex < step ? 2 : 1.5
          },
        }
      })
    )
  }, [setNodes, setEdges])

  useEffect(() => {
    if (nodes.length > 0) {
      updateGraph(currentStep)
    }
  }, [currentStep, nodes.length, updateGraph])

  // Interval player
  useEffect(() => {
    if (!isPlaying || totalSteps === 0) return
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          return 0
        }
        return prev + 1
      })
    }, speed)

    return () => clearInterval(interval)
  }, [isPlaying, totalSteps, speed])

  const handleRestart = () => {
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const handleJumpToEnd = () => {
    setCurrentStep(totalSteps - 1)
    setIsPlaying(false)
  }

  return (
    <div className="w-full flex flex-col h-[650px] bg-black/40 border border-border/40 rounded-2xl overflow-hidden backdrop-blur-md relative">
      
      {/* Top Header info */}
      <div className="bg-white/5 border-b border-border/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono border border-primary/30 text-primary bg-primary/5 uppercase tracking-widest font-bold">
              Cognition Stream
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              60fps Replay Engine
            </span>
          </div>
          <h3 className="text-sm font-bold text-foreground font-mono mt-1 truncate max-w-[280px] sm:max-w-md">
            {trace.title}
          </h3>
        </div>

        {/* Speed Adjustment tab */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground">Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-background/40 border border-border/30 rounded px-1.5 py-0.5 text-[10px] text-foreground font-mono outline-none"
            >
              <option value={2000}>0.5x</option>
              <option value={1500}>1.0x</option>
              <option value={800}>2.0x</option>
              <option value={400}>4.0x</option>
            </select>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
            Node {totalSteps > 0 ? currentStep + 1 : 0} / {totalSteps}
          </span>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1 bg-[#06060c]/20 relative min-h-[300px]">
        {nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
            nodesFocusable={false}
            selectNodesOnDrag={false}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={true}
            zoomOnScroll={false}
            zoomOnPinch={true}
            zoomOnDoubleClick={false}
          >
            <Background color="oklch(0.72 0.19 195 / 0.05)" gap={22} size={1} />
          </ReactFlow>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <Terminal className="w-8 h-8 text-muted-foreground/30 animate-pulse mb-2" />
            <p className="text-xs text-muted-foreground font-mono">No nodes available inside trace</p>
          </div>
        )}
      </div>

      {/* Control Bar bottom */}
      <div className="bg-white/5 border-t border-border/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 z-10">
        
        {/* Playback action buttons */}
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="border-primary/20 hover:border-primary hover:bg-primary/10 text-xs h-8 px-3"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            className="border-border/40 hover:border-primary/40 text-xs h-8 px-2.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleJumpToEnd}
            className="border-border/40 hover:border-primary/40 text-xs h-8 px-2.5"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 max-w-md flex items-center gap-3">
          <span className="text-[10px] font-mono text-muted-foreground shrink-0">STEP</span>
          <Slider
            value={[currentStep]}
            max={totalSteps > 0 ? totalSteps - 1 : 0}
            step={1}
            onValueChange={([value]) => {
              setCurrentStep(value)
              setIsPlaying(false)
            }}
            className="cursor-pointer flex-1"
          />
        </div>
      </div>
    </div>
  )
}
