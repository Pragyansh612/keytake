'use client'

import { GlassPanel } from "@/components/glass-panel"
import { NoteCard } from "@/components/note-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Sparkles, BookOpen, Filter, ArrowUpRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { PublicNoteResponse } from "@/types/types"

export default function ExplorePage() {
  const [publicNotes, setPublicNotes] = useState<PublicNoteResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("trending")

  // Get current user info from localStorage to check ownership
  const getCurrentUserId = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data')
      if (userData) {
        return JSON.parse(userData).id
      }
    }
    return null
  }

  // Filter notes based on search query
  const filteredNotes = publicNotes.filter(note =>
    note.video_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort notes based on active tab
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (activeTab) {
      case 'trending':
        return (b.view_count || 0) - (a.view_count || 0)
      case 'recommended':
        return (b.like_count || 0) - (a.like_count || 0)
      case 'community':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  // Get certified notes for topics tab
  const certifiedNotes = publicNotes.filter(note => note.is_certified)

  // Extract tags from video titles and summaries for trending topics
  const getTrendingTopics = () => {
    const tagCounts: Record<string, number> = {}
    
    // Extract potential topics from video titles
    publicNotes.forEach(note => {
      const words = note.video_title.toLowerCase().split(/\s+/)
      words.forEach(word => {
        // Filter out common words and keep meaningful terms
        if (word.length > 3 && !['the', 'and', 'for', 'with', 'from', 'that', 'this', 'will', 'your', 'how'].includes(word)) {
          const cleanWord = word.replace(/[^a-zA-Z]/g, '')
          if (cleanWord.length > 3) {
            tagCounts[cleanWord] = (tagCounts[cleanWord] || 0) + 1
          }
        }
      })
    })

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({
        name: tag.charAt(0).toUpperCase() + tag.slice(1),
        count,
        icon: getTopicIcon(tag)
      }))
  }

  const getTopicIcon = (topic: string) => {
    const topicLower = topic.toLowerCase()
    if (topicLower.includes('ai') || topicLower.includes('machine') || topicLower.includes('learning')) return "🤖"
    if (topicLower.includes('web') || topicLower.includes('development') || topicLower.includes('coding')) return "🌐"
    if (topicLower.includes('data') || topicLower.includes('science') || topicLower.includes('analytics')) return "📊"
    if (topicLower.includes('business') || topicLower.includes('finance') || topicLower.includes('marketing')) return "💼"
    if (topicLower.includes('physics') || topicLower.includes('quantum') || topicLower.includes('chemistry')) return "⚛️"
    if (topicLower.includes('math') || topicLower.includes('calculus') || topicLower.includes('statistics')) return "🔢"
    if (topicLower.includes('history') || topicLower.includes('literature') || topicLower.includes('philosophy')) return "📚"
    if (topicLower.includes('psychology') || topicLower.includes('neuroscience') || topicLower.includes('brain')) return "🧠"
    if (topicLower.includes('design') || topicLower.includes('art') || topicLower.includes('creative')) return "🎨"
    if (topicLower.includes('music') || topicLower.includes('audio') || topicLower.includes('sound')) return "🎵"
    return "📖"
  }

  const fetchPublicNotes = async (sortBy?: 'newest' | 'views' | 'likes') => {
    try {
      setLoading(true)
      const notes = await api.browsePublicNotes({ sort_by: sortBy })
      setPublicNotes(notes)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch public notes')
      console.error('Error fetching public notes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublicNotes()
  }, [])

  // Handle tab change and re-fetch with appropriate sorting
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    let sortBy: 'newest' | 'views' | 'likes' | undefined

    switch (value) {
      case 'trending':
        sortBy = 'views'
        break
      case 'recommended':
        sortBy = 'likes'
        break
      case 'community':
        sortBy = 'newest'
        break
      default:
        sortBy = undefined
    }

    if (sortBy) {
      fetchPublicNotes(sortBy)
    }
  }

  const trendingTopics = getTrendingTopics()
  const currentUserId = getCurrentUserId()

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading public notes...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Explore</h1>
            <p className="text-muted-foreground mt-1">Discover popular notes and community content</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search notes..." 
                className="pl-9 bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <GlassPanel className="p-4 border-red-200 bg-red-50">
            <p className="text-red-600">Error: {error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => fetchPublicNotes()}
            >
              Try Again
            </Button>
          </GlassPanel>
        )}

        {/* Trending Topics Carousel */}
        {trendingTopics.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Trending Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {trendingTopics.map((topic, index) => (
                <GlassPanel
                  key={index}
                  className="p-4 flex flex-col gap-2 hover:shadow-md transition-all cursor-pointer"
                  hoverEffect={true}
                  onClick={() => setSearchQuery(topic.name)}
                >
                  <div className="text-2xl">{topic.icon}</div>
                  <h3 className="font-medium text-sm md:text-base">{topic.name}</h3>
                  <p className="text-xs text-muted-foreground">{topic.count} notes</p>
                </GlassPanel>
              ))}
            </div>
          </section>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="topics">Certified</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-6">
            {sortedNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.video_title}
                    thumbnail={note.video_thumbnail_url || "/placeholder.svg?height=400&width=600"}
                    duration={note.video_duration ? `${Math.floor(note.video_duration / 60)}:${String(note.video_duration % 60).padStart(2, '0')}` : "N/A"}
                    tags={[]} // Public notes don't have tags in the current API
                    createdAt={note.created_at}
                    viewCount={note.view_count}
                    isPublic={note.is_public}
                    // Only show edit/delete options if the current user owns the note
                    ownerId={note.user_id}
                    showOwnerActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No trending notes found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommended" className="mt-6">
            {sortedNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.video_title}
                    thumbnail={note.video_thumbnail_url || "/placeholder.svg?height=400&width=600"}
                    duration={note.video_duration ? `${Math.floor(note.video_duration / 60)}:${String(note.video_duration % 60).padStart(2, '0')}` : "N/A"}
                    tags={[]}
                    createdAt={note.created_at}
                    viewCount={note.view_count}
                    isPublic={note.is_public}
                    ownerId={note.user_id}
                    showOwnerActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recommended notes found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            {sortedNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.video_title}
                    thumbnail={note.video_thumbnail_url || "/placeholder.svg?height=400&width=600"}
                    duration={note.video_duration ? `${Math.floor(note.video_duration / 60)}:${String(note.video_duration % 60).padStart(2, '0')}` : "N/A"}
                    tags={[]}
                    createdAt={note.created_at}
                    viewCount={note.view_count}
                    isPublic={note.is_public}
                    ownerId={note.user_id}
                    showOwnerActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No community notes found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="topics" className="mt-6">
            {certifiedNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifiedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.video_title}
                    thumbnail={note.video_thumbnail_url || "/placeholder.svg?height=400&width=600"}
                    duration={note.video_duration ? `${Math.floor(note.video_duration / 60)}:${String(note.video_duration % 60).padStart(2, '0')}` : "N/A"}
                    tags={[]}
                    createdAt={note.created_at}
                    viewCount={note.view_count}
                    isPublic={note.is_public}
                    ownerId={note.user_id}
                    showOwnerActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No certified notes found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Learning Paths</h2>
            <Button variant="link" className="text-primary gap-1">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassPanel className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Data Science Fundamentals</h3>
                  <p className="text-sm text-muted-foreground">
                    {publicNotes.filter(note => 
                      note.video_title.toLowerCase().includes('data') || 
                      note.video_title.toLowerCase().includes('science') ||
                      note.summary?.toLowerCase().includes('data') ||
                      note.summary?.toLowerCase().includes('science')
                    ).length} notes available
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                A comprehensive introduction to data science concepts, tools, and methodologies.
              </p>
              <Button variant="outline" className="w-full mt-2">
                Explore Path
              </Button>
            </GlassPanel>

            <GlassPanel className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Web Development</h3>
                  <p className="text-sm text-muted-foreground">
                    {publicNotes.filter(note => 
                      note.video_title.toLowerCase().includes('web') || 
                      note.video_title.toLowerCase().includes('development') ||
                      note.video_title.toLowerCase().includes('javascript') ||
                      note.video_title.toLowerCase().includes('programming')
                    ).length} notes available
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Learn modern web development from the fundamentals to advanced concepts.
              </p>
              <Button variant="outline" className="w-full mt-2">
                Explore Path
              </Button>
            </GlassPanel>
          </div>
        </section>

        {/* Stats section */}
        <section className="mt-8">
          <GlassPanel className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <h3 className="text-2xl font-bold">{publicNotes.length}</h3>
                <p className="text-sm text-muted-foreground">Total Notes</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{certifiedNotes.length}</h3>
                <p className="text-sm text-muted-foreground">Certified Notes</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {publicNotes.reduce((sum, note) => sum + (note.view_count || 0), 0).toLocaleString()}
                </h3>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {publicNotes.reduce((sum, note) => sum + (note.like_count || 0), 0)}
                </h3>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </div>
            </div>
          </GlassPanel>
        </section>
      </div>
    </div>
  )
}