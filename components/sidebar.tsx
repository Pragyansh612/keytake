"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  User,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Users,
  BookMarked,
  Settings
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

// Only include sidebar items that have API support
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Notes", href: "/dashboard/notes" },
  { icon: Brain, label: "Study Tools", href: "/dashboard/study-tools" },
  { icon: TrendingUp, label: "Progress", href: "/dashboard/progress" },
  { icon: Users, label: "Community", href: "/dashboard/community" },
  { icon: BookMarked, label: "Study Plans", href: "/dashboard/study-plans" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { user, profile, signOut } = useAuth()

  const getUserInitials = () => {
    const name = profile?.name || user?.email || 'User'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getDisplayName = () => {
    return profile?.name || user?.email?.split('@')[0] || 'User'
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-r border-foreground/10 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center p-4 border-b border-foreground/10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 flex-shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 ml-3">
            <span className="text-xl font-bold">Keytake</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {/* Back to Home */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
          title={collapsed ? "Back to Home" : undefined}
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Back to Home</span>}
        </Link>

        <div className="h-px bg-foreground/10 my-3" />

        {/* Dashboard Navigation */}
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium",
                isActive
                  ? "bg-foreground/10 text-foreground"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-3 border-t border-foreground/10">
        {collapsed ? (
          <div className="flex flex-col gap-2">
            <Avatar className="h-8 w-8 mx-auto">
              <AvatarFallback className="bg-foreground/10 text-foreground font-semibold text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8"
                title="Profile Settings"
              >
                <Link href="/profile">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="h-8 w-8"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-foreground/10 text-foreground font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{getDisplayName()}</p>
                <p className="text-xs text-foreground/60 truncate">
                  {profile?.subscription_tier || 'Free Plan'}
                </p>
              </div>
              <ThemeToggle />
            </div>

            <div className="flex justify-between items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex-1 justify-start gap-2 h-8"
              >
                <Link href="/dashboard/account">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut()}
                  className="h-8 w-8 flex-shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}