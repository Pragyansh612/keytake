"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface LoginFormData {
  email: string
  password: string
}

export function LoginClientPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const updateFormData = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        setErrors((prev) => ({ ...prev, form: error.message }))
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setErrors((prev) => ({ 
        ...prev, 
        form: err.message || "An unexpected error occurred" 
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = () => {
    // Navigate to forgot password page or show modal
    router.push("/forgot-password")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 md:px-6">
      <div className="container max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs
            items={[
              { label: "Login", href: "/login" },
            ]}
          />
        </motion.div>

        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Sign in to your Keytake account
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="px-8">
              <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
                      <Mail size={16} />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className={`h-12 ${errors.email ? "border-destructive focus:ring-destructive" : "border-muted-foreground/20 focus:border-primary"} transition-all duration-200`}
                      autoComplete="email"
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-destructive text-sm"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium flex items-center gap-2">
                      <Lock size={16} />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        className={`h-12 pr-12 ${errors.password ? "border-destructive focus:ring-destructive" : "border-muted-foreground/20 focus:border-primary"} transition-all duration-200`}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    <AnimatePresence>
                      {errors.password && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-destructive text-sm"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {/* Add remember me checkbox if needed */}
                    </div>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="px-0 text-primary hover:underline"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <AnimatePresence>
                    {errors.form && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20"
                      >
                        {errors.form}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </motion.form>
            </CardContent>

            <CardFooter className="text-center pb-8">
              <div className="w-full">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a 
                    href="/signup" 
                    className="text-primary hover:underline font-medium transition-colors duration-200"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}