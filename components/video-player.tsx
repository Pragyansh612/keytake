"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"

interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  title?: string
  description?: string
  onPlay?: () => void
}

export function VideoPlayer({
  src,
  poster,
  className,
  autoPlay = false,
  loop = false,
  title,
  description,
  onPlay,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current
          .play()
          .then(() => {
            if (onPlay) onPlay()
          })
          .catch((error) => {
            console.error("Error playing video:", error)
          })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const toggleFullscreen = () => {
    if (!playerRef.current) return

    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(currentProgress)
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width

    videoRef.current.currentTime = pos * videoRef.current.duration
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setShowVolumeSlider(false)

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 2000)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isHovering) {
          setShowControls(false)
        }
      }, 2000)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("ended", () => setIsPlaying(false))
      video.addEventListener("loadedmetadata", () => {
        setDuration(video.duration)
        setIsLoading(false)
      })
      video.addEventListener("waiting", () => setIsLoading(true))
      video.addEventListener("playing", () => setIsLoading(false))
      video.addEventListener("canplay", () => setIsLoading(false))

      if (autoPlay) {
        video
          .play()
          .then(() => {
            setIsPlaying(true)
            if (onPlay) onPlay()
          })
          .catch(() => {
            setIsPlaying(false)
          })
      }
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("ended", () => setIsPlaying(false))
        video.removeEventListener("loadedmetadata", () => {
          setDuration(video.duration)
          setIsLoading(false)
        })
        video.removeEventListener("waiting", () => setIsLoading(true))
        video.removeEventListener("playing", () => setIsLoading(false))
        video.removeEventListener("canplay", () => setIsLoading(false))
      }

      document.removeEventListener("fullscreenchange", handleFullscreenChange)

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [autoPlay, onPlay])

  return (
    <div
      ref={playerRef}
      className={cn("relative group overflow-hidden rounded-lg", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        className="w-full h-full rounded-lg object-cover"
        poster={poster}
        onClick={togglePlay}
        loop={loop}
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm"
          >
            <Loader2 className="h-8 w-8 text-foreground animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause button overlay */}
      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30 text-foreground"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video title and description */}
      {(title || description) && (
        <AnimatePresence>
          {(!isPlaying || showControls) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 right-0 p-4"
            >
              <GlassPanel className="p-3" intensity="high">
                {title && <h3 className="font-medium text-sm md:text-base">{title}</h3>}
                {description && <p className="text-xs md:text-sm text-foreground/70 mt-1">{description}</p>}
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Controls */}
      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-4"
          >
            <GlassPanel className="p-2 flex flex-col gap-2" intensity="high">
              <div
                className="relative h-1.5 bg-foreground/20 rounded-full overflow-hidden cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-foreground rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-0 h-full w-3 bg-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </Button>

                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={toggleMute}
                      onMouseEnter={() => setShowVolumeSlider(true)}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 80 }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-8 top-1/2 -translate-y-1/2 h-8 px-2 flex items-center"
                          onMouseEnter={() => setShowVolumeSlider(true)}
                          onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                          <Slider
                            value={[volume]}
                            min={0}
                            max={1}
                            step={0.01}
                            onValueChange={handleVolumeChange}
                            className="w-full"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <span className="text-xs text-foreground/80">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
