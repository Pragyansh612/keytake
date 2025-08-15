"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Target, 
  Plus,
  Clock,
  Calendar,
  CheckCircle,
  Circle,
  Play,
  BookOpen,
  Brain,
  FileText,
  Award,
  TrendingUp,
  BarChart3,
  Users,
  Zap,
  RefreshCw,
  AlertCircle,
  Settings,
  ArrowRight,
  Lightbulb,
  ExternalLink,
  Timer,
  CalendarDays,
  ChevronRight,
  Star,
  Globe
} from "lucide-react"
import { api } from "@/lib/api"
import { 
  StudyPlanResponse, 
  StudyPlanModuleResponse,
  StudyPlanCreateRequest,
  RecommendationResponse
} from "@/types/types"
import { useRouter } from "next/navigation"

export default function StudyPlansPage() {
  const [studyPlans, setStudyPlans] = useState<StudyPlanResponse[]>([])
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newPlanGoal, setNewPlanGoal] = useState("")
  const [newPlanDuration, setNewPlanDuration] = useState(30)
  const [selectedPlan, setSelectedPlan] = useState<StudyPlanResponse | null>(null)
  
  const router = useRouter()

  useEffect(() => {
    loadStudyPlansData()
  }, [])

  const loadStudyPlansData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const results = await Promise.allSettled([
        api.getStudyPlans(),
        api.getRecommendations()
      ])

      const [studyPlansResult, recommendationsResult] = results

      if (studyPlansResult.status === 'fulfilled') {
        setStudyPlans(studyPlansResult.value)
      } else {
        console.error("Failed to load study plans:", studyPlansResult.reason)
      }

      if (recommendationsResult.status === 'fulfilled') {
        setRecommendations(recommendationsResult.value)
      } else {
        console.error("Failed to load recommendations:", recommendationsResult.reason)
      }

    } catch (error) {
      console.error("Failed to load study plans data:", error)
      setError("Failed to load study plans data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStudyPlan = async () => {
    if (!newPlanGoal.trim()) return

    try {
      setCreating(true)
      const createData: StudyPlanCreateRequest = {
        goal: newPlanGoal.trim(),
        duration_days: newPlanDuration
      }

      const response = await api.createStudyPlan(createData)
      
      // Reload study plans to get the new one
      await loadStudyPlansData()
      
      // Reset form and close dialog
      setNewPlanGoal("")
      setNewPlanDuration(30)
      setShowCreateDialog(false)

    } catch (error) {
      console.error("Failed to create study plan:", error)
      setError("Failed to create study plan")
    } finally {
      setCreating(false)
    }
  }

  const handleCompleteModule = async (moduleId: string) => {
    try {
      await api.completeStudyPlanModule(moduleId)
      
      // Update the local state optimistically
      setStudyPlans(prev => prev.map(plan => ({
        ...plan,
        modules: plan.modules.map(module =>
          module.id === moduleId 
            ? { ...module, completed: true, completed_at: new Date().toISOString() }
            : module
        )
      })))

    } catch (error) {
      console.error("Failed to complete module:", error)
    }
  }

  const getModuleIcon = (moduleType: string) => {
    switch (moduleType) {
      case 'video': return Play
      case 'reading': return BookOpen
      case 'practice': return Brain
      case 'quiz': return FileText
      case 'project': return Target
      default: return Circle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'completed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'generating': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'failed': return 'bg-red-500/10 text-red-600 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getModuleTypeColor = (moduleType: string) => {
    switch (moduleType) {
      case 'video': return 'bg-blue-500/10 text-blue-600'
      case 'reading': return 'bg-green-500/10 text-green-600'
      case 'practice': return 'bg-purple-500/10 text-purple-600'
      case 'quiz': return 'bg-orange-500/10 text-orange-600'
      case 'project': return 'bg-red-500/10 text-red-600'
      default: return 'bg-gray-500/10 text-gray-600'
    }
  }

  const getPlanProgress = (plan: StudyPlanResponse) => {
    const completedModules = plan.modules.filter(module => module.completed).length
    const totalModules = plan.modules.length
    return totalModules > 0 ? (completedModules / totalModules) * 100 : 0
  }

  const getDaysRemaining = (plan: StudyPlanResponse) => {
    const endDate = new Date(plan.end_date)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const getOverallProgress = () => {
    const totalModules = studyPlans.reduce((acc, plan) => acc + plan.modules.length, 0)
    const completedModules = studyPlans.reduce((acc, plan) => 
      acc + plan.modules.filter(module => module.completed).length, 0
    )
    return { total: totalModules, completed: completedModules }
  }

  const getActivePlans = () => studyPlans.filter(plan => plan.status === 'active')
  const getCompletedPlans = () => studyPlans.filter(plan => plan.status === 'completed')
  const getGeneratingPlans = () => studyPlans.filter(plan => plan.status === 'generating')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <p className="text-muted-foreground">Loading your study plans...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-500">{error}</p>
          <Button onClick={() => loadStudyPlansData()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const overallProgress = getOverallProgress()
  const activePlans = getActivePlans()
  const completedPlans = getCompletedPlans()
  const generatingPlans = getGeneratingPlans()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study Plans</h1>
          <p className="text-muted-foreground">
            Organize your learning with personalized study plans
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Study Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Study Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal">Learning Goal</Label>
                <Textarea
                  id="goal"
                  placeholder="What would you like to learn? (e.g., Master React.js fundamentals)"
                  value={newPlanGoal}
                  onChange={(e) => setNewPlanGoal(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="7"
                  max="365"
                  value={newPlanDuration}
                  onChange={(e) => setNewPlanDuration(parseInt(e.target.value) || 30)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 30-90 days for best results
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreateStudyPlan}
                  disabled={!newPlanGoal.trim() || creating}
                  className="flex-1"
                >
                  {creating && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                  Create Plan
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-foreground/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{studyPlans.length}</p>
                <p className="text-sm text-muted-foreground">Total Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Play className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activePlans.length}</p>
                <p className="text-sm text-muted-foreground">Active Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overallProgress.completed}</p>
                <p className="text-sm text-muted-foreground">Modules Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedPlans.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">
            Active Plans ({activePlans.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Plans ({studyPlans.length})
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Generating Plans Alert */}
        {generatingPlans.length > 0 && (
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
                <div>
                  <p className="font-medium text-yellow-800">
                    {generatingPlans.length} study plan{generatingPlans.length > 1 ? 's' : ''} being generated
                  </p>
                  <p className="text-sm text-yellow-600">
                    This may take a few minutes. We'll update you once they're ready.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <TabsContent value="active" className="space-y-6">
          {activePlans.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No active study plans</p>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first study plan to start organizing your learning journey
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Study Plan
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {activePlans.map((plan) => (
                <Card key={plan.id} className="border-foreground/10 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">{plan.goal}</CardTitle>
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Timer className="h-4 w-4" />
                            {getDaysRemaining(plan)} days left
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{plan.modules.filter(m => m.completed).length} / {plan.modules.length} modules</span>
                          </div>
                          <Progress value={getPlanProgress(plan)} className="h-2" />
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
                      >
                        {selectedPlan?.id === plan.id ? 'Hide' : 'View'} Details
                        <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${selectedPlan?.id === plan.id ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>

                  {selectedPlan?.id === plan.id && (
                    <CardContent className="pt-0">
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Modules ({plan.modules.length})</h4>
                        <div className="space-y-3">
                          {plan.modules.map((module, index) => {
                            const ModuleIcon = getModuleIcon(module.module_type)
                            const isOverdue = !module.completed && new Date(module.due_date) < new Date()
                            
                            return (
                              <div
                                key={module.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                  module.completed 
                                    ? 'bg-green-50/50 border-green-200' 
                                    : isOverdue
                                    ? 'bg-red-50/50 border-red-200'
                                    : 'bg-foreground/5 border-foreground/10'
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={`p-2 rounded ${getModuleTypeColor(module.module_type)}`}>
                                    <ModuleIcon className="h-4 w-4" />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{module.title}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {module.module_type}
                                      </Badge>
                                    </div>
                                    
                                    {module.description && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {module.description}
                                      </p>
                                    )}
                                    
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                      <span>Due: {formatDate(module.due_date)}</span>
                                      {isOverdue && !module.completed && (
                                        <span className="text-red-600 font-medium">Overdue</span>
                                      )}
                                      {module.completed && module.completed_at && (
                                        <span className="text-green-600">
                                          Completed {formatDate(module.completed_at)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {module.completed ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleCompleteModule(module.id)}
                                      className="flex items-center gap-1"
                                    >
                                      <Circle className="h-3 w-3" />
                                      Mark Complete
                                    </Button>
                                  )}
                                  
                                  {module.resource_id && (
                                    <Button size="sm" variant="ghost">
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {studyPlans.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No study plans yet</p>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first study plan to get started
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Study Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studyPlans.map((plan) => (
                <Card key={plan.id} className="border-foreground/10 hover:border-foreground/20 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-base">{plan.goal}</CardTitle>
                          <Badge className={getStatusColor(plan.status)} variant="outline">
                            {plan.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{plan.modules.filter(m => m.completed).length} / {plan.modules.length}</span>
                      </div>
                      <Progress value={getPlanProgress(plan)} className="h-2" />
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground">
                          {plan.status === 'active' ? `${getDaysRemaining(plan)} days left` : 
                           plan.status === 'completed' ? 'Completed' : 
                           plan.status === 'generating' ? 'Generating...' : 'Failed'}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => setSelectedPlan(plan)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No recommendations available</p>
              <p className="text-sm text-muted-foreground">
                Complete more study plans to get personalized recommendations
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="border-foreground/10 hover:border-foreground/20 transition-colors">
                  <CardContent className="p-0">
                    {recommendation.image_url && (
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={recommendation.image_url}
                          alt={recommendation.title}
                          className="w-full h-32 object-cover"
                        />
                        <Badge className="absolute top-2 left-2 bg-blue-500/90 text-white border-0">
                          {recommendation.recommendation_type}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{recommendation.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {recommendation.description}
                      </p>
                      
                      {recommendation.source_provider && (
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {recommendation.source_provider}
                          </span>
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(recommendation.link, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        View Resource
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Completion Rate */}
            <Card className="border-foreground/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {overallProgress.total > 0 
                        ? Math.round((overallProgress.completed / overallProgress.total) * 100)
                        : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {overallProgress.completed} of {overallProgress.total} modules completed
                    </p>
                  </div>
                  <Progress 
                    value={overallProgress.total > 0 ? (overallProgress.completed / overallProgress.total) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Study Streak */}
            <Card className="border-foreground/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Days in a row</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete modules daily to build your streak
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Plan Types Distribution */}
            <Card className="border-foreground/10">
              <CardHeader>
                <CardTitle>Plan Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Plans</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">
                      {activePlans.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Plans</span>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                      {completedPlans.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Generating Plans</span>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
                      {generatingPlans.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-foreground/10">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studyPlans
                    .flatMap(plan => 
                      plan.modules
                        .filter(module => module.completed && module.completed_at)
                        .map(module => ({ ...module, planGoal: plan.goal }))
                    )
                    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
                    .slice(0, 5)
                    .map((module, index) => {
                      const ModuleIcon = getModuleIcon(module.module_type)
                      return (
                        <div key={`${module.id}-${index}`} className="flex items-center gap-3">
                          <div className={`p-1.5 rounded ${getModuleTypeColor(module.module_type)}`}>
                            <ModuleIcon className="h-3 w-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{module.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {module.planGoal}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(module.completed_at!)}
                          </span>
                        </div>
                      )
                    })}
                    
                  {studyPlans.flatMap(plan => plan.modules).filter(m => m.completed).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No completed modules yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}