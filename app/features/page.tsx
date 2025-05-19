import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Sparkles,
  Clock,
  FileText,
  Search,
  Share2,
  Download,
  Folder,
  Zap,
  Layers,
  Lightbulb,
  Brain,
  BookOpen,
  Bookmark,
  BarChart3,
  Check,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Features | Keytake",
  description: "Explore the powerful features of Keytake that transform YouTube videos into structured notes",
  openGraph: {
    title: "Features | Keytake",
    description: "Explore the powerful features of Keytake that transform YouTube videos into structured notes",
    url: "https://keytake.com/features",
    type: "website",
  },
}

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  highlight?: boolean
}

const coreFeatures: Feature[] = [
  {
    title: "AI-Powered Note Generation",
    description:
      "Our advanced AI analyzes video content and automatically generates comprehensive, structured notes with key concepts and insights.",
    icon: <Sparkles className="h-6 w-6" />,
    highlight: true,
  },
  {
    title: "Time-Stamped References",
    description:
      "Each note is linked to the exact moment in the video, allowing you to quickly revisit specific sections for deeper understanding.",
    icon: <Clock className="h-6 w-6" />,
  },
  {
    title: "Hierarchical Organization",
    description:
      "Notes are automatically organized into a clear hierarchy with main topics, subtopics, and supporting details for better comprehension.",
    icon: <Layers className="h-6 w-6" />,
  },
  {
    title: "Smart Summaries",
    description:
      "Get concise summaries of entire videos or specific sections to quickly grasp the main ideas without watching the full content.",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "Keyword Search",
    description:
      "Easily find specific information across all your notes with our powerful search functionality that indexes all your generated content.",
    icon: <Search className="h-6 w-6" />,
  },
  {
    title: "One-Click Sharing",
    description:
      "Share your notes with classmates, colleagues, or study groups with a single click, making collaboration seamless and efficient.",
    icon: <Share2 className="h-6 w-6" />,
  },
]

const organizationFeatures: Feature[] = [
  {
    title: "Custom Folders",
    description:
      "Organize your notes into custom folders by subject, course, project, or any system that works for your learning style.",
    icon: <Folder className="h-6 w-6" />,
  },
  {
    title: "Tags and Categories",
    description:
      "Add custom tags to your notes for flexible organization and easy filtering when searching for specific topics.",
    icon: <Bookmark className="h-6 w-6" />,
  },
  {
    title: "Learning Paths",
    description:
      "Create sequential learning paths by linking related notes together, building a comprehensive knowledge structure.",
    icon: <Zap className="h-6 w-6" />,
  },
]

const productivityFeatures: Feature[] = [
  {
    title: "Chrome Extension",
    description:
      "Generate notes directly from YouTube with our browser extension, streamlining your workflow with one-click access.",
    icon: <Lightbulb className="h-6 w-6" />,
    highlight: true,
  },
  {
    title: "Multiple Export Formats",
    description:
      "Export your notes in various formats including PDF, Markdown, and Word to integrate with your existing workflow.",
    icon: <Download className="h-6 w-6" />,
  },
  {
    title: "Learning Analytics",
    description:
      "Track your learning progress with detailed analytics on your note-taking habits, study patterns, and knowledge growth.",
    icon: <BarChart3 className="h-6 w-6" />,
  },
]

const aiFeatures: Feature[] = [
  {
    title: "Concept Identification",
    description:
      "Our AI automatically identifies and highlights key concepts, definitions, and important terminology in your notes.",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    title: "Knowledge Connections",
    description:
      "Discover connections between related concepts across different videos, building a comprehensive knowledge network.",
    icon: <BookOpen className="h-6 w-6" />,
    highlight: true,
  },
]

export default function FeaturesPage() {
  return (
    <div className="page-transition">
      <section className="w-full py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_0,rgba(var(--primary-rgb),0)_50%)]" />
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Powerful Features</h1>
            <p className="text-xl text-foreground/70">
              Discover how Keytake transforms video learning with our comprehensive suite of features
            </p>
          </div>

          {/* Core Features */}
          <div className="mb-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <GlassPanel
                  key={index}
                  className={`p-6 h-full border-foreground/10 shadow-sm hover:shadow-md transition-all duration-300 ${feature.highlight ? "border-foreground/30" : ""}`}
                  intensity={feature.highlight ? "medium" : "low"}
                  hoverEffect={true}
                >
                  <div className="flex flex-col gap-4 h-full">
                    <div
                      className={`rounded-full ${feature.highlight ? "bg-foreground/20" : "bg-foreground/10"} p-3 w-fit`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                    <p className="text-foreground/70 flex-1">{feature.description}</p>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>

          {/* Feature Showcase */}
          <div className="mb-24">
            <GlassPanel className="overflow-hidden border-foreground/10 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">AI-Powered Note Generation</h2>
                  <p className="text-foreground/70 mb-6">
                    Our advanced AI technology analyzes video content in real-time, identifying key concepts, important
                    definitions, and the relationships between ideas to create comprehensive, structured notes.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                      <span>Automatic identification of main topics and subtopics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                      <span>Extraction of key definitions and terminology</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                      <span>Hierarchical organization for better comprehension</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                      <span>Time-stamped references to original video content</span>
                    </li>
                  </ul>
                  <Button asChild>
                    <Link href="/signup">
                      Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="relative aspect-video lg:aspect-auto lg:h-full">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="AI-Powered Note Generation"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Organization Features */}
          <div className="mb-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Organization Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {organizationFeatures.map((feature, index) => (
                <GlassPanel
                  key={index}
                  className={`p-6 h-full border-foreground/10 shadow-sm hover:shadow-md transition-all duration-300 ${feature.highlight ? "border-foreground/30" : ""}`}
                  intensity={feature.highlight ? "medium" : "low"}
                  hoverEffect={true}
                >
                  <div className="flex flex-col gap-4 h-full">
                    <div
                      className={`rounded-full ${feature.highlight ? "bg-foreground/20" : "bg-foreground/10"} p-3 w-fit`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                    <p className="text-foreground/70 flex-1">{feature.description}</p>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>

          {/* Productivity Features */}
          <div className="mb-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Productivity Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {productivityFeatures.map((feature, index) => (
                <GlassPanel
                  key={index}
                  className={`p-6 h-full border-foreground/10 shadow-sm hover:shadow-md transition-all duration-300 ${feature.highlight ? "border-foreground/30" : ""}`}
                  intensity={feature.highlight ? "medium" : "low"}
                  hoverEffect={true}
                >
                  <div className="flex flex-col gap-4 h-full">
                    <div
                      className={`rounded-full ${feature.highlight ? "bg-foreground/20" : "bg-foreground/10"} p-3 w-fit`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                    <p className="text-foreground/70 flex-1">{feature.description}</p>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>

          {/* AI Features */}
          <div className="mb-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Advanced AI Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {aiFeatures.map((feature, index) => (
                <GlassPanel
                  key={index}
                  className={`p-6 h-full border-foreground/10 shadow-sm hover:shadow-md transition-all duration-300 ${feature.highlight ? "border-foreground/30" : ""}`}
                  intensity={feature.highlight ? "medium" : "low"}
                  hoverEffect={true}
                >
                  <div className="flex flex-col gap-4 h-full">
                    <div
                      className={`rounded-full ${feature.highlight ? "bg-foreground/20" : "bg-foreground/10"} p-3 w-fit`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                    <p className="text-foreground/70 flex-1">{feature.description}</p>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div>
            <GlassPanel className="p-8 md:p-12 text-center border-foreground/10 shadow-md max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your learning experience?</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
                Join thousands of students and professionals who are using Keytake to learn more efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-foreground/20 hover:border-foreground/60">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>
    </div>
  )
}
