"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/AuthContext"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Explore", href: "/explore" },
  { name: "About", href: "/about" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [mounted, setMounted] = useState(false)
  const { user, profile, signOut, loading } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Get display name - prefer profile name, fallback to email
  const displayName = profile?.name || user?.email?.split('@')[0] || 'User'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false)
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  const handleSignOut = async () => {
    try {
      await signOut()
      setUserMenuOpen(false)
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled || mobileMenuOpen 
          ? "border-b border-foreground/10 bg-background/98 backdrop-blur-xl shadow-sm" 
          : "bg-background/80 backdrop-blur-sm md:bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 sm:h-24 items-center justify-between">
          {/* Logo section */}
          <div className="flex items-center gap-6 lg:gap-10 flex-shrink-0">
            <div className="relative">
              {/* Logo with orbital effect in dark mode */}
              <Link href="/" className="flex items-center gap-2 group relative z-10">
                <span className="text-xl sm:text-2xl font-bold tracking-tight relative">
                  Keytake
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>

              {/* Orbital effect for dark mode */}
              {mounted && isDark && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-6 -left-6 w-[150%] h-[150%] pointer-events-none z-0"
                >
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-20">
                    <motion.ellipse
                      cx="50"
                      cy="50"
                      rx="45"
                      ry="25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <motion.circle
                      cx="95"
                      cy="50"
                      r="2"
                      fill="currentColor"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-8 xl:gap-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-base font-medium transition-colors relative py-1 group whitespace-nowrap",
                    pathname === item.href ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {item.name}
                  {pathname === item.href ? (
                    <motion.span layoutId="underline" className="absolute left-0 top-full h-[2px] w-full bg-foreground" />
                  ) : (
                    <span className="absolute left-0 top-full h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full"></span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            
            {/* Desktop auth section */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 h-10 px-3 hover:bg-foreground/5"
                  >
                    <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground/80 max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", userMenuOpen && "rotate-180")} />
                  </Button>

                  {/* User dropdown menu */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-background border border-foreground/10 rounded-md shadow-lg overflow-hidden"
                      >
                        <div className="p-3 border-b border-foreground/10">
                          <p className="text-sm font-medium truncate">{displayName}</p>
                          <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                          <Link
                            href="/profile"
                            className="flex items-center w-full px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Profile Settings
                          </Link>
                          <Link
                            href="/dashboard"
                            className="flex items-center w-full px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              signOut()
                              setUserMenuOpen(false)
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded"
                          >
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-10 px-5 border-foreground/20 hover:border-foreground/80 shadow-sm hover:shadow-md transition-all"
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild 
                    className="h-10 px-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-10 w-10" 
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile menu panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background border-l border-foreground/10 shadow-xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-foreground/10">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-2xl font-bold">Keytake</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-10 w-10"
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors",
                        pathname === item.href 
                          ? "text-foreground bg-foreground/5" 
                          : "text-foreground/70 hover:text-foreground hover:bg-foreground/5",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Auth section */}
                <div className="p-4 border-t border-foreground/10">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{displayName}</p>
                          <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center w-full px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center w-full px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          signOut()
                          setMobileMenuOpen(false)
                        }}
                      >
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setMobileMenuOpen(false)} 
                        asChild
                      >
                        <Link href="/login">Log in</Link>
                      </Button>
                      <Button 
                        className="w-full" 
                        onClick={() => setMobileMenuOpen(false)} 
                        asChild
                      >
                        <Link href="/signup">Sign up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}