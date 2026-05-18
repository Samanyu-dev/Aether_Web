"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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
import { motion, AnimatePresence } from "framer-motion"
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
          ? "bg-emerald-500/20 border-emerald-500 scale-105" 
          : data.completed
          ? "bg-emerald-500/10 border-emerald-500/50"
          : "bg-card/60 border-border/30"
      }`}
      style={data.active ? { boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)" } : {}}
    >
      <div className="flex items-center gap-3">
        <svg className={`w-4 h-4 transition-colors ${data.active || data.completed ? "text-emerald-400" : "text-muted-foreground/50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    position: { x: 50, y: 180 },
    data: { label: "1. User Input", description: "Parsing task: 'Prune DevOps logs safely'", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "2",
    type: "thought",
    position: { x: 230, y: 80 },
    data: { label: "2. Plan Strategy", description: "Formulating log sweeping paths", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "3",
    type: "tool",
    position: { x: 410, y: 180 },
    data: { label: "3. bash_run(find)", description: "Scanning folders under /var/log", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "4",
    type: "thought",
    position: { x: 590, y: 80 },
    data: { label: "4. Memory Lookup", description: "Checking environment rules safety", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "5",
    type: "hallucination",
    position: { x: 770, y: 280 },
    data: { label: "5. Wildcard Risk", description: "Wildcard 'rm -rf /var/log/*' injected!", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "6",
    type: "tool",
    position: { x: 950, y: 180 },
    data: { label: "6. Sandbox Correct", description: "Bypassing malicious arguments", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "7",
    type: "output",
    position: { x: 1130, y: 180 },
    data: { label: "7. Safe Response", description: "Success: Sweep done. 0 escapes.", active: false, completed: false },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.3)", strokeWidth: 2 } },
  { id: "e2-3", source: "2", target: "3", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.3)", strokeWidth: 2 } },
  { id: "e3-4", source: "3", target: "4", animated: false, style: { stroke: "oklch(0.72 0.19 195 / 0.3)", strokeWidth: 2 } },
  { id: "e4-5", source: "4", target: "5", animated: false, style: { stroke: "oklch(0.577 0.245 27.325 / 0.3)", strokeWidth: 2 } },
  { id: "e5-6", source: "5", target: "6", animated: false, style: { stroke: "oklch(0.65 0.22 300 / 0.3)", strokeWidth: 2 } },
  { id: "e6-7", source: "6", target: "7", animated: false, style: { stroke: "oklch(0.75 0.18 180 / 0.3)", strokeWidth: 2 } },
]

export function LiveCognitionReplay() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const totalSteps = nodes.length

  // Keep a ref of nodes to query within dropped trace nodes safely
  const nodesRef = useRef<Node[]>([])
  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

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
        if (prev >= totalSteps - 1) {
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

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && (file.type === "application/json" || file.name.endsWith(".json"))) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          if (Array.isArray(data)) {
            // Reconstruct straight chain from steps
            const newNodes: Node[] = data.map((item, idx) => ({
              id: String(idx + 1),
              type: item.type || "thought",
              position: { x: 50 + idx * 180, y: 100 + (idx % 2) * 60 },
              data: { 
                label: item.label || item.title || `Node ${idx + 1}`, 
                description: item.description || item.subtext || "Custom traced event",
                active: false,
                completed: false
              },
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
            }))
            const newEdges: Edge[] = newNodes.slice(0, -1).map((node, idx) => ({
              id: `e${idx+1}-${idx+2}`,
              source: node.id,
              target: newNodes[idx+1].id,
              animated: false,
              style: { stroke: "oklch(0.72 0.19 195 / 0.4)", strokeWidth: 2 }
            }))
            setNodes(newNodes)
            setEdges(newEdges)
            setCurrentStep(0)
            setIsPlaying(true)
          } else if (data.nodes && Array.isArray(data.nodes)) {
            setNodes(data.nodes)
            setEdges(data.edges || [])
            setCurrentStep(0)
            setIsPlaying(true)
          }
        } catch (err) {
          alert("Invalid Aether Trace format or corrupt JSON!")
        }
      }
      reader.readAsText(file)
    }
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
          <span className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-semibold text-primary mb-4">
            Interactive Playback Sandbox
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Interactive <span className="text-gradient-cyan">Cognition Replay</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Watch AI reasoning unfold step by step. Drag & drop your local agent trace JSON file directly onto the canvas to replay your own custom runs!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel rounded-2xl p-6 max-w-5xl mx-auto relative overflow-hidden"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Controls */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50 relative z-10">
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
              <span className="text-xs font-mono text-muted-foreground">
                Node {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
              </span>
              <div className="w-48">
                <Slider
                  value={[currentStep]}
                  max={totalSteps - 1}
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

          {/* Graph Canvas */}
          <div className="h-[400px] rounded-xl overflow-hidden bg-background/30 relative">
            
            {/* Drag and Drop Hover Overlay */}
            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/90 backdrop-blur-md border-4 border-dashed border-primary/50 rounded-xl z-50 flex flex-col items-center justify-center gap-4 text-center pointer-events-none"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary animate-bounce">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">Drop Aether Trace JSON</h4>
                    <p className="text-xs text-muted-foreground mt-1">Reconstruct and replay your agent cognition instantly</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

          {/* Premiere Pro style AI Cognition Timeline Control Grid */}
          <div className="mt-8 pt-6 border-t border-border/30 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Cognition Timeline Tracks</span>
              <span className="text-[10px] font-mono text-primary/80">Premiere Replay Mode</span>
            </div>
            
            <div className="relative flex items-center justify-between gap-3 overflow-x-auto pb-4 pt-2 px-1 scrollbar-none">
              {/* Dynamic horizontal connector line */}
              <div className="absolute top-[21px] left-8 right-8 h-[2px] bg-border/40 z-0 pointer-events-none" />
              
              {nodes.map((node, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                const type = (node.type as string) || "thought"
                
                // Color codes
                let colorClass = "bg-primary"
                let ringClass = "border-primary/20"
                if (type === "tool") {
                  colorClass = "bg-accent"
                  ringClass = "border-accent/20"
                } else if (type === "hallucination") {
                  colorClass = "bg-destructive animate-pulse"
                  ringClass = "border-destructive/30"
                } else if (type === "output") {
                  colorClass = "bg-emerald-400"
                  ringClass = "border-emerald-500/20"
                }

                return (
                  <div key={node.id} className="flex-1 min-w-[120px] relative z-10 group flex flex-col items-center">
                    <button
                      onClick={() => {
                        setCurrentStep(index)
                        setIsPlaying(false)
                      }}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-background border-primary glow-cyan scale-110"
                          : isCompleted
                          ? "bg-background border-primary/50 text-primary/70"
                          : "bg-[#0b0b12] border-border/40 text-muted-foreground/40 hover:border-border/80"
                      }`}
                    >
                      {type === "thought" && (
                        <span className={`text-[10px] font-mono font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>COG</span>
                      )}
                      {type === "tool" && (
                        <svg className={`w-3.5 h-3.5 ${isActive ? "text-accent" : "text-muted-foreground"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        </svg>
                      )}
                      {type === "hallucination" && (
                        <svg className={`w-3.5 h-3.5 text-destructive ${isActive ? "animate-pulse" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                      {type === "output" && (
                        <svg className={`w-3.5 h-3.5 text-emerald-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Small Connector Node indicator dot */}
                    <div className={`w-2 h-2 rounded-full mt-2 transition-all duration-300 ${
                      isActive ? `${colorClass} scale-125 ring-4 ${ringClass}` : isCompleted ? "bg-primary/60" : "bg-muted-foreground/30"
                    }`} />

                    {/* Node Metadata label & Hover descriptions popup */}
                    <div className="mt-2 text-center w-full">
                      <div className={`text-[10px] font-mono font-bold truncate max-w-[110px] ${isActive ? "text-primary" : "text-muted-foreground/80"}`}>
                        {String((node.data as any)?.label || "")}
                      </div>
                    </div>

                    {/* Hover Preview Panel card */}
                    <div className="absolute bottom-14 hidden group-hover:flex flex-col bg-[#08080f] border border-border/80 rounded-xl p-3 text-[10px] font-mono text-muted-foreground w-48 shadow-2xl z-50 pointer-events-none transition-all duration-300">
                      <span className={`text-[8px] font-bold uppercase tracking-wider mb-1 ${
                        type === "thought" ? "text-primary" : type === "tool" ? "text-accent" : type === "hallucination" ? "text-destructive" : "text-emerald-400"
                      }`}>{type}</span>
                      <p className="text-white font-bold text-[10px] mb-1">{String((node.data as any)?.label || "")}</p>
                      <p className="text-muted-foreground leading-relaxed">{(node.data as any)?.description || ""}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
