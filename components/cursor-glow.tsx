"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion"

export function CursorGlow() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isVisible, setIsVisible] = useState(false)

  // Apply a smooth spring animation to the mouse tracking
  const springX = useSpring(mouseX, { stiffness: 70, damping: 30, restDelta: 0.001 })
  const springY = useSpring(mouseY, { stiffness: 70, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", handleMouseMove)
    document.documentElement.addEventListener("mouseleave", handleMouseLeave)
    document.documentElement.addEventListener("mouseenter", handleMouseEnter)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave)
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [mouseX, mouseY, isVisible])

  // Create a stunning premium cyan/purple glowing gradient that tracks the cursor
  const background = useMotionTemplate`radial-gradient(700px circle at ${springX}px ${springY}px, oklch(0.72 0.19 195 / 0.06), transparent 80%)`

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
      style={{
        background,
        opacity: isVisible ? 1 : 0
      }}
    />
  )
}
