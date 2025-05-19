"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StepIllustrationProps {
  number: number
  title: string
  description: string
  isActive?: boolean
  className?: string
  delay?: number
}

export function StepIllustration({
  number,
  title,
  description,
  isActive = false,
  className,
  delay = 0,
}: StepIllustrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: delay * 0.1 }}
      className={cn(
        "flex gap-4 transition-all duration-500",
        isActive ? "opacity-100 scale-105" : "opacity-60 scale-100",
        className,
      )}
    >
      <div className="flex-shrink-0">
        <div
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all duration-500",
            isActive
              ? "border-foreground bg-foreground text-background shadow-md"
              : "border-foreground/40 text-foreground/70",
          )}
        >
          <span className="font-medium">{number}</span>
        </div>
      </div>
      <div>
        <h3
          className={cn(
            "text-lg font-medium mb-1 transition-all duration-500",
            isActive ? "text-foreground" : "text-foreground/70",
          )}
        >
          {title}
        </h3>
        <p
          className={cn("text-sm transition-all duration-500", isActive ? "text-foreground/80" : "text-foreground/50")}
        >
          {description}
        </p>
      </div>
    </motion.div>
  )
}
