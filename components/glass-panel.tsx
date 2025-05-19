"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion, type MotionProps } from "framer-motion"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement>, MotionProps {
  children: React.ReactNode
  className?: string
  intensity?: "none" | "low" | "medium" | "high"
  hoverEffect?: boolean
  animation?: "none" | "fade-in" | "slide-up" | "scale-in"
  motionProps?: MotionProps
}

export function GlassPanel({
  children,
  className,
  intensity = "low",
  hoverEffect = false,
  animation = "none",
  motionProps,
  ...props
}: GlassPanelProps) {
  const intensityClasses = {
    none: "bg-background border-border",
    low: "bg-background/80 backdrop-blur-[2px] border-border/40",
    medium: "bg-background/70 backdrop-blur-[4px] border-border/50",
    high: "bg-background/60 backdrop-blur-[6px] border-border/60",
  }

  const hoverClasses = hoverEffect
    ? "transition-all duration-300 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-foreground/5 hover:-translate-y-1"
    : ""

  const animationVariants = {
    "fade-in": {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
    },
    "slide-up": {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    },
    "scale-in": {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 },
    },
    none: {},
  }

  const selectedAnimation = animationVariants[animation]

  return (
    <motion.div
      className={cn(
        "rounded-lg border shadow-sm",
        "dark:shadow-inner dark:shadow-foreground/5",
        intensityClasses[intensity],
        hoverClasses,
        className,
      )}
      {...(animation !== "none" ? selectedAnimation : {})}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}
