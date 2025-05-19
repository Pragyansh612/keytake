"use client"

import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Brain, Lightbulb, Users, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.08)_0,rgba(var(--primary-rgb),0)_50%)]" />
        </div>

        <div className="container">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Our Mission</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-xl text-muted-foreground mb-8">
                At Keytake, we're on a mission to transform how people learn from video content. We believe that
                everyone should have access to efficient, effective learning tools that help them absorb and retain
                knowledge.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="lg" asChild>
                <Link href="/signup">
                  Join our journey <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Keytake was founded in 2022 by a team of AI researchers and educators who recognized a fundamental
                  problem: as educational content on platforms like YouTube continues to grow exponentially, our ability
                  to efficiently process and retain that information hasn't kept pace.
                </p>
                <p>
                  We started with a simple question: What if we could use AI to transform lengthy educational videos
                  into structured, easy-to-review notes? This would allow learners to focus on understanding concepts
                  rather than frantically taking notes, and provide a valuable reference for later review.
                </p>
                <p>
                  After months of research and development, we launched the first version of Keytake. The response was
                  overwhelming, with students, professionals, and lifelong learners embracing our tool as an essential
                  part of their learning process.
                </p>
                <p>
                  Today, Keytake serves thousands of users worldwide, continuously improving our AI models and expanding
                  our features to better serve the global learning community.
                </p>
              </div>
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=800&width=600" alt="Keytake team" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-20 px-4">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassPanel className="p-6" intensity="medium" hoverEffect={true}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 rounded-full bg-primary/10 p-3 h-fit">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We continuously push the boundaries of what's possible with AI and learning technology, always
                    seeking better ways to serve our users.
                  </p>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-6" intensity="medium" hoverEffect={true}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 rounded-full bg-primary/10 p-3 h-fit">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Accessibility</h3>
                  <p className="text-muted-foreground">
                    We believe that powerful learning tools should be available to everyone, regardless of background or
                    resources.
                  </p>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-6" intensity="medium" hoverEffect={true}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 rounded-full bg-primary/10 p-3 h-fit">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Community</h3>
                  <p className="text-muted-foreground">
                    We foster a supportive community of learners who share knowledge and help each other grow.
                  </p>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-6" intensity="medium" hoverEffect={true}>
              <div className="flex gap-4">
                <div className="flex-shrink-0 rounded-full bg-primary/10 p-3 h-fit">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Excellence</h3>
                  <p className="text-muted-foreground">
                    We are committed to delivering the highest quality experience in everything we do, from our AI
                    models to our user interface.
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The passionate people behind Keytake</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Alex Chen", role: "Founder & CEO", image: "/placeholder.svg?height=400&width=400" },
              { name: "Sarah Johnson", role: "Chief AI Officer", image: "/placeholder.svg?height=400&width=400" },
              { name: "Michael Rodriguez", role: "Head of Product", image: "/placeholder.svg?height=400&width=400" },
              { name: "Emily Wong", role: "Lead Designer", image: "/placeholder.svg?height=400&width=400" },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassPanel className="overflow-hidden text-center" intensity="medium">
                  <div className="relative aspect-square w-full">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="w-full py-20 px-4">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  At the heart of Keytake is our proprietary AI system that combines several cutting-edge technologies:
                </p>
                <ul className="space-y-2 pl-6 list-disc">
                  <li>
                    <span className="font-medium text-foreground">Advanced Speech Recognition:</span> Our system
                    accurately transcribes spoken content from videos, handling different accents, technical
                    terminology, and background noise.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Natural Language Processing:</span> We use
                    state-of-the-art NLP models to understand the semantic meaning of content, identify key concepts,
                    and recognize relationships between ideas.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Knowledge Graphs:</span> Our system builds structured
                    representations of information, allowing for hierarchical organization of notes.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Continuous Learning:</span> Our models improve over
                    time based on user feedback and interactions, becoming increasingly accurate and helpful.
                  </li>
                </ul>
                <p>
                  We're constantly researching and implementing new advances in AI to make Keytake even more powerful
                  and intuitive for our users.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <GlassPanel className="p-6" intensity="medium">
                <div className="relative aspect-square w-full bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="absolute w-3/4 h-3/4 rounded-full border-4 border-primary/20 animate-pulse-subtle"></div>
                  <div
                    className="absolute w-1/2 h-1/2 rounded-full border-4 border-primary/30 animate-pulse-subtle"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute w-1/4 h-1/4 rounded-full border-4 border-primary/40 animate-pulse-subtle"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div className="relative z-10">
                    <Brain className="h-16 w-16 text-primary" />
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 bg-muted/30">
        <div className="container text-center">
          <GlassPanel className="max-w-3xl mx-auto p-8 md:p-12" intensity="medium">
            <h2 className="text-3xl font-bold mb-6">Join the Keytake Community</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Be part of our mission to transform learning and education through technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  )
}
