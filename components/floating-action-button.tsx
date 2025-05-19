"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassPanel } from "@/components/glass-panel"
import { Plus, X, ArrowRight, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recentUrls, setRecentUrls] = useState([
    "youtube.com/watch?v=quantum-computing",
    "youtube.com/watch?v=machine-learning",
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setUrl("")
      setIsOpen(false)
      // Add to recent URLs
      setRecentUrls([url, ...recentUrls.slice(0, 1)])
    }, 1500)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-2 w-80"
          >
            <GlassPanel className="p-4 border-foreground/10 shadow-lg" intensity="high">
              <form onSubmit={handleSubmit}>
                <h3 className="font-medium text-sm mb-3">Quick Note Generation</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    type="url"
                    placeholder="Paste YouTube URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-9 text-sm"
                    required
                  />
                  <Button type="submit" size="sm" className="h-9 px-3" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>

                {recentUrls.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-foreground/70 mb-2">Recently Processed</h4>
                    <div className="space-y-1">
                      {recentUrls.map((recentUrl, index) => (
                        <div
                          key={index}
                          className="text-xs p-2 rounded-md hover:bg-foreground/5 cursor-pointer transition-colors flex items-center"
                          onClick={() => setUrl(recentUrl)}
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-foreground/40 mr-2"></div>
                          {recentUrl}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className={`h-12 w-12 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? "bg-foreground/90 text-background rotate-45" : "bg-foreground text-background"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </Button>
    </div>
  )
}
