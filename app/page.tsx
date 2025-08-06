"use client"

import { GlassPanel } from "@/components/glass-panel"
import { YouTubeInput } from "@/components/youtube-input"
import { VideoPlayerAI } from "@/components/video-player-ai"
import { StepIllustration } from "@/components/step-illustration"
import { AnimatedCounter } from "@/components/animated-counter"
import { ChromeExtensionShowcase } from "@/components/chrome-extension-showcase"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Chrome, ArrowDown, Star, Users, BookOpen, Clock } from "lucide-react"
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
      <section className="w-full min-h-[90vh] flex items-center justify-center py-12 sm:py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_0,rgba(var(--primary-rgb),0)_50%)]" />
          {/* Additional gradient overlays for better visual depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.05)_0,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--primary-rgb),0.02)_0,transparent_50%)]" />
        </div>

        <div className="container flex flex-col items-center text-center max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 md:mb-8 text-balance leading-[1.1] sm:leading-[1.1] md:leading-[1.1]">
              Transform YouTube videos into
              <span className="text-foreground ml-2 relative inline-block">
                structured notes
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-[2px] sm:h-[3px] bg-foreground"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/70 max-w-4xl mb-8 sm:mb-10 md:mb-14 px-2">
              Keytake uses AI to convert educational videos into comprehensive, organized notes instantly. Save time and
              learn more effectively.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="w-full max-w-2xl px-4 sm:px-0"
          >
            <YouTubeInput />
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="mt-12 sm:mt-16 md:mt-24 w-full max-w-5xl px-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex flex-col items-center p-6 rounded-lg bg-foreground/[0.02] border border-foreground/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-foreground/60" />
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
                    <AnimatedCounter end={50} suffix="K+" className="text-3xl sm:text-4xl md:text-5xl" />
                  </div>
                </div>
                <p className="text-sm sm:text-base text-foreground/60">Active Users</p>
              </div>
              
              <div className="flex flex-col items-center p-6 rounded-lg bg-foreground/[0.02] border border-foreground/10">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-foreground/60" />
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
                    <AnimatedCounter end={1.2} suffix="M+" className="text-3xl sm:text-4xl md:text-5xl" decimalPlaces={1} />
                  </div>
                </div>
                <p className="text-sm sm:text-base text-foreground/60">Notes Generated</p>
              </div>
              
              <div className="flex flex-col items-center p-6 rounded-lg bg-foreground/[0.02] border border-foreground/10 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-foreground/60" />
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
                    <AnimatedCounter end={4.9} suffix="/5" className="text-3xl sm:text-4xl md:text-5xl" decimalPlaces={1} />
                  </div>
                </div>
                <p className="text-sm sm:text-base text-foreground/60">User Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Scroll down indicator */}
          <motion.div
            className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -20 : 0 }}
            transition={{ duration: 0.5 }}
            onClick={scrollToNextSection}
          >
            <div className="flex flex-col items-center">
              <p className="text-xs sm:text-sm text-foreground/60 mb-2">Learn more</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/60" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 sm:py-20 md:py-24 px-4 bg-foreground/[0.02]">
        <div className="container max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-foreground/70 max-w-3xl mx-auto text-base sm:text-lg px-4">
                Our AI-powered platform analyzes videos and extracts key information in just a few seconds
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <GlassPanel className="overflow-hidden border-foreground/10 shadow-lg" intensity="medium">
                  <div className="aspect-video relative">
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
                          className="rounded-full h-12 w-12 sm:h-16 sm:w-16 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          <Play className="h-6 w-6 sm:h-8 sm:w-8 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                </GlassPanel>
              </motion.div>
            </div>

            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
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
                className="pt-4"
              >
                <Button
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 shadow-md hover:shadow-lg transition-all"
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
      <section className="w-full py-16 sm:py-20 md:py-24 px-4">
        <div className="container max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-foreground/70 max-w-3xl mx-auto text-base sm:text-lg px-4">
                Join thousands of students and professionals who are transforming how they learn
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                className={`${index === 2 ? 'md:col-span-2 xl:col-span-1' : ''}`}
              >
                <GlassPanel className="p-6 sm:p-8 h-full hover:shadow-lg transition-all duration-300" intensity="medium">
                  <div className="flex flex-col gap-4 sm:gap-6 h-full">
                    <div className="flex items-center gap-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              i < testimonial.rating 
                                ? 'text-foreground fill-current' 
                                : 'text-foreground/20'
                            }`}
                          />
                        ))}
                    </div>

                    <div className="relative flex-grow">
                      <svg
                        className="absolute -top-1 -left-1 h-6 w-6 sm:h-8 sm:w-8 text-foreground/10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                      </svg>
                      <p className="text-foreground/70 italic relative z-10 text-sm sm:text-base leading-relaxed">
                        {testimonial.quote}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-foreground/10">
                      <p className="font-medium text-sm sm:text-base">{testimonial.author}</p>
                      <p className="text-xs sm:text-sm text-foreground/60">{testimonial.role}</p>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chrome Extension Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4 bg-foreground/[0.02]">
        <div className="container max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Chrome Extension</h2>
              <p className="text-foreground/70 max-w-3xl mx-auto text-base sm:text-lg px-4">
                Generate notes directly from YouTube with our browser extension
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <ChromeExtensionShowcase className="max-w-5xl mx-auto" />
          </motion.div>

          <div className="mt-12 sm:mt-16 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Button
                size="lg"
                className="gap-2 bg-foreground text-background hover:bg-foreground/90 shadow-md hover:shadow-lg transition-all px-6 sm:px-8"
              >
                <Chrome className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Install Chrome Extension</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 sm:py-20 md:py-24 px-4">
        <div className="container text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <GlassPanel
              className="max-w-4xl mx-auto p-6 sm:p-8 md:p-12 border-foreground/10 shadow-lg hover:shadow-xl transition-all duration-300"
              intensity="medium"
            >
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                    Ready to transform your learning?
                  </h2>
                  <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto px-2">
                    Join thousands of students and professionals who are learning more efficiently with Keytake.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-6 sm:px-8 bg-foreground text-background hover:bg-foreground/90 shadow-md hover:shadow-lg transition-all"
                  >
                    <span className="text-sm sm:text-base">Get Started Free</span>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto px-6 sm:px-8 border-foreground/20 hover:border-foreground/80 shadow-md hover:shadow-lg transition-all"
                  >
                    <Link href="/explore">
                      <span className="text-sm sm:text-base">Explore Examples</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>
    </div>
  )
}