"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Mic,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Sparkles,
  Lightbulb,
  Zap,
  Volume2,
  Maximize,
  Minimize,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Head from "next/head"

export default function NotesPage() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")
  const id = searchParams.get("id")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("notes")
  const [progress, setProgress] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "1": true,
    "2": true,
    "3": true,
    "4": true,
    "5": true,
  })
  const [selectedText, setSelectedText] = useState("")
  const [showHighlightTools, setShowHighlightTools] = useState(false)
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0 })
  const [viewDensity, setViewDensity] = useState<"compact" | "comfortable">("comfortable")
  const [helpfulRating, setHelpfulRating] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showVoiceNotes, setShowVoiceNotes] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)

  // SEO metadata
  const pageTitle = "Understanding Quantum Computing in 15 Minutes | Keytake Notes"
  const pageDescription =
    "Comprehensive AI-generated notes on quantum computing, covering qubits, quantum algorithms, practical applications, and future outlook."
  const pageKeywords = [
    "quantum computing notes",
    "quantum computing tutorial",
    "quantum bits",
    "qubits",
    "quantum algorithms",
    "Shor's algorithm",
    "Grover's algorithm",
    "quantum applications",
    "quantum future",
    "AI-generated notes",
    "video notes",
    "educational notes",
    "Keytake",
  ]

  useEffect(() => {
    // Simulate loading with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setLoading(false)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

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

  const handleCopy = () => {
    navigator.clipboard.writeText(getContentText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getContentText = () => {
    // This would extract all text content from the active tab
    if (activeTab === "notes") {
      return "1. Introduction to Quantum Computing\n\nQuantum computing represents a paradigm shift from classical computing, utilizing quantum mechanical phenomena to perform calculations.\n\nKey concepts:\n• Classical computers use bits (0 or 1), while quantum computers use quantum bits or qubits\n• Superposition: qubits can exist in multiple states simultaneously\n• Entanglement: qubits can be correlated with each other\n• Potential to solve certain problems exponentially faster than classical computers\n\n2. Quantum Bits (Qubits)...\n\n[Full notes content]"
    } else if (activeTab === "summary") {
      return "This video provides a comprehensive introduction to quantum computing, explaining how it differs from classical computing through the use of qubits that leverage quantum mechanical properties like superposition and entanglement. It covers the physical implementations of qubits, major quantum algorithms like Shor's and Grover's, and practical applications across cryptography, drug discovery, optimization, AI, and materials science. The current state of quantum computing is discussed, noting that while quantum supremacy has been demonstrated, practical quantum computers with error correction are still 5-10 years away, with hybrid classical-quantum approaches likely to emerge first."
    } else {
      return "[Full transcript content]"
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

  const generateQuiz = () => {
    console.log("Generating quiz from notes")
    // Implementation would generate a quiz based on the notes
  }

  const generateKnowledgeMap = () => {
    console.log("Generating knowledge map")
    // Implementation would generate a visual knowledge map
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
            <div className="h-1 w-full bg-foreground/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-foreground" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-foreground/60 mt-2">{progress}% complete</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords.join(", ")} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://keytake.ai/notes/${id || ""}`} />
        <meta property="og:image" content="https://keytake.ai/images/quantum-computing-notes.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://keytake.ai/images/quantum-computing-notes.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LearningResource",
              name: pageTitle,
              description: pageDescription,
              learningResourceType: "Notes",
              educationalLevel: "Advanced",
              keywords: pageKeywords.join(", "),
              dateCreated: "2025-05-05T12:00:00Z",
              dateModified: "2025-05-05T12:00:00Z",
              author: {
                "@type": "Organization",
                name: "Keytake AI",
                url: "https://keytake.ai",
              },
              provider: {
                "@type": "Organization",
                name: "Keytake AI",
                url: "https://keytake.ai",
              },
            }),
          }}
        />
      </Head>

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
              <h1 className="text-xl md:text-2xl font-bold">Understanding Quantum Computing in 15 Minutes</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 justify-center md:justify-start">
                <div className="flex items-center gap-1 text-sm text-foreground/60">
                  <Clock className="h-4 w-4" />
                  <span>15:42</span>
                </div>
                <div className="text-sm text-foreground/60">•</div>
                <div className="text-sm text-foreground/60">1.2M views</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
              <Badge
                variant="outline"
                className="bg-foreground/5 border-foreground/20 cursor-pointer hover:bg-foreground/10"
              >
                Quantum Computing
              </Badge>
              <Badge
                variant="outline"
                className="bg-foreground/5 border-foreground/20 cursor-pointer hover:bg-foreground/10"
              >
                Physics
              </Badge>
              <Badge
                variant="outline"
                className="bg-foreground/5 border-foreground/20 cursor-pointer hover:bg-foreground/10"
              >
                Technology
              </Badge>
            </div>
          </div>
        </GlassPanel>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              {/* Action Toolbar */}
              <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
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

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-1 hover:bg-foreground/5 ${saved ? "text-foreground" : "text-foreground/70"}`}
                      onClick={handleSave}
                    >
                      <Bookmark className="h-4 w-4 transition-colors" fill={saved ? "currentColor" : "none"} />
                      {saved ? "Saved" : "Save"}
                    </Button>

                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-foreground/5">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>

                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-foreground/5">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>

                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-foreground/5" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 hover:bg-foreground/5 hidden md:flex"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    </Button>
                  </div>
                </div>

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
                          {/* Section 1 */}
                          <div className="border-b border-foreground/10 pb-6">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleSection("1")}
                            >
                              <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">1. Introduction to Quantum Computing</h2>
                                <Badge
                                  variant="outline"
                                  className="bg-foreground/5 border-foreground/20 cursor-pointer hover:bg-foreground/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    jumpToTimestamp("00:42")
                                  }}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  00:42
                                </Badge>
                              </div>
                              {expandedSections["1"] ? (
                                <ChevronUp className="h-5 w-5 text-foreground/60" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-foreground/60" />
                              )}
                            </div>

                            <AnimatePresence>
                              {expandedSections["1"] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-4 space-y-3 text-foreground/80"
                                >
                                  <p>
                                    Quantum computing represents a paradigm shift from classical computing, utilizing
                                    quantum mechanical phenomena to perform calculations.
                                  </p>
                                  <div className="pl-4 border-l-2 border-foreground/20 mt-4">
                                    <h3 className="font-medium text-foreground mb-2">Key concepts:</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                      <li>
                                        Classical computers use bits (0 or 1), while quantum computers use quantum bits
                                        or qubits.
                                      </li>
                                      <li>
                                        <span className="font-medium text-foreground">Superposition:</span> qubits can
                                        exist in multiple states simultaneously
                                      </li>
                                      <li>
                                        <span className="font-medium text-foreground">Entanglement:</span> qubits can be
                                        correlated with each other
                                      </li>
                                      <li>
                                        Potential to solve certain problems exponentially faster than classical
                                        computers
                                      </li>
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Section 2 */}
                          <div className="border-b border-foreground/10 pb-6">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleSection("2")}
                            >
                              <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">2. Quantum Bits (Qubits)</h2>
                                <Badge
                                  variant="outline"
                                  className="bg-foreground/5 border-foreground/20 cursor-pointer hover:bg-foreground/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    jumpToTimestamp("03:15")
                                  }}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  03:15
                                </Badge>
                              </div>
                              {expandedSections["2"] ? (
                                <ChevronUp className="h-5 w-5 text-foreground/60" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-foreground/60" />
                              )}
                            </div>

                            <AnimatePresence>
                              {expandedSections["2"] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-4 space-y-3 text-foreground/80"
                                >
                                  <p>
                                    Qubits are the fundamental building blocks of quantum computers, analogous to bits
                                    in classical computers.
                                  </p>
                                  <div className="pl-4 border-l-2 border-foreground/20 mt-4">
                                    <h3 className="font-medium text-foreground mb-2">Key points:</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                      <li>
                                        Unlike classical bits which can only be 0 or 1, qubits can exist in a
                                        superposition of both states.
                                      </li>
                                      <li>Physical implementations include:</li>
                                      <ul className="list-circle pl-6 space-y-1">
                                        <li>Superconducting circuits</li>
                                        <li>Trapped ions</li>
                                        <li>Photonic qubits</li>
                                        <li>Topological qubits</li>
                                      </ul>
                                      <li>
                                        Challenges include maintaining quantum coherence and reducing error rates.
                                      </li>
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Section 3 */}
                          <div className="border-b border-foreground/10 pb-6">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleSection("3")}
                            >
                              <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">3. Quantum Algorithms</h2>
                                <Badge
                                  variant="outline"
                                  className="bg-foreground/5 border-foreground/20 cursor-pointer hover:bg-foreground/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    jumpToTimestamp("06:22")
                                  }}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  06:22
                                </Badge>
                              </div>
                              {expandedSections["3"] ? (
                                <ChevronUp className="h-5 w-5 text-foreground/60" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-foreground/60" />
                              )}
                            </div>

                            <AnimatePresence>
                              {expandedSections["3"] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-4 space-y-3 text-foreground/80"
                                >
                                  <p>
                                    Quantum algorithms are designed to take advantage of quantum phenomena to solve
                                    specific problems more efficiently than classical algorithms.
                                  </p>
                                  <div className="pl-4 border-l-2 border-foreground/20 mt-4">
                                    <h3 className="font-medium text-foreground mb-2">Notable algorithms:</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                      <li>
                                        <span className="font-medium text-foreground">Shor's Algorithm:</span>{" "}
                                        Efficiently factors large numbers, threatening current cryptographic systems.
                                      </li>
                                      <li>
                                        <span className="font-medium text-foreground">Grover's Algorithm:</span>{" "}
                                        Provides a quadratic speedup for searching unsorted databases.
                                      </li>
                                      <li>
                                        <span className="font-medium text-foreground">Quantum Fourier Transform:</span>{" "}
                                        A quantum version of the classical Fourier transform, a building block for many
                                        quantum algorithms.
                                      </li>
                                      <li>
                                        Quantum algorithms for simulation of quantum systems, with applications in
                                        chemistry and materials science.
                                      </li>
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Section 4 */}
                          <div className="border-b border-foreground/10 pb-6">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleSection("4")}
                            >
                              <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">4. Practical Applications</h2>
                                <Badge
                                  variant="outline"
                                  className="bg-foreground/5 border-foreground/20 cursor-pointer hover:bg-foreground/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    jumpToTimestamp("09:45")
                                  }}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  09:45
                                </Badge>
                              </div>
                              {expandedSections["4"] ? (
                                <ChevronUp className="h-5 w-5 text-foreground/60" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-foreground/60" />
                              )}
                            </div>

                            <AnimatePresence>
                              {expandedSections["4"] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-4 space-y-3 text-foreground/80"
                                >
                                  <p>
                                    While still in early stages, quantum computing has several promising applications
                                    across different fields.
                                  </p>
                                  <div className="pl-4 border-l-2 border-foreground/20 mt-4">
                                    <h3 className="font-medium text-foreground mb-2">Application areas:</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                      <li>
                                        <span className="font-medium text-foreground">Cryptography:</span> Breaking
                                        current encryption systems and developing quantum-resistant cryptography.
                                      </li>
                                      <li>
                                        <span className="font-medium text-foreground">Drug Discovery:</span> Simulating
                                        molecular interactions to accelerate pharmaceutical research.
                                      </li>
                                      <li>
                                        <span className="font-medium text-foreground">Optimization Problems:</span>{" "}
                                        Solving complex logistics, financial modeling, and resource allocation problems.
                                      </li>
                                      <li>
                                        <span className="font-medium text-foreground">Artificial Intelligence:</span>{" "}
                                        Potential quantum advantage in machine learning algorithms.
                                      </li>
                                      <li>
                                        <span className="font-medium text-foreground">Materials Science:</span>{" "}
                                        Designing new materials with specific properties.
                                      </li>
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Section 5 */}
                          <div className="pb-6">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleSection("5")}
                            >
                              <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">5. Current State and Future Outlook</h2>
                                <Badge
                                  variant="outline"
                                  className="bg-foreground/5 border-foreground/20 cursor-pointer hover:bg-foreground/10"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    jumpToTimestamp("12:30")
                                  }}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  12:30
                                </Badge>
                              </div>
                              {expandedSections["5"] ? (
                                <ChevronUp className="h-5 w-5 text-foreground/60" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-foreground/60" />
                              )}
                            </div>

                            <AnimatePresence>
                              {expandedSections["5"] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-4 space-y-3 text-foreground/80"
                                >
                                  <p>Quantum computing is rapidly evolving but still faces significant challenges.</p>
                                  <div className="pl-4 border-l-2 border-foreground/20 mt-4">
                                    <h3 className="font-medium text-foreground mb-2">Current status:</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                      <li>
                                        Current quantum computers have limited qubits (50-100 range) with high error
                                        rates.
                                      </li>
                                      <li>
                                        Quantum supremacy (performing tasks impossible for classical computers) has been
                                        demonstrated.
                                      </li>
                                      <li>
                                        Major companies investing in quantum computing: IBM, Google, Microsoft, Amazon,
                                        and several startups.
                                      </li>
                                      <li>
                                        Timeline for practical, error-corrected quantum computers: 5-10 years for
                                        specialized applications.
                                      </li>
                                      <li>
                                        Hybrid classical-quantum approaches are likely to be the first commercially
                                        viable applications.
                                      </li>
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </TabsContent>

                        <TabsContent value="summary" className="mt-0">
                          <div className="prose dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed text-foreground/80">
                              This video provides a comprehensive introduction to quantum computing, explaining how it
                              differs from classical computing through the use of qubits that leverage quantum
                              mechanical properties like superposition and entanglement. It covers the physical
                              implementations of qubits, major quantum algorithms like Shor's and Grover's, and
                              practical applications across cryptography, drug discovery, optimization, AI, and
                              materials science. The current state of quantum computing is discussed, noting that while
                              quantum supremacy has been demonstrated, practical quantum computers with error correction
                              are still 5-10 years away, with hybrid classical-quantum approaches likely to emerge
                              first.
                            </p>
                          </div>
                        </TabsContent>

                        <TabsContent value="transcript" className="mt-0">
                          <div className="space-y-4 text-foreground/70">
                            <p>
                              <span className="text-foreground font-medium">[0:00]</span> Hello and welcome to this
                              introduction to quantum computing. Today we'll explore how quantum computers work and why
                              they're poised to revolutionize computing as we know it.
                            </p>
                            <p>
                              <span className="text-foreground font-medium">[0:15]</span> Let's start with the basics.
                              Classical computers, the ones we use every day, process information using bits - binary
                              digits that can be either 0 or 1. Quantum computers, on the other hand, use quantum bits
                              or qubits.
                            </p>
                            <p>
                              <span className="text-foreground font-medium">[0:32]</span> What makes qubits special is
                              that they leverage two key quantum mechanical properties: superposition and entanglement.
                              Superposition allows qubits to exist in multiple states simultaneously, while entanglement
                              creates correlations between qubits that classical bits cannot achieve.
                            </p>
                            <p>
                              <span className="text-foreground font-medium">[1:05]</span> This gives quantum computers
                              the potential to solve certain types of problems exponentially faster than classical
                              computers. However, it's important to note that quantum computers aren't simply faster
                              versions of classical computers - they're fundamentally different machines designed for
                              specific types of calculations.
                            </p>

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

              {/* Bottom Toolbar */}
              <GlassPanel className="p-4 mt-6 border-foreground/10" intensity="medium">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-foreground/60 mb-1">Was this helpful?</p>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setHelpfulnessRating(1)}>
                          <ThumbsUp className="h-4 w-4" fill={helpfulRating === 1 ? "currentColor" : "none"} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setHelpfulnessRating(0)}>
                          <ThumbsDown className="h-4 w-4" fill={helpfulRating === 0 ? "currentColor" : "none"} />
                        </Button>
                      </div>
                    </div>

                    <div className="h-8 border-r border-foreground/10 hidden sm:block"></div>

                    <Button variant="outline" size="sm" className="gap-1">
                      <FolderPlus className="h-4 w-4" />
                      Add to Folder
                    </Button>

                    <Button variant="outline" size="sm" className="gap-1" onClick={generateQuiz}>
                      <BookOpen className="h-4 w-4" />
                      Generate Quiz
                    </Button>

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

              {/* Voice Notes Panel */}
              <AnimatePresence>
                {showVoiceNotes && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GlassPanel className="p-4 mt-4 border-foreground/10" intensity="medium">
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
                        <div className="flex items-center gap-3 p-3 bg-foreground/5 rounded-md">
                          <div className="h-8 w-8 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                            <Volume2 className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Voice Note 1</div>
                            <div className="text-xs text-foreground/60">0:32 • Just now</div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 bg-foreground/5 rounded-md">
                          <p className="text-sm text-foreground/80">
                            <span className="font-medium">AI Transcription:</span> I need to remember that quantum
                            computing uses qubits instead of classical bits, and the two key properties are
                            superposition and entanglement. Shor's algorithm is important for cryptography.
                          </p>
                        </div>
                      </div>
                    </GlassPanel>
                  </motion.div>
                )}
              </AnimatePresence>
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
              {/* Video Thumbnail */}
              <div className="relative aspect-video w-full">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30 text-foreground"
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="p-4 border-b border-foreground/10">
                <h3 className="font-medium mb-3">Quick Navigation</h3>
                <div className="space-y-2">
                  {[
                    { id: "1", title: "Introduction to Quantum Computing", time: "00:42" },
                    { id: "2", title: "Quantum Bits (Qubits)", time: "03:15" },
                    { id: "3", title: "Quantum Algorithms", time: "06:22" },
                    { id: "4", title: "Practical Applications", time: "09:45" },
                    { id: "5", title: "Current State and Future Outlook", time: "12:30" },
                  ].map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-foreground/5 cursor-pointer"
                      onClick={() => {
                        toggleSection(section.id)
                        jumpToTimestamp(section.time)
                      }}
                    >
                      <span className="text-sm truncate">{section.title}</span>
                      <Badge variant="outline" className="bg-foreground/5 border-foreground/20">
                        <Play className="h-3 w-3 mr-1" />
                        {section.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note Information */}
              <div className="p-4 border-b border-foreground/10">
                <h3 className="font-medium mb-3">Note Information</h3>
                <div className="space-y-2 text-sm text-foreground/70">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>May 5, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last edited:</span>
                    <span>May 5, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Word count:</span>
                    <span>842</span>
                  </div>
                </div>
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
