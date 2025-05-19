"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassPanel } from "@/components/glass-panel"
import { X, ArrowRight, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Step {
  title: string
  description: string
  position: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  arrow?: "top" | "right" | "bottom" | "left"
}

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  const steps: Step[] = [
    {
      title: "Welcome to Keytake",
      description: "Transform YouTube videos into structured notes with AI. Let's show you around!",
      position: { top: "50%", left: "50%" },
    },
    {
      title: "Paste any YouTube URL",
      description: "Start by pasting a YouTube video URL in the input field to generate notes.",
      position: { top: "40%", left: "50%" },
      arrow: "bottom",
    },
    {
      title: "Explore your notes",
      description: "View your generated notes in a structured format, ready for studying.",
      position: { bottom: "30%", right: "20%" },
      arrow: "left",
    },
    {
      title: "Save and organize",
      description: "Save your notes to your library and organize them into folders.",
      position: { top: "30%", right: "20%" },
      arrow: "left",
    },
  ]

  useEffect(() => {
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem("hasSeenTour")

    if (!hasSeenTour && !dismissed) {
      // Show tour after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [dismissed])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem("hasSeenTour", "true")
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setDismissed(true)
    localStorage.setItem("hasSeenTour", "true")
  }

  if (!isVisible) return null

  const currentStepData = steps[currentStep]

  // Calculate transform based on position
  let transform = "translate(-50%, -50%)"
  if (currentStepData.position.right && !currentStepData.position.left) transform = "translate(0, -50%)"
  if (currentStepData.position.bottom && !currentStepData.position.top) transform = "translate(-50%, 0)"
  if (currentStepData.position.right && currentStepData.position.bottom) transform = "translate(0, 0)"
  if (currentStepData.position.left && currentStepData.position.bottom) transform = "translate(-100%, 0)"
  if (currentStepData.position.right && currentStepData.position.top) transform = "translate(0, -100%)"
  if (currentStepData.position.left && currentStepData.position.top) transform = "translate(-100%, -100%)"

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute pointer-events-auto"
          style={{
            ...currentStepData.position,
            transform,
          }}
        >
          <GlassPanel className="p-4 border-foreground/10 shadow-lg w-72" intensity="high">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{currentStepData.title}</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 -mt-1" onClick={handleDismiss}>
                <X className="h-3 w-3" />
              </Button>
            </div>

            <p className="text-sm text-foreground/70 mb-4">{currentStepData.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === currentStep ? "bg-foreground" : "bg-foreground/30"
                    }`}
                  ></div>
                ))}
              </div>

              <Button size="sm" className="h-8 text-xs gap-1" onClick={handleNext}>
                {currentStep === steps.length - 1 ? (
                  <>
                    <Check className="h-3 w-3" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-3 w-3" />
                  </>
                )}
              </Button>
            </div>

            {/* Arrow */}
            {currentStepData.arrow && (
              <div
                className={`absolute w-3 h-3 bg-background rotate-45 ${
                  currentStepData.arrow === "top"
                    ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    : currentStepData.arrow === "right"
                      ? "top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
                      : currentStepData.arrow === "bottom"
                        ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                        : "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
                }`}
              ></div>
            )}
          </GlassPanel>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
