"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Heart, 
  Eye, 
  Search,
  Filter,
  BookOpen,
  Star,
  TrendingUp,
  Award,
  MessageSquare,
  Share,
  ThumbsUp,
  Clock,
  User,
  Crown,
  Sparkles,
  Grid3X3,
  List,
  ExternalLink
} from "lucide-react"
import { api } from "@/lib/api"
import { 
  PublicNoteResponse, 
  CertifiedCollectionResponse,
  LikeResponse
} from "@/types/types"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Loading component for Suspense fallback
function CommunityLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        <p className="text-muted-foreground">Loading community content...</p>
      </div>
    </div>
  )
}

// Main community component
function CommunityContent() {
  const [publicNotes, setPublicNotes] = useState<PublicNoteResponse[]>([])
  const [certifiedCollections, setCertifiedCollections] = useState<CertifiedCollectionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'likes'>('newest')
  const [showCertifiedOnly, setShowCertifiedOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [likedNotes, setLikedNotes] = useState<Set<string>>(new Set())
  
  const router = useRouter()

  useEffect(() => {
    loadCommunityData()
  }, [sortBy, showCertifiedOnly])

  const loadCommunityData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const results = await Promise.allSettled([
        api.browsePublicNotes({ 
          is_certified: showCertifiedOnly || undefined, 
          sort_by: sortBy 
        }),
        api.getCertifiedCollections()
      ])

      const [notesResult, collectionsResult] = results

      if (notesResult.status === 'fulfilled') {
        setPublicNotes(notesResult.value)
      } else {
        console.error("Failed to load public notes:", notesResult.reason)
      }

      if (collectionsResult.status === 'fulfilled') {
        setCertifiedCollections(collectionsResult.value)
      } else {
        console.error("Failed to load collections:", collectionsResult.reason)
      }

    } catch (error) {
      console.error("Failed to load community data:", error)
      setError("Failed to load community data")
    } finally {
      setLoading(false)
    }
  }

  const handleLikeNote = async (noteId: string) => {
    try {
      if (likedNotes.has(noteId)) {
        await api.unlikeNote(noteId)
        setLikedNotes(prev => {
          const newSet = new Set(prev)
          newSet.delete(noteId)
          return newSet
        })
        // Update the local state optimistically
        setPublicNotes(prev => prev.map(note => 
          note.id === noteId 
            ? { ...note, like_count: Math.max((note.like_count || 0) - 1, 0) }
            : note
        ))
      } else {
        await api.likeNote(noteId)
        setLikedNotes(prev => new Set([...prev, noteId]))
        // Update the local state optimistically
        setPublicNotes(prev => prev.map(note => 
          note.id === noteId 
            ? { ...note, like_count: (note.like_count || 0) + 1 }
            : note
        ))
      }
    } catch (error) {
      console.error("Failed to toggle like:", error)
    }
  }

  const handleShare = async (note: PublicNoteResponse) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.video_title,
          text: `Check out this note: ${note.video_title}`,
          url: `${window.location.origin}/dashboard/notes/${note.id}`,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/dashboard/notes/${note.id}`)
        alert('Link copied to clipboard!')
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
      }
    }
  }

  const filteredNotes = publicNotes.filter(note =>
    note.video_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.author_name || note.user_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTrendingNotes = () => {
    // Simple trending algorithm based on likes and views in the last period
    return [...publicNotes]
      .sort((a, b) => {
        const scoreA = (a.like_count || 0) * 2 + (a.view_count || a.views || 0) * 0.1
        const scoreB = (b.like_count || 0) * 2 + (b.view_count || b.views || 0) * 0.1
        return scoreB - scoreA
      })
      .slice(0, 6)
  }

  if (loading) {
    return <CommunityLoading />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => loadCommunityData()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const NoteCard = ({ note, className = "" }: { note: PublicNoteResponse, className?: string }) => (
    <Card key={note.id} className={`border-foreground/10 hover:border-foreground/20 transition-all duration-300 cursor-pointer group hover:shadow-lg ${className}`}>
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative overflow-hidden rounded-t-lg">
          {note.video_thumbnail_url || note.thumbnail_url ? (
            <img
              src={note.video_thumbnail_url || note.thumbnail_url}
              alt={note.video_title}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          
          <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center hidden">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {note.is_certified && (
              <Badge className="bg-yellow-500/90 text-yellow-900 text-xs border-0">
                <Crown className="h-3 w-3 mr-1" />
                Certified
              </Badge>
            )}
          </div>
          
          {/* Duration */}
          {note.video_duration && (
            <Badge variant="secondary" className="absolute bottom-2 right-2 text-xs bg-black/50 text-white border-0">
              {formatDuration(note.video_duration)}
            </Badge>
          )}
        </div>

        <div className="p-4">
          {/* Title */}
          <h3 
            className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer"
            onClick={() => router.push(`/dashboard/notes/${note.id}`)}
          >
            {note.video_title}
          </h3>

          {/* Creator */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
              <User className="h-3 w-3" />
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {note.author_name || note.user_name || 'Anonymous'}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatViews(note.view_count || note.views || 0)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {note.like_count || note.likes_count || 0}
              </span>
            </div>
            <span>{new Date(note.created_at).toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-foreground/10">
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLikeNote(note.id)
                }}
                className={`h-7 px-2 text-xs ${likedNotes.has(note.id) ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-3 w-3 mr-1 ${likedNotes.has(note.id) ? 'fill-current' : ''}`} />
                {likedNotes.has(note.id) ? 'Liked' : 'Like'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  handleShare(note)
                }}
                className="h-7 px-2 text-xs"
              >
                <Share className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
            <Button
              size="sm"
              onClick={() => router.push(`/dashboard/notes/${note.id}`)}
              className="h-7 px-3 text-xs"
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">
            Discover notes and collections shared by the learning community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes and creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: 'newest' | 'views' | 'likes') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant={showCertifiedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCertifiedOnly(!showCertifiedOnly)}
              className="flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Certified Only
            </Button>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none h-9"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none h-9"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Notes</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No public notes found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms" : "Be the first to share a public note!"}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredNotes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  className={viewMode === 'list' ? "flex" : ""} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          {certifiedCollections.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No certified collections found</p>
              <p className="text-sm text-muted-foreground">
                Collections are curated sets of high-quality notes on specific topics
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifiedCollections.map((collection) => (
                <Card key={collection.id} className="border-foreground/10 hover:border-foreground/20 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Crown className="h-5 w-5 text-yellow-500" />
                          {collection.name}
                        </CardTitle>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {collection.description}
                          </p>
                        )}
                      </div>
                      {collection.image_url && (
                        <img 
                          src={collection.image_url} 
                          alt={collection.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{collection.notes.length} notes</span>
                      <span>{new Date(collection.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Preview of notes in collection */}
                    <div className="space-y-2 mb-4">
                      {collection.notes.slice(0, 3).map((note) => (
                        <div key={note.id} className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{note.video_title}</span>
                        </div>
                      ))}
                      {collection.notes.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{collection.notes.length - 3} more notes
                        </p>
                      )}
                    </div>

                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Collection
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          {publicNotes.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No trending content available</p>
              <p className="text-sm text-muted-foreground">
                Check back later for trending notes and topics
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-semibold">Trending Now</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTrendingNotes().map((note, index) => (
                  <div key={note.id} className="relative">
                    <Badge 
                      className="absolute -top-2 -left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0"
                    >
                      #{index + 1}
                    </Badge>
                    <NoteCard note={note} />
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Main exported component with Suspense wrapper
export default function CommunityPage() {
  return (
    <Suspense fallback={<CommunityLoading />}>
      <CommunityContent />
    </Suspense>
  )
}