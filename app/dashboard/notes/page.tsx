"use client"

import { useState, useEffect } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { NoteCard } from "@/components/note-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, FolderOpen, Plus, Filter, Loader2, RefreshCw, BookOpen, Grid3X3, List } from "lucide-react"
import { api } from "@/lib/api"
import { NoteResponse } from "@/types/types"
import { useRouter } from "next/navigation"

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const router = useRouter()

  // Load notes on component mount
  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true)
      else setLoading(true)
      
      const notesData = await api.getNotes()
      setNotes(notesData)
    } catch (error) {
      console.error("Failed to load notes:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleCreateNote = async () => {
    if (!videoUrl.trim() || !videoTitle.trim()) return

    try {
      setIsCreating(true)
      
      // Extract video ID from YouTube URL
      const videoId = extractVideoId(videoUrl)
      if (!videoId) {
        alert("Please enter a valid YouTube URL")
        return
      }

      const response = await api.createNote({
        video_id: videoId,
        video_title: videoTitle
      })

      // Close dialog and reset form
      setIsCreateDialogOpen(false)
      setVideoUrl("")
      setVideoTitle("")
      
      // Refresh notes list to show the new note
      loadNotes(true)
      
      // Redirect to the notes page to show generation progress
      router.push(`/dashboard/notes/${response.note_id}`)
      
    } catch (error) {
      console.error("Failed to create note:", error)
      alert("Failed to create note. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const handlePrivacyChange = (noteId: string, isPublic: boolean) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === noteId 
          ? { ...note, is_public: isPublic }
          : note
      )
    )
  }

  const handleNoteDelete = (noteId: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.video_title.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (activeTab) {
      case "recent":
        // Show notes from last 7 days
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return matchesSearch && new Date(note.created_at) > weekAgo
      case "public":
        return matchesSearch && note.is_public
      case "private":
        return matchesSearch && !note.is_public
      case "folders":
        return matchesSearch && note.folder_id
      default:
        return matchesSearch
    }
  })

  const handleNoteClick = (noteId: string) => {
    router.push(`/dashboard/notes/${noteId}`)
  }

  // Get counts for tabs
  const getCounts = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    return {
      all: notes.length,
      recent: notes.filter(note => new Date(note.created_at) > weekAgo).length,
      public: notes.filter(note => note.is_public).length,
      private: notes.filter(note => !note.is_public).length,
      folders: notes.filter(note => note.folder_id).length
    }
  }

  const counts = getCounts()

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading your notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notes Library</h1>
            <p className="text-muted-foreground mt-1">Organize and manage your learning materials</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes by title..." 
              className="pl-9 bg-background/50 border-foreground/20" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 border border-foreground/20 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => loadNotes(true)}
            disabled={refreshing}
            className="border-foreground/20 hover:border-foreground/60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="video-url">YouTube Video URL</Label>
                  <Input
                    id="video-url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-title">Video Title</Label>
                  <Input
                    id="video-title"
                    placeholder="Enter the video title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="h-11"
                  />
                </div>
                <Button 
                  onClick={handleCreateNote} 
                  className="w-full h-11"
                  disabled={isCreating || !videoUrl.trim() || !videoTitle.trim()}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Note...
                    </>
                  ) : (
                    "Create Note"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList className="grid w-full md:w-auto grid-cols-5 md:grid-cols-5">
            <TabsTrigger value="all" className="text-xs md:text-sm">
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-xs md:text-sm">
              Recent ({counts.recent})
            </TabsTrigger>
            <TabsTrigger value="public" className="text-xs md:text-sm">
              Public ({counts.public})
            </TabsTrigger>
            <TabsTrigger value="private" className="text-xs md:text-sm">
              Private ({counts.private})
            </TabsTrigger>
            <TabsTrigger value="folders" className="text-xs md:text-sm">
              Folders ({counts.folders})
            </TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm" className="gap-2 border-foreground/20">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Empty State Component */}
        {filteredNotes.length === 0 && (
          <div className="mt-8">
            <GlassPanel className="p-12 text-center">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <FolderOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-xl font-semibold mb-2">
                    {searchQuery ? "No notes match your search" : "No notes found"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? "Try adjusting your search terms or browse all notes." 
                      : "Create your first note from a YouTube video to get started with AI-powered learning."
                    }
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="shadow-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Note
                    </Button>
                  )}
                </div>
              </div>
            </GlassPanel>
          </div>
        )}

        {/* Notes Grid/List */}
        {filteredNotes.length > 0 && (
          <>
            <TabsContent value="all" className="mt-8">
              <NotesDisplay 
                notes={filteredNotes} 
                viewMode={viewMode}
                onNoteClick={handleNoteClick}
                onPrivacyChange={handlePrivacyChange}
                onDelete={handleNoteDelete}
              />
            </TabsContent>

            <TabsContent value="recent" className="mt-8">
              <NotesDisplay 
                notes={filteredNotes} 
                viewMode={viewMode}
                onNoteClick={handleNoteClick}
                onPrivacyChange={handlePrivacyChange}
                onDelete={handleNoteDelete}
                badge="Recent"
              />
            </TabsContent>

            <TabsContent value="public" className="mt-8">
              <NotesDisplay 
                notes={filteredNotes} 
                viewMode={viewMode}
                onNoteClick={handleNoteClick}
                onPrivacyChange={handlePrivacyChange}
                onDelete={handleNoteDelete}
                badge="Public"
              />
            </TabsContent>

            <TabsContent value="private" className="mt-8">
              <NotesDisplay 
                notes={filteredNotes} 
                viewMode={viewMode}
                onNoteClick={handleNoteClick}
                onPrivacyChange={handlePrivacyChange}
                onDelete={handleNoteDelete}
                badge="Private"
              />
            </TabsContent>

            <TabsContent value="folders" className="mt-8">
              <NotesDisplay 
                notes={filteredNotes} 
                viewMode={viewMode}
                onNoteClick={handleNoteClick}
                onPrivacyChange={handlePrivacyChange}
                onDelete={handleNoteDelete}
                badge="Organized"
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

// Notes Display Component
function NotesDisplay({ 
  notes, 
  viewMode, 
  onNoteClick, 
  onPrivacyChange, 
  onDelete, 
  badge 
}: {
  notes: NoteResponse[]
  viewMode: 'grid' | 'list'
  onNoteClick: (noteId: string) => void
  onPrivacyChange: (noteId: string, isPublic: boolean) => void
  onDelete: (noteId: string) => void
  badge?: string
}) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.video_title}
            thumbnail={note.video_thumbnail_url || "/placeholder.svg?height=400&width=600"}
            duration={note.video_duration ? `${Math.floor(note.video_duration / 60)}:${(note.video_duration % 60).toString().padStart(2, '0')}` : "N/A"}
            tags={badge ? ["AI Generated", badge] : ["AI Generated"]}
            saved={note.is_public}
            onClick={() => onNoteClick(note.id)}
            createdAt={note.created_at}
            viewCount={note.view_count}
            isPublic={note.is_public}
            onPrivacyChange={onPrivacyChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <GlassPanel key={note.id} className="p-6 hover:bg-foreground/[0.02] transition-colors">
          <div 
            className="flex items-center gap-6 cursor-pointer"
            onClick={() => onNoteClick(note.id)}
          >
            <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-2 truncate">{note.video_title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Created {new Date(note.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>{note.view_count} views</span>
                <span>•</span>
                <span className={note.is_public ? "text-green-600" : "text-orange-600"}>
                  {note.is_public ? "Public" : "Private"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {badge && (
                  <span className="px-2 py-1 bg-foreground/10 text-foreground rounded-md text-xs font-medium">
                    {badge}
                  </span>
                )}
                <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-md text-xs font-medium">
                  AI Generated
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onPrivacyChange(note.id, !note.is_public)
                }}
              >
                {note.is_public ? "Make Private" : "Make Public"}
              </Button>
            </div>
          </div>
        </GlassPanel>
      ))}
    </div>
  )
}