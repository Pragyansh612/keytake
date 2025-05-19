"use client"

import { useState, useRef, useEffect } from "react"
import { VideoPlayer } from "@/components/video-player"
import { GlassPanel } from "@/components/glass-panel"
import { motion, useInView } from "framer-motion"

interface VideoSnippetProps {
  src: string
  poster?: string
  title?: string
  description?: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  delay?: number
}

export function VideoSnippet({
  src,
  poster,
  title,
  description,
  className,
  autoPlay = false,
  loop = true,
  delay = 0,
}: VideoSnippetProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  useEffect(() => {
    if (isInView && !isPlaying && autoPlay) {
      setIsPlaying(true)
    }
  }, [isInView, isPlaying, autoPlay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={className}
    >
      <GlassPanel className="overflow-hidden border-foreground/10" intensity="medium">
        <VideoPlayer
          src={src}
          poster={poster}
          title={title}
          description={description}
          autoPlay={isInView && autoPlay}
          loop={loop}
        />
      </GlassPanel>
    </motion.div>
  )
}
