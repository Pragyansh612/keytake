"use client"

import { useState } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Folder,
  Clock,
  Star,
  Archive,
  LayoutGrid,
  LayoutList,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Plus,
  FolderPlus,
  Tag,
  Download,
  Share2,
  Trash2,
  Edit,
} from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    courses: true,
    personal: false,
    work: false,
  })

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const selectAll = () => {
    if (selectedItems.length > 0) {
      setSelectedItems([])
    } else {
      setSelectedItems(["1", "2", "3", "4", "5", "6"])
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Library</h1>
            <p className="text-muted-foreground mt-1">Organize and access your saved notes</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search notes..." className="pl-9 bg-background/50" />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="flex border border-foreground/10 rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10 rounded-none rounded-l-md"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10 rounded-none rounded-r-md"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          {/* Folder Structure */}
          <div className="md:sticky md:top-24 h-fit">
            <GlassPanel className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Folders</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-2 h-9">
                  <Clock className="h-4 w-4" />
                  Recent
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 h-9">
                  <Star className="h-4 w-4" />
                  Favorites
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 h-9">
                  <Archive className="h-4 w-4" />
                  Archived
                </Button>

                <div className="pt-2">
                  <h3 className="text-xs font-medium text-foreground/60 px-3 py-1">CUSTOM FOLDERS</h3>

                  <div className="space-y-1 mt-1">
                    <div>
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-9"
                        onClick={() => toggleFolder("courses")}
                      >
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4" />
                          <span>Courses</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedFolders["courses"] ? "rotate-180" : ""}`}
                        />
                      </Button>

                      {expandedFolders["courses"] && (
                        <div className="ml-6 space-y-1 mt-1">
                          <Button variant="ghost" className="w-full justify-start gap-2 h-8 text-sm">
                            Computer Science
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-2 h-8 text-sm">
                            Physics
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-2 h-8 text-sm">
                            Mathematics
                          </Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-9"
                        onClick={() => toggleFolder("personal")}
                      >
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4" />
                          <span>Personal</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedFolders["personal"] ? "rotate-180" : ""}`}
                        />
                      </Button>

                      {expandedFolders["personal"] && (
                        <div className="ml-6 space-y-1 mt-1">
                          <Button variant="ghost" className="w-full justify-start gap-2 h-8 text-sm">
                            Learning Goals
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-2 h-8 text-sm">
                            Book Notes
                          </Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-9"
                        onClick={() => toggleFolder("work")}
                      >
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4" />
                          <span>Work</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedFolders["work"] ? "rotate-180" : ""}`}
                        />
                      </Button>

                      {expandedFolders["work"] && (
                        <div className="ml-6 space-y-1 mt-1">
                          <Button variant="ghost" className="w-full justify-start gap-2 h-8 text-sm">
                            Research
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-2 h-8 text-sm">
                            Presentations
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4 gap-2">
                <FolderPlus className="h-4 w-4" />
                New Folder
              </Button>
            </GlassPanel>

            <GlassPanel className="p-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Tags</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1 h-7">
                  <Tag className="h-3 w-3" />
                  Physics
                </Button>
                <Button variant="outline" size="sm" className="gap-1 h-7">
                  <Tag className="h-3 w-3" />
                  AI
                </Button>
                <Button variant="outline" size="sm" className="gap-1 h-7">
                  <Tag className="h-3 w-3" />
                  Programming
                </Button>
                <Button variant="outline" size="sm" className="gap-1 h-7">
                  <Tag className="h-3 w-3" />
                  History
                </Button>
                <Button variant="outline" size="sm" className="gap-1 h-7">
                  <Tag className="h-3 w-3" />
                  Mathematics
                </Button>
              </div>
            </GlassPanel>
          </div>

          {/* Content Area */}
          <div>
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="bg-foreground/5 p-1 border border-foreground/10">
                  <TabsTrigger value="all" className="data-[state=active]:bg-background">
                    All Notes
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="data-[state=active]:bg-background">
                    Videos
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="data-[state=active]:bg-background">
                    Documents
                  </TabsTrigger>
                </TabsList>

                {selectedItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground/60">{selectedItems.length} selected</span>
                    <Button variant="outline" size="sm" className="gap-1">
                      <FolderPlus className="h-4 w-4" />
                      Move
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Tag className="h-4 w-4" />
                      Tag
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="all" className="mt-0">
                <GlassPanel className="p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`gap-1 ${selectedItems.length > 0 ? "bg-foreground/5" : ""}`}
                        onClick={selectAll}
                      >
                        {selectedItems.length > 0 ? "Deselect All" : "Select All"}
                      </Button>
                      <span className="text-sm text-foreground/60">6 notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground/60">Sort by:</span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Date Added
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </GlassPanel>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        id: "1",
                        title: "Understanding Quantum Computing in 15 Minutes",
                        date: "May 4, 2025",
                        tags: ["Physics", "Technology"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                      {
                        id: "2",
                        title: "The Complete Guide to Machine Learning Algorithms",
                        date: "May 2, 2025",
                        tags: ["AI", "Data Science"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                      {
                        id: "3",
                        title: "History of Philosophy: Ancient Greece to Modern Day",
                        date: "Apr 28, 2025",
                        tags: ["Philosophy", "History"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                      {
                        id: "4",
                        title: "Web Development Fundamentals",
                        date: "Apr 25, 2025",
                        tags: ["Programming", "Web Development"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                      {
                        id: "5",
                        title: "Introduction to Blockchain Technology",
                        date: "Apr 20, 2025",
                        tags: ["Blockchain", "Technology"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                      {
                        id: "6",
                        title: "The Science of Climate Change Explained",
                        date: "Apr 15, 2025",
                        tags: ["Science", "Environment"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                    ].map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <GlassPanel
                          className={`overflow-hidden transition-all hover:shadow-md group h-full flex flex-col ${
                            selectedItems.includes(note.id) ? "ring-2 ring-foreground" : ""
                          }`}
                          hoverEffect={true}
                        >
                          <div className="relative aspect-video w-full overflow-hidden">
                            <div
                              className="absolute top-2 left-2 z-10 h-5 w-5 rounded-md border border-foreground/20 bg-background/80 flex items-center justify-center cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleItemSelection(note.id)
                              }}
                            >
                              {selectedItems.includes(note.id) && (
                                <div className="h-3 w-3 bg-foreground rounded-sm"></div>
                              )}
                            </div>
                            <Image
                              src={note.thumbnail || "/placeholder.svg"}
                              alt={note.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {note.title}
                            </h3>
                            <p className="text-xs text-foreground/60 mt-1">{note.date}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {note.tags.map((tag) => (
                                <span key={tag} className="text-xs bg-foreground/5 px-2 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-4">
                              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </GlassPanel>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      {
                        id: "1",
                        title: "Understanding Quantum Computing in 15 Minutes",
                        date: "May 4, 2025",
                        tags: ["Physics", "Technology"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                      {
                        id: "2",
                        title: "The Complete Guide to Machine Learning Algorithms",
                        date: "May 2, 2025",
                        tags: ["AI", "Data Science"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                      {
                        id: "3",
                        title: "History of Philosophy: Ancient Greece to Modern Day",
                        date: "Apr 28, 2025",
                        tags: ["Philosophy", "History"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                      {
                        id: "4",
                        title: "Web Development Fundamentals",
                        date: "Apr 25, 2025",
                        tags: ["Programming", "Web Development"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                      {
                        id: "5",
                        title: "Introduction to Blockchain Technology",
                        date: "Apr 20, 2025",
                        tags: ["Blockchain", "Technology"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                      {
                        id: "6",
                        title: "The Science of Climate Change Explained",
                        date: "Apr 15, 2025",
                        tags: ["Science", "Environment"],
                        thumbnail: "/placeholder.svg?height=400&width=600",
                      },
                    ].map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <GlassPanel
                          className={`transition-all hover:shadow-md ${
                            selectedItems.includes(note.id) ? "ring-2 ring-foreground" : ""
                          }`}
                          hoverEffect={true}
                        >
                          <div className="flex items-center gap-4 p-3">
                            <div
                              className="h-5 w-5 rounded-md border border-foreground/20 bg-background/80 flex items-center justify-center cursor-pointer flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleItemSelection(note.id)
                              }}
                            >
                              {selectedItems.includes(note.id) && (
                                <div className="h-3 w-3 bg-foreground rounded-sm"></div>
                              )}
                            </div>

                            <div className="relative h-12 w-20 flex-shrink-0">
                              <Image
                                src={note.thumbnail || "/placeholder.svg"}
                                alt={note.title}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{note.title}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-foreground/60">{note.date}</p>
                                <div className="flex gap-1">
                                  {note.tags.map((tag) => (
                                    <span key={tag} className="text-xs bg-foreground/5 px-2 py-0.5 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </GlassPanel>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="videos" className="mt-0">
                <div className="flex items-center justify-center h-64 bg-foreground/5 rounded-lg border border-foreground/10">
                  <div className="text-center">
                    <h3 className="font-medium">Video Notes</h3>
                    <p className="text-sm text-foreground/60 mt-1">Your video notes will appear here</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <div className="flex items-center justify-center h-64 bg-foreground/5 rounded-lg border border-foreground/10">
                  <div className="text-center">
                    <h3 className="font-medium">Document Notes</h3>
                    <p className="text-sm text-foreground/60 mt-1">Your document notes will appear here</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
