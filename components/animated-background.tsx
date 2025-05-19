"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

type BackgroundType = "particles" | "grid" | "flow"

interface AnimatedBackgroundProps {
  type?: BackgroundType
  intensity?: "low" | "medium" | "high"
  className?: string
  interactive?: boolean
}

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export function AnimatedBackground({
  type = "particles",
  intensity = "medium",
  className = "",
  interactive = true,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isMouseMovingRef = useRef(false)
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number>(0)
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark"

  // Initialize canvas and particles
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const { width, height } = canvas.getBoundingClientRect()

      // Set canvas dimensions with device pixel ratio for sharp rendering
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr

      // Scale the context
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.scale(dpr, dpr)
      }

      dimensionsRef.current = { width, height }

      // Initialize particles based on canvas dimensions
      initializeParticles(width, height)
    }

    // Initialize particles based on canvas dimensions
    const initializeParticles = (width: number, height: number) => {
      const intensityMap = {
        low: 0.5,
        medium: 1,
        high: 1.5,
      }

      const intensityFactor = intensityMap[intensity]
      const particleCount = Math.min(Math.floor((width * height) / 10000) * intensityFactor, 150)
      const newParticles: Particle[] = []

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }

      particlesRef.current = newParticles
    }

    // Initial setup
    handleResize()

    // Add event listeners
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }
    }
  }, [intensity])

  // Mouse movement effect
  useEffect(() => {
    if (!interactive) return

    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        mousePositionRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }
        isMouseMovingRef.current = true

        // Reset the mouse moving state after a delay
        if (mouseTimeoutRef.current) {
          clearTimeout(mouseTimeoutRef.current)
        }

        mouseTimeoutRef.current = setTimeout(() => {
          isMouseMovingRef.current = false
        }, 2000)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }
    }
  }, [interactive])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      const { width, height } = dimensionsRef.current
      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      particlesRef.current = particlesRef.current.map((particle) => {
        // Calculate distance from mouse for interactive effect
        let dx = 0
        let dy = 0

        if (interactive && isMouseMovingRef.current) {
          dx = mousePositionRef.current.x - particle.x
          dy = mousePositionRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Apply subtle attraction/repulsion based on mouse position
          if (distance < 100) {
            const force = 0.2 * (1 - distance / 100)
            particle.speedX += (dx / distance) * force
            particle.speedY += (dy / distance) * force
          }
        }

        // Apply speed limits
        particle.speedX = Math.max(-1, Math.min(1, particle.speedX))
        particle.speedY = Math.max(-1, Math.min(1, particle.speedY))

        // Update position
        let newX = particle.x + particle.speedX
        let newY = particle.y + particle.speedY

        // Bounce off edges
        if (newX < 0 || newX > width) {
          particle.speedX *= -1
          newX = Math.max(0, Math.min(width, newX))
        }

        if (newY < 0 || newY > height) {
          particle.speedY *= -1
          newY = Math.max(0, Math.min(height, newY))
        }

        // Apply friction
        particle.speedX *= 0.99
        particle.speedY *= 0.99

        // Draw the particle
        ctx.beginPath()
        ctx.arc(newX, newY, particle.size, 0, Math.PI * 2)

        // Set color based on theme
        const color = isDarkTheme ? 255 : 0
        ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${particle.opacity})`
        ctx.fill()

        // Draw connections between particles
        if (type === "particles") {
          particlesRef.current.forEach((otherParticle) => {
            const dx = newX - otherParticle.x
            const dy = newY - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(newX, newY)
              ctx.lineTo(otherParticle.x, otherParticle.y)

              const opacity = (1 - distance / 100) * 0.2
              ctx.strokeStyle = `rgba(${color}, ${color}, ${color}, ${opacity})`
              ctx.stroke()
            }
          })
        }

        // Return updated particle
        return {
          ...particle,
          x: newX,
          y: newY,
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [interactive, isDarkTheme, type])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.7 }}
    />
  )
}
