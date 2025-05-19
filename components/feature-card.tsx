"use client"

import { cn } from "@/lib/utils"
import { GlassPanel } from "@/components/glass-panel"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  className?: string
  delay?: number
}

export function FeatureCard({ title, description, icon: Icon, className, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <GlassPanel className={cn("p-6 h-full hover-lift", className)} hoverEffect={true}>
        <div className="flex flex-col gap-4">
          <div className="rounded-full bg-primary/10 p-3 w-fit">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </GlassPanel>
    </motion.div>
  )
}
