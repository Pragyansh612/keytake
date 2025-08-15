"use client"

import { useState, useEffect } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  BookOpen, 
  Play,
  RotateCcw,
  Check,
  X,
  ChevronRight,
  Trophy,
  Clock,
  Target,
  ArrowLeft,
  Shuffle
} from "lucide-react"
import { api } from "@/lib/api"
import { 
  FlashcardWithProgressResponse, 
  QuizResponse, 
  NoteResponse,
  QuizAttemptResponse 
} from "@/types/types"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface StudySession {
  type: 'flashcards' | 'quiz'
  data: FlashcardWithProgressResponse[] | QuizResponse
  currentIndex: number
  score: number
  completed: boolean
}

export default function StudyToolsPage() {
  const [notes, setNotes] = useState<NoteResponse[]>([])
  const [flashcards, setFlashcards] = useState<FlashcardWithProgressResponse[]>([])
  const [quizzes, setQuizzes] = useState<Record<string, QuizResponse[]>>({})
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  const [studySession, setStudySession] = useState<StudySession | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizResults, setQuizResults] = useState<QuizAttemptResponse | null>(null)
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()

  useEffect(() => {
    loadStudyData()
  }, [])

  const loadStudyData = async () => {
    try {
      setLoading(true)
      
      const [notesResult, flashcardsResult] = await Promise.allSettled([
        api.getNotes(),
        api.getFlashcards()
      ])

      if (notesResult.status === 'fulfilled') {
        setNotes(notesResult.value)
        
        // Load quizzes for each note
        const quizPromises = notesResult.value.map(async (note) => {
          try {
            const noteQuizzes = await api.getQuizzesForNote(note.id)
            return { noteId: note.id, quizzes: noteQuizzes }
          } catch (error) {
            console.error(`Failed to load quizzes for note ${note.id}:`, error)
            return { noteId: note.id, quizzes: [] }
          }
        })
        
        const quizResults = await Promise.allSettled(quizPromises)
        const quizMap: Record<string, QuizResponse[]> = {}
        
        quizResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            quizMap[result.value.noteId] = result.value.quizzes
          }
        })
        
        setQuizzes(quizMap)
      }

      if (flashcardsResult.status === 'fulfilled') {
        setFlashcards(flashcardsResult.value)
      }

    } catch (error) {
      console.error("Failed to load study data:", error)
    } finally {
      setLoading(false)
    }
  }

  const startFlashcardSession = (noteId?: string) => {
    const cardsToStudy = noteId 
      ? flashcards.filter(card => card.note_id === noteId)
      : flashcards

    if (cardsToStudy.length === 0) return

    // Prioritize cards that are due for review
    const today = new Date().toISOString().split('T')[0]
    const dueCards = cardsToStudy.filter(card => 
      card.progress?.next_review_date && card.progress.next_review_date <= today
    )

    const sessionCards = dueCards.length > 0 ? dueCards : cardsToStudy
    
    setStudySession({
      type: 'flashcards',
      data: sessionCards,
      currentIndex: 0,
      score: 0,
      completed: false
    })
    setShowAnswer(false)
  }

  const startQuizSession = (quiz: QuizResponse) => {
    setStudySession({
      type: 'quiz',
      data: quiz,
      currentIndex: 0,
      score: 0,
      completed: false
    })
    setQuizAnswers({})
    setQuizResults(null)
  }

  const handleFlashcardDifficulty = async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!studySession || studySession.type !== 'flashcards') return

    const cards = studySession.data as FlashcardWithProgressResponse[]
    const currentCard = cards[studySession.currentIndex]

    try {
      // Update flashcard progress
      await api.updateFlashcardProgress(currentCard.id, {
        difficulty,
        last_reviewed: new Date().toISOString(),
        review_count: (currentCard.progress?.review_count || 0) + 1,
        ease_factor: currentCard.progress?.ease_factor || 2.5,
        repetitions: (currentCard.progress?.repetitions || 0) + 1
      })

      const newScore = difficulty === 'easy' ? studySession.score + 1 : studySession.score

      if (studySession.currentIndex < cards.length - 1) {
        setStudySession({
          ...studySession,
          currentIndex: studySession.currentIndex + 1,
          score: newScore
        })
        setShowAnswer(false)
      } else {
        setStudySession({
          ...studySession,
          score: newScore,
          completed: true
        })
      }
    } catch (error) {
      console.error('Failed to update flashcard progress:', error)
    }
  }

  const handleQuizSubmit = async () => {
    if (!studySession || studySession.type !== 'quiz') return

    const quiz = studySession.data as QuizResponse
    
    try {
      const result = await api.submitQuizAttempt(quiz.id, {
        answers: quizAnswers
      })
      
      setQuizResults(result)
      setStudySession({
        ...studySession,
        completed: true
      })
    } catch (error) {
      console.error('Failed to submit quiz:', error)
    }
  }

  const getDueFlashcards = () => {
    const today = new Date().toISOString().split('T')[0]
    return flashcards.filter(card => 
      card.progress?.next_review_date && card.progress.next_review_date <= today
    ).length
  }

  const getNotesWithContent = () => {
    return notes.filter(note => {
      const hasFlashcards = flashcards.some(card => card.note_id === note.id)
      const hasQuizzes = quizzes[note.id]?.length > 0
      return hasFlashcards || hasQuizzes
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <p className="text-muted-foreground">Loading study tools...</p>
        </div>
      </div>
    )
  }

  // Study Session View
  if (studySession && !studySession.completed) {
    if (studySession.type === 'flashcards') {
      const cards = studySession.data as FlashcardWithProgressResponse[]
      const currentCard = cards[studySession.currentIndex]

      return (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setStudySession(null)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Study Tools
            </Button>
            
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Flashcard Study Session</h1>
              <Badge variant="outline">
                {studySession.currentIndex + 1} of {cards.length}
              </Badge>
            </div>
            
            <Progress 
              value={((studySession.currentIndex + 1) / cards.length) * 100} 
              className="mt-4" 
            />
          </div>

          <GlassPanel className="p-8">
            <div className="text-center space-y-6">
              <div className="min-h-[200px] flex items-center justify-center">
                <div className="space-y-4 max-w-2xl">
                  <h3 className="text-lg font-medium">
                    {showAnswer ? 'Answer:' : 'Question:'}
                  </h3>
                  <div className="text-xl">
                    {showAnswer ? currentCard.back : currentCard.front}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {!showAnswer ? (
                  <Button 
                    onClick={() => setShowAnswer(true)}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    Show Answer
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">How well did you know this?</p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => handleFlashcardDifficulty('hard')}
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                        Hard
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleFlashcardDifficulty('medium')}
                        className="flex items-center gap-2 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Medium
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleFlashcardDifficulty('easy')}
                        className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4" />
                        Easy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GlassPanel>
        </div>
      )
    }

    if (studySession.type === 'quiz') {
      const quiz = studySession.data as QuizResponse
      
      return (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setStudySession(null)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Study Tools
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                <p className="text-muted-foreground">{quiz.description}</p>
              </div>
              <Badge variant="outline">
                {quiz.questions.length} Questions
              </Badge>
            </div>
          </div>

          <GlassPanel className="p-6">
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <h3 className="font-medium">
                    {index + 1}. {question.question}
                  </h3>
                  
                  {question.question_type === 'multiple_choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label 
                          key={optionIndex}
                          className="flex items-center space-x-3 p-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={quizAnswers[question.id] === option}
                            onChange={(e) => setQuizAnswers({
                              ...quizAnswers,
                              [question.id]: e.target.value
                            })}
                            className="w-4 h-4"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.question_type === 'short_answer' && (
                    <textarea
                      className="w-full p-3 rounded-lg border border-foreground/10 bg-background"
                      placeholder="Enter your answer..."
                      value={quizAnswers[question.id] || ''}
                      onChange={(e) => setQuizAnswers({
                        ...quizAnswers,
                        [question.id]: e.target.value
                      })}
                    />
                  )}

                  {question.question_type === 'true_false' && (
                    <div className="space-y-2">
                      {['True', 'False'].map((option) => (
                        <label 
                          key={option}
                          className="flex items-center space-x-3 p-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={quizAnswers[question.id] === option}
                            onChange={(e) => setQuizAnswers({
                              ...quizAnswers,
                              [question.id]: e.target.value
                            })}
                            className="w-4 h-4"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Button 
                onClick={handleQuizSubmit}
                className="w-full"
                disabled={Object.keys(quizAnswers).length !== quiz.questions.length}
              >
                Submit Quiz
              </Button>
            </div>
          </GlassPanel>
        </div>
      )
    }
  }

  // Quiz Results View
  if (studySession?.completed && quizResults) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <GlassPanel className="p-8 text-center">
          <div className="space-y-6">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-muted-foreground">
                You scored {quizResults.correct_answers} out of {quizResults.total_questions}
              </p>
            </div>
            
            <div className="max-w-sm mx-auto">
              <Progress value={(quizResults.correct_answers / quizResults.total_questions) * 100} />
              <p className="text-sm mt-2">
                {Math.round((quizResults.correct_answers / quizResults.total_questions) * 100)}% Score
              </p>
            </div>

            <Badge variant={quizResults.passed ? "default" : "destructive"} className="text-lg px-6 py-2">
              {quizResults.passed ? "Passed" : "Failed"}
            </Badge>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => setStudySession(null)}>
                Back to Study Tools
              </Button>
              <Button variant="outline" onClick={() => startQuizSession(studySession.data as QuizResponse)}>
                Retake Quiz
              </Button>
            </div>
          </div>
        </GlassPanel>
      </div>
    )
  }

  // Flashcard Session Complete View
  if (studySession?.completed && studySession.type === 'flashcards') {
    const cards = studySession.data as FlashcardWithProgressResponse[]
    
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <GlassPanel className="p-8 text-center">
          <div className="space-y-6">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
              <p className="text-muted-foreground">
                You studied {cards.length} flashcards
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => setStudySession(null)}>
                Back to Study Tools
              </Button>
              <Button variant="outline" onClick={() => startFlashcardSession(selectedNote || undefined)}>
                Study More Cards
              </Button>
            </div>
          </div>
        </GlassPanel>
      </div>
    )
  }

  // Main Study Tools View
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Study Tools</h1>
        <p className="text-muted-foreground">Practice with flashcards and quizzes to reinforce your learning</p>
      </div>

      {/* Quick Study Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">All Flashcards</h3>
                <p className="text-sm text-muted-foreground">{flashcards.length} cards available</p>
              </div>
              <Button 
                onClick={() => startFlashcardSession()}
                disabled={flashcards.length === 0}
              >
                Study
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Due for Review</h3>
                <p className="text-sm text-muted-foreground">{getDueFlashcards()} cards due</p>
              </div>
              <Button 
                onClick={() => startFlashcardSession()}
                disabled={getDueFlashcards() === 0}
                variant="outline"
              >
                Review
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Shuffle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Mixed Practice</h3>
                <p className="text-sm text-muted-foreground">Random selection</p>
              </div>
              <Button 
                onClick={() => startFlashcardSession()}
                disabled={flashcards.length === 0}
                variant="outline"
              >
                Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study by Note */}
      <GlassPanel className="p-6">
        <h2 className="text-xl font-semibold mb-4">Study by Note</h2>
        
        {getNotesWithContent().length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No study materials available</p>
            <p className="text-sm text-muted-foreground">Create notes and generate learning aids to start studying</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/notes">Create Notes</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getNotesWithContent().map((note) => {
              const noteFlashcards = flashcards.filter(card => card.note_id === note.id)
              const noteQuizzes = quizzes[note.id] || []
              
              return (
                <Card key={note.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{note.video_title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {noteFlashcards.length > 0 && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
                        <div className="flex items-center gap-3">
                          <Brain className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Flashcards</p>
                            <p className="text-sm text-muted-foreground">{noteFlashcards.length} cards</p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => startFlashcardSession(note.id)}
                        >
                          Study
                        </Button>
                      </div>
                    )}

                    {noteQuizzes.map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
                        <div className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">{quiz.title}</p>
                            <p className="text-sm text-muted-foreground">{quiz.questions.length} questions</p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => startQuizSession(quiz)}
                        >
                          Take Quiz
                        </Button>
                      </div>
                    ))}

                    <Button 
                      variant="ghost" 
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link href={`/dashboard/notes/${note.id}`}>
                        View Note <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </GlassPanel>
    </div>
  )
}