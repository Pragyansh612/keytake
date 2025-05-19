"use client"

import { useState } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Chrome, Play, Check, Bookmark, Download, X } from "lucide-react"
import Image from "next/image"

interface ChromeExtensionProps {
  className?: string
}

export function ChromeExtension({ className }: ChromeExtensionProps) {
  const [showExtension, setShowExtension] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleProcess = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setProcessed(true)
    }, 2000)
  }

  const handleReset = () => {
    setShowExtension(false)
    setProcessing(false)
    setProcessed(false)
    setShowPreview(false)
    setTimeout(() => {
      setShowExtension(true)
    }, 300)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Browser mockup */}
      <GlassPanel
        className="overflow-hidden border-foreground/10 p-4 shadow-md hover:shadow-lg transition-all duration-300"
        intensity="medium"
      >
        <div className="flex items-center gap-2 border-b border-foreground/10 pb-3 mb-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
            <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
            <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
          </div>
          <div className="flex-1 flex items-center h-8 px-3 rounded-full bg-foreground/5 text-sm text-foreground/60">
            youtube.com/watch?v=example
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-foreground/10 transition-colors"
            onClick={() => setShowExtension(!showExtension)}
          >
            <Chrome className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative aspect-video w-full rounded-md overflow-hidden">
          <Image src="/placeholder.svg?height=400&width=600" alt="YouTube video" fill className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button className="rounded-full h-12 w-12 bg-[#FF0000] text-white hover:bg-[#FF0000]/90 transition-transform duration-300 hover:scale-110 shadow-md">
              <Play className="h-6 w-6 ml-0.5" />
            </Button>
          </div>
        </div>
      </GlassPanel>

      {/* Chrome extension popup */}
      <AnimatePresence>
        {showExtension && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-12 w-72 z-10"
          >
            <GlassPanel className="p-4 border-foreground/10 shadow-lg" intensity="high">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Chrome className="h-5 w-5" />
                  <h3 className="font-medium text-sm">Keytake Extension</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-foreground/10" onClick={handleReset}>
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {!processed ? (
                <>
                  <p className="text-xs text-foreground/70 mb-4">
                    Generate structured notes from this YouTube video with one click.
                  </p>
                  <Button
                    className="w-full h-9 text-sm shadow-sm hover:shadow-md transition-all"
                    onClick={handleProcess}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="h-3 w-3 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>Generate Notes</>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3 bg-foreground/5 p-2 rounded-md">
                    <div className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                    <p className="text-xs">Notes generated successfully!</p>
                  </div>

                  <div className="mb-4">
                    <div
                      className="cursor-pointer hover:bg-foreground/5 p-2 rounded-md transition-colors"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <h4 className="text-sm font-medium mb-1">Understanding Quantum Computing</h4>
                      <p className="text-xs text-foreground/70 line-clamp-2">
                        A comprehensive overview of quantum computing principles, qubits, and applications...
                      </p>
                    </div>

                    <AnimatePresence>
                      {showPreview && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 p-2 bg-foreground/5 rounded-md text-xs"
                        >
                          <p className="font-medium mb-1">1. Introduction to Quantum Computing</p>
                          <ul className="text-foreground/70 pl-4 space-y-1 list-disc text-[10px]">
                            <li>Classical vs quantum computing paradigms</li>
                            <li>Superposition and entanglement principles</li>
                          </ul>
                          <p className="font-medium mt-2 mb-1">2. Quantum Bits (Qubits)</p>
                          <ul className="text-foreground/70 pl-4 space-y-1 list-disc text-[10px]">
                            <li>How qubits differ from classical bits</li>
                            <li>Physical implementations of qubits</li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs gap-1 border-foreground/20 hover:border-foreground/60"
                    >
                      <Bookmark className="h-3 w-3" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs gap-1 border-foreground/20 hover:border-foreground/60"
                    >
                      <Download className="h-3 w-3" />
                      Export
                    </Button>
                    <Button size="sm" className="flex-1 h-8 text-xs shadow-sm hover:shadow-md transition-all">
                      Open
                    </Button>
                  </div>
                </>
              )}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
