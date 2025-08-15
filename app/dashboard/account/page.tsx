"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Crown,
  TrendingUp,
  BookOpen,
  Award,
  Calendar,
  Target,
  Activity,
  Shield,
  Bell,
  Download,
  Trash2
} from "lucide-react"
import { api, useApiAuth } from "@/lib/api"
import { 
  UserProfile, 
  UpdateUserProfile, 
  UserStatsResponse,
  UserAchievementResponse 
} from "@/types/types"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStatsResponse | null>(null)
  const [achievements, setAchievements] = useState<UserAchievementResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState<'student' | 'teacher' | 'professional'>('student')
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(false)
  const [autoSaveNotes, setAutoSaveNotes] = useState(true)

  const router = useRouter()
  const { logout } = useApiAuth()

  useEffect(() => {
    loadAccountData()
  }, [])

  const loadAccountData = async () => {
    try {
      setLoading(true)
      setError(null)

      const results = await Promise.allSettled([
        api.getUserProfile(),
        api.getUserStats(),
        api.getUserAchievements()
      ])

      const [profileResult, statsResult, achievementsResult] = results

      if (profileResult.status === 'fulfilled') {
        const profile = profileResult.value
        setUserProfile(profile)
        setName(profile.name)
        setEmail(profile.email)
        setUserType(profile.user_type)
      } else {
        console.error("Failed to load user profile:", profileResult.reason)
      }

      if (statsResult.status === 'fulfilled') {
        setUserStats(statsResult.value)
      } else {
        console.error("Failed to load user stats:", statsResult.reason)
      }

      if (achievementsResult.status === 'fulfilled') {
        setAchievements(achievementsResult.value)
      } else {
        console.error("Failed to load achievements:", achievementsResult.reason)
      }

    } catch (error) {
      console.error("Failed to load account data:", error)
      setError("Failed to load account data")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setSaving(true)
      setError(null)

      const updates: UpdateUserProfile = {}
      if (name !== userProfile?.name) updates.name = name
      if (userType !== userProfile?.user_type) updates.user_type = userType

      if (Object.keys(updates).length > 0) {
        await api.updateUserProfile(updates)
        await loadAccountData() // Refresh data
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      setError("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await api.deleteUserAccount()
        router.push('/login')
      } catch (error) {
        console.error("Failed to delete account:", error)
        setError("Failed to delete account")
      }
    }
  }

  const getSubscriptionInfo = () => {
    if (!userProfile) return { plan: 'Free', color: 'gray', features: [] }
    
    switch (userProfile.subscription_tier) {
      case 'premium':
        return {
          plan: 'Premium',
          color: 'blue',
          features: [
            'Unlimited notes generation',
            'Advanced AI analysis',
            'Export in multiple formats',
            'Priority support'
          ]
        }
      case 'enterprise':
        return {
          plan: 'Enterprise',
          color: 'purple',
          features: [
            'Everything in Premium',
            'Team collaboration',
            'Advanced analytics',
            'Custom integrations',
            'Dedicated support'
          ]
        }
      default:
        return {
          plan: 'Free',
          color: 'gray',
          features: [
            '5 notes per month',
            'Basic AI analysis',
            'Community features'
          ]
        }
    }
  }

  const getUserTypeIcon = () => {
    switch (userProfile?.user_type) {
      case 'teacher':
        return <Award className="h-4 w-4" />
      case 'professional':
        return <Target className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <p className="text-muted-foreground">Loading account data...</p>
        </div>
      </div>
    )
  }

  if (error && !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => loadAccountData()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const subscriptionInfo = getSubscriptionInfo()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, subscription, and preferences
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Profile Sidebar */}
        <div className="space-y-4">
          <Card className="border-foreground/10">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <User className="h-10 w-10 text-foreground" />
                </div>
                
                <div>
                  <h2 className="font-semibold text-lg">{userProfile?.name || 'User'}</h2>
                  <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {getUserTypeIcon()}
                    <span className="text-xs capitalize text-muted-foreground">
                      {userProfile?.user_type}
                    </span>
                  </div>
                </div>

                <Badge 
                  variant="secondary" 
                  className={`bg-${subscriptionInfo.color}-100 text-${subscriptionInfo.color}-700 border-${subscriptionInfo.color}-200`}
                >
                  {subscriptionInfo.plan === 'Premium' && <Crown className="h-3 w-3 mr-1" />}
                  {subscriptionInfo.plan}
                </Badge>

                {userProfile && (
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Notes Generated</span>
                      <span className="font-medium">{userProfile.notes_generated}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Learning Streak</span>
                      <span className="font-medium">{userProfile.current_learning_streak} days</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Member Since</span>
                      <span className="font-medium">
                        {userProfile.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                {subscriptionInfo.plan === 'Free' && (
                  <Button variant="outline" className="w-full" size="sm">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {userStats && (
            <Card className="border-foreground/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Current Streak</span>
                  <span className="font-medium">{userStats.current_learning_streak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Longest Streak</span>
                  <span className="font-medium">{userStats.longest_learning_streak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Notes Generated</span>
                  <span className="font-medium">{userStats.notes_generated}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-4 w-full lg:w-fit">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="border-foreground/10">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Display Name
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="userType" className="text-sm font-medium">
                        User Type
                      </label>
                      <select
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value as 'student' | 'teacher' | 'professional')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Contact support to change your email address
                    </p>
                  </div>

                  <Button 
                    onClick={handleUpdateProfile} 
                    disabled={saving}
                    className="w-full md:w-auto"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-foreground/10">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium">
                      Current Password
                    </label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="newPassword" className="text-sm font-medium">
                        New Password
                      </label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm New Password
                      </label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                    className="w-full md:w-auto"
                  >
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <Card className="border-foreground/10">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-foreground/20 rounded-lg bg-foreground/5">
                    <div className="flex items-center gap-3">
                      {subscriptionInfo.plan === 'Premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                      {subscriptionInfo.plan === 'Enterprise' && <Shield className="h-5 w-5 text-purple-500" />}
                      <div>
                        <h4 className="font-medium">{subscriptionInfo.plan} Plan</h4>
                        <p className="text-sm text-muted-foreground">
                          {subscriptionInfo.plan === 'Free' ? 'Free forever' : 
                           subscriptionInfo.plan === 'Premium' ? '$9.99/month' : 'Contact sales'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {subscriptionInfo.plan === 'Free' ? 'Upgrade' : 'Change Plan'}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Plan Features</h4>
                    <ul className="space-y-2">
                      {subscriptionInfo.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {userProfile?.subscription_tier !== 'free' && (
                <Card className="border-foreground/10">
                  <CardHeader>
                    <CardTitle>Usage & Billing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 border border-foreground/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Notes This Month</p>
                        <p className="text-2xl font-bold">{userProfile?.notes_generated || 0}</p>
                      </div>
                      <div className="p-3 border border-foreground/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Plan Renewal</p>
                        <p className="text-2xl font-bold">15 days</p>
                      </div>
                      <div className="p-3 border border-foreground/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Next Bill</p>
                        <p className="text-2xl font-bold">$9.99</p>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <h4 className="font-medium">Recent Invoices</h4>
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-foreground/10">
                            <div>
                              <p className="text-sm font-medium">{subscriptionInfo.plan} Plan</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {subscriptionInfo.plan === 'Premium' ? '$9.99' : 'Custom'}
                              </span>
                              <Button variant="ghost" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card className="border-foreground/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Your Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {achievements.length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No achievements yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Keep learning to unlock achievements!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.achievement.id}
                          className="flex items-center gap-3 p-3 border border-foreground/10 rounded-lg"
                        >
                          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Award className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.achievement.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {achievement.achievement.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Achieved {new Date(achievement.achieved_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-foreground/10">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      label: "Email Notifications",
                      description: "Receive updates about your account",
                      checked: emailNotifications,
                      onChange: setEmailNotifications
                    },
                    {
                      label: "Weekly Summary",
                      description: "Get a weekly report of your learning activity",
                      checked: weeklySummary,
                      onChange: setWeeklySummary
                    },
                    {
                      label: "Auto-save Notes",
                      description: "Automatically save generated notes",
                      checked: autoSaveNotes,
                      onChange: setAutoSaveNotes
                    }
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <button
                        onClick={() => setting.onChange(!setting.checked)}
                        className={`h-6 w-11 rounded-full relative transition-colors ${
                          setting.checked ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                            setting.checked ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-foreground/10">
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    className="w-full justify-start"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}