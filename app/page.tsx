"use client"

import { GlassPanel } from "@/components/glass-panel"
import { YouTubeInput } from "@/components/youtube-input"
import { VideoPlayerAI } from "@/components/video-player-ai"
import { StepIllustration } from "@/components/step-illustration"
import { AnimatedCounter } from "@/components/animated-counter"
import { ChromeExtensionShowcase } from "@/components/chrome-extension-showcase"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Chrome, ArrowDown } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function Home() {
  const [activeStep, setActiveStep] = useState(1)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Simulate changing the active step when the video is playing
  const handlePlayVideo = () => {
    setVideoPlaying(true)

    // Simulate step progression
    let currentStep = 1
    const interval = setInterval(() => {
      currentStep++
      if (currentStep > 4) {
        clearInterval(interval)
        return
      }
      setActiveStep(currentStep)
    }, 3000)
  }

  // Scroll to the next section
  const scrollToNextSection = () => {
    const howItWorksSection = document.getElementById("how-it-works")
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="w-full min-h-[90vh] flex items-center justify-center py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_0,rgba(var(--primary-rgb),0)_50%)]" />
        </div>

        <div className="container flex flex-col items-center text-center max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 md:mb-8 text-balance leading-tight">
              Transform YouTube videos into
              <span className="text-foreground ml-2 relative inline-block">
                structured notes
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-[3px] bg-foreground"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mb-10 md:mb-14">
              Keytake uses AI to convert educational videos into comprehensive, organized notes instantly. Save time and
              learn more effectively.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full"
          >
            <YouTubeInput />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl"
          >
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold">
                <AnimatedCounter end={50} suffix="K+" className="text-4xl md:text-5xl" />
              </div>
              <p className="text-sm md:text-base text-foreground/60 mt-2">Active Users</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold">
                <AnimatedCounter end={1.2} suffix="M+" className="text-4xl md:text-5xl" decimalPlaces={1} />
              </div>
              <p className="text-sm md:text-base text-foreground/60 mt-2">Notes Generated</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold">
                <AnimatedCounter end={4.9} suffix="/5" className="text-4xl md:text-5xl" decimalPlaces={1} />
              </div>
              <p className="text-sm md:text-base text-foreground/60 mt-2">User Rating</p>
            </div>
          </motion.div>

          {/* Scroll down indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -20 : 0 }}
            transition={{ duration: 0.5 }}
            onClick={scrollToNextSection}
          >
            <div className="flex flex-col items-center">
              <p className="text-sm text-foreground/60 mb-2">Learn more</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <ArrowDown className="h-5 w-5 text-foreground/60" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-24 px-4 bg-foreground/[0.02]">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
                Our AI-powered platform analyzes videos and extracts key information in just a few seconds
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
              >
                <GlassPanel className="overflow-hidden border-foreground/10 shadow-md" intensity="medium">
                  <VideoPlayerAI
                    src="/placeholder.mp4"
                    poster="/placeholder.svg?height=400&width=600"
                    autoPlay={videoPlaying}
                    title="How Keytake Works"
                    description="A step-by-step guide to generating notes from YouTube videos"
                    grayscale={true}
                  />

                  {!videoPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={handlePlayVideo}
                        className="rounded-full h-16 w-16 bg-foreground text-background hover:bg-foreground/90 transition-transform duration-300 hover:scale-110"
                      >
                        <Play className="h-8 w-8 ml-1" />
                      </Button>
                    </div>
                  )}
                </GlassPanel>
              </motion.div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <StepIllustration
                number={1}
                title="Paste any YouTube URL"
                description="Simply copy and paste the URL of any educational YouTube video you want to analyze."
                isActive={activeStep === 1}
                delay={0}
              />

              <StepIllustration
                number={2}
                title="AI analyzes the content"
                description="Our advanced AI processes the video, identifying key concepts, definitions, and relationships."
                isActive={activeStep === 2}
                delay={1}
              />

              <StepIllustration
                number={3}
                title="Get structured notes instantly"
                description="Receive comprehensive, hierarchically organized notes ready for review and study."
                isActive={activeStep === 3}
                delay={2}
              />

              <StepIllustration
                number={4}
                title="Save and organize your notes"
                description="Store your notes in your personal library, organize them into folders, and access them anytime."
                isActive={activeStep === 4}
                delay={3}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Button
                  size="lg"
                  className="mt-4 bg-foreground text-background hover:bg-foreground/90 shadow-sm hover:shadow-md transition-all"
                  asChild
                >
                  <Link href="/explore">
                    See examples <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-24 px-4">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
                Join thousands of students and professionals who are transforming how they learn
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Keytake has completely transformed how I study. I save hours of note-taking time and can focus on actually understanding the material.",
                author: "Sarah J.",
                role: "Computer Science Student",
                rating: 5,
              },
              {
                quote:
                  "As a medical student, I need to process vast amounts of video content. Keytake's AI-generated notes are incredibly accurate and well-structured.",
                author: "Michael T.",
                role: "Medical Student",
                rating: 5,
              },
              {
                quote:
                  "The structured format of the notes makes reviewing complex topics so much easier. It's like having a personal research assistant.",
                author: "Emily L.",
                role: "PhD Researcher",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
              >
                <GlassPanel className="p-6 h-full" intensity="medium">
                  <div className="flex flex-col gap-4 h-full">
                    <div className="flex">
                      {Array(testimonial.rating)
                        .fill(0)
                        .map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                    </div>

                    <div className="relative flex-grow">
                      <svg
                        className="absolute -top-2 -left-2 h-8 w-8 text-foreground/20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                      </svg>
                      <p className="text-foreground/70 italic relative z-10">{testimonial.quote}</p>
                    </div>

                    <div className="mt-4">
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-foreground/60">{testimonial.role}</p>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chrome Extension Section */}
      <section className="w-full py-24 px-4 bg-foreground/[0.02]">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Chrome Extension</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
                Generate notes directly from YouTube with our browser extension
              </p>
            </motion.div>
          </div>

          <ChromeExtensionShowcase className="max-w-4xl mx-auto" />

          <div className="mt-16 flex justify-center">
            <Button
              size="lg"
              className="gap-2 bg-foreground text-background hover:bg-foreground/90 shadow-sm hover:shadow-md transition-all"
            >
              <Chrome className="h-4 w-4" />
              Install Chrome Extension
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-4">
        <div className="container text-center">
          <GlassPanel
            className="max-w-3xl mx-auto p-8 md:p-12 border-foreground/10 shadow-md hover:shadow-lg transition-all duration-300"
            intensity="medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to transform your learning?</h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-xl mx-auto">
              Join thousands of students and professionals who are learning more efficiently with Keytake.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 bg-foreground text-background hover:bg-foreground/90 shadow-sm hover:shadow-md transition-all"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-foreground/20 hover:border-foreground/80 shadow-sm hover:shadow-md transition-all"
              >
                <Link href="/explore">Explore Examples</Link>
              </Button>
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  )
}
