"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={`relative overflow-hidden rounded-full w-10 h-10 border-foreground/20 ${className}`}
        aria-label="Toggle theme"
      >
        <div className="opacity-0">
          <Sun className="h-5 w-5" />
        </div>
      </Button>
    )
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
      className={`relative overflow-hidden rounded-full w-10 h-10 border-foreground/20 hover:border-foreground/60 transition-colors shadow-sm hover:shadow-md ${className}`}
      aria-label="Toggle theme"
    >
      <div className="relative w-full h-full">
        {/* Sun icon for light mode */}
        <motion.div
          initial={false}
          animate={{
            opacity: currentTheme === "light" ? 1 : 0,
            scale: currentTheme === "light" ? 1 : 0.5,
            rotate: currentTheme === "light" ? 0 : 180,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="h-5 w-5" />
        </motion.div>

        {/* Moon icon for dark mode */}
        <motion.div
          initial={false}
          animate={{
            opacity: currentTheme === "dark" ? 1 : 0,
            scale: currentTheme === "dark" ? 1 : 0.5,
            rotate: currentTheme === "dark" ? 0 : -180,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="h-5 w-5" />
        </motion.div>
      </div>
    </Button>
  )
}
