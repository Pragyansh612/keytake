"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  decimalPlaces?: number
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  className,
  decimalPlaces = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      let startTime: number
      let animationFrame: number

      const countUp = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const currentCount = progress * end

        setCount(currentCount)

        if (progress < 1) {
          animationFrame = requestAnimationFrame(countUp)
        } else {
          setHasAnimated(true)
        }
      }

      animationFrame = requestAnimationFrame(countUp)

      return () => cancelAnimationFrame(animationFrame)
    }
  }, [isInView, end, duration, hasAnimated])

  const formattedCount = count.toFixed(decimalPlaces)

  return (
    <div ref={ref} className={cn("font-bold", className)}>
      {prefix}
      {isInView ? formattedCount : "0"}
      {suffix}
    </div>
  )
}
