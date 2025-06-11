import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, CreditCard, BarChart3, Settings, LogOut } from "lucide-react"

export default function AccountPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          <div className="md:sticky md:top-24 h-fit">
            <GlassPanel className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Alex Johnson</h2>
                    <p className="text-sm text-muted-foreground">alex@example.com</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium">
                    Plan: <span className="text-primary">Pro</span>
                  </p>
                  <div className="mt-1 h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4"></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">75% of storage used</p>
                </div>

                <Button variant="outline" className="mt-2 w-full" asChild>
                  <a href="/account/upgrade">Upgrade Plan</a>
                </Button>
              </div>
            </GlassPanel>
          </div>

          <div>
            <Tabs defaultValue="profile">
              <TabsList className="grid grid-cols-4 w-full md:w-fit">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <GlassPanel className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Personal Information</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">
                          First Name
                        </label>
                        <Input id="firstName" defaultValue="Alex" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">
                          Last Name
                        </label>
                        <Input id="lastName" defaultValue="Johnson" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" defaultValue="alex@example.com" />
                    </div>

                    <div className="pt-4">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </GlassPanel>

                <GlassPanel className="p-6 mt-6">
                  <h3 className="text-xl font-semibold mb-6">Password</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="currentPassword" className="text-sm font-medium">
                        Current Password
                      </label>
                      <Input id="currentPassword" type="password" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium">
                          New Password
                        </label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm New Password
                        </label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button>Update Password</Button>
                    </div>
                  </div>
                </GlassPanel>
              </TabsContent>

              <TabsContent value="billing" className="mt-6">
                <GlassPanel className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Subscription Plan</h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-primary/20 rounded-lg bg-primary/5">
                      <div>
                        <h4 className="font-medium">Pro Plan</h4>
                        <p className="text-sm text-muted-foreground">$9.99/month, billed monthly</p>
                      </div>
                      <Button variant="outline">Change Plan</Button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Plan Features</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          Unlimited notes generation
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          Advanced AI analysis
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          Export in multiple formats
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          Priority support
                        </li>
                      </ul>
                    </div>
                  </div>
                </GlassPanel>

                <GlassPanel className="p-6 mt-6">
                  <h3 className="text-xl font-semibold mb-6">Payment Method</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-xs text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>

                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </GlassPanel>

                <GlassPanel className="p-6 mt-6">
                  <h3 className="text-xl font-semibold mb-6">Billing History</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <p className="font-medium">Pro Plan - Monthly</p>
                        <p className="text-xs text-muted-foreground">Apr 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$9.99</p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <p className="font-medium">Pro Plan - Monthly</p>
                        <p className="text-xs text-muted-foreground">Mar 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$9.99</p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <p className="font-medium">Pro Plan - Monthly</p>
                        <p className="text-xs text-muted-foreground">Feb 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$9.99</p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <GlassPanel className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Learning Analytics</h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Notes</h4>
                        <p className="text-3xl font-bold mt-2">42</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Videos Processed</h4>
                        <p className="text-3xl font-bold mt-2">67</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Hours Saved</h4>
                        <p className="text-3xl font-bold mt-2">28.5</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Activity Over Time</h4>
                      <div className="h-64 w-full bg-muted/30 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Activity chart showing your note generation over the past 30 days
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Top Topics</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm">Computer Science</p>
                          <p className="text-sm font-medium">32%</p>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[32%]"></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm">Physics</p>
                          <p className="text-sm font-medium">24%</p>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[24%]"></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm">Mathematics</p>
                          <p className="text-sm font-medium">18%</p>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[18%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <GlassPanel className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Preferences</h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates about your account</p>
                      </div>
                      <div className="h-6 w-11 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Summary</p>
                        <p className="text-sm text-muted-foreground">Get a weekly report of your learning activity</p>
                      </div>
                      <div className="h-6 w-11 bg-muted rounded-full relative">
                        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-muted-foreground"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-save Notes</p>
                        <p className="text-sm text-muted-foreground">Automatically save generated notes</p>
                      </div>
                      <div className="h-6 w-11 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>
                </GlassPanel>

                <GlassPanel className="p-6 mt-6">
                  <h3 className="text-xl font-semibold mb-6">Account Actions</h3>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </GlassPanel>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
