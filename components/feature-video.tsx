"use client"

import { useState } from "react"
import { VideoPlayer } from "@/components/video-player"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface FeatureVideoProps {
  src: string
  poster?: string
  title: string
  description: string
  className?: string
  delay?: number
}

export function FeatureVideo({ src, poster, title, description, className, delay = 0 }: FeatureVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: delay * 0.1 }}
      className={className}
    >
      <GlassPanel
        className="overflow-hidden h-full flex flex-col border-foreground/10 shadow-sm hover:shadow-md transition-all duration-300"
        intensity="medium"
      >
        <div className="relative aspect-video w-full">
          {isPlaying ? (
            <VideoPlayer src={src} poster={poster} title={title} autoPlay={true} onPlay={handlePlay} />
          ) : (
            <>
              <Image
                src={poster || "/placeholder.svg?height=400&width=600"}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  className="rounded-full h-12 w-12 bg-foreground text-background hover:bg-foreground/90 transition-transform duration-300 hover:scale-110 shadow-md"
                  onClick={handlePlay}
                >
                  <Play className="h-6 w-6 ml-0.5" />
                </Button>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <GlassPanel className="p-3" intensity="high">
                  <h3 className="font-medium text-sm md:text-base">{title}</h3>
                  <p className="text-xs md:text-sm text-foreground/70 mt-1">{description}</p>
                </GlassPanel>
              </div>
            </>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  )
}
