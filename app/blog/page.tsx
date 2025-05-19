import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Clock, User, Tag } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest articles, tutorials, and updates from the Keytake team.",
}

// Mock blog data
const blogPosts = [
  {
    id: "effective-note-taking",
    title: "Effective Note-Taking Strategies for Online Learning",
    excerpt: "Discover proven techniques to maximize your learning potential through strategic note-taking.",
    author: "Alex Johnson",
    date: "May 2, 2023",
    readTime: "5 min read",
    category: "Study Tips",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "ai-education",
    title: "The Future of AI in Education",
    excerpt: "How artificial intelligence is transforming the educational landscape and what it means for students.",
    author: "Maria Garcia",
    date: "April 18, 2023",
    readTime: "8 min read",
    category: "Technology",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "youtube-learning",
    title: "Maximizing YouTube as a Learning Resource",
    excerpt: "Tips and tricks to turn YouTube from a distraction into your most valuable learning platform.",
    author: "James Wilson",
    date: "April 5, 2023",
    readTime: "6 min read",
    category: "Digital Learning",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "remote-study",
    title: "Building Effective Remote Study Habits",
    excerpt: "Strategies to stay focused and productive when studying from home.",
    author: "Sarah Chen",
    date: "March 22, 2023",
    readTime: "7 min read",
    category: "Productivity",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "video-notes",
    title: "From Video to Notes: The Science of Information Retention",
    excerpt: "Understanding how our brains process and retain information from visual content.",
    author: "Dr. Michael Brown",
    date: "March 10, 2023",
    readTime: "10 min read",
    category: "Cognitive Science",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "student-success",
    title: "Student Success Stories: How Keytake Changed My Study Routine",
    excerpt: "Real stories from students who transformed their academic performance with better note-taking.",
    author: "The Keytake Team",
    date: "February 28, 2023",
    readTime: "4 min read",
    category: "Success Stories",
    image: "/placeholder.svg?height=200&width=400",
  },
]

export default function BlogPage() {
  const featuredPost = blogPosts[0]
  const regularPosts = blogPosts.slice(1)

  return (
    <div className="container py-8 px-4 md:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
        ]}
      />

      <div className="mt-8">
        <h1 className="text-4xl font-bold mb-2">Keytake Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Insights, tips, and updates from our team</p>

        {/* Featured Post */}
        <div className="mb-12">
          <Link href={`/blog/${featuredPost.id}`} className="group">
            <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Tag size={14} />
                    {featuredPost.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {featuredPost.readTime}
                  </span>
                </div>
                <CardTitle className="text-2xl group-hover:underline">{featuredPost.title}</CardTitle>
                <CardDescription className="text-base">{featuredPost.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span className="text-sm">{featuredPost.author}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{featuredPost.date}</span>
              </CardFooter>
            </Card>
          </Link>
        </div>

        {/* Regular Posts - Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
              <Card className="h-full border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {post.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-lg group-hover:underline">{post.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    <span className="text-xs">{post.author}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{post.date}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
