"use client"

import { useState } from "react"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Chrome, Check, Bookmark, Download, X, Settings, Copy, Zap, ArrowRight, Sparkles } from "lucide-react"
import { VideoPlayerAI } from "@/components/video-player-ai"

interface ChromeExtensionShowcaseProps {
  className?: string
}

export function ChromeExtensionShowcase({ className }: ChromeExtensionShowcaseProps) {
  const [activeTab, setActiveTab] = useState("popup")
  const [showExtension, setShowExtension] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleProcess = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setProcessed(true)
    }, 2000)
  }

  const handleReset = () => {
    setShowExtension(false)
    setProcessing(false)
    setProcessed(false)
    setShowPreview(false)
    setTimeout(() => {
      setShowExtension(true)
    }, 300)
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="popup">Popup</TabsTrigger>
          <TabsTrigger value="youtube">YouTube Integration</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="install">Installation</TabsTrigger>
        </TabsList>

        <TabsContent value="popup" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Browser mockup */}
            <GlassPanel
              className="overflow-hidden border-foreground/10 p-4 shadow-md hover:shadow-lg transition-all duration-300"
              intensity="medium"
            >
              <div className="flex items-center gap-2 border-b border-foreground/10 pb-3 mb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
                  <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
                  <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
                </div>
                <div className="flex-1 flex items-center h-8 px-3 rounded-full bg-foreground/5 text-sm text-foreground/60">
                  youtube.com/watch?v=example
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-foreground/10 transition-colors"
                  onClick={() => setShowExtension(!showExtension)}
                >
                  <Chrome className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative aspect-video w-full rounded-md overflow-hidden">
                <VideoPlayerAI
                  src="/placeholder.mp4"
                  poster="/placeholder.svg?height=400&width=600"
                  autoPlay={false}
                  muted={true}
                  grayscale={true}
                />
              </div>
            </GlassPanel>

            {/* Chrome extension popup */}
            <AnimatePresence>
              {showExtension && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <GlassPanel className="p-4 border-foreground/10 shadow-lg" intensity="high">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Chrome className="h-5 w-5" />
                        <h3 className="font-medium text-sm">Keytake Extension</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-foreground/10"
                        onClick={handleReset}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {!processed ? (
                      <>
                        <p className="text-xs text-foreground/70 mb-4">
                          Generate structured notes from this YouTube video with one click.
                        </p>
                        <Button
                          className="w-full h-9 text-sm shadow-sm hover:shadow-md transition-all"
                          onClick={handleProcess}
                          disabled={processing}
                        >
                          {processing ? (
                            <>
                              <div className="h-3 w-3 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>Generate Notes</>
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-3 bg-foreground/5 p-2 rounded-md">
                          <div className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <p className="text-xs">Notes generated successfully!</p>
                        </div>

                        <div className="mb-4">
                          <div
                            className="cursor-pointer hover:bg-foreground/5 p-2 rounded-md transition-colors"
                            onClick={() => setShowPreview(!showPreview)}
                          >
                            <h4 className="text-sm font-medium mb-1">Understanding Quantum Computing</h4>
                            <p className="text-xs text-foreground/70 line-clamp-2">
                              A comprehensive overview of quantum computing principles, qubits, and applications...
                            </p>
                          </div>

                          <AnimatePresence>
                            {showPreview && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-2 p-2 bg-foreground/5 rounded-md text-xs"
                              >
                                <p className="font-medium mb-1">1. Introduction to Quantum Computing</p>
                                <ul className="text-foreground/70 pl-4 space-y-1 list-disc text-[10px]">
                                  <li>Classical vs quantum computing paradigms</li>
                                  <li>Superposition and entanglement principles</li>
                                </ul>
                                <p className="font-medium mt-2 mb-1">2. Quantum Bits (Qubits)</p>
                                <ul className="text-foreground/70 pl-4 space-y-1 list-disc text-[10px]">
                                  <li>How qubits differ from classical bits</li>
                                  <li>Physical implementations of qubits</li>
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs gap-1 border-foreground/20 hover:border-foreground/60"
                          >
                            <Bookmark className="h-3 w-3" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs gap-1 border-foreground/20 hover:border-foreground/60"
                          >
                            <Download className="h-3 w-3" />
                            Export
                          </Button>
                          <Button size="sm" className="flex-1 h-8 text-xs shadow-sm hover:shadow-md transition-all">
                            Open
                          </Button>
                        </div>
                      </>
                    )}
                  </GlassPanel>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="lg:col-span-2">
              <h3 className="text-xl font-medium mb-4">Extension Popup</h3>
              <p className="text-foreground/70 mb-6">
                The Keytake Chrome extension adds a convenient popup that allows you to generate notes from any YouTube
                video with a single click. The popup interface provides quick access to all core features without
                leaving the video page.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <div className="rounded-full bg-foreground/10 p-2 w-fit">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-medium">One-Click Generation</h4>
                  <p className="text-xs text-foreground/70">
                    Generate comprehensive notes with a single click while watching videos.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="rounded-full bg-foreground/10 p-2 w-fit">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-medium">Instant Preview</h4>
                  <p className="text-xs text-foreground/70">Preview generated notes before saving or exporting them.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="rounded-full bg-foreground/10 p-2 w-fit">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-medium">Seamless Integration</h4>
                  <p className="text-xs text-foreground/70">
                    Works directly within YouTube without disrupting your viewing experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="youtube" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <GlassPanel
              className="overflow-hidden border-foreground/10 p-4 shadow-md hover:shadow-lg transition-all duration-300"
              intensity="medium"
            >
              <div className="flex items-center gap-2 border-b border-foreground/10 pb-3 mb-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
                  <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
                  <div className="w-3 h-3 rounded-full bg-foreground/20"></div>
                </div>
                <div className="flex-1 flex items-center h-8 px-3 rounded-full bg-foreground/5 text-sm text-foreground/60">
                  youtube.com/watch?v=example
                </div>
              </div>

              <div className="relative w-full rounded-md overflow-hidden">
                <div className="flex flex-col">
                  <div className="aspect-video relative">
                    <VideoPlayerAI
                      src="/placeholder.mp4"
                      poster="/placeholder.svg?height=400&width=600"
                      autoPlay={false}
                      muted={true}
                      grayscale={true}
                    />
                  </div>

                  {/* YouTube-like interface below video */}
                  <div className="p-4 border-b border-foreground/10">
                    <h3 className="font-medium text-base mb-2">Understanding Quantum Computing in 15 Minutes</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-foreground/10"></div>
                        <span className="text-sm">Quantum Science</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1 border-foreground/20">
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Keytake integration */}
                  <div className="p-4 bg-foreground/5 rounded-md m-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Chrome className="h-4 w-4" />
                        <h4 className="font-medium text-sm">Keytake</h4>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-foreground/20">
                        <Sparkles className="h-3 w-3" />
                        Generate Notes
                      </Button>
                    </div>
                    <p className="text-xs text-foreground/70">
                      Transform this video into structured notes with AI. Save time and learn more effectively.
                    </p>
                  </div>
                </div>
              </div>
            </GlassPanel>

            <div>
              <h3 className="text-xl font-medium mb-4">YouTube Integration</h3>
              <p className="text-foreground/70 mb-6">
                The Keytake extension seamlessly integrates with the YouTube interface, adding a convenient panel below
                videos that allows you to generate notes without interrupting your viewing experience.
              </p>

              <GlassPanel className="p-4 border-foreground/10 mb-6">
                <h4 className="font-medium text-sm mb-2">Key Features</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Native integration with YouTube's interface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Generate notes while watching without switching tabs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Automatic video metadata extraction for better notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Works with any educational YouTube video</span>
                  </li>
                </ul>
              </GlassPanel>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-2 border-foreground/20 hover:border-foreground/60">
                  <Chrome className="h-4 w-4" />
                  Install Extension
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <GlassPanel
              className="overflow-hidden border-foreground/10 p-6 shadow-md hover:shadow-lg transition-all duration-300"
              intensity="medium"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Chrome className="h-5 w-5" />
                  <h3 className="font-medium">Keytake Settings</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-foreground/10">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3">Note Generation</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Note Detail Level</p>
                        <p className="text-xs text-foreground/60">Control how detailed your generated notes will be</p>
                      </div>
                      <select className="h-8 rounded-md border border-foreground/20 bg-background px-3 text-sm">
                        <option>Comprehensive</option>
                        <option>Balanced</option>
                        <option>Concise</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Include Timestamps</p>
                        <p className="text-xs text-foreground/60">Add video timestamps to your notes</p>
                      </div>
                      <div className="h-6 w-11 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Auto-save Notes</p>
                        <p className="text-xs text-foreground/60">Automatically save generated notes to your library</p>
                      </div>
                      <div className="h-6 w-11 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-foreground/10">
                  <h4 className="text-sm font-medium mb-3">Display Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Dark Mode</p>
                        <p className="text-xs text-foreground/60">Use dark theme for the extension</p>
                      </div>
                      <div className="h-6 w-11 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Show YouTube Integration</p>
                        <p className="text-xs text-foreground/60">Display Keytake panel on YouTube pages</p>
                      </div>
                      <div className="h-6 w-11 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-foreground/10">
                  <h4 className="text-sm font-medium mb-3">Account</h4>
                  <div className="p-3 bg-foreground/5 rounded-md flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">alex@example.com</p>
                      <p className="text-xs text-foreground/60">Pro Plan</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-foreground/20">
                      Sign Out
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button size="sm" className="gap-1">
                    <Check className="h-3 w-3" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </GlassPanel>

            <div>
              <h3 className="text-xl font-medium mb-4">Extension Settings</h3>
              <p className="text-foreground/70 mb-6">
                Customize your Keytake experience with powerful settings that let you control how notes are generated,
                displayed, and organized. The extension settings panel provides complete control over your note-taking
                workflow.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <GlassPanel className="p-4 border-foreground/10">
                  <div className="flex flex-col gap-2">
                    <div className="rounded-full bg-foreground/10 p-2 w-fit">
                      <Settings className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-medium">Customizable Note Format</h4>
                    <p className="text-xs text-foreground/70">
                      Control the level of detail, structure, and format of your generated notes to match your learning
                      style.
                    </p>
                  </div>
                </GlassPanel>

                <GlassPanel className="p-4 border-foreground/10">
                  <div className="flex flex-col gap-2">
                    <div className="rounded-full bg-foreground/10 p-2 w-fit">
                      <Bookmark className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-medium">Auto-save Options</h4>
                    <p className="text-xs text-foreground/70">
                      Configure automatic saving and organization of notes to streamline your workflow.
                    </p>
                  </div>
                </GlassPanel>
              </div>

              <p className="text-sm text-foreground/70 mb-4">
                All settings sync automatically with your Keytake account, ensuring a consistent experience across all
                your devices.
              </p>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-2 border-foreground/20 hover:border-foreground/60">
                  <Chrome className="h-4 w-4" />
                  Install Extension
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="install" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-xl font-medium mb-4">Installation Guide</h3>
              <p className="text-foreground/70 mb-6">
                Installing the Keytake Chrome extension is quick and easy. Follow these simple steps to start generating
                AI-powered notes from YouTube videos in seconds.
              </p>

              <GlassPanel className="p-6 border-foreground/10 mb-6">
                <h4 className="font-medium mb-4">Installation Steps</h4>
                <ol className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Visit the Chrome Web Store</p>
                      <p className="text-foreground/70 mt-1">
                        Go to the Chrome Web Store and search for "Keytake" or click the direct link below.
                      </p>
                      <div className="mt-2 p-2 bg-foreground/5 rounded-md flex items-center justify-between">
                        <span className="text-xs">https://chrome.google.com/webstore/detail/keytake/...</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleCopy}>
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Click "Add to Chrome"</p>
                      <p className="text-foreground/70 mt-1">
                        Click the "Add to Chrome" button on the extension page and confirm the installation when
                        prompted.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Pin the Extension (Optional)</p>
                      <p className="text-foreground/70 mt-1">
                        Click the extensions icon in your browser toolbar, find Keytake, and click the pin icon for easy
                        access.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Sign In to Your Account</p>
                      <p className="text-foreground/70 mt-1">
                        Click the Keytake icon and sign in with your Keytake account to sync your notes across devices.
                      </p>
                    </div>
                  </li>
                </ol>
              </GlassPanel>

              <div className="flex justify-center">
                <Button className="gap-2">
                  <Chrome className="h-4 w-4" />
                  Install Chrome Extension
                </Button>
              </div>
            </div>

            <GlassPanel
              className="overflow-hidden border-foreground/10 shadow-md hover:shadow-lg transition-all duration-300"
              intensity="medium"
            >
              <div className="aspect-video relative">
                <VideoPlayerAI
                  src="/placeholder.mp4"
                  poster="/placeholder.svg?height=400&width=600"
                  title="How to Install Keytake"
                  description="A quick guide to installing and using the Keytake Chrome extension"
                  autoPlay={false}
                  muted={true}
                  grayscale={true}
                />
              </div>

              <div className="p-6">
                <h4 className="font-medium mb-2">System Requirements</h4>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Google Chrome 88 or later</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Microsoft Edge 88 or later (Chromium-based)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Brave, Opera, or any Chromium-based browser</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-foreground/10 p-1 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Internet connection for AI processing</span>
                  </li>
                </ul>

                <div className="mt-6 p-3 bg-foreground/5 rounded-md">
                  <p className="text-xs text-foreground/70">
                    Need help? Contact our support team at <span className="text-foreground">support@keytake.com</span>{" "}
                    or visit our <span className="text-foreground">Help Center</span>.
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
