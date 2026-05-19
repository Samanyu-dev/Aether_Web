"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { ReactFlow, Background, Handle, Position, MarkerType, useNodesState, useEdgesState, type Node, type Edge, MiniMap, Controls } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { motion, AnimatePresence } from "framer-motion"

// ─── Shared Styles ────────────────────────────────────────────────────────
const CFG = {
  thought:       { label: "THOUGHT",      border: "#1a6077", active: "oklch(0.72 0.19 195)", bg: "rgba(0,180,255,0.04)" },
  tool:          { label: "TOOL CALL",    border: "#3d1f5c", active: "oklch(0.65 0.22 300)", bg: "rgba(160,50,255,0.04)" },
  memory:        { label: "MEMORY",       border: "#1a5c3d", active: "oklch(0.7 0.19 150)",  bg: "rgba(0,255,100,0.04)" },
  hallucination: { label: "RISK DETECTED",border: "#5c1a1a", active: "oklch(0.577 0.245 27)", bg: "rgba(255,50,50,0.05)" },
  output:        { label: "OUTPUT",       border: "#1a4a35", active: "oklch(0.75 0.18 150)", bg: "rgba(50,220,120,0.04)" },
} as const

type NodeKind = keyof typeof CFG

function ReplayNode({ data }: { data: { label: string; kind: NodeKind; isActive?: boolean; isDone?: boolean } }) {
  const cfg = CFG[data.kind] || CFG.thought
  const isActive = !!data.isActive
  const isDone = !!data.isDone

  return (
    <div style={{ position: "relative", width: 220 }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <motion.div
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          width: 220,
          minHeight: 70,
          borderRadius: 12,
          border: `1.5px solid ${isActive ? cfg.active : isDone ? cfg.border : "#ffffff0a"}`,
          background: isActive ? cfg.bg : isDone ? "rgba(255,255,255,0.02)" : "rgba(5,5,10,0.6)",
          boxShadow: isActive ? `0 0 20px ${cfg.active}40` : "none",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          backdropFilter: "blur(8px)",
          opacity: (!isActive && !isDone && data.isActive !== undefined) ? 0.4 : 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: isActive || isDone ? cfg.active : "#ffffff30", fontFamily: "monospace" }}>
            {cfg.label}
          </span>
          {isActive && <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.active, animation: "pulse 1s infinite" }} />}
          {isDone && !isActive && <span style={{ fontSize: 10, color: cfg.active }}>✓</span>}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: isActive || isDone ? "#fff" : "#ffffff40" }}>
          {data.label}
        </div>
      </motion.div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  )
}

const nodeTypes = { replay: ReplayNode }

const STORY_ASSETS: Record<number, {
  thoughtLabels: string[]
  toolLabels: string[]
  memoryLabels: string[]
  logs: string[]
}> = {
  1: { // Multi-Tool Research Agent
    thoughtLabels: ["Analyze Hyperparams", "Calculate Tensor Bounds", "Compare Rank Scales", "Evaluate Cache Load", "Predict Execution Cost", "Draft Compute Pipeline", "Verify Weight Alignment"],
    toolLabels: ["query_vectors()", "gpu_profiler.check()", "cuda_malloc()", "lora_weight_sync()", "cache_flush()", "benchmark_step()"],
    memoryLabels: ["Recall LoRA config", "Retrieve VRAM limits", "Match CUDA profile", "Check alpha ratio", "Fetch baseline thermals"],
    logs: [
      "Initializing search query optimization sequence...",
      "Querying cluster metadata cache...",
      "Retrieved embedding cluster 0x9f4a (similarity: 0.96)",
      "Analyzing LoRA adapter ranks against memory threshold...",
      "Checking CUDA cache for structural alignment...",
      "gpu_profiler.profile_memory() active: testing 24GB Unified Memory",
      "VRAM allocation map generated: 19.8GB active",
      "Warning: Tensor footprint approaching GPU limit",
      "Analyzing weight deviation in backward pass...",
      "Compiling custom Triton kernels for high speed inference..."
    ]
  },
  2: { // Autonomous DevOps Assistant
    thoughtLabels: ["Inspect Syslogs", "Parse Crash Dump", "Assess Docker Config", "Verify Networking", "Check Mount Limits", "Verify File Integrity", "Isolate Threat Scope"],
    toolLabels: ["bash_run(find)", "docker_inspect()", "sandbox_isolate()", "port_scan()", "prune_log_dir()", "iptables_restrict()"],
    memoryLabels: ["Load DevOps rules", "Recall isolation", "Fetch host safety guidelines", "Verify mount checks"],
    logs: [
      "Scanning /var/log/syslog for memory leak triggers...",
      "bash_run(grep -i 'oom-killer' /var/log/messages) completed.",
      "Parsing docker daemon container process table...",
      "Inspecting filesystem mounting safety rules...",
      "Warning: root path mount proposal discovered.",
      "Initiating temporary sandbox container isolation...",
      "Restricting host networking interface via iptables...",
      "Evaluating argument token bounds inside bash run...",
      "Filtering out potentially harmful wildcard executions..."
    ]
  },
  3: { // Multi-Agent Coordinator
    thoughtLabels: ["Spawn Recruiter", "Initialize Reviewer", "Verify Consensus Limit", "Score Proposal Align", "Rank Output Quality", "Check Agent Agreement", "Review Debate Conflict"],
    toolLabels: ["agent_broadcast()", "collect_debates()", "verify_signature()", "resolve_conflicts()", "consensus_search()"],
    memoryLabels: ["Fetch Recruiter profiles", "Recall Reviewer weights", "Match agent debate rules", "Load consensus thresholds"],
    logs: [
      "Spawning Recruiter and Reviewer agent threads...",
      "Recruiter agent scanning candidate repository...",
      "Broadcasting task assignment to agent debate cluster...",
      "Reviewer agent performing structural cross-reference...",
      "Debate Round 1: experience and timeline matching...",
      "Alignment score calculated: 0.945 (consensus target: 0.95)",
      "Conflict detected: mismatched resume timelines.",
      "Triggering consensus search algorithm...",
      "Resolving debate parameters via strict mathematical proof..."
    ]
  }
}

const LAYER_SCHEMES: Record<number, number[]> = {
  1: [1, 3, 4, 3, 2, 4, 3, 4, 1], // 25 nodes
  2: [1, 3, 4, 2, 3, 4, 1],       // 18 nodes
  3: [1, 4, 5, 4, 3, 5, 4, 5, 1], // 32 nodes
}

export function StoryReplayGraph({ story }: { story: any }) {
  const assets = STORY_ASSETS[story.id] || STORY_ASSETS[1]
  const scheme = LAYER_SCHEMES[story.id] || [1, 3, 4, 3, 1]

  // Dynamically generate a branching neural network DAG structure
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = []
    const previewNodes = story.preview
    const totalEvents = scheme.reduce((a, b) => a + b, 0)
    
    let nodeIndexCounter = 0
    
    // We will place the preview nodes at key bottleneck stages (levels with 1 node)
    const singleNodeLevels = scheme.reduce((acc: number[], val, idx) => {
      if (val === 1) acc.push(idx)
      return acc
    }, [])

    scheme.forEach((levelCount, levelIdx) => {
      const horizontalX = levelIdx * 280 + 60
      const layerHeight = (levelCount - 1) * 120
      
      for (let j = 0; j < levelCount; j++) {
        const verticalY = 290 - (layerHeight / 2) + (j * 120)
        const i = nodeIndexCounter++
        
        let nodeData = { type: "thought", label: "" }
        let isPreview = false

        // Determine if this is a bottleneck stage to place a premium preview milestone
        const isSingleLevel = levelCount === 1
        const singleLevelIdx = singleNodeLevels.indexOf(levelIdx)
        
        if (isSingleLevel && singleLevelIdx !== -1 && singleLevelIdx < previewNodes.length) {
          nodeData = previewNodes[singleLevelIdx]
          isPreview = true
        } else if (i === totalEvents - 1) {
          nodeData = previewNodes[previewNodes.length - 1]
          isPreview = true
        } else {
          const types = ["thought", "memory", "tool"]
          const type = types[i % 3]
          nodeData.type = type
          
          // Select story-specific realistic labels
          if (type === "thought") {
            nodeData.label = assets.thoughtLabels[Math.floor(i / 3) % assets.thoughtLabels.length]
          } else if (type === "tool") {
            nodeData.label = assets.toolLabels[Math.floor(i / 3) % assets.toolLabels.length]
          } else {
            nodeData.label = assets.memoryLabels[Math.floor(i / 3) % assets.memoryLabels.length]
          }
        }

        nodes.push({
          id: `n${i}`,
          type: "replay",
          position: { x: horizontalX, y: verticalY },
          data: {
            label: nodeData.label,
            kind: nodeData.type,
            isPreview
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        })
      }
    })
    
    return nodes
  }, [story, assets, scheme])

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = []
    let nodeIndexCounter = 0
    
    // Distribute Node IDs per layer level
    const layersOfIds: string[][] = []
    scheme.forEach(count => {
      const layerIds: string[] = []
      for (let i = 0; i < count; i++) {
        layerIds.push(`n${nodeIndexCounter++}`)
      }
      layersOfIds.push(layerIds)
    })

    // Establish dynamic connection branches
    for (let l = 0; l < layersOfIds.length - 1; l++) {
      const currentLayer = layersOfIds[l]
      const nextLayer = layersOfIds[l+1]

      if (currentLayer.length === 1) {
        // One-to-many: branch from single bottleneck to all parallel nodes
        nextLayer.forEach(targetId => {
          edges.push({
            id: `e-${currentLayer[0]}-${targetId}`,
            source: currentLayer[0],
            target: targetId,
            type: "smoothstep",
          })
        })
      } else if (nextLayer.length === 1) {
        // Many-to-one: converge all parallel nodes back down to a single consensus gate
        currentLayer.forEach(sourceId => {
          edges.push({
            id: `e-${sourceId}-${nextLayer[0]}`,
            source: sourceId,
            target: nextLayer[0],
            type: "smoothstep",
          })
        })
      } else {
        // Many-to-many: Parallel mesh flow connection
        currentLayer.forEach((sourceId, j) => {
          const targetIndex1 = j % nextLayer.length
          edges.push({
            id: `e-${sourceId}-${nextLayer[targetIndex1]}`,
            source: sourceId,
            target: nextLayer[targetIndex1],
            type: "smoothstep",
          })

          // Cross-connect neighboring threads for dynamic mesh feel
          const targetIndex2 = (j + 1) % nextLayer.length
          if (targetIndex2 !== targetIndex1) {
            edges.push({
              id: `e-${sourceId}-${nextLayer[targetIndex2]}`,
              source: sourceId,
              target: nextLayer[targetIndex2],
              type: "smoothstep",
            })
          }
        })
      }
    }
    return edges
  }, [scheme])

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  
  const [activeIdx, setActiveIdx] = useState(-1)
  const [logs, setLogs] = useState<string[]>([])
  const reactFlowInstance = useRef<any>(null)
  
  const exeOrder = useMemo(() => initialNodes.map(n => n.id), [initialNodes])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let cursor = 0
    let isResetting = false

    intervalRef.current = setInterval(() => {
      if (isResetting) return

      setActiveIdx(prev => {
        const next = prev + 1
        if (next >= exeOrder.length) {
          isResetting = true
          setTimeout(() => {
            setActiveIdx(-1)
            setLogs([])
            cursor = 0
            isResetting = false
            // Reset camera to fit view
            reactFlowInstance.current?.fitView({ padding: 0.2, duration: 800 })
          }, 5000)
          return prev
        }
        
        // Push logs dynamically when we hit key 'preview' milestones
        const currentNode = initialNodes[next]
        if (currentNode?.data?.isPreview && cursor < story.narrations.length) {
          const log = story.narrations[cursor]
          if (log) setLogs(logsPrev => [...logsPrev, log])
          cursor++
        } else if (!currentNode?.data?.isPreview) {
          // Push contextual filler trace logs
          const assetLog = assets.logs[next % assets.logs.length]
          setLogs(logsPrev => [...logsPrev, `[TRACE] ${assetLog}`])
        }

        return next
      })
    }, 1500) // Paced 1500ms for comfortable reading and glide pan

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [exeOrder, story.narrations, initialNodes, assets])

  // Sync graph states: SPAWN NODES ONE BY ONE
  useEffect(() => {
    const activeIds = new Set(exeOrder.slice(0, activeIdx + 1))
    const currentId = exeOrder[activeIdx]

    // Only render nodes that have been generated up to the current active index!
    const sliceCount = activeIdx === -1 ? 0 : activeIdx + 1
    const visibleNodes = initialNodes.slice(0, sliceCount).map(n => ({
      ...n,
      data: { 
        ...n.data, 
        isActive: n.id === currentId, 
        isDone: activeIds.has(n.id) && n.id !== currentId 
      }
    }))

    // Only render edges connecting spawned nodes
    const visibleEdges = initialEdges
      .filter(e => activeIds.has(e.source) && activeIds.has(e.target))
      .map(e => {
        const isSrcActive = activeIds.has(e.source)
        const isAnimated = e.source === currentId || (e.target === currentId && activeIds.has(e.source))
        const targetNode = initialNodes.find(n => n.id === e.target)
        const isRisk = targetNode?.data.kind === "hallucination"
        
        return {
          ...e,
          animated: isAnimated,
          style: {
            stroke: isSrcActive ? (isRisk ? "oklch(0.577 0.245 27)" : "oklch(0.72 0.19 195)") : "rgba(255,255,255,0.06)",
            strokeWidth: isSrcActive ? 2.5 : 1.5,
            transition: "stroke 0.4s ease"
          },
          markerEnd: isSrcActive ? { type: MarkerType.ArrowClosed, color: isRisk ? "oklch(0.577 0.245 27)" : "oklch(0.72 0.19 195)", width: 12, height: 12 } : undefined
        }
      })

    setNodes(visibleNodes)
    setEdges(visibleEdges)

    // Pan camera to the currently active node
    if (activeIdx >= 0 && activeIdx < initialNodes.length && reactFlowInstance.current) {
      const activeNode = initialNodes[activeIdx]
      // Offset by node width (220/2) and height (70/2) to center it
      reactFlowInstance.current.setCenter(activeNode.position.x + 110, activeNode.position.y + 35, { zoom: 1.1, duration: 900 })
    }
  }, [activeIdx, exeOrder, initialNodes, initialEdges, setNodes, setEdges])

  const activeNode = activeIdx >= 0 && activeIdx < initialNodes.length ? initialNodes[activeIdx] : null
  const activeData = activeNode?.data as { kind: string; label: string; isActive?: boolean } | undefined
  const isRedNode = activeData?.kind === "hallucination"

  const KIND_EXPLANATIONS: Record<string, string> = {
    thought: "Analyzing variables, reviewing context weights, and preparing structural pipeline steps.",
    tool: "Invoking sandbox-isolated API operation to process deep-level data transfers.",
    memory: "Retrieving weights, system states, and previous parameter histories from memory clusters.",
    hallucination: "CRITICAL: Guardrails intercepted confidence anomaly! Terminating threat vector.",
    output: "Trace complete. System safety checks passed and output parameters successfully synchronized."
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-[580px] bg-[#06060c] border border-border/20 rounded-xl overflow-hidden relative">
      
      {/* ── Left: React Flow Graph Canvas ──────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden bg-[#040409]">
        
        {/* Floating Explainability Card */}
        <AnimatePresence>
          {activeNode && activeData && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-4 left-4 z-20 max-w-[340px] p-4 rounded-xl border border-border/30 bg-[#06060c]/85 backdrop-blur-md text-left shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded ${
                  activeData.kind === "hallucination" ? "bg-red-500/20 text-red-400" :
                  activeData.kind === "tool" ? "bg-purple-500/20 text-purple-400" :
                  activeData.kind === "memory" ? "bg-emerald-500/20 text-emerald-400" :
                  "bg-cyan-500/20 text-cyan-400"
                }`}>
                  {activeData.kind}
                </span>
                <span className="text-xs font-bold text-white truncate max-w-[180px]">
                  {activeData.label}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {KIND_EXPLANATIONS[activeData.kind] || KIND_EXPLANATIONS.thought}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* High-Threat Local Red Guardrail Alert Pop-up */}
        <AnimatePresence>
          {isRedNode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
              transition={{ type: "spring", damping: 15 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-[320px] flex flex-col items-center justify-center p-4 gap-2 rounded-2xl border border-red-500/40 bg-red-500/12 backdrop-blur-md text-red-400 text-center shadow-[0_0_35px_oklch(0.577_0.245_27/_0.3)] pointer-events-none"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base animate-pulse">⚠</span>
                <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase">Guardrail Intercept</span>
              </div>
              <span className="text-[11px] leading-relaxed text-red-400/90 font-medium">
                Unsafe parameters / hallucination attempt caught in sandbox. Restoring deployment safety.
              </span>
              <span className="text-[9px] font-mono text-red-400/50 bg-red-500/10 px-2 py-0.5 rounded mt-0.5">
                threat status: blocked · recovering
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .react-flow__attribution { display:none; }
          .react-flow__minimap { background-color: rgba(5,5,10,0.8) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 8px !important; }
        `}</style>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onInit={(instance) => { reactFlowInstance.current = instance }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          panOnDrag zoomOnScroll nodesDraggable={false} elementsSelectable={false}
        >
          <Background color="oklch(0.72 0.19 195 / 0.05)" gap={20} size={1} />
        </ReactFlow>
      </div>

      {/* ── Right: Live Feed ────────────────────────────────── */}
      <div className="w-[260px] border-l border-border/20 bg-[#030307]/90 flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-border/20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Logs</span>
        </div>
        
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-[11px] font-mono text-primary/80 border-l-2 border-primary/30 pl-3 leading-relaxed"
              >
                <span className="text-primary font-bold">{">"}</span> {log}
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground/30 font-mono italic">
              Waiting for telemetry...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
