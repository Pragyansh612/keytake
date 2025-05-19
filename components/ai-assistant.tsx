"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassPanel } from "@/components/glass-panel"
import { MessageSquare, X, Send, Bot, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! I'm your Keytake assistant. How can I help you today?" },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: message }
    setMessages([...messages, userMessage])
    setMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (message.toLowerCase().includes("how") && message.toLowerCase().includes("work")) {
        response =
          "Keytake uses advanced AI to analyze YouTube videos and generate structured notes. Simply paste a YouTube URL, and our system will transcribe the content, identify key concepts, and organize them into comprehensive notes."
      } else if (
        message.toLowerCase().includes("price") ||
        message.toLowerCase().includes("cost") ||
        message.toLowerCase().includes("plan")
      ) {
        response =
          "We offer a free plan that allows 5 video analyses per month. Our premium plan at $9.99/month provides unlimited analyses, priority processing, and advanced export options."
      } else if (message.toLowerCase().includes("export") || message.toLowerCase().includes("download")) {
        response =
          "You can export your notes in multiple formats including PDF, Markdown, and Word. Premium users also get access to our Notion and Evernote integrations."
      } else {
        response =
          "Thanks for your question! I'd be happy to help with that. Could you provide a bit more detail so I can give you the most accurate information?"
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-0 mb-2 w-80 sm:w-96"
          >
            <GlassPanel className="flex flex-col h-96 border-foreground/10 shadow-lg" intensity="high">
              <div className="flex items-center justify-between p-3 border-b border-foreground/10">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <h3 className="font-medium text-sm">Keytake Assistant</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-2 rounded-lg ${
                        msg.role === "user"
                          ? "bg-foreground text-background rounded-tr-none"
                          : "bg-foreground/10 rounded-tl-none"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {msg.role === "assistant" ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        <span className="text-xs font-medium">{msg.role === "assistant" ? "Assistant" : "You"}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-2 rounded-lg bg-foreground/10 rounded-tl-none">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Bot className="h-3 w-3" />
                        <span className="text-xs font-medium">Assistant</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-foreground/60 animate-pulse"></div>
                        <div
                          className="h-2 w-2 rounded-full bg-foreground/60 animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-foreground/60 animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-3 border-t border-foreground/10 flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-9 text-sm"
                />
                <Button type="submit" size="sm" className="h-9 px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        variant="outline"
        className="h-12 w-12 rounded-full shadow-lg border-foreground/20 hover:border-foreground/60 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </div>
  )
}
