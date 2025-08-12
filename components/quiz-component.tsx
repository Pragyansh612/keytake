import { useState, useEffect } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  RotateCcw,
  Loader2,
  AlertCircle,
  Play,
  BookOpen
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { api } from "@/lib/api"
import { QuizResponse, QuizAttemptRequest } from "@/types/types"

interface QuizComponentProps {
  noteId: string
  onClose?: () => void
}

interface QuizAttempt {
  answers: Record<string, string>
  score?: number
  totalQuestions?: number
  completed: boolean
  timeSpent?: number
}

export function QuizComponent({ noteId, onClose }: QuizComponentProps) {
  const [quizzes, setQuizzes] = useState<QuizResponse[]>([])
  const [currentQuiz, setCurrentQuiz] = useState<QuizResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("available")

  useEffect(() => {
    loadQuizzes()
  }, [noteId])

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      setError(null)
      const quizData = await api.getQuizzesForNote(noteId)
      setQuizzes(quizData)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load quizzes")
    } finally {
      setLoading(false)
    }
  }

  const generateQuiz = async () => {
    try {
      setGenerating(true)
      setError(null)
      await api.generateLearningAids(noteId)

      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const updatedQuizzes = await api.getQuizzesForNote(noteId)
          if (updatedQuizzes.length > quizzes.length) {
            setQuizzes(updatedQuizzes)
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
      setError(error instanceof Error ? error.message : "Failed to generate quiz")
      setGenerating(false)
    }
  }

  const startQuiz = (quiz: QuizResponse) => {
    setCurrentQuiz(quiz)
    setCurrentAttempt({
      answers: {},
      completed: false
    })
    setResults(null)
    setActiveTab("taking")
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (!currentAttempt) return

    setCurrentAttempt({
      ...currentAttempt,
      answers: {
        ...currentAttempt.answers,
        [questionId]: answer
      }
    })
  }

  const submitQuiz = async () => {
    if (!currentQuiz || !currentAttempt) return

    try {
      setSubmitting(true)
      
      // Send answers as a dictionary/object directly
      const attemptData: QuizAttemptRequest = {
        answers: currentAttempt.answers // This is already a Record<string, string>
      }

      const result = await api.submitQuizAttempt(currentQuiz.id, attemptData)
      setResults(result)
      setCurrentAttempt({
        ...currentAttempt,
        completed: true,
        score: result.score,
        totalQuestions: result.total_questions
      })
      setActiveTab("results")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit quiz")
    } finally {
      setSubmitting(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuiz(null)
    setCurrentAttempt(null)
    setResults(null)
    setActiveTab("available")
  }

  if (loading) {
    return (
      <GlassPanel className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading quizzes...</p>
          </div>
        </div>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Quiz Center</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="available">Available Quizzes</TabsTrigger>
          {currentQuiz && (
            <TabsTrigger value="taking">Taking Quiz</TabsTrigger>
          )}
          {results && (
            <TabsTrigger value="results">Results</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="available">
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-destructive">{error}</span>
            </div>
          )}

          {quizzes.length === 0 && !generating ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No quizzes available</h3>
              <p className="text-muted-foreground mb-4">
                Generate a quiz to test your knowledge of this note
              </p>
              <Button onClick={generateQuiz} disabled={generating}>
                <Play className="h-4 w-4 mr-2" />
                Generate Quiz
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {generating && (
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <div>
                        <h3 className="font-medium">Generating quiz...</h3>
                        <p className="text-sm text-muted-foreground">
                          Creating questions based on your note content
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{quiz.title || "Quiz"}</CardTitle>
                      <Badge variant="outline">
                        {quiz.questions?.length || 0} questions
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          ~{Math.ceil((quiz.questions?.length || 0) * 1.5)} min
                        </span>
                        <span>Difficulty: {quiz.difficulty || "Medium"}</span>
                      </div>
                      <Button onClick={() => startQuiz(quiz)}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {quizzes.length > 0 && (
                <Button
                  variant="outline"
                  onClick={generateQuiz}
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
                      Generate Another Quiz
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="taking">
          {currentQuiz && currentAttempt && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{currentQuiz.title}</h3>
                <div className="text-sm text-muted-foreground">
                  {Object.keys(currentAttempt.answers).length} / {currentQuiz.questions?.length || 0} answered
                </div>
              </div>

              <Progress
                value={(Object.keys(currentAttempt.answers).length / (currentQuiz.questions?.length || 1)) * 100}
                className="h-2"
              />

              <div className="space-y-6">
                {currentQuiz.questions?.map((question, index) => (
                  <Card key={question.id || index}>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="space-y-2">
                        {question.options && question.options.length > 0 ? (
                          // Multiple choice questions with options
                          question.options.map((option, optionIndex) => {
                            // Handle both string options and option objects from backend
                            const optionText = typeof option === 'string' ? option : String(option);
                            const questionKey = question.id || String(index);
                            
                            return (
                              <label
                                key={optionIndex}
                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                  currentAttempt.answers[questionKey] === optionText
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${questionKey}`}
                                  value={optionText}
                                  checked={currentAttempt.answers[questionKey] === optionText}
                                  onChange={() => handleAnswerSelect(questionKey, optionText)}
                                  className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                                  currentAttempt.answers[questionKey] === optionText
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground"
                                }`}>
                                  {currentAttempt.answers[questionKey] === optionText && (
                                    <div className="w-full h-full rounded-full bg-white scale-50" />
                                  )}
                                </div>
                                <span className="text-sm">{optionText}</span>
                              </label>
                            );
                          })
                        ) : (
                          // Short answer questions without options
                          <div className="space-y-2">
                            <textarea
                              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              placeholder="Type your answer here..."
                              value={currentAttempt.answers[question.id || String(index)] || ''}
                              onChange={(e) => handleAnswerSelect(question.id || String(index), e.target.value)}
                              rows={3}
                            />
                            <p className="text-sm text-muted-foreground">
                              This is a short answer question. Write your response in the text area above.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={resetQuiz} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={submitQuiz}
                  disabled={submitting || Object.keys(currentAttempt.answers).length !== (currentQuiz.questions?.length || 0)}
                  className="flex-1"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Quiz"
                  )}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="results">
          {results && currentQuiz && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  results.score >= 80 ? "bg-green-100 text-green-600" :
                  results.score >= 60 ? "bg-yellow-100 text-yellow-600" :
                  "bg-red-100 text-red-600"
                }`}>
                  {results.score >= 80 ? <Trophy className="h-8 w-8" /> :
                   results.score >= 60 ? <CheckCircle2 className="h-8 w-8" /> :
                   <XCircle className="h-8 w-8" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {results.score >= 80 ? "Excellent!" :
                   results.score >= 60 ? "Good Job!" :
                   "Keep Practicing!"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  You scored {results.score}% ({results.correct_answers}/{results.total_questions})
                </p>
                <Badge variant={results.score >= 80 ? "default" : results.score >= 60 ? "secondary" : "destructive"}>
                  {results.score >= 80 ? "Excellent" :
                   results.score >= 60 ? "Good" :
                   "Needs Improvement"}
                </Badge>
              </div>

              {results.question_results && (
                <div className="space-y-4">
                  <h4 className="font-medium">Question Review</h4>
                  {results.question_results.map((result: any, index: number) => (
                    <Card key={index} className={`border-l-4 ${
                      result.correct ? "border-l-green-500" : "border-l-red-500"
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium flex-1">{index + 1}. {result.question}</h5>
                          {result.correct ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">Your answer: </span>
                            <span className={result.correct ? "text-green-600" : "text-red-600"}>
                              {result.user_answer}
                            </span>
                          </div>
                          {!result.correct && (
                            <div>
                              <span className="text-muted-foreground">Correct answer: </span>
                              <span className="text-green-600">{result.correct_answer}</span>
                            </div>
                          )}
                          {result.explanation && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <span className="font-medium">Explanation: </span>
                              {result.explanation}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={resetQuiz} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Take Another Quiz
                </Button>
                <Button onClick={() => startQuiz(currentQuiz)} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Retake This Quiz
                </Button>
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </GlassPanel>
  )
}