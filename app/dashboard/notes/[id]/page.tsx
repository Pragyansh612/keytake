"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Play,
  Info,
  Loader2,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Target,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"
import { NoteResponse } from "@/types/types"
import { QuizComponent } from "@/components/quiz-component"
import { FlashcardComponent } from "@/components/flashcard-component"
import { ExportModal } from "@/components/export-modal"
import { ShareModal } from "@/components/share-modal"
import { PrivacyToggle } from "@/components/privacy-toggle"

interface Section {
  id: string
  title: string
  content: string
  points?: string[]
  keyPoints?: string[]
  timestamp?: string
  summary?: string
  detailed_content?: string[]
  learning_objectives?: string[]
  questions_for_reflection?: string[]
  examples_and_applications?: string[]
  terminology?: Record<string, string>
}

interface ProcessingStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  stage?: string
  error?: string
  error_type?: string
}

interface ParsedNoteContent {
  sections?: Section[]
  key_definitions?: Record<string, string>
  learning_timestamps?: Array<{
    time: string
    topic: string
    importance: string
    description: string
  }>
  study_strategies?: string[]
  detailed_sections?: Array<{
    title: string
    summary: string
    timestamp: string
    key_points: string[]
    terminology: Record<string, string>
    detailed_content: string[]
    learning_objectives: string[]
    questions_for_reflection: string[]
    examples_and_applications: string[]
  }>
}

export default function NotePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [noteData, setNoteData] = useState<NoteResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("notes")
  const [retryCount, setRetryCount] = useState(0)
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (id) {
      loadNote()
      // Set up polling for processing notes
      const pollInterval = setInterval(() => {
        if (processingStatus?.status === 'processing' || processingStatus?.status === 'pending') {
          loadNote()
        }
      }, 5000) // Poll every 5 seconds

      return () => clearInterval(pollInterval)
    }
  }, [id, retryCount])

  const loadNote = async () => {
    try {
      setLoading(true)
      setError(null)
      const note = await api.getNote(id)
      setNoteData(note)
      setSaved(note.is_public)

      // Check if note is still processing
      if (note.content && typeof note.content === 'object') {
        const status = note.content.status
        if (status === 'pending' || status === 'processing' || status === 'failed') {
          setProcessingStatus({
            status: status as any,
            stage: note.content.stage,
            error: note.content.error,
            error_type: note.content.error_type
          })
        } else {
          setProcessingStatus(null)
        }
      }

    } catch (error) {
      console.error("Failed to load note:", error)
      setError(error instanceof Error ? error.message : "Failed to load note")
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  const handleCopy = () => {
    if (!noteData) return

    const contentText = getContentText()
    navigator.clipboard.writeText(contentText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrivacyChange = (isPublic: boolean) => {
    if (noteData) {
      setNoteData({ ...noteData, is_public: isPublic })
      setSaved(isPublic)
    }
  }

  const getContentText = () => {
    if (!noteData) return ""

    if (activeTab === "notes") {
      return formatNotesContent()
    } else if (activeTab === "summary") {
      return noteData.summary || "No summary available"
    }
    return ""
  }

  const formatNotesContent = () => {
    if (!noteData?.content) return "No content available"

    // Handle processing states
    if (typeof noteData.content === 'object') {
      const status = noteData.content.status
      if (status === 'pending' || status === 'processing') {
        return `Note is being generated... Status: ${status}${noteData.content.stage ? ` (${noteData.content.stage})` : ''}`
      }
      if (status === 'failed') {
        return `Note generation failed: ${noteData.content.error || 'Unknown error'}`
      }

      // Handle parsed content structure
      const parsedContent = parseNoteContent()
      if (parsedContent.sections && parsedContent.sections.length > 0) {
        return parsedContent.sections.map((section, index) =>
          `${section.title}\n\n${section.summary || section.content || ""}\n\n${
            section.keyPoints && section.keyPoints.length > 0 
              ? section.keyPoints.map(point => `• ${point}`).join('\n') + '\n\n'
              : ""
          }`
        ).join("")
      }

      // Handle other content structures
      if (typeof noteData.content === 'object' && !noteData.content.status) {
        return JSON.stringify(noteData.content, null, 2)
      }
    }

    return String(noteData.content)
  }

  const parseNoteContent = (): ParsedNoteContent => {
    if (!noteData?.content || typeof noteData.content !== 'object') {
      return {}
    }

    // Skip if still processing
    const status = noteData.content.status
    if (status === 'pending' || status === 'processing' || status === 'failed') {
      return {}
    }

    // Return the content as parsed structure
    return noteData.content as ParsedNoteContent
  }

  const parseNoteSections = (): Section[] => {
    const parsedContent = parseNoteContent()
    
    // Try to get sections from detailed_sections first
    if (parsedContent.detailed_sections && parsedContent.detailed_sections.length > 0) {
      return parsedContent.detailed_sections.map((section, index) => ({
        id: String(index + 1),
        title: section.title,
        content: section.summary || '',
        points: section.key_points || [],
        keyPoints: [],
        timestamp: section.timestamp,
        summary: section.summary,
        detailed_content: section.detailed_content,
        learning_objectives: section.learning_objectives,
        questions_for_reflection: section.questions_for_reflection,
        examples_and_applications: section.examples_and_applications,
        terminology: section.terminology
      }))
    }

    // Fall back to sections if available
    if (parsedContent.sections && parsedContent.sections.length > 0) {
      return parsedContent.sections
    }

    return []
  }

  const handleSave = async () => {
    if (!noteData) return

    try {
      await api.updateNote(noteData.id, { is_public: !saved })
      setSaved(!saved)
      setNoteData({ ...noteData, is_public: !saved })
    } catch (error) {
      console.error("Failed to update note:", error)
    }
  }

  const renderProcessingStatus = () => {
    if (!processingStatus) return null

    const getStatusIcon = () => {
      switch (processingStatus.status) {
        case 'pending':
          return <Clock className="h-5 w-5 text-yellow-500" />
        case 'processing':
          return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
        case 'failed':
          return <XCircle className="h-5 w-5 text-red-500" />
        default:
          return <CheckCircle2 className="h-5 w-5 text-green-500" />
      }
    }

    const getStatusColor = () => {
      switch (processingStatus.status) {
        case 'pending':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800'
        case 'processing':
          return 'bg-blue-50 border-blue-200 text-blue-800'
        case 'failed':
          return 'bg-red-50 border-red-200 text-red-800'
        default:
          return 'bg-green-50 border-green-200 text-green-800'
      }
    }

    const getStatusMessage = () => {
      switch (processingStatus.status) {
        case 'pending':
          return 'Your note is queued for processing...'
        case 'processing':
          const stage = processingStatus.stage || 'processing'
          const stageMessages = {
            'initializing': 'Initializing note generation...',
            'fetching_video_details': 'Fetching video information...',
            'fetching_transcript': 'Extracting video transcript...',
            'generating_notes': 'Generating structured notes with AI...',
            'processing': 'Processing your note...'
          }
          return stageMessages[stage as keyof typeof stageMessages] || `Processing: ${stage}`
        case 'failed':
          return `Note generation failed: ${processingStatus.error || 'Unknown error'}`
        default:
          return 'Note generated successfully!'
      }
    }

    return (
      <GlassPanel className={`p-4 mb-6 border-2 ${getStatusColor()}`}>
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="flex-1">
            <div className="font-medium">{getStatusMessage()}</div>
            {processingStatus.status === 'processing' && (
              <div className="mt-2">
                <Progress value={getProgressValue()} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  This usually takes 1-2 minutes depending on video length
                </div>
              </div>
            )}
            {processingStatus.status === 'failed' && (
              <div className="mt-2 flex gap-2">
                <Button onClick={handleRetry} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Generation
                </Button>
              </div>
            )}
          </div>
        </div>
      </GlassPanel>
    )
  }

  const getProgressValue = () => {
    if (!processingStatus?.stage) return 20

    const stageProgress = {
      'initializing': 20,
      'fetching_video_details': 40,
      'fetching_transcript': 60,
      'generating_notes': 80
    }

    return stageProgress[processingStatus.stage as keyof typeof stageProgress] || 20
  }

  const renderKeyDefinitions = () => {
    const parsedContent = parseNoteContent()
    if (!parsedContent.key_definitions) return null

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Key Definitions</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(parsedContent.key_definitions).map(([term, definition]) => (
            <div key={term} className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="font-medium text-primary mb-2">{term}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{definition}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderStudyStrategies = () => {
    const parsedContent = parseNoteContent()
    if (!parsedContent.study_strategies || parsedContent.study_strategies.length === 0) return null

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Study Strategies</h3>
        </div>
        <div className="grid gap-2">
          {parsedContent.study_strategies.map((strategy, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{strategy}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
          <h2 className="text-xl font-medium mt-4">Loading your note...</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Please wait while we fetch your note content.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h2 className="text-xl font-medium mt-4">Failed to load note</h2>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            {error}
          </p>
          <div className="flex gap-2">
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!noteData) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <Info className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-medium mt-4">Note not found</h2>
          <p className="text-muted-foreground mb-4 text-center max-w-md">
            The note you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const sections = parseNoteSections()
  const parsedContent = parseNoteContent()
  const isProcessing = processingStatus?.status === 'pending' || processingStatus?.status === 'processing'
  const hasFailed = processingStatus?.status === 'failed'

  return (
    <div className="container py-6">
      {/* Header */}
      <GlassPanel className="p-4 mb-6 border-foreground/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold">{noteData.video_title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 justify-center md:justify-start">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {noteData.video_duration
                    ? `${Math.floor(noteData.video_duration / 60)}:${(noteData.video_duration % 60).toString().padStart(2, '0')}`
                    : "N/A"
                  }
                </span>
              </div>
              <div className="text-sm text-muted-foreground">•</div>
              <div className="text-sm text-muted-foreground">{noteData.view_count} views</div>
              {noteData.video_creator && (
                <>
                  <div className="text-sm text-muted-foreground">•</div>
                  <div className="text-sm text-muted-foreground">by {noteData.video_creator}</div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={noteData.is_certified ? "default" : "outline"}>
              {noteData.is_certified ? "Certified" : "AI Generated"}
            </Badge>
            {noteData.is_public && (
              <Badge variant="secondary">Public</Badge>
            )}
            {isProcessing && (
              <Badge variant="outline" className="text-blue-600">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Processing
              </Badge>
            )}
            {hasFailed && (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Failed
              </Badge>
            )}

            {/* Privacy Toggle */}
            <PrivacyToggle
              noteId={noteData.id}
              isPublic={noteData.is_public}
              onPrivacyChange={handlePrivacyChange}
              disabled={isProcessing}
              size="sm"
            />
          </div>
        </div>
      </GlassPanel>

      {/* Processing Status */}
      {renderProcessingStatus()}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList className="bg-muted">
                <TabsTrigger value="notes" disabled={isProcessing}>
                  Notes {isProcessing && <Loader2 className="h-3 w-3 ml-1 animate-spin" />}
                </TabsTrigger>
                <TabsTrigger value="summary" disabled={isProcessing}>
                  Summary {isProcessing && <Loader2 className="h-3 w-3 ml-1 animate-spin" />}
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${saved ? "text-primary" : ""}`}
                  onClick={handleSave}
                  disabled={isProcessing}
                >
                  <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
                  {saved ? "Saved" : "Save"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={handleCopy}
                  disabled={isProcessing}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowExportModal(true)}
                  disabled={isProcessing}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowShareModal(true)}
                  disabled={isProcessing}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            <GlassPanel className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="notes" className="mt-0 space-y-6">
                    {isProcessing ? (
                      <div className="text-center py-12">
                        <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
                        <h3 className="text-lg font-medium mb-2">Generating your notes...</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          We're analyzing the video content and creating structured notes for you.
                          This process usually takes 1-2 minutes.
                        </p>
                      </div>
                    ) : hasFailed ? (
                      <div className="text-center py-12">
                        <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                        <h3 className="text-lg font-medium mb-2">Note generation failed</h3>
                        <p className="text-muted-foreground mb-4">
                          {processingStatus?.error || "An error occurred while generating your notes"}
                        </p>
                        <Button onClick={handleRetry} variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    ) : sections.length === 0 ? (
                      <div className="text-center py-12">
                        <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No content available</h3>
                        <p className="text-muted-foreground">
                          This note doesn't have structured content yet.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Render Key Definitions */}
                        {renderKeyDefinitions()}

                        {/* Render Study Strategies */}
                        {renderStudyStrategies()}

                        {/* Render Sections */}
                        {sections.map((section) => (
                          <div key={section.id} className="border-b border-border/50 pb-8 last:border-b-0" id={`section-${section.id}`}>
                            <div className="flex items-center gap-2 mb-4">
                              <h2 className="text-xl font-semibold">
                                {section.title}
                              </h2>
                              {section.timestamp && (
                                <Badge variant="outline" className="gap-1">
                                  <Play className="h-3 w-3" />
                                  {section.timestamp}
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-6">
                              {/* Summary */}
                              {section.summary && (
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                  <h4 className="font-medium text-primary mb-2">Summary</h4>
                                  <p className="text-muted-foreground leading-relaxed">
                                    {section.summary}
                                  </p>
                                </div>
                              )}

                              {/* Main content */}
                              {section.content && section.content !== section.summary && (
                                <div>
                                  <p className="text-muted-foreground leading-relaxed">
                                    {section.content}
                                  </p>
                                </div>
                              )}

                              {/* Detailed Content */}
                              {section.detailed_content && section.detailed_content.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3">Detailed Content</h4>
                                  <div className="space-y-3">
                                    {section.detailed_content.map((content, index) => (
                                      <p key={index} className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-muted">
                                        {content}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Key Points */}
                              {((section.points && section.points.length > 0) ||
                                (section.keyPoints && section.keyPoints.length > 0)) && (
                                <div>
                                  <h4 className="font-medium mb-3">Key Points</h4>
                                  <div className="bg-muted/30 rounded-lg p-4">
                                    <ul className="list-disc pl-6 space-y-2">
                                      {[...(section.points || []), ...(section.keyPoints || [])].map((point, index) => (
                                        <li key={index} className="text-muted-foreground leading-relaxed">
                                          {point}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}

                              {/* Learning Objectives */}
                              {section.learning_objectives && section.learning_objectives.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-primary" />
                                    Learning Objectives
                                  </h4>
                                  <ul className="list-disc pl-6 space-y-1">
                                    {section.learning_objectives.map((objective, index) => (
                                      <li key={index} className="text-muted-foreground">
                                        {objective}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Terminology */}
                              {section.terminology && Object.keys(section.terminology).length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3">Key Terms</h4>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    {Object.entries(section.terminology).map(([term, definition]) => (
                                      <div key={term} className="p-3 rounded-lg bg-muted/50 border">
                                        <h5 className="font-medium text-primary text-sm">{term}</h5>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{definition}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Examples and Applications */}
                              {section.examples_and_applications && section.examples_and_applications.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3">Examples & Applications</h4>
                                  <ul className="list-disc pl-6 space-y-1">
                                    {section.examples_and_applications.map((example, index) => (
                                      <li key={index} className="text-muted-foreground">
                                        {example}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Reflection Questions */}
                              {section.questions_for_reflection && section.questions_for_reflection.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3">Questions for Reflection</h4>
                                  <ul className="list-disc pl-6 space-y-1">
                                    {section.questions_for_reflection.map((question, index) => (
                                      <li key={index} className="text-muted-foreground">
                                        {question}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="summary" className="mt-0">
                    {isProcessing ? (
                      <div className="text-center py-12">
                        <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
                        <h3 className="text-lg font-medium mb-2">Generating summary...</h3>
                        <p className="text-muted-foreground">
                          Please wait while we create a comprehensive summary.
                        </p>
                      </div>
                    ) : hasFailed ? (
                      <div className="text-center py-12">
                        <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                        <h3 className="text-lg font-medium mb-2">Summary generation failed</h3>
                        <p className="text-muted-foreground mb-4">
                          {processingStatus?.error || "An error occurred while generating the summary"}
                        </p>
                        <Button onClick={handleRetry} variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    ) : noteData.summary ? (
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed">{noteData.summary}</p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No summary available</h3>
                        <p className="text-muted-foreground">
                          This note doesn't have a summary yet.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </GlassPanel>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <GlassPanel className="sticky top-24 p-4">
            {/* Video Thumbnail */}
            {noteData.video_thumbnail_url && (
              <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                <img
                  src={noteData.video_thumbnail_url}
                  alt={noteData.video_title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Processing Status in Sidebar */}
            {processingStatus && (
              <div className="mb-4 p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  {processingStatus.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                  {processingStatus.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                  {processingStatus.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                  <span className="font-medium text-sm">
                    {processingStatus.status === 'processing' && 'Processing...'}
                    {processingStatus.status === 'failed' && 'Generation Failed'}
                    {processingStatus.status === 'pending' && 'Queued'}
                  </span>
                </div>
                {processingStatus.stage && (
                  <p className="text-xs text-muted-foreground">
                    Stage: {processingStatus.stage}
                  </p>
                )}
              </div>
            )}

            {/* Quick Navigation */}
            {sections.length > 0 && !isProcessing && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Quick Navigation</h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-1">
                    {sections.map((section) => (
                      <Button
                        key={section.id}
                        variant="ghost"
                        className="w-full justify-start text-sm p-2 h-auto"
                        onClick={() => {
                          const element = document.getElementById(`section-${section.id}`)
                          element?.scrollIntoView({ behavior: 'smooth' })
                        }}
                      >
                        <span className="truncate">
                          {section.title}
                        </span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Learning Timeline */}
            {parsedContent.learning_timestamps && parsedContent.learning_timestamps.length > 0 && !isProcessing && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Learning Timeline</h3>
                <ScrollArea className="h-[250px]">
                  <div className="space-y-3">
                    {parsedContent.learning_timestamps.map((item, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/30 border">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {item.time}
                          </Badge>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs font-medium">{item.topic}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Note Info */}
            <div className="space-y-3 text-sm">
              <h3 className="font-medium">Note Information</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(noteData.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated:</span>
                  <span>{new Date(noteData.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Views:</span>
                  <span>{noteData.view_count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Privacy:</span>
                  <span>{noteData.is_public ? "Public" : "Private"}</span>
                </div>
                {noteData.folder_id && (
                  <div className="flex justify-between">
                    <span>Folder:</span>
                    <span>Organized</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Video ID:</span>
                  <span className="font-mono text-xs">{noteData.video_id}</span>
                </div>
              </div>
            </div>

            {/* Learning Tools */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <h3 className="font-medium mb-3">Learning Tools</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  disabled={isProcessing || hasFailed}
                  onClick={() => setShowQuiz(true)}
                >
                  <Play className="h-4 w-4" />
                  Generate Quiz
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  disabled={isProcessing || hasFailed}
                  onClick={() => setShowFlashcards(true)}
                >
                  <Copy className="h-4 w-4" />
                  Create Flashcards
                </Button>
              </div>
            </div>

            {/* Metadata (Debug Info - only show in development) */}
            {process.env.NODE_ENV === 'development' && noteData.content && typeof noteData.content === 'object' && noteData.content.metadata && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="font-medium mb-3 text-xs">Debug Info</h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>Transcript: {noteData.content.metadata.transcript_available ? 'Available' : 'Not available'}</div>
                  {noteData.content.metadata.transcript_language && (
                    <div>Language: {noteData.content.metadata.transcript_language}</div>
                  )}
                  {noteData.content.metadata.transcript_auto_generated && (
                    <div>Auto-generated: Yes</div>
                  )}
                  <div>Status: {noteData.content.metadata.processing_status}</div>
                </div>
              </div>
            )}
          </GlassPanel>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuiz(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <QuizComponent
                noteId={id}
                onClose={() => setShowQuiz(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flashcard Modal */}
      <AnimatePresence>
        {showFlashcards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFlashcards(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <FlashcardComponent
                noteId={id}
                onClose={() => setShowFlashcards(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        noteId={noteData.id}
        noteTitle={noteData.video_title}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        noteId={noteData.id}
        noteTitle={noteData.video_title}
        isPublic={noteData.is_public}
      />
    </div>
  )
}