"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export function AnimatedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, radius: 100 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const { theme } = useTheme()
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize particles
  const initParticles = () => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    setDimensions({ width, height })

    const particleCount = Math.min(Math.floor((width * height) / 10000), 100)
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    particlesRef.current = particles
    setIsInitialized(true)
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight
        setDimensions({ width, height })

        // Reinitialize particles on significant size changes
        if (Math.abs(width - dimensions.width) > 100 || Math.abs(height - dimensions.height) > 100) {
          initParticles()
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [dimensions])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        mouseRef.current.x = e.clientX - rect.left
        mouseRef.current.y = e.clientY - rect.top
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Initialize particles and start animation
  useEffect(() => {
    // Delay initialization to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      initParticles()
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  // Animation loop
  useEffect(() => {
    if (!isInitialized) return

    const animate = () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")

      if (!canvas || !ctx || !containerRef.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > dimensions.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > dimensions.height) {
          particle.speedY *= -1
        }

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouseRef.current.radius) {
          const angle = Math.atan2(dy, dx)
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius

          particle.speedX -= Math.cos(angle) * force * 0.05
          particle.speedY -= Math.sin(angle) * force * 0.05

          // Limit speed
          const maxSpeed = 2
          const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY)
          if (currentSpeed > maxSpeed) {
            particle.speedX = (particle.speedX / currentSpeed) * maxSpeed
            particle.speedY = (particle.speedY / currentSpeed) * maxSpeed
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)

        // Set color based on theme
        const particleColor =
          theme === "dark" ? `rgba(255, 255, 255, ${particle.opacity})` : `rgba(0, 0, 0, ${particle.opacity})`
        ctx.fillStyle = particleColor
        ctx.fill()

        // Connect particles
        for (let j = index + 1; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)

            const opacity = (1 - distance / 100) * 0.2
            const lineColor = theme === "dark" ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions, isInitialized, theme])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {isInitialized && (
        <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="absolute inset-0" />
      )}
    </div>
  )
}
