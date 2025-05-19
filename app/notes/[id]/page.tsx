"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bookmark,
  Download,
  Share2,
  Clock,
  Copy,
  Check,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Play,
  FolderPlus,
  LayoutGrid,
  LayoutList,
  HelpCircle,
  MapPin,
  BookOpen,
  Sparkles,
  Lightbulb,
  Zap,
  Maximize,
  Minimize,
  Mic,
  Volume2,
  Pause,
  Star,
  Folder,
  FolderOpen,
  FileText,
  Printer,
  FileDown,
  FileIcon,
  Info,
  Brain,
  Network,
  VolumeX,
  Mail,
  Twitter,
  Linkedin,
  LinkIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { SEOHead } from "@/components/seo/seo-head"
import { useMediaQuery } from "@/hooks/use-media-query"

// Types
interface Section {
  id: string
  title: string
  time: string
  content: string
  keyPoints: string[]
}

interface VoiceNote {
  id: string
  duration: string
  timestamp: string
  transcription: string
}

interface NoteData {
  id: string
  title: string
  videoId: string
  videoUrl: string
  thumbnailUrl: string
  duration: string
  views: string
  createdAt: string
  updatedAt: string
  wordCount: number
  tags: string[]
  sections: Section[]
  summary: string
  transcript: string[]
}

export default function NotePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("notes")
  const [progress, setProgress] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [selectedText, setSelectedText] = useState("")
  const [showHighlightTools, setShowHighlightTools] = useState(false)
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0 })
  const [viewDensity, setViewDensity] = useState<"compact" | "comfortable">("comfortable")
  const [helpfulRating, setHelpfulRating] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showVoiceNotes, setShowVoiceNotes] = useState(false)
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingNote, setCurrentPlayingNote] = useState<string | null>(null)
  const [showKnowledgeMap, setShowKnowledgeMap] = useState(false)
  const [quizDifficulty, setQuizDifficulty] = useState("medium")
  const [showQuizOptions, setShowQuizOptions] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [showFolderOptions, setShowFolderOptions] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>("1")
  const [noteData, setNoteData] = useState<NoteData | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoVolume, setVideoVolume] = useState(80)
  const [videoMuted, setVideoMuted] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [currentVideoTime, setCurrentVideoTime] = useState("0:00")
  const [showVideoControls, setShowVideoControls] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Create refs for each section to track active section during scroll
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Mock data for the note
  useEffect(() => {
    // Simulate API call to fetch note data
    setTimeout(() => {
      const mockData: NoteData = {
        id,
        title: "Understanding Quantum Computing in 15 Minutes",
        videoId: "qw9TkZA_Ixo",
        videoUrl: "https://example.com/video",
        thumbnailUrl: "/placeholder.svg?height=400&width=600",
        duration: "15:42",
        views: "1.2M",
        createdAt: "2025-05-05T12:00:00Z",
        updatedAt: "2025-05-05T12:00:00Z",
        wordCount: 842,
        tags: ["Quantum Computing", "Physics", "Technology"],
        sections: [
          {
            id: "1",
            title: "Introduction to Quantum Computing",
            time: "00:42",
            content:
              "Quantum computing represents a paradigm shift from classical computing, utilizing quantum mechanical phenomena to perform calculations.",
            keyPoints: [
              "Classical computers use bits (0 or 1), while quantum computers use quantum bits or qubits.",
              "Superposition: qubits can exist in multiple states simultaneously",
              "Entanglement: qubits can be correlated with each other",
              "Potential to solve certain problems exponentially faster than classical computers",
            ],
          },
          {
            id: "2",
            title: "Quantum Bits (Qubits)",
            time: "03:15",
            content:
              "Qubits are the fundamental building blocks of quantum computers, analogous to bits in classical computers.",
            keyPoints: [
              "Unlike classical bits which can only be 0 or 1, qubits can exist in a superposition of both states.",
              "Physical implementations include superconducting circuits, trapped ions, photonic qubits, and topological qubits.",
              "Challenges include maintaining quantum coherence and reducing error rates.",
            ],
          },
          {
            id: "3",
            title: "Quantum Algorithms",
            time: "06:22",
            content:
              "Quantum algorithms are designed to take advantage of quantum phenomena to solve specific problems more efficiently than classical algorithms.",
            keyPoints: [
              "Shor's Algorithm: Efficiently factors large numbers, threatening current cryptographic systems.",
              "Grover's Algorithm: Provides a quadratic speedup for searching unsorted databases.",
              "Quantum Fourier Transform: A quantum version of the classical Fourier transform, a building block for many quantum algorithms.",
              "Quantum algorithms for simulation of quantum systems, with applications in chemistry and materials science.",
            ],
          },
          {
            id: "4",
            title: "Practical Applications",
            time: "09:45",
            content:
              "While still in early stages, quantum computing has several promising applications across different fields.",
            keyPoints: [
              "Cryptography: Breaking current encryption systems and developing quantum-resistant cryptography.",
              "Drug Discovery: Simulating molecular interactions to accelerate pharmaceutical research.",
              "Optimization Problems: Solving complex logistics, financial modeling, and resource allocation problems.",
              "Artificial Intelligence: Potential quantum advantage in machine learning algorithms.",
              "Materials Science: Designing new materials with specific properties.",
            ],
          },
          {
            id: "5",
            title: "Current State and Future Outlook",
            time: "12:30",
            content: "Quantum computing is rapidly evolving but still faces significant challenges.",
            keyPoints: [
              "Current quantum computers have limited qubits (50-100 range) with high error rates.",
              "Quantum supremacy (performing tasks impossible for classical computers) has been demonstrated.",
              "Major companies investing in quantum computing: IBM, Google, Microsoft, Amazon, and several startups.",
              "Timeline for practical, error-corrected quantum computers: 5-10 years for specialized applications.",
              "Hybrid classical-quantum approaches are likely to be the first commercially viable applications.",
            ],
          },
        ],
        summary:
          "This video provides a comprehensive introduction to quantum computing, explaining how it differs from classical computing through the use of qubits that leverage quantum mechanical properties like superposition and entanglement. It covers the physical implementations of qubits, major quantum algorithms like Shor's and Grover's, and practical applications across cryptography, drug discovery, optimization, AI, and materials science. The current state of quantum computing is discussed, noting that while quantum supremacy has been demonstrated, practical quantum computers with error correction are still 5-10 years away, with hybrid classical-quantum approaches likely to emerge first.",
        transcript: [
          {
            time: "0:00",
            text: "Hello and welcome to this introduction to quantum computing. Today we'll explore how quantum computers work and why they're poised to revolutionize computing as we know it.",
          },
          {
            time: "0:15",
            text: "Let's start with the basics. Classical computers, the ones we use every day, process information using bits - binary digits that can be either 0 or 1. Quantum computers, on the other hand, use quantum bits or qubits.",
          },
          {
            time: "0:32",
            text: "What makes qubits special is that they leverage two key quantum mechanical properties: superposition and entanglement. Superposition allows qubits to exist in multiple states simultaneously, while entanglement creates correlations between qubits that classical bits cannot achieve.",
          },
          {
            time: "1:05",
            text: "This gives quantum computers the potential to solve certain types of problems exponentially faster than classical computers. However, it's important to note that quantum computers aren't simply faster versions of classical computers - they're fundamentally different machines designed for specific types of calculations.",
          },
        ],
      }

      setNoteData(mockData)

      // Initialize expanded sections
      const initialExpandedSections: Record<string, boolean> = {}
      mockData.sections.forEach((section) => {
        initialExpandedSections[section.id] = true
      })
      setExpandedSections(initialExpandedSections)

      // Mock voice notes
      setVoiceNotes([
        {
          id: "vn1",
          duration: "0:32",
          timestamp: "Just now",
          transcription:
            "I need to remember that quantum computing uses qubits instead of classical bits, and the two key properties are superposition and entanglement. Shor's algorithm is important for cryptography.",
        },
      ])

      setLoading(false)
    }, 1500)

    // Simulate loading with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(interval)
  }, [id])

  // Set up intersection observers for each section
  useEffect(() => {
    if (!noteData || loading) return

    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -70% 0px",
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("data-section-id")
          if (sectionId) {
            setActiveSection(sectionId)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all section elements
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [noteData, loading])

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection()
      if (selection && selection.toString().trim().length > 0) {
        setSelectedText(selection.toString())

        // Get position for highlight tools
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setHighlightPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        })

        setShowHighlightTools(true)
      } else {
        setShowHighlightTools(false)
      }
    }

    document.addEventListener("mouseup", handleTextSelection)
    return () => document.removeEventListener("mouseup", handleTextSelection)
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + C to copy content
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedText) {
        navigator.clipboard.writeText(selectedText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }

      // Escape to exit fullscreen
      if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen()
      }

      // Spacebar to play/pause video
      if (e.key === " " && e.target === document.body) {
        e.preventDefault()
        toggleVideoPlayback()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedText, isFullscreen])

  const handleCopy = () => {
    navigator.clipboard.writeText(getContentText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getContentText = () => {
    if (!noteData) return ""

    if (activeTab === "notes") {
      return noteData.sections
        .map(
          (section) =>
            `${section.id}. ${section.title}\n\n${section.content}\n\nKey points:\n${section.keyPoints.map((point) => `• ${point}`).join("\n")}\n\n`,
        )
        .join("")
    } else if (activeTab === "summary") {
      return noteData.summary
    } else {
      return noteData.transcript.map((item) => `[${item.time}] ${item.text}`).join("\n\n")
    }
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const handleHighlight = (color: string) => {
    console.log(`Highlighting text: "${selectedText}" with color: ${color}`)
    setShowHighlightTools(false)
  }

  const jumpToTimestamp = (timestamp: string) => {
    console.log(`Jumping to timestamp: ${timestamp}`)
    // Implementation would connect to video player
    if (videoRef.current) {
      // Convert timestamp to seconds
      const [minutes, seconds] = timestamp.split(":").map(Number)
      const timeInSeconds = minutes * 60 + seconds

      videoRef.current.currentTime = timeInSeconds
      if (!isVideoPlaying) {
        videoRef.current.play()
        setIsVideoPlaying(true)
      }
    }
  }

  const setHelpfulnessRating = (rating: number) => {
    setHelpfulRating(rating)
  }

  const toggleFullscreen = () => {
    if (!fullscreenRef.current) return

    if (!isFullscreen) {
      if (fullscreenRef.current.requestFullscreen) {
        fullscreenRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const toggleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
        recordingInterval.current = null
      }
      setIsRecording(false)
      setShowVoiceNotes(true)

      // In a real implementation, we would save the recording here
      // For now, let's simulate adding a new voice note
      const newVoiceNote: VoiceNote = {
        id: `vn${voiceNotes.length + 1}`,
        duration: formatRecordingTime(recordingTime),
        timestamp: "Just now",
        transcription: "This is a simulated transcription of your voice note about quantum computing concepts.",
      }

      setVoiceNotes((prev) => [newVoiceNote, ...prev])
      setRecordingTime(0)
    } else {
      // Start recording
      setIsRecording(true)
      setRecordingTime(0)
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
  }

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const generateQuiz = (difficulty: string) => {
    console.log(`Generating ${difficulty} quiz from notes`)
    // Implementation would generate a quiz based on the notes
    setShowQuizOptions(false)

    // Navigate to quiz page (in a real implementation)
    // router.push(`/quiz/${id}?difficulty=${difficulty}`);
  }

  const generateKnowledgeMap = () => {
    setShowKnowledgeMap(!showKnowledgeMap)
  }

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return

    if (isVideoPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }

    setIsVideoPlaying(!isVideoPlaying)
  }

  const handleVolumeChange = (value: number[]) => {
    setVideoVolume(value[0])
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100
    }

    if (value[0] === 0) {
      setVideoMuted(true)
    } else if (videoMuted) {
      setVideoMuted(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return

    videoRef.current.muted = !videoMuted
    setVideoMuted(!videoMuted)
  }

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return

    const currentTime = videoRef.current.currentTime
    const duration = videoRef.current.duration
    const progressPercent = (currentTime / duration) * 100

    setVideoProgress(progressPercent)

    // Format current time
    const minutes = Math.floor(currentTime / 60)
    const seconds = Math.floor(currentTime % 60)
    setCurrentVideoTime(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`)
  }

  const handleVideoProgressChange = (value: number[]) => {
    if (!videoRef.current) return

    const newTime = (value[0] / 100) * videoRef.current.duration
    videoRef.current.currentTime = newTime
  }

  const scrollToSection = (sectionId: string) => {
    const sectionRef = sectionRefs.current[sectionId]
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const exportNote = (format: string) => {
    console.log(`Exporting note in ${format} format`)
    setShowExportOptions(false)
  }

  const shareNote = (platform: string) => {
    console.log(`Sharing note on ${platform}`)
    setShowShareOptions(false)
  }

  const addToFolder = (folderId: string) => {
    console.log(`Adding note to folder ${folderId}`)
    setShowFolderOptions(false)
  }

  const playVoiceNote = (noteId: string) => {
    if (currentPlayingNote === noteId) {
      // Toggle play/pause for current note
      setIsPlaying(!isPlaying)
    } else {
      // Start playing a new note
      setCurrentPlayingNote(noteId)
      setIsPlaying(true)
    }
  }

  if (loading) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-foreground border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 rounded-full border border-foreground/10 animate-pulse"></div>
          </div>
          <h2 className="text-xl font-medium mt-4">Generating your notes...</h2>
          <div className="max-w-md text-center">
            <p className="text-foreground/70 mb-2">Our AI is analyzing the video and creating structured notes</p>
            <Progress value={progress} className="h-1 w-full" />
            <p className="text-xs text-foreground/60 mt-2">{progress}% complete</p>
          </div>
        </div>
      </div>
    )
  }

  if (!noteData) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <Info className="h-16 w-16 text-foreground/50" />
          <h2 className="text-xl font-medium mt-4">Note not found</h2>
          <p className="text-foreground/70 mb-4">The note you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title={`${noteData.title} | Keytake Notes`}
        description={`AI-generated notes on ${noteData.title}. Learn about ${noteData.tags.join(", ")} with comprehensive, structured notes.`}
        keywords={[
          ...noteData.tags,
          "video notes",
          "AI notes",
          "educational content",
          "learning resources",
          "study notes",
          "quantum computing notes",
        ]}
        type="article"
        publishedTime={noteData.createdAt}
        modifiedTime={noteData.updatedAt}
        imageUrl="https://keytake.ai/images/notes-preview.jpg"
        videoUrl={noteData.videoUrl}
        videoDuration={noteData.duration}
        videoViews={noteData.views}
      />

      <div className="container py-4 animate-fade-in" ref={fullscreenRef}>
        {/* Header Section */}
        <GlassPanel className="p-4 mb-6 border-foreground/10" intensity="medium">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-foreground/5" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-bold">{noteData.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 justify-center md:justify-start">
                <div className="flex items-center gap-1 text-sm text-foreground/60">
                  <Clock className="h-4 w-4" />
                  <span>{noteData.duration}</span>
                </div>
                <div className="text-sm text-foreground/60">•</div>
                <div className="text-sm text-foreground/60">{noteData.views} views</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
              {noteData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-foreground/5 border-foreground/20 cursor-pointer hover:bg-foreground/10"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </GlassPanel>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              {/* Action Toolbar */}
              <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <TabsList className="bg-foreground/5 p-1 border border-foreground/10">
                    <TabsTrigger value="notes" className="data-[state=active]:bg-background">
                      Notes
                    </TabsTrigger>
                    <TabsTrigger value="summary" className="data-[state=active]:bg-background">
                      Summary
                    </TabsTrigger>
                    <TabsTrigger value="transcript" className="data-[state=active]:bg-background">
                      Transcript
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-1 hover:bg-foreground/5 ${saved ? "text-foreground" : "text-foreground/70"}`}
                            onClick={handleSave}
                          >
                            <Bookmark className="h-4 w-4 transition-colors" fill={saved ? "currentColor" : "none"} />
                            <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{saved ? "Remove from saved notes" : "Save this note"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 hover:bg-foreground/5"
                            onClick={() => setShowExportOptions(!showExportOptions)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Export this note in various formats</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 hover:bg-foreground/5"
                            onClick={() => setShowShareOptions(!showShareOptions)}
                          >
                            <Share2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Share</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share this note with others</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 hover:bg-foreground/5"
                            onClick={handleCopy}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy note content to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 hover:bg-foreground/5 hidden md:flex"
                            onClick={toggleFullscreen}
                          >
                            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                            <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Export Options Dropdown */}
                <AnimatePresence>
                  {showExportOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 z-50 bg-background border border-foreground/10 rounded-md shadow-lg p-2 w-48"
                    >
                      <div className="text-sm font-medium mb-2 px-2">Export as:</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => exportNote("pdf")}
                      >
                        <FileDown className="h-4 w-4" />
                        PDF Document
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => exportNote("markdown")}
                      >
                        <FileText className="h-4 w-4" />
                        Markdown
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => exportNote("word")}
                      >
                        <FileIcon className="h-4 w-4" />
                        Word Document
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => exportNote("print")}
                      >
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Share Options Dropdown */}
                <AnimatePresence>
                  {showShareOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 z-50 bg-background border border-foreground/10 rounded-md shadow-lg p-2 w-48"
                    >
                      <div className="text-sm font-medium mb-2 px-2">Share via:</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => shareNote("email")}
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => shareNote("link")}
                      >
                        <LinkIcon className="h-4 w-4" />
                        Copy Link
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => shareNote("twitter")}
                      >
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => shareNote("linkedin")}
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content Area */}
                <GlassPanel
                  className={`p-6 md:p-8 border-foreground/10 ${viewDensity === "compact" ? "text-sm" : "text-base"}`}
                  intensity="medium"
                >
                  <div ref={contentRef}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TabsContent value="notes" className="mt-0 space-y-6">
                          {noteData.sections.map((section) => (
                            <div
                              key={section.id}
                              className={`border-b border-foreground/10 pb-6 ${activeSection === section.id ? "bg-foreground/5 -mx-4 px-4 py-2 rounded-md transition-colors duration-300" : ""}`}
                              ref={(el) => (sectionRefs.current[section.id] = el)}
                              data-section-id={section.id}
                            >
                              <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleSection(section.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <h2 className="text-2xl font-bold">
                                    {section.id}. {section.title}
                                  </h2>
                                  <Badge
                                    variant="outline"
                                    className="bg-foreground/5 border-foreground/20 cursor-pointer hover:bg-foreground/10"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      jumpToTimestamp(section.time)
                                    }}
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    {section.time}
                                  </Badge>
                                </div>
                                {expandedSections[section.id] ? (
                                  <ChevronUp className="h-5 w-5 text-foreground/60" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-foreground/60" />
                                )}
                              </div>

                              <AnimatePresence>
                                {expandedSections[section.id] && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-4 space-y-3 text-foreground/80"
                                  >
                                    <p>{section.content}</p>
                                    <div className="pl-4 border-l-2 border-foreground/20 mt-4">
                                      <h3 className="font-medium text-foreground mb-2">Key points:</h3>
                                      <ul className="list-disc pl-6 space-y-2">
                                        {section.keyPoints.map((point, index) => (
                                          <li key={index}>{point}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="summary" className="mt-0">
                          <div className="prose dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed text-foreground/80">{noteData.summary}</p>
                          </div>
                        </TabsContent>

                        <TabsContent value="transcript" className="mt-0">
                          <div className="space-y-4 text-foreground/70">
                            {noteData.transcript.map((item, index) => (
                              <p key={index}>
                                <span className="text-foreground font-medium">[{item.time}]</span> {item.text}
                              </p>
                            ))}
                            <div className="py-2 text-center text-sm">
                              <Button variant="link" className="text-foreground font-medium">
                                Show full transcript
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </GlassPanel>
              </Tabs>

              {/* Knowledge Map Visualization */}
              <AnimatePresence>
                {showKnowledgeMap && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <GlassPanel className="p-4 border-foreground/10" intensity="medium">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <Network className="h-4 w-4" />
                          Knowledge Map
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setShowKnowledgeMap(false)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="h-[400px] relative bg-foreground/5 rounded-md flex items-center justify-center">
                        {/* This would be replaced with an actual interactive knowledge map visualization */}
                        <div className="text-center">
                          <Network className="h-16 w-16 mx-auto text-foreground/30 mb-4" />
                          <p className="text-foreground/60">Interactive knowledge map visualization</p>
                          <p className="text-sm text-foreground/40">
                            Showing connections between quantum computing concepts
                          </p>
                        </div>
                      </div>
                    </GlassPanel>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Voice Notes Panel */}
              <AnimatePresence>
                {showVoiceNotes && voiceNotes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <GlassPanel className="p-4 border-foreground/10" intensity="medium">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          Your Voice Notes
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setShowVoiceNotes(false)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {voiceNotes.map((note) => (
                          <div key={note.id} className="space-y-2">
                            <div className="flex items-center gap-3 p-3 bg-foreground/5 rounded-md">
                              <div className="h-8 w-8 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                                <Volume2 className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">Voice Note {note.id.replace("vn", "")}</div>
                                <div className="text-xs text-foreground/60">
                                  {note.duration} • {note.timestamp}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => playVoiceNote(note.id)}
                              >
                                {currentPlayingNote === note.id && isPlaying ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="p-3 bg-foreground/5 rounded-md">
                              <p className="text-sm text-foreground/80">
                                <span className="font-medium">AI Transcription:</span> {note.transcription}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassPanel>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Toolbar */}
              <GlassPanel className="p-4 mt-6 border-foreground/10" intensity="medium">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-foreground/60 mb-1">Was this helpful?</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setHelpfulnessRating(star)}
                          >
                            <Star
                              className="h-4 w-4"
                              fill={helpfulRating && star <= helpfulRating ? "currentColor" : "none"}
                            />
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="h-8 border-r border-foreground/10 hidden sm:block"></div>

                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => setShowFolderOptions(!showFolderOptions)}
                      >
                        <FolderPlus className="h-4 w-4" />
                        Add to Folder
                      </Button>

                      <AnimatePresence>
                        {showFolderOptions && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 top-full mt-1 z-50 bg-background border border-foreground/10 rounded-md shadow-lg p-2 w-48"
                          >
                            <div className="text-sm font-medium mb-2 px-2">Select folder:</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start gap-2"
                              onClick={() => addToFolder("study")}
                            >
                              <FolderOpen className="h-4 w-4" />
                              Study Materials
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start gap-2"
                              onClick={() => addToFolder("physics")}
                            >
                              <FolderOpen className="h-4 w-4" />
                              Physics
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start gap-2"
                              onClick={() => addToFolder("favorites")}
                            >
                              <FolderOpen className="h-4 w-4" />
                              Favorites
                            </Button>
                            <div className="border-t border-foreground/10 my-1 pt-1">
                              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                                <Folder className="h-4 w-4" />
                                Create New Folder
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => setShowQuizOptions(!showQuizOptions)}
                      >
                        <BookOpen className="h-4 w-4" />
                        Generate Quiz
                      </Button>

                      <AnimatePresence>
                        {showQuizOptions && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 top-full mt-1 z-50 bg-background border border-foreground/10 rounded-md shadow-lg p-2 w-48"
                          >
                            <div className="text-sm font-medium mb-2 px-2">Difficulty level:</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start gap-2"
                              onClick={() => generateQuiz("easy")}
                            >
                              <Sparkles className="h-4 w-4" />
                              Easy
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start gap-2"
                              onClick={() => generateQuiz("medium")}
                            >
                              <Sparkles className="h-4 w-4" />
                              Medium
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start gap-2"
                              onClick={() => generateQuiz("hard")}
                            >
                              <Sparkles className="h-4 w-4" />
                              Hard
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button variant="outline" size="sm" className="gap-1" onClick={generateKnowledgeMap}>
                      <MapPin className="h-4 w-4" />
                      Knowledge Map
                    </Button>

                    <div className="relative">
                      <Button
                        variant={isRecording ? "default" : "outline"}
                        size="sm"
                        className={`gap-1 ${isRecording ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
                        onClick={toggleVoiceRecording}
                      >
                        <Mic className="h-4 w-4" />
                        {isRecording ? `Recording ${formatRecordingTime(recordingTime)}` : "Voice Notes"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/60">View:</span>
                    <Button
                      variant={viewDensity === "comfortable" ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewDensity("comfortable")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewDensity === "compact" ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewDensity("compact")}
                    >
                      <LayoutList className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <GlassPanel
              className="sticky top-24 overflow-hidden border-foreground/10"
              intensity="medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Video Player */}
              <div
                className="relative aspect-video w-full group"
                onMouseEnter={() => setShowVideoControls(true)}
                onMouseLeave={() => setShowVideoControls(false)}
              >
                <video
                  ref={videoRef}
                  src="/placeholder.mp4"
                  poster={noteData.thumbnailUrl}
                  className="w-full h-full object-cover"
                  onClick={toggleVideoPlayback}
                  onTimeUpdate={handleVideoTimeUpdate}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  {!isVideoPlaying && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-16 w-16 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30 text-foreground"
                      onClick={toggleVideoPlayback}
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Video Controls */}
                <AnimatePresence>
                  {(showVideoControls || !isVideoPlaying) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-0 left-0 right-0 p-2 bg-background/30 backdrop-blur-sm"
                    >
                      <div className="flex flex-col gap-1">
                        <Slider
                          value={[videoProgress]}
                          min={0}
                          max={100}
                          step={0.1}
                          onValueChange={handleVideoProgressChange}
                          className="h-1"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleVideoPlayback}>
                              {isVideoPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            </Button>
                            <span className="text-xs text-white">{currentVideoTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleMute}>
                              {videoMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                            </Button>
                            <Slider
                              value={[videoVolume]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={handleVolumeChange}
                              className="w-16 h-1"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Navigation */}
              <div className="p-4 border-b border-foreground/10">
                <h3 className="font-medium mb-3">Quick Navigation</h3>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-2">
                    {noteData.sections.map((section) => (
                      <div
                        key={section.id}
                        className={`flex items-center justify-between p-2 rounded-md hover:bg-foreground/5 cursor-pointer ${
                          activeSection === section.id ? "bg-foreground/10 font-medium" : ""
                        }`}
                        onClick={() => scrollToSection(section.id)}
                      >
                        <span className="text-sm truncate">
                          {section.id}. {section.title}
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-foreground/5 border-foreground/20"
                          onClick={(e) => {
                            e.stopPropagation()
                            jumpToTimestamp(section.time)
                          }}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          {section.time}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Learning Tools */}
              <div className="p-4 border-b border-foreground/10">
                <h3 className="font-medium mb-3">Learning Tools</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9">
                    <Sparkles className="h-4 w-4" />
                    Generate Flashcards
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9">
                    <Lightbulb className="h-4 w-4" />
                    Practice Questions
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9">
                    <Zap className="h-4 w-4" />
                    Concept Connections
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9">
                    <Brain className="h-4 w-4" />
                    AI Tutor
                  </Button>
                </div>
              </div>

              {/* Note Information */}
              <div className="p-4 border-b border-foreground/10">
                <h3 className="font-medium mb-3">Note Information</h3>
                <div className="space-y-2 text-sm text-foreground/70">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{new Date(noteData.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last edited:</span>
                    <span>{new Date(noteData.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Word count:</span>
                    <span>{noteData.wordCount}</span>
                  </div>
                </div>
              </div>

              {/* Related Videos */}
              <div className="p-4">
                <h3 className="font-medium mb-3">Related Videos</h3>
                <div className="space-y-3">
                  {[
                    "Quantum Computing Applications in Finance",
                    "How Quantum Encryption Works",
                    "The Race for Quantum Supremacy",
                  ].map((title, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 cursor-pointer hover:bg-foreground/5 p-2 rounded-md"
                    >
                      <div className="relative h-12 w-20 flex-shrink-0">
                        <Image
                          src={`/placeholder.svg?height=120&width=200`}
                          alt={title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <span className="text-sm">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Text Selection Highlight Tools */}
        <AnimatePresence>
          {showHighlightTools && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed z-50 bg-background border border-foreground/10 rounded-lg shadow-lg p-2 flex gap-2"
              style={{
                left: `${highlightPosition.x}px`,
                top: `${highlightPosition.y - 40}px`,
                transform: "translateX(-50%)",
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-yellow-200/20 hover:bg-yellow-200/30"
                onClick={() => handleHighlight("yellow")}
              >
                <div className="h-4 w-4 rounded-full bg-yellow-200"></div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-green-200/20 hover:bg-green-200/30"
                onClick={() => handleHighlight("green")}
              >
                <div className="h-4 w-4 rounded-full bg-green-200"></div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-blue-200/20 hover:bg-blue-200/30"
                onClick={() => handleHighlight("blue")}
              >
                <div className="h-4 w-4 rounded-full bg-blue-200"></div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-pink-200/20 hover:bg-pink-200/30"
                onClick={() => handleHighlight("pink")}
              >
                <div className="h-4 w-4 rounded-full bg-pink-200"></div>
              </Button>
              <div className="h-8 border-r border-foreground/10"></div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-foreground/10"
                onClick={() => {
                  navigator.clipboard.writeText(selectedText)
                  setShowHighlightTools(false)
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full shadow-lg border-foreground/20 hover:border-foreground/60 transition-all duration-300"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  )
}
