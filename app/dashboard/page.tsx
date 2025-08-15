"use client"

import { useState, useEffect } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback} from "@/components/ui/avatar"
import { 
  BookOpen, 
  Brain, 
  Target,
  Award,
  ChevronRight,
  FileText,
  Zap,
  PlusCircle,
  ArrowUpRight,
  BookMarked,
  GraduationCap,
  Users,
  TrendingUp,
  Clock,
  Star
} from "lucide-react"
import { api } from "@/lib/api"
import { NoteResponse, UserStatsResponse, FlashcardWithProgressResponse, StudyPlanResponse } from "@/types/types"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function DashboardPage() {
  const [notes, setNotes] = useState<NoteResponse[]>([])
  const [userStats, setUserStats] = useState<UserStatsResponse | null>(null)
  const [flashcards, setFlashcards] = useState<FlashcardWithProgressResponse[]>([])
  const [studyPlans, setStudyPlans] = useState<StudyPlanResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { user, profile } = useAuth()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load all dashboard data in parallel with proper error handling
      const results = await Promise.allSettled([
        api.getNotes(),
        api.getUserStats(),
        api.getFlashcards(),
        api.getStudyPlans()
      ])

      const [notesResult, statsResult, flashcardsResult, studyPlansResult] = results

      if (notesResult.status === 'fulfilled') {
        setNotes(notesResult.value.slice(0, 6)) // Show only recent 6 notes
      } else {
        console.error("Failed to load notes:", notesResult.reason)
      }

      if (statsResult.status === 'fulfilled') {
        setUserStats(statsResult.value)
      } else {
        console.error("Failed to load user stats:", statsResult.reason)
      }

      if (flashcardsResult.status === 'fulfilled') {
        setFlashcards(flashcardsResult.value.slice(0, 10)) // Recent 10 flashcards
      } else {
        console.error("Failed to load flashcards:", flashcardsResult.reason)
      }

      if (studyPlansResult.status === 'fulfilled') {
        setStudyPlans(studyPlansResult.value)
      } else {
        console.error("Failed to load study plans:", studyPlansResult.reason)
      }

    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getCompletionRate = () => {
    if (!studyPlans.length) return 0
    const totalModules = studyPlans.reduce((acc, plan) => acc + plan.modules.length, 0)
    const completedModules = studyPlans.reduce((acc, plan) => 
      acc + plan.modules.filter(module => module.completed).length, 0
    )
    return totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
  }

  const getDueFlashcards = () => {
    const today = new Date().toISOString().split('T')[0]
    return flashcards.filter(card => 
      card.progress?.next_review_date && card.progress.next_review_date <= today
    ).length
  }

  const getActiveStudyPlans = () => {
    return studyPlans.filter(plan => plan.status === 'active').length
  }

  const getUserInitials = () => {
    const name = profile?.name || user?.email || 'User'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => loadDashboardData()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-foreground/10 text-foreground font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {profile?.name || user?.email?.split('@')[0] || 'there'}!
            </h1>
            <p className="text-muted-foreground">Ready to continue your learning journey?</p>
          </div>
        </div>

        {/* Quick Stats */}
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
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats?.current_learning_streak || 0}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
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
                  <p className="text-2xl font-bold">{flashcards.length}</p>
                  <p className="text-sm text-muted-foreground">Flashcards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-foreground/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{getActiveStudyPlans()}</p>
                  <p className="text-sm text-muted-foreground">Active Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Progress */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Learning Progress</h3>
              <Badge variant="secondary" className="capitalize">
                {profile?.subscription_tier || 'free'}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Study Plan Progress</span>
                  <span>{getCompletionRate()}%</span>
                </div>
                <Progress value={getCompletionRate()} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Streak</span>
                  <span>{userStats?.current_learning_streak || 0} days</span>
                </div>
                <Progress value={Math.min((userStats?.current_learning_streak || 0) * 10, 100)} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Notes Generated</span>
                  <span>{userStats?.notes_generated || 0}</span>
                </div>
                <Progress value={Math.min((userStats?.notes_generated || 0) * 5, 100)} className="h-2" />
              </div>
            </div>
          </GlassPanel>

          {/* Recent Notes */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Notes</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/notes" className="flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No notes yet</p>
                <Button asChild>
                  <Link href="/dashboard/notes">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Note
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.slice(0, 4).map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/notes/${note.id}`)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{note.video_title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(note.created_at).toLocaleDateString()}
                        {note.is_public && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Public
                          </Badge>
                        )}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>

          {/* Study Plans Preview */}
          {studyPlans.length > 0 && (
            <GlassPanel className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Active Study Plans</h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/study-plans" className="flex items-center gap-1">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-3">
                {studyPlans.filter(plan => plan.status === 'active').slice(0, 2).map((plan) => (
                  <div key={plan.id} className="p-4 rounded-lg border border-foreground/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{plan.goal}</h4>
                      <Badge variant="outline" className="capitalize">
                        {plan.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {plan.duration_days} days
                        </span>
                        <span>
                          {plan.modules.filter(m => m.completed).length}/{plan.modules.length} modules complete
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={(plan.modules.filter(m => m.completed).length / plan.modules.length) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </GlassPanel>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Study Today */}
          <GlassPanel className="p-6">
            <h3 className="text-lg font-semibold mb-4">Study Today</h3>
            
            <div className="space-y-4">
              {getDueFlashcards() > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Flashcards Due</p>
                      <p className="text-sm text-muted-foreground">{getDueFlashcards()} cards ready</p>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/study-tools">Study</Link>
                  </Button>
                </div>
              )}

              {studyPlans.filter(plan => plan.status === 'active').length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Study Plan</p>
                      <p className="text-sm text-muted-foreground">Continue learning</p>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/dashboard/study-plans">Continue</Link>
                  </Button>
                </div>
              )}

              {notes.length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Review Notes</p>
                      <p className="text-sm text-muted-foreground">{notes.length} notes available</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/dashboard/notes">Review</Link>
                  </Button>
                </div>
              )}
            </div>
          </GlassPanel>

          {/* Quick Actions */}
          <GlassPanel className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/notes">
                  <BookOpen className="h-4 w-4 mr-3" />
                  Create New Note
                </Link>
              </Button>
              
              {flashcards.length > 0 && (
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/dashboard/study-tools">
                    <Brain className="h-4 w-4 mr-3" />
                    Practice Flashcards
                  </Link>
                </Button>
              )}
              
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/community">
                  <Users className="h-4 w-4 mr-3" />
                  Explore Community
                </Link>
              </Button>

              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/study-plans">
                  <Target className="h-4 w-4 mr-3" />
                  Create Study Plan
                </Link>
              </Button>
            </div>
          </GlassPanel>

          {/* Achievements & Stats */}
          <GlassPanel className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
            
            <div className="space-y-3">
              {userStats && userStats.longest_learning_streak > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Longest Streak</p>
                    <p className="text-sm text-muted-foreground">{userStats.longest_learning_streak} days</p>
                  </div>
                </div>
              )}
              
              {userStats && userStats.notes_generated > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Notes Created</p>
                    <p className="text-sm text-muted-foreground">{userStats.notes_generated} total</p>
                  </div>
                </div>
              )}

              {flashcards.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Flashcards</p>
                    <p className="text-sm text-muted-foreground">{flashcards.length} available</p>
                  </div>
                </div>
              )}

              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/dashboard/progress">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Detailed Progress
                </Link>
              </Button>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}