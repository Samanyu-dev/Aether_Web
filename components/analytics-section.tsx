"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const analyticsData = [
  {
    label: "Reasoning Depth",
    value: 7,
    max: 10,
    color: "primary",
    description: "Cognitive steps in reasoning chain",
  },
  {
    label: "Tool Frequency",
    value: 12,
    max: 20,
    color: "accent",
    description: "External tool invocations",
  },
  {
    label: "Hallucination Probability",
    value: 0.08,
    max: 1,
    color: "destructive",
    description: "Confidence uncertainty score",
    isPercentage: true,
  },
  {
    label: "Token Count",
    value: 2847,
    max: 4096,
    color: "chart-3",
    description: "Total tokens processed",
  },
  {
    label: "Replay Duration",
    value: 3.2,
    max: 10,
    color: "chart-4",
    description: "Session length in seconds",
    suffix: "s",
  },
]

const colorMap: Record<string, { bar: string; glow: string; text: string }> = {
  primary: {
    bar: "bg-primary",
    glow: "shadow-[0_0_20px_oklch(0.72_0.19_195/0.4)]",
    text: "text-primary",
  },
  accent: {
    bar: "bg-accent",
    glow: "shadow-[0_0_20px_oklch(0.65_0.22_300/0.4)]",
    text: "text-accent",
  },
  destructive: {
    bar: "bg-destructive",
    glow: "shadow-[0_0_20px_oklch(0.577_0.245_27.325/0.4)]",
    text: "text-destructive",
  },
  "chart-3": {
    bar: "bg-chart-3",
    glow: "shadow-[0_0_20px_oklch(0.7_0.15_270/0.4)]",
    text: "text-chart-3",
  },
  "chart-4": {
    bar: "bg-chart-4",
    glow: "shadow-[0_0_20px_oklch(0.75_0.18_180/0.4)]",
    text: "text-chart-4",
  },
}

function AnimatedBar({ metric, index }: { metric: typeof analyticsData[0]; index: number }) {
  const [width, setWidth] = useState(0)
  const percentage = (metric.value / metric.max) * 100
  const colors = colorMap[metric.color]

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage)
    }, 200 + index * 100)
    return () => clearTimeout(timer)
  }, [percentage, index])

  const displayValue = metric.isPercentage 
    ? `${(metric.value * 100).toFixed(0)}%` 
    : `${metric.value}${metric.suffix || ""}`

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel rounded-xl p-5 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">{metric.label}</span>
        <span className={`text-lg font-bold ${colors.text}`}>{displayValue}</span>
      </div>
      
      {/* Progress bar */}
      <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${colors.bar} ${colors.glow}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 + index * 0.1 }}
        />
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
    </motion.div>
  )
}

function LatencyTimeline() {
  const dataPoints = [12, 28, 15, 42, 35, 22, 38, 25, 18, 32, 28, 20]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel rounded-xl p-6 col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Latency Timeline</h3>
        <span className="text-xs text-muted-foreground">Last 12 events</span>
      </div>
      
      {/* SVG Chart */}
      <div className="relative h-24">
        <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 20, 40, 60].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="400"
              y2={y}
              stroke="oklch(0.72 0.19 195 / 0.1)"
              strokeDasharray="4 4"
            />
          ))}
          
          {/* Area fill */}
          <motion.path
            d={`M 0 80 ${dataPoints.map((d, i) => `L ${(i / (dataPoints.length - 1)) * 400} ${80 - (d / 50) * 80}`).join(" ")} L 400 80 Z`}
            fill="url(#gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          />
          
          {/* Line */}
          <motion.path
            d={`M ${dataPoints.map((d, i) => `${(i / (dataPoints.length - 1)) * 400} ${80 - (d / 50) * 80}`).join(" L ")}`}
            fill="none"
            stroke="oklch(0.72 0.19 195)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          
          {/* Points */}
          {dataPoints.map((d, i) => (
            <motion.circle
              key={i}
              cx={(i / (dataPoints.length - 1)) * 400}
              cy={80 - (d / 50) * 80}
              r="3"
              fill="oklch(0.72 0.19 195)"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.05 }}
            />
          ))}
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.72 0.19 195)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="oklch(0.72 0.19 195)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>0ms</span>
        <span>Avg: 27ms</span>
        <span>42ms</span>
      </div>
    </motion.div>
  )
}

export function AnalyticsSection() {
  return (
    <section className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial-cyan opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-primary mb-4">
            Lightweight Analytics
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-cyan">Observability</span> at a Glance
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time metrics that help you understand AI behavior without the complexity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {analyticsData.map((metric, index) => (
            <AnimatedBar key={metric.label} metric={metric} index={index} />
          ))}
          <LatencyTimeline />
        </div>
      </div>
    </section>
  )
}
