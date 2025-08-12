import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Copy, Check, Mail, Link as LinkIcon, Share2, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  noteId: string
  noteTitle: string
  isPublic: boolean
}

export function ShareModal({ isOpen, onClose, noteId, noteTitle, isPublic }: ShareModalProps) {
  const [shareType, setShareType] = useState<"email" | "link">("link")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [permission, setPermission] = useState<"view" | "comment">("view")
  const [isSharing, setIsSharing] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/notes/${noteId}` : ''

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      }
    } catch (error) {
      console.error("Failed to copy link:", error)
      // Fallback: try to select and copy using document.execCommand (deprecated but still works)
      try {
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      } catch (fallbackError) {
        alert("Failed to copy link. Please copy manually: " + shareUrl)
      }
    }
  }

  const handleEmailShare = async () => {
    if (!email.trim()) {
      alert("Please enter an email address")
      return
    }

    try {
      setIsSharing(true)
      
      // First, you'll need to find the user ID by email
      // This assumes you have an API endpoint to find users by email
      // If you don't have this endpoint, you'll need to create one or modify the backend
      // to accept email directly in the share endpoint
      
      // For now, I'll show you how to structure the call assuming you get the user ID somehow:
      // const userResponse = await api.findUserByEmail(email) // You'll need this endpoint
      // const shared_with_user_id = userResponse.user_id
      
      // Since you don't have this endpoint, let's modify the approach:
      // You might want to create a separate shareNoteByEmail method in your API client
      
      await api.shareNoteByEmail(noteId, {
        email,
        message: message || `Check out this note: ${noteTitle}`,
        permission
      })
      
      alert("Note shared successfully!")
      onClose()
    } catch (error) {
      console.error("Failed to share note:", error)
      alert("Failed to share note. Please try again.")
    } finally {
      setIsSharing(false)
    }
  }

  const handleNativeShare = async () => {
    // Check if navigator.share is actually available
    if (typeof navigator !== 'undefined' && navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: noteTitle,
          text: `Check out this note: ${noteTitle}`,
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Failed to share:", error)
          // Fallback to copy link
          handleCopyLink()
        }
      }
    } else {
      // Fallback to copy link if native sharing isn't available
      handleCopyLink()
    }
  }

  // Check if native sharing is available
  const isNativeShareAvailable = typeof navigator !== 'undefined' && 
    navigator.share && 
    typeof navigator.share === 'function'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isPublic && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                This note is private. Make it public first to share with others.
              </p>
            </div>
          )}

          <div>
            <Label className="text-base font-medium">Share method:</Label>
            <RadioGroup 
              value={shareType} 
              onValueChange={(value) => setShareType(value as "email" | "link")}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="link" id="link" />
                <Label htmlFor="link" className="flex items-center gap-2 cursor-pointer">
                  <LinkIcon className="h-4 w-4" />
                  Copy link
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                  <Mail className="h-4 w-4" />
                  Send via email
                </Label>
              </div>
            </RadioGroup>
          </div>

          {shareType === "link" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="share-url">Share URL:</Label>
                <div className="flex mt-1">
                  <Input
                    id="share-url"
                    value={shareUrl}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2 flex-shrink-0"
                    onClick={handleCopyLink}
                  >
                    {copiedLink ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCopyLink} className="flex-1">
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
                
                {isNativeShareAvailable && (
                  <Button variant="outline" onClick={handleNativeShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                )}
              </div>
            </div>
          )}

          {shareType === "email" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="email-input">Email address:</Label>
                <Input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recipient@example.com"
                />
              </div>

              <div>
                <Label htmlFor="permission">Permission level:</Label>
                <RadioGroup 
                  value={permission} 
                  onValueChange={(value) => setPermission(value as "view" | "comment")}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="view" id="read" />
                    <Label htmlFor="read" className="cursor-pointer">View only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comment" id="comment" />
                    <Label htmlFor="comment" className="cursor-pointer">Can comment</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="message">Message (optional):</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Check out this note: ${noteTitle}`}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleEmailShare} 
                className="w-full"
                disabled={isSharing || !email.trim()}
              >
                {isSharing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}