"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
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
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [mounted, setMounted] = useState(false)
  const { user, profile, signOut } = useAuth()

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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled || mobileMenuOpen ? "border-b border-foreground/10 bg-background/95 backdrop-blur-xl" : "bg-background/80 backdrop-blur-sm md:bg-transparent",
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="relative">
            {/* Logo with orbital effect in dark mode */}
            <Link href="/" className="flex items-center gap-2 group relative z-10">
              <span className="text-xl font-bold tracking-tight relative">
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

          <nav className="hidden md:flex gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1 group",
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
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex gap-3">
            {user && profile ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground/80">
                  Welcome, {profile.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="h-10 px-5 border-foreground/20 hover:border-foreground/80 shadow-sm hover:shadow-md transition-all"
                >
                  Sign out
                </Button>
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
                <Button size="sm" asChild className="h-10 px-5 shadow-sm hover:shadow-md transition-all">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-xl font-bold">Keytake</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-base font-medium py-2 transition-colors",
                      pathname === item.href ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="h-px w-full bg-foreground/10 my-2" />
                {user && profile ? (
                  <div className="space-y-2">
                    <div className="text-base font-medium py-2 text-foreground">
                      Welcome, {profile.name}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-base font-medium py-2 text-foreground/70 hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Button className="mt-2" onClick={() => setMobileMenuOpen(false)} asChild>
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}