"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Bookmark, 
  Play, 
  Eye, 
  Calendar, 
  MoreVertical, 
  Download, 
  Share2, 
  Lock, 
  Globe,
  Trash2,
  Edit
} from "lucide-react"
import Image from "next/image"
import { api } from "@/lib/api"
import { ExportModal } from "@/components/export-modal"
import { ShareModal } from "@/components/share-modal"

interface NoteCardProps {
  id: string
  title: string
  thumbnail: string
  duration: string
  tags: string[]
  saved?: boolean
  onClick?: () => void
  createdAt: string
  viewCount: number
  isPublic?: boolean
  onPrivacyChange?: (noteId: string, isPublic: boolean) => void
  onDelete?: (noteId: string) => void
  ownerId?: string // Add this prop to identify note owner
  showOwnerActions?: boolean // Add this to control whether to show owner-only actions
}

export function NoteCard({
  id,
  title,
  thumbnail,
  duration,
  tags,
  saved = false,
  onClick,
  createdAt,
  viewCount,
  isPublic = false,
  onPrivacyChange,
  onDelete,
  ownerId,
  showOwnerActions = true
}: NoteCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(saved)
  const [currentPrivacy, setCurrentPrivacy] = useState(isPublic)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false)

  // Check if current user is the owner
  const getCurrentUserId = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data')
      if (userData) {
        return JSON.parse(userData).id
      }
    }
    return null
  }

  const currentUserId = getCurrentUserId()
  const isOwner = currentUserId && (currentUserId === ownerId)
  const shouldShowOwnerActions = showOwnerActions && isOwner

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!shouldShowOwnerActions) return
    
    try {
      await api.updateNote(id, { is_public: !isBookmarked })
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error("Failed to update bookmark:", error)
    }
  }

  const handlePrivacyToggle = async (newPublicState: boolean, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!shouldShowOwnerActions || isUpdatingPrivacy) return

    try {
      setIsUpdatingPrivacy(true)
      await api.updateNote(id, { is_public: newPublicState })
      setCurrentPrivacy(newPublicState)
      onPrivacyChange?.(id, newPublicState)
    } catch (error) {
      console.error("Failed to update privacy:", error)
    } finally {
      setIsUpdatingPrivacy(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!shouldShowOwnerActions) return
    
    if (confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      try {
        await api.deleteNote(id)
        onDelete?.(id)
      } catch (error) {
        console.error("Failed to delete note:", error)
        alert("Failed to delete note. Please try again.")
      }
    }
  }

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowExportModal(true)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowShareModal(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <>
      <Card 
        className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-foreground/10 bg-background/50 backdrop-blur-sm"
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            
            {/* Duration badge */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {duration}
            </div>
            
            {/* Privacy indicator */}
            <div className="absolute top-2 left-2">
              <Badge variant={currentPrivacy ? "default" : "secondary"} className="text-xs">
                {currentPrivacy ? (
                  <>
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
            </div>
            
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Play className="h-6 w-6 text-white ml-1" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                {title}
              </h3>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Only show bookmark for owners */}
                {shouldShowOwnerActions && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleBookmark}
                  >
                    <Bookmark 
                      className="h-4 w-4" 
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Note
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Note
                    </DropdownMenuItem>
                    
                    {/* Only show owner-specific actions for owners */}
                    {shouldShowOwnerActions && (
                      <>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={(e) => handlePrivacyToggle(!currentPrivacy, e)}
                          disabled={isUpdatingPrivacy}
                        >
                          {currentPrivacy ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Make Private
                            </>
                          ) : (
                            <>
                              <Globe className="h-4 w-4 mr-2" />
                              Make Public
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={handleDelete}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Note
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{viewCount} views</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-foreground/5 hover:bg-foreground/10 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        noteId={id}
        noteTitle={title}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        noteId={id}
        noteTitle={title}
        isPublic={currentPrivacy}
      />
    </>
  )
}