"use client"

import { useState, useEffect } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  Brain, 
  BookOpen, 
  Target, 
  Award,
  Calendar,
  BarChart3,
  Activity,
  Flame,
  Star,
  Clock,
  CheckCircle,
  Circle
} from "lucide-react"
import { api } from "@/lib/api"
import { 
  UserStatsResponse, 
  UserAchievementResponse, 
  NoteResponse,
  FlashcardWithProgressResponse,
  StudyPlanResponse
} from "@/types/types"
import { useAuth } from "@/context/AuthContext"

export default function ProgressPage() {
  const [userStats, setUserStats] = useState<UserStatsResponse | null>(null)
  const [achievements, setAchievements] = useState<UserAchievementResponse[]>([])
  const [notes, setNotes] = useState<NoteResponse[]>([])
  const [flashcards, setFlashcards] = useState<FlashcardWithProgressResponse[]>([])
  const [studyPlans, setStudyPlans] = useState<StudyPlanResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { profile } = useAuth()

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const results = await Promise.allSettled([
        api.getUserStats(),
        api.getUserAchievements(),
        api.getNotes(),
        api.getFlashcards(),
        api.getStudyPlans()
      ])

      const [statsResult, achievementsResult, notesResult, flashcardsResult, studyPlansResult] = results

      if (statsResult.status === 'fulfilled') {
        setUserStats(statsResult.value)
      }

      if (achievementsResult.status === 'fulfilled') {
        setAchievements(achievementsResult.value)
      }

      if (notesResult.status === 'fulfilled') {
        setNotes(notesResult.value)
      }

      if (flashcardsResult.status === 'fulfilled') {
        setFlashcards(flashcardsResult.value)
      }

      if (studyPlansResult.status === 'fulfilled') {
        setStudyPlans(studyPlansResult.value)
      }

    } catch (error) {
      console.error("Failed to load progress data:", error)
      setError("Failed to load progress data")
    } finally {
      setLoading(false)
    }
  }

  const getStudyPlanProgress = () => {
    const totalModules = studyPlans.reduce((acc, plan) => acc + plan.modules.length, 0)
    const completedModules = studyPlans.reduce((acc, plan) => 
      acc + plan.modules.filter(module => module.completed).length, 0
    )
    return { total: totalModules, completed: completedModules }
  }

  const getFlashcardStats = () => {
    const reviewedCards = flashcards.filter(card => card.progress && card.progress.review_count > 0).length
    const masteredCards = flashcards.filter(card => 
      card.progress?.difficulty === 'easy' && card.progress.review_count >= 3
    ).length
    return { total: flashcards.length, reviewed: reviewedCards, mastered: masteredCards }
  }

  const getWeeklyActivity = () => {
    // Mock weekly activity data - in real app, this would come from API
    const today = new Date()
    const weekDays = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      weekDays.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        activity: Math.floor(Math.random() * 5) // Mock activity level
      })
    }
    return weekDays
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => loadProgressData()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const studyPlanProgress = getStudyPlanProgress()
  const flashcardStats = getFlashcardStats()
  const weeklyActivity = getWeeklyActivity()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Learning Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-foreground/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notes.length}</p>
                <p className="text-sm text-muted-foreground">Notes Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats?.current_learning_streak || 0}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{flashcardStats.mastered}</p>
                <p className="text-sm text-muted-foreground">Cards Mastered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{achievements.length}</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="study-plans">Study Plans</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Streak */}
            <GlassPanel className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Learning Streak</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Current Streak</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {userStats?.current_learning_streak || 0} days
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((userStats?.current_learning_streak || 0) * 10, 100)} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Longest Streak</span>
                    <span className="text-lg font-semibold">
                      {userStats?.longest_learning_streak || 0} days
                    </span>
                  </div>
                </div>

                {/* Weekly Activity */}
                <div className="pt-4 border-t border-foreground/10">
                  <p className="text-sm text-muted-foreground mb-3">This Week</p>
                  <div className="flex justify-between gap-1">
                    {weeklyActivity.map((day, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div 
                          className={`w-6 h-6 rounded-sm ${
                            day.activity > 0 
                              ? `bg-green-${Math.min(day.activity * 200, 600)}` 
                              : 'bg-foreground/10'
                          }`}
                        />
                        <span className="text-xs text-muted-foreground">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassPanel>

            {/* Progress Summary */}
            <GlassPanel className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Progress Summary</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Study Plans</span>
                    <span>{studyPlanProgress.completed}/{studyPlanProgress.total}</span>
                  </div>
                  <Progress 
                    value={studyPlanProgress.total > 0 ? (studyPlanProgress.completed / studyPlanProgress.total) * 100 : 0} 
                    className="h-2" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Flashcards Reviewed</span>
                    <span>{flashcardStats.reviewed}/{flashcardStats.total}</span>
                  </div>
                  <Progress 
                    value={flashcardStats.total > 0 ? (flashcardStats.reviewed / flashcardStats.total) * 100 : 0} 
                    className="h-2" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Notes Created</span>
                    <span>{userStats?.notes_generated || 0}</span>
                  </div>
                  <Progress 
                    value={Math.min((userStats?.notes_generated || 0) * 5, 100)} 
                    className="h-2" 
                  />
                </div>
              </div>
            </GlassPanel>
          </div>
        </TabsContent>

        <TabsContent value="study-plans" className="space-y-6">
          <GlassPanel className="p-6">
            <h3 className="text-lg font-semibold mb-4">Study Plan Progress</h3>
            
            {studyPlans.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No study plans yet</p>
                <Button>Create Your First Study Plan</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {studyPlans.map((plan) => {
                  const completedModules = plan.modules.filter(m => m.completed).length
                  const totalModules = plan.modules.length
                  const progressPercent = totalModules > 0 ? (completedModules / totalModules) * 100 : 0

                  return (
                    <div key={plan.id} className="p-4 rounded-lg border border-foreground/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{plan.goal}</h4>
                        <Badge variant="outline" className="capitalize">
                          {plan.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {plan.duration_days} days
                        </span>
                        <span>
                          {completedModules}/{totalModules} modules
                        </span>
                        <span>
                          Started {new Date(plan.start_date).toLocaleDateString()}
                        </span>
                      </div>

                      <Progress value={progressPercent} className="h-2 mb-3" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {plan.modules.slice(0, 4).map((module) => (
                          <div key={module.id} className="flex items-center gap-2 text-sm">
                            {module.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={module.completed ? "line-through text-muted-foreground" : ""}>
                              {module.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </GlassPanel>
        </TabsContent>

        <TabsContent value="flashcards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel className="p-6">
              <h3 className="text-lg font-semibold mb-4">Flashcard Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Flashcards</span>
                  <span className="font-semibold">{flashcardStats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cards Reviewed</span>
                  <span className="font-semibold">{flashcardStats.reviewed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cards Mastered</span>
                  <span className="font-semibold text-green-600">{flashcardStats.mastered}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Mastery Progress</span>
                  <span>{flashcardStats.total > 0 ? Math.round((flashcardStats.mastered / flashcardStats.total) * 100) : 0}%</span>
                </div>
                <Progress 
                  value={flashcardStats.total > 0 ? (flashcardStats.mastered / flashcardStats.total) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <h3 className="text-lg font-semibold mb-4">Review Activity</h3>
              
              <div className="space-y-3">
                {flashcards.slice(0, 5).map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{card.front}</p>
                      <p className="text-sm text-muted-foreground">
                        {card.progress && card.progress.review_count ? (
                          <>
                            {card.progress.review_count} reviews • 
                            <Badge variant="outline" className={`ml-1 text-xs ${
                              card.progress.difficulty === 'easy' ? 'border-green-500 text-green-600' :
                              card.progress.difficulty === 'medium' ? 'border-yellow-500 text-yellow-600' :
                              'border-red-500 text-red-600'
                            }`}>
                              {card.progress.difficulty}
                            </Badge>
                          </>
                        ) : (
                          'Not reviewed yet'
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <GlassPanel className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
            
            {achievements.length === 0 ? (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No achievements yet</p>
                <p className="text-sm text-muted-foreground">
                  Keep studying to unlock your first achievement!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((userAchievement) => (
                  <div key={userAchievement.achievement.id} className="p-4 rounded-lg border border-foreground/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                        <Award className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{userAchievement.achievement.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(userAchievement.achieved_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userAchievement.achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </TabsContent>
      </Tabs>
    </div>
  )
}