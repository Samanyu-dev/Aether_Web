"use client"

import { useState } from "react"
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  type Node,
  type Edge,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

// Custom Sleek Node definition matching the user's screenshot exactly
interface SleekNodeData {
  label: string
  count?: number
  statusColor?: string
  active?: boolean
  borderStyle?: "solid" | "dashed"
  description: string
}

function SleekCustomNode({ data }: { data: SleekNodeData }) {
  const [hovered, setHovered] = useState(false)
  const dotColor = data.statusColor || "bg-primary"
  const isDashed = data.borderStyle === "dashed"

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Target input handle (Left side) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        isConnectable={false} 
        className="!opacity-0 !pointer-events-none" 
      />

      {/* Floating Observability Explanation Tooltip - Floating strictly above to prevent overlaps */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-[120%] left-1/2 -translate-x-1/2 z-50 w-[240px] p-3 rounded-2xl border border-primary/30 bg-[#07070c]/98 text-[11px] leading-relaxed text-muted-foreground font-mono shadow-[0_12px_30px_rgba(0,0,0,0.85)] backdrop-blur-md pointer-events-none"
            style={{ borderLeftWidth: "3px", borderLeftColor: "oklch(0.72 0.19 195)" }}
          >
            <div className="font-extrabold text-foreground mb-1.5 flex items-center gap-2 border-b border-border/10 pb-1 text-[10.5px]">
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${data.active ? "animate-pulse" : ""}`} />
              {data.label}
            </div>
            <div className="text-foreground/90 font-mono text-[10px] leading-normal text-left">
              {data.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Node Card - Fixed 46px height, completely stable, zero layout overlaps */}
      <div 
        className={`px-4 py-3 rounded-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs font-mono transition-all duration-300 ${
          data.active 
            ? "bg-[#0b0c16]/95 border-primary/70 shadow-[0_0_20px_oklch(0.72_0.19_195_/_0.22)]" 
            : "bg-[#0a0a0f]/90 border-border/30 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.02)]"
        } ${isDashed ? "border-dashed border-[1.5px]" : "border-[1px]"} w-[230px] h-[46px]`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
          {/* Status Dot */}
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${data.active ? "animate-pulse" : "opacity-80"}`} />
          {/* Node Text */}
          <span className="font-bold text-foreground/95 truncate">{data.label}</span>
        </div>

        {/* Count Badge (e.g. 251, 1, 2) */}
        {data.count !== undefined && (
          <span className="px-2 py-0.5 rounded bg-[#161622] border border-border/40 text-[10px] font-bold text-muted-foreground shrink-0 group-hover:text-foreground transition-colors">
            {data.count}
          </span>
        )}
      </div>

      {/* Source output handle (Right side) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        isConnectable={false} 
        className="!opacity-0 !pointer-events-none" 
      />
    </div>
  )
}

const nodeTypes = {
  sleek: SleekCustomNode,
}

// Node layout modeling the screenshot: Root executing node on the left, branches stacked vertically on the right
const initialNodes: Node[] = [
  {
    id: "root",
    type: "sleek",
    position: { x: 40, y: 345 },
    data: { 
      label: "executeCheckout", 
      count: 251, 
      statusColor: "bg-primary", 
      active: true,
      description: "Root controller managing final purchase sequence orchestration."
    },
  },
  {
    id: "branch1",
    type: "sleek",
    position: { x: 460, y: 100 },
    data: { 
      label: "info", 
      count: 1, 
      statusColor: "bg-muted-foreground/60",
      description: "Logs trace lifecycle initiation metadata & parameters."
    },
  },
  {
    id: "branch2",
    type: "sleek",
    position: { x: 460, y: 170 },
    data: { 
      label: "generateIdempotencyKey", 
      statusColor: "bg-muted-foreground/60",
      description: "Computes request-scoped token to protect database consistency."
    },
  },
  {
    id: "branch3",
    type: "sleek",
    position: { x: 460, y: 240 },
    data: { 
      label: "getIdempotent", 
      statusColor: "bg-muted-foreground/60",
      description: "Queries regional lock cache for pre-existing checkout state."
    },
  },
  {
    id: "branch4",
    type: "sleek",
    position: { x: 460, y: 310 },
    data: { 
      label: "if(cached)", 
      count: 2, 
      statusColor: "bg-muted-foreground/60",
      description: "Validates lock status: serves cached block if hit, else proceeds."
    },
  },
  {
    id: "branch5",
    type: "sleek",
    position: { x: 460, y: 380 },
    data: { 
      label: "CircuitBreaker", 
      count: 1, 
      statusColor: "bg-muted-foreground/40",
      borderStyle: "dashed",
      description: "Monitors transaction provider connectivity thresholds."
    },
  },
  {
    id: "branch6",
    type: "sleek",
    position: { x: 460, y: 450 },
    data: { 
      label: "CircuitBreaker", 
      count: 1, 
      statusColor: "bg-muted-foreground/40",
      borderStyle: "dashed",
      description: "Shields internal webhook dispatchers from overload cascading."
    },
  },
  {
    id: "branch7",
    type: "sleek",
    position: { x: 460, y: 520 },
    data: { 
      label: "try", 
      count: 202, 
      statusColor: "bg-primary", 
      active: true,
      description: "Executes target checkout script under secure runtime context."
    },
  },
  {
    id: "branch8",
    type: "sleek",
    position: { x: 460, y: 590 },
    data: { 
      label: "catch", 
      count: 35, 
      statusColor: "bg-primary", 
      active: true,
      description: "Intercepts failures, dispatches alert telemetry & resets cache lock."
    },
  },
]

const initialEdges: Edge[] = [
  { 
    id: "e-root-b1", 
    source: "root", 
    target: "branch1", 
    type: "smoothstep",
    style: { stroke: "oklch(0.72 0.19 195 / 0.15)", strokeWidth: 1.5 } 
  },
  { 
    id: "e-root-b2", 
    source: "root", 
    target: "branch2", 
    type: "smoothstep",
    style: { stroke: "oklch(0.72 0.19 195 / 0.15)", strokeWidth: 1.5 } 
  },
  { 
    id: "e-root-b3", 
    source: "root", 
    target: "branch3", 
    type: "smoothstep",
    style: { stroke: "oklch(0.72 0.19 195 / 0.15)", strokeWidth: 1.5 } 
  },
  { 
    id: "e-root-b4", 
    source: "root", 
    target: "branch4", 
    type: "smoothstep",
    style: { stroke: "oklch(0.72 0.19 195 / 0.25)", strokeWidth: 1.5 } 
  },
  { 
    id: "e-root-b5", 
    source: "root", 
    target: "branch5", 
    type: "smoothstep",
    style: { stroke: "oklch(0.72 0.19 195 / 0.1)", strokeWidth: 1.5 } 
  },
  { 
    id: "e-root-b6", 
    source: "root", 
    target: "branch6", 
    type: "smoothstep",
    style: { stroke: "oklch(0.72 0.19 195 / 0.1)", strokeWidth: 1.5 } 
  },
  { 
    id: "e-root-b7", 
    source: "root", 
    target: "branch7", 
    type: "smoothstep",
    animated: true,
    style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2.5 } 
  },
  { 
    id: "e-root-b8", 
    source: "root", 
    target: "branch8", 
    type: "smoothstep",
    animated: true,
    style: { stroke: "oklch(0.72 0.19 195 / 0.8)", strokeWidth: 2.5 } 
  },
]

export function ControlCodebases() {
  const [copied, setCopied] = useState(false)

  const handleCopyInstall = async () => {
    await navigator.clipboard.writeText("pip install aether-observe")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 relative overflow-hidden bg-[#030307]" id="control-codebases">
      {/* Background Orbs and Sleek Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(oklch(0.72 0.19 195) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] right-[10%] w-[550px] h-[550px] bg-gradient-radial-purple opacity-[0.06] blur-3xl" />
        <div className="absolute bottom-[20%] left-[5%] w-[450px] h-[450px] bg-gradient-radial-cyan opacity-[0.04] blur-3xl" />
      </div>

      <div className="site-container relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT: Copy content */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-mono font-bold tracking-widest text-primary uppercase">
                Trace Telemetry Runtime
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Control <br />
                <span className="inline-block mt-2 relative px-5 py-2 bg-gradient-to-r from-primary/10 to-accent/15 border border-primary/30 rounded-2xl text-gradient-purple">
                  Complex Codebases
                </span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                Trace exactly how your code works end-to-end. Understand AI-generated code without reading line-by-line. See the execution flow that connects your entire system.
              </p>
            </div>

            {/* Premium Pill Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Button
                onClick={handleCopyInstall}
                className="w-full sm:w-auto bg-white hover:bg-white/95 text-black font-bold font-mono text-sm px-8 py-6 rounded-full flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_35px_oklch(0.58_0.23_292_/_0.55)] hover:shadow-[0_0_45px_oklch(0.58_0.23_292_/_0.85)] scale-100 hover:scale-105 active:scale-98 shrink-0 relative overflow-hidden"
              >
                <svg className="w-5 h-5 text-black shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                {copied ? "Copied Command!" : "Install Now"}
              </Button>
              
              <span className="text-xs font-mono text-muted-foreground select-none">
                pip install aether-observe
              </span>
            </div>
          </div>

          {/* RIGHT: Breathtaking trace graph with animations and tooltip descriptions */}
          <div className="lg:col-span-7">
            <div className="glass-panel bg-card/10 border border-border/20 rounded-3xl p-5 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between pb-4 border-b border-border/10 mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider text-left">Trace: executeCheckout</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[9.5px] font-mono bg-white/5 border border-border/30 text-muted-foreground rounded px-1.5 py-0.5 select-none">Interactive Nodes</span>
                </div>
              </div>

              {/* Increased Container Size: Height 600px */}
              <div className="h-[600px] rounded-2xl overflow-hidden bg-[#040409]/60 relative border border-border/10">
                <ReactFlow
                  nodes={initialNodes}
                  edges={initialEdges}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.12 }}
                  proOptions={{ hideAttribution: true }}
                  nodesFocusable={false}
                  selectNodesOnDrag={false}
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  panOnDrag={true}
                  zoomOnScroll={true}
                  zoomOnPinch={true}
                  zoomOnDoubleClick={false}
                >
                  <Background color="oklch(0.72 0.19 195 / 0.05)" gap={20} size={1} />
                </ReactFlow>
              </div>
              <div className="pt-2 text-center text-[10px] font-mono text-muted-foreground/50">
                💡 Hover over any node to reveal its trace explanation instantly.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
