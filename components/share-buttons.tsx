"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react"

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  const shareOnLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
  }

  return (
    <div>
      <p className="font-medium mb-3">Share this article</p>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-foreground/20 hover:border-foreground/60"
          onClick={shareOnTwitter}
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-foreground/20 hover:border-foreground/60"
          onClick={shareOnFacebook}
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-foreground/20 hover:border-foreground/60"
          onClick={shareOnLinkedin}
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-foreground/20 hover:border-foreground/60"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
