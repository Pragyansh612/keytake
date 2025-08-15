"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  
  // Check if we're on a dashboard page to hide footer
  const isDashboardPage = pathname?.startsWith('/dashboard')

  // Don't render footer on dashboard pages
  if (isDashboardPage) {
    return null
  }

  return (
    <footer className="border-t border-foreground/10 mt-20 py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Link href="/" className="text-xl font-bold inline-block mb-4">
              Keytake
            </Link>
            <p className="text-foreground/70 mb-6 max-w-md">
              Transform YouTube videos into structured notes instantly with AI-powered analysis. Save time and learn
              more effectively with our cutting-edge platform.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-foreground/20">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-foreground/20">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-foreground/20">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-foreground/20">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-lg">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-foreground/70 hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-foreground/70 hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-foreground/70 hover:text-foreground transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-foreground/70 hover:text-foreground transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium mb-4 text-lg">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-foreground/70 hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground/70 hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-foreground/70 hover:text-foreground transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-foreground/70 hover:text-foreground transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-medium mb-4 text-lg">Subscribe to our newsletter</h3>
            <p className="text-foreground/70 mb-4">
              Get the latest updates, articles, and resources delivered straight to your inbox.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-11 bg-background/50 border-foreground/20 focus-visible:border-foreground/60"
              />
              <Button type="submit" className="h-11 px-4">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-foreground/60">© {currentYear} Keytake. All rights reserved.</p>

            <div className="flex items-center gap-6">
              <Link
                href="/legal/privacy"
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link
                href="/legal/cookies"
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}