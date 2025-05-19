"use client"

import { cn } from "@/lib/utils"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, LinkIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassPanel } from "@/components/glass-panel"

export function YouTubeInput() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [typingEffect, setTypingEffect] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
    return youtubeRegex.test(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    if (!validateYouTubeUrl(url)) {
      setStatus("error")
      setErrorMessage("Please enter a valid YouTube URL")
      return
    }

    setStatus("loading")
    setIsLoading(true)
    setTypingEffect(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval)
      setIsLoading(false)
      setStatus("success")
      setTypingEffect(false)

      // Redirect after showing success state
      setTimeout(() => {
        window.location.href = `/notes?url=${encodeURIComponent(url)}`
      }, 1000)
    }, 2500)
  }

  // Focus input on mount for better UX
  useEffect(() => {
    if (inputRef.current && window.innerWidth > 768) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <GlassPanel
        className={cn(
          "p-1 transition-all duration-300 border-foreground/10 shadow-sm hover:shadow-md",
          isFocused ? "shadow-md border-foreground/30" : "",
        )}
        intensity="medium"
        hoverEffect={true}
        animation="fade-in"
      >
        <div className="flex w-full items-center">
          <div className="flex-shrink-0 pl-3 pr-1 text-foreground/40">
            <LinkIcon className="h-5 w-5" />
          </div>
          <Input
            ref={inputRef}
            type="url"
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setStatus("idle")
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="h-14 border-0 bg-transparent focus-visible:ring-0 text-base"
            required
          />
          <AnimatePresence mode="wait">
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center mr-2 text-destructive"
              >
                <AlertCircle className="h-5 w-5" />
              </motion.div>
            )}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center mr-2 text-foreground"
              >
                <CheckCircle2 className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !url}
            className={cn(
              "h-12 px-6 m-1 rounded-md transition-all duration-300",
              url && !isLoading ? "bg-foreground text-background hover:bg-foreground/90" : "",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Generate <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </GlassPanel>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-destructive mt-2 ml-2"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4"
          >
            <div className="flex justify-between text-xs text-foreground/60 mb-1">
              <span>Analyzing video content...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 w-full bg-foreground/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-foreground"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typing effect */}
      <AnimatePresence>
        {typingEffect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 text-sm text-foreground/70"
          >
            <TypingEffect />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 text-sm text-foreground/60 flex flex-wrap justify-center gap-2">
        Try with popular videos:
        <Button
          variant="link"
          className="text-foreground h-auto p-0 font-medium"
          onClick={() => setUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
        >
          Machine Learning Basics
        </Button>
        <Button
          variant="link"
          className="text-foreground h-auto p-0 font-medium"
          onClick={() => setUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
        >
          History of Philosophy
        </Button>
      </div>
    </form>
  )
}

function TypingEffect() {
  const [text, setText] = useState("")
  const fullText = "Extracting key concepts... Organizing information... Generating structured notes..."

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setText(fullText.substring(0, index))
      index++

      if (index > fullText.length) {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <p>
      {text}
      <span className="animate-pulse">|</span>
    </p>
  )
}
