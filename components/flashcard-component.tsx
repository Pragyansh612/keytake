import { useState, useEffect } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  RotateCcw,
  Shuffle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Brain,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcwIcon,
  Play
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"
import { FlashcardWithProgressResponse, FlashcardProgressUpdateRequest } from "@/types/types"

interface FlashcardComponentProps {
  noteId: string
  onClose?: () => void
}

interface StudySession {
  cards: FlashcardWithProgressResponse[]
  currentIndex: number
  showAnswer: boolean
  completed: boolean
  streak: number
  correctCount: number
  totalAnswered: number
}

export function FlashcardComponent({ noteId, onClose }: FlashcardComponentProps) {
  const [flashcards, setFlashcards] = useState<FlashcardWithProgressResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [studySession, setStudySession] = useState<StudySession | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadFlashcards()
  }, [noteId])

  const loadFlashcards = async () => {
    try {
      setLoading(true)
      setError(null)
      const cards = await api.getFlashcards(noteId)
      setFlashcards(cards)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load flashcards")
    } finally {
      setLoading(false)
    }
  }

  const generateFlashcards = async () => {
    try {
      setGenerating(true)
      setError(null)
      await api.generateLearningAids(noteId)
      
      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const updatedCards = await api.getFlashcards(noteId)
          if (updatedCards.length > flashcards.length) {
            setFlashcards(updatedCards)
            setGenerating(false)
            clearInterval(pollInterval)
          }
        } catch (error) {
          console.error("Polling error:", error)
        }
      }, 3000)

      // Clear interval after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        setGenerating(false)
      }, 120000)

    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate flashcards")
      setGenerating(false)
    }
  }

  const startStudySession = (shuffled = false) => {
    if (flashcards.length === 0) return

    let cards = [...flashcards]
    if (shuffled) {
      cards = cards.sort(() => Math.random() - 0.5)
    }

    setStudySession({
      cards,
      currentIndex: 0,
      showAnswer: false,
      completed: false,
      streak: 0,
      correctCount: 0,
      totalAnswered: 0
    })
  }

  const nextCard = () => {
    if (!studySession) return

    if (studySession.currentIndex >= studySession.cards.length - 1) {
      setStudySession({
        ...studySession,
        completed: true
      })
      return
    }

    setStudySession({
      ...studySession,
      currentIndex: studySession.currentIndex + 1,
      showAnswer: false
    })
  }

  const prevCard = () => {
    if (!studySession || studySession.currentIndex <= 0) return

    setStudySession({
      ...studySession,
      currentIndex: studySession.currentIndex - 1,
      showAnswer: false
    })
  }

  const toggleAnswer = () => {
    if (!studySession) return

    setStudySession({
      ...studySession,
      showAnswer: !studySession.showAnswer
    })
  }

const markCardDifficulty = async (difficulty: 'easy' | 'medium' | 'hard') => {
  if (!studySession) return

  const currentCard = studySession.cards[studySession.currentIndex]
  const isCorrect = difficulty === 'easy'

  try {
    setUpdating(true)

    // Calculate ease_factor based on difficulty (spaced repetition algorithm)
    let easeFactor = currentCard.progress?.ease_factor || 2.5 // Default ease factor
    const currentRepetitions = currentCard.progress?.repetitions || 0

    // Adjust ease factor based on difficulty
    switch (difficulty) {
      case 'easy':
        easeFactor = Math.max(1.3, easeFactor + 0.1) // Increase ease factor
        break
      case 'medium':
        // Keep current ease factor or slight decrease
        easeFactor = Math.max(1.3, easeFactor - 0.05)
        break
      case 'hard':
        easeFactor = Math.max(1.3, easeFactor - 0.2) // Decrease ease factor significantly
        break
    }

    const updateData: FlashcardProgressUpdateRequest = {
      difficulty: difficulty,
      last_reviewed: new Date().toISOString(),
      review_count: (currentCard.progress?.review_count || 0) + 1,
      ease_factor: easeFactor,
      repetitions: difficulty === 'hard' ? 0 : currentRepetitions + 1 // Reset repetitions if hard
    }

    await api.updateFlashcardProgress(currentCard.id, updateData)

    setStudySession({
      ...studySession,
      correctCount: studySession.correctCount + (isCorrect ? 1 : 0),
      totalAnswered: studySession.totalAnswered + 1,
      streak: isCorrect ? studySession.streak + 1 : 0
    })

    // Auto-advance after marking difficulty
    setTimeout(() => {
      nextCard()
    }, 800)

  } catch (error) {
    setError(error instanceof Error ? error.message : "Failed to update progress")
  } finally {
    setUpdating(false)
  }
}

  const resetSession = () => {
    setStudySession(null)
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'hard': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading flashcards...</p>
          </div>
        </div>
      </GlassPanel>
    )
  }

  // Study Session View
  if (studySession && !studySession.completed) {
    const currentCard = studySession.cards[studySession.currentIndex]
    const progress = ((studySession.currentIndex + 1) / studySession.cards.length) * 100

    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Study Session</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {studySession.currentIndex + 1} / {studySession.cards.length}
            </div>
            <Button variant="ghost" size="sm" onClick={resetSession}>
              ✕
            </Button>
          </div>
        </div>

        <Progress value={progress} className="h-2 mb-6" />

        <div className="flex items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={studySession.currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow min-h-[300px] flex flex-col"
                onClick={toggleAnswer}
              >
                <CardContent className="p-8 flex-1 flex flex-col justify-center">
                  <div className="text-center">
                    {!studySession.showAnswer ? (
                      <div>
                        <div className="flex items-center justify-center mb-4">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Question</h3>
                        <p className="text-lg leading-relaxed">{currentCard.front}</p>
                        <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">Click to reveal answer</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center mb-4">
                          <Brain className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4">Answer</h3>
                        <p className="text-lg leading-relaxed mb-6">{currentCard.back}</p>
                        
                        <div className="flex gap-3 justify-center">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              markCardDifficulty('hard')
                            }}
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            disabled={updating}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Hard
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              markCardDifficulty('medium')
                            }}
                            variant="outline"
                            className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                            disabled={updating}
                          >
                            <RotateCcwIcon className="h-4 w-4 mr-2" />
                            Medium
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              markCardDifficulty('easy')
                            }}
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            disabled={updating}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Easy
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Streak: {studySession.streak}</span>
            <span>•</span>
            <span>Correct: {studySession.correctCount}/{studySession.totalAnswered}</span>
            {currentCard.progress && (
              <>
                <span>•</span>
                <Badge variant="outline" className={getDifficultyColor(currentCard.progress.difficulty)}>
                  {currentCard.progress.difficulty || 'New'}
                </Badge>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevCard}
              disabled={studySession.currentIndex <= 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={studySession.showAnswer ? nextCard : toggleAnswer}
            >
              {studySession.showAnswer ? (
                <>
                  <ChevronRight className="h-4 w-4" />
                  Next
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4" />
                  Reveal
                </>
              )}
            </Button>
          </div>
        </div>
      </GlassPanel>
    )
  }

  // Completion Screen
  if (studySession && studySession.completed) {
    const accuracy = studySession.totalAnswered > 0 
      ? Math.round((studySession.correctCount / studySession.totalAnswered) * 100) 
      : 0

    return (
      <GlassPanel className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
            accuracy >= 80 ? "bg-green-100 text-green-600" :
            accuracy >= 60 ? "bg-yellow-100 text-yellow-600" :
            "bg-red-100 text-red-600"
          }`}>
            {accuracy >= 80 ? <CheckCircle2 className="h-8 w-8" /> :
             accuracy >= 60 ? <Brain className="h-8 w-8" /> :
             <RotateCcw className="h-8 w-8" />}
          </div>

          <h2 className="text-2xl font-bold mb-4">
            {accuracy >= 80 ? "Excellent Work!" :
             accuracy >= 60 ? "Good Progress!" :
             "Keep Practicing!"}
          </h2>
          
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{studySession.cards.length}</div>
              <div className="text-sm text-muted-foreground">Cards Studied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{studySession.streak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => startStudySession()} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Study Again
            </Button>
            <Button onClick={() => startStudySession(true)}>
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle & Study
            </Button>
          </div>
        </motion.div>
      </GlassPanel>
    )
  }

  // Main Flashcard View
  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Flashcards</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-destructive">{error}</span>
        </div>
      )}

      {flashcards.length === 0 && !generating ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No flashcards available</h3>
          <p className="text-muted-foreground mb-4">
            Generate flashcards to start studying this note
          </p>
          <Button onClick={generateFlashcards} disabled={generating}>
            <Play className="h-4 w-4 mr-2" />
            Generate Flashcards
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {generating && (
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div>
                    <h3 className="font-medium">Generating flashcards...</h3>
                    <p className="text-sm text-muted-foreground">
                      Creating study cards based on your note content
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {flashcards.length > 0 && (
            <>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="font-medium">{flashcards.length} flashcards available</h3>
                  <p className="text-sm text-muted-foreground">
                    Study these cards to reinforce your learning
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => startStudySession()} variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Study in Order
                  </Button>
                  <Button onClick={() => startStudySession(true)}>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Shuffle & Study
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                <h4 className="font-medium">Preview Cards</h4>
                {flashcards.slice(0, 3).map((card, index) => (
                  <Card key={card.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Q:</span>
                            <p className="mt-1">{card.front}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">A:</span>
                            <p className="mt-1 text-muted-foreground">{card.back}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {card.progress && (
                            <Badge variant="outline" className={getDifficultyColor(card.progress.difficulty)}>
                              {card.progress.difficulty || 'New'}
                            </Badge>
                          )}
                          <div className="text-xs text-muted-foreground text-right">
                            {card.progress?.review_count || 0} reviews
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {flashcards.length > 3 && (
                  <div className="text-center text-muted-foreground text-sm">
                    And {flashcards.length - 3} more cards...
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                onClick={generateFlashcards} 
                disabled={generating}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Generate More Flashcards
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      )}
    </GlassPanel>
  )
}