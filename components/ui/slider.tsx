"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
  value?: number[]
  max?: number
  min?: number
  step?: number
  onValueChange?: (value: number[]) => void
  className?: string
}

export function Slider({
  value = [0],
  max = 100,
  min = 0,
  step = 1,
  onValueChange,
  className,
}: SliderProps) {
  const currentValue = value[0] ?? 0
  const maxVal = max - 1 || 1 // Keep it safe within steps array bound

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    if (onValueChange) {
      onValueChange([val])
    }
  }

  // Calculate percentage of glow filled track
  const percentage = Math.min(Math.max(((currentValue - min) / (maxVal - min)) * 100, 0), 100)

  return (
    <div className={cn("relative flex w-full items-center select-none", className)}>
      <input
        type="range"
        min={min}
        max={maxVal}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        style={{
          background: `linear-gradient(to right, oklch(0.72 0.19 195) 0%, oklch(0.72 0.19 195) ${percentage}%, oklch(0.22 0.025 260) ${percentage}%, oklch(0.22 0.025 260) 100%)`,
          WebkitAppearance: "none",
        }}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: oklch(0.95 0.01 260);
          border: 2px solid oklch(0.72 0.19 195);
          box-shadow: 0 0 10px oklch(0.72 0.19 195 / 0.5);
          cursor: pointer;
          transition: transform 0.1s ease, background-color 0.1s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: oklch(0.72 0.19 195);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: oklch(0.95 0.01 260);
          border: 2px solid oklch(0.72 0.19 195);
          box-shadow: 0 0 10px oklch(0.72 0.19 195 / 0.5);
          cursor: pointer;
          transition: transform 0.1s ease, background-color 0.1s ease;
        }
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          background: oklch(0.72 0.19 195);
        }
      `}</style>
    </div>
  )
}
