"use client"

import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Bookmark, Share2 } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

interface NoteCardProps {
  id: string
  title: string
  thumbnail: string
  duration: string
  tags: string[]
  saved?: boolean
  delay?: number
}

export function NoteCard({ id, title, thumbnail, duration, tags, saved = false, delay = 0 }: NoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Link href={`/notes?id=${id}`}>
        <GlassPanel
          className="overflow-hidden transition-all hover:shadow-md group h-full flex flex-col"
          hoverEffect={true}
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={thumbnail || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="flex items-center gap-1 bg-background/80 backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                {duration}
              </Badge>
            </div>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-secondary/50">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between mt-auto">
              <Button variant="ghost" size="sm" className="gap-1">
                <Bookmark
                  className="h-4 w-4 transition-all"
                  fill={saved ? "currentColor" : "none"}
                  stroke={saved ? "none" : "currentColor"}
                />
                {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </GlassPanel>
      </Link>
    </motion.div>
  )
}
