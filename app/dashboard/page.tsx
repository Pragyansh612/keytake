import { GlassPanel } from "@/components/glass-panel"
import { NoteCard } from "@/components/note-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, FolderOpen, Plus, Filter } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Notes</h1>
            <p className="text-muted-foreground mt-1">Manage and organize your learning materials</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search notes..." className="pl-9 bg-background/50" />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Notes</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="folders">Folders</TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NoteCard
                id="1"
                title="Understanding Quantum Computing in 15 Minutes"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="15:42"
                tags={["Quantum Computing", "Physics", "Technology"]}
                saved={true}
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
                saved={true}
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

          <TabsContent value="recent" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NoteCard
                id="1"
                title="Understanding Quantum Computing in 15 Minutes"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="15:42"
                tags={["Quantum Computing", "Physics", "Technology"]}
                saved={true}
              />
              <NoteCard
                id="2"
                title="The Complete Guide to Machine Learning Algorithms"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="28:15"
                tags={["AI", "Machine Learning", "Data Science"]}
              />
              <NoteCard
                id="4"
                title="Web Development Fundamentals: HTML, CSS, and JavaScript"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="35:18"
                tags={["Web Development", "Programming", "JavaScript"]}
              />
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NoteCard
                id="1"
                title="Understanding Quantum Computing in 15 Minutes"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="15:42"
                tags={["Quantum Computing", "Physics", "Technology"]}
                saved={true}
              />
              <NoteCard
                id="3"
                title="History of Philosophy: Ancient Greece to Modern Day"
                thumbnail="/placeholder.svg?height=400&width=600"
                duration="42:30"
                tags={["Philosophy", "History", "Education"]}
                saved={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="folders" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassPanel className="p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Computer Science</h3>
                <p className="text-sm text-muted-foreground">12 notes</p>
              </GlassPanel>

              <GlassPanel className="p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Physics</h3>
                <p className="text-sm text-muted-foreground">8 notes</p>
              </GlassPanel>

              <GlassPanel className="p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                <div className="rounded-full bg-primary/10 p-3 w-fit">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">History</h3>
                <p className="text-sm text-muted-foreground">5 notes</p>
              </GlassPanel>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
