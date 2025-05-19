"use client"

import { GlassPanel } from "@/components/glass-panel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  company: string
  avatar?: string
  delay?: number
}

export function TestimonialCard({ quote, author, role, company, avatar, delay = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <GlassPanel className="p-6 h-full" intensity="medium">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <svg className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
            </svg>
            <p className="text-muted-foreground italic relative z-10">{quote}</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={author} />
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{author}</p>
              <p className="text-xs text-muted-foreground">
                {role}, {company}
              </p>
            </div>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  )
}
