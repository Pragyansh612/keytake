import { GlassPanel } from "@/components/glass-panel"
import { NoteCard } from "@/components/note-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Sparkles, BookOpen, Filter, ArrowUpRight } from "lucide-react"
import Image from "next/image"

export default function ExplorePage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Explore</h1>
            <p className="text-muted-foreground mt-1">Discover popular videos and community notes</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search topics..." className="pl-9 bg-background/50" />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Trending Topics Carousel */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Trending Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "AI & Machine Learning", icon: "🤖", count: 245 },
              { name: "Web Development", icon: "🌐", count: 189 },
              { name: "Data Science", icon: "📊", count: 167 },
              { name: "Business Finance", icon: "💼", count: 132 },
              { name: "Quantum Physics", icon: "⚛️", count: 98 },
            ].map((topic, index) => (
              <GlassPanel
                key={index}
                className="p-4 flex flex-col gap-2 hover:shadow-md transition-all cursor-pointer"
                hoverEffect={true}
              >
                <div className="text-2xl">{topic.icon}</div>
                <h3 className="font-medium text-sm md:text-base">{topic.name}</h3>
                <p className="text-xs text-muted-foreground">{topic.count} videos</p>
              </GlassPanel>
            ))}
          </div>
        </section>

        <Tabs defaultValue="trending">
          <TabsList>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NoteCard
                id="1"
                title="Understanding Quantum Computing in 15 Minutes"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="15:42"
                tags={["Quantum Computing", "Physics", "Technology"]}
              />
              <NoteCard
                id="2"
                title="The Complete Guide to Machine Learning Algorithms"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="28:15"
                tags={["AI", "Machine Learning", "Data Science"]}
              />
              <NoteCard
                id="3"
                title="History of Philosophy: Ancient Greece to Modern Day"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="42:30"
                tags={["Philosophy", "History", "Education"]}
              />
              <NoteCard
                id="4"
                title="Web Development Fundamentals: HTML, CSS, and JavaScript"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="35:18"
                tags={["Web Development", "Programming", "JavaScript"]}
              />
              <NoteCard
                id="5"
                title="Introduction to Blockchain Technology"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="22:45"
                tags={["Blockchain", "Cryptocurrency", "Technology"]}
              />
              <NoteCard
                id="6"
                title="The Science of Climate Change Explained"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="31:20"
                tags={["Climate Change", "Science", "Environment"]}
              />
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NoteCard
                id="7"
                title="Advanced Python Programming Techniques"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="45:12"
                tags={["Python", "Programming", "Computer Science"]}
              />
              <NoteCard
                id="8"
                title="The Future of Artificial Intelligence"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="38:05"
                tags={["AI", "Technology", "Future"]}
              />
              <NoteCard
                id="9"
                title="Understanding Neural Networks"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="27:30"
                tags={["AI", "Neural Networks", "Deep Learning"]}
              />
            </div>
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NoteCard
                id="10"
                title="How to Build a Startup: From Idea to Launch"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="52:18"
                tags={["Startup", "Business", "Entrepreneurship"]}
              />
              <NoteCard
                id="11"
                title="The Psychology of Decision Making"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="33:45"
                tags={["Psychology", "Decision Making", "Cognitive Science"]}
              />
              <NoteCard
                id="12"
                title="Introduction to Quantum Mechanics"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="41:20"
                tags={["Physics", "Quantum Mechanics", "Science"]}
              />
            </div>
          </TabsContent>

          <TabsContent value="topics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassPanel className="p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Computer Science</h3>
                <p className="text-sm text-muted-foreground">120+ videos available</p>
              </GlassPanel>

              <GlassPanel className="p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Physics</h3>
                <p className="text-sm text-muted-foreground">85+ videos available</p>
              </GlassPanel>

              <GlassPanel className="p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Mathematics</h3>
                <p className="text-sm text-muted-foreground">95+ videos available</p>
              </GlassPanel>

              <GlassPanel className="p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">History</h3>
                <p className="text-sm text-muted-foreground">70+ videos available</p>
              </GlassPanel>

              <GlassPanel className="p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Business</h3>
                <p className="text-sm text-muted-foreground">65+ videos available</p>
              </GlassPanel>

              <GlassPanel className="p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Psychology</h3>
                <p className="text-sm text-muted-foreground">55+ videos available</p>
              </GlassPanel>
            </div>
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
                  <p className="text-sm text-muted-foreground">8 videos • 3.5 hours</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                A comprehensive introduction to data science concepts, tools, and methodologies.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-foreground/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                    >
                      {i}
                    </div>
                  ))}
                  <div className="h-8 w-8 rounded-full bg-foreground/5 border-2 border-background flex items-center justify-center text-xs">
                    +5
                  </div>
                </div>
                <div className="ml-2 text-sm text-foreground/60">
                  <span className="font-medium">42%</span> complete
                </div>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Continue Learning
              </Button>
            </GlassPanel>

            <GlassPanel className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Web Development Bootcamp</h3>
                  <p className="text-sm text-muted-foreground">12 videos • 6 hours</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Learn modern web development from the fundamentals to advanced concepts.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-foreground/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                    >
                      {i}
                    </div>
                  ))}
                  <div className="h-8 w-8 rounded-full bg-foreground/5 border-2 border-background flex items-center justify-center text-xs">
                    +10
                  </div>
                </div>
                <div className="ml-2 text-sm text-foreground/60">
                  <span className="font-medium">16%</span> complete
                </div>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Continue Learning
              </Button>
            </GlassPanel>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Content Creators Spotlight</h2>
            <Button variant="link" className="text-primary gap-1">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: "Tech Explained",
                topics: "Computer Science, AI",
                followers: "125K",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Science Simplified",
                topics: "Physics, Chemistry",
                followers: "98K",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "History Hub",
                topics: "History, Anthropology",
                followers: "76K",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Math Mastery",
                topics: "Mathematics, Statistics",
                followers: "62K",
                image: "/placeholder.svg?height=200&width=200",
              },
            ].map((creator, index) => (
              <GlassPanel
                key={index}
                className="p-6 flex flex-col items-center text-center gap-4 hover:shadow-md transition-all"
              >
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image src={creator.image || "/placeholder.svg"} alt={creator.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">{creator.name}</h3>
                  <p className="text-sm text-muted-foreground">{creator.topics}</p>
                  <p className="text-xs text-foreground/60 mt-1">{creator.followers} followers</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Follow
                </Button>
              </GlassPanel>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
