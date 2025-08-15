"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ChevronLeft, ChevronRight, CheckCircle, User, Lock, FileText } from "lucide-react"
import { useAuth, SignUpData } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

type UserType = "student" | "professional" | "researcher" | "other"

interface UserFormData {
  email: string
  password: string
  confirmPassword: string
  name: string
  userType: UserType
  // Student fields
  university?: string
  fieldOfStudy?: string
  yearSemester?: string
  // Professional fields
  industry?: string
  role?: string
  useCase?: string
}

export function SignupClientPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    userType: "student",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const totalSteps = 3

  const stepIcons = [Lock, User, FileText]
  const stepTitles = ["Account", "Profile", "Details"]

  const updateFormData = (field: keyof UserFormData, value: string) => {
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

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.email) newErrors.email = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

      if (!formData.password) newErrors.password = "Password is required"
      else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"

      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }

    if (currentStep === 2) {
      if (!formData.name) newErrors.name = "Name is required"
      if (!formData.userType) newErrors.userType = "Please select a user type"
    }

    if (currentStep === 3) {
      if (formData.userType === "student") {
        if (!formData.university) newErrors.university = "University/College name is required"
        if (!formData.fieldOfStudy) newErrors.fieldOfStudy = "Field of study is required"
      } else if (formData.userType === "professional") {
        if (!formData.industry) newErrors.industry = "Industry is required"
        if (!formData.role) newErrors.role = "Role/Position is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(step)) {
      setIsSubmitting(true)
      try {
        if (!formData.name) {
          setErrors(prev => ({ ...prev, name: "Name is required" }));
          setIsSubmitting(false);
          return;
        }
      
        // Map form data to match backend expectations
        const signUpData: SignUpData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          userType: formData.userType,
          university: formData.university || null,
          fieldOfStudy: formData.fieldOfStudy || null,
          yearSemester: formData.yearSemester || null,
          industry: formData.industry || null,
          role: formData.role || null,
          useCase: formData.useCase || null,
        }

        const { error } = await signUp(signUpData)

        if (error) {
          setErrors((prev) => ({ ...prev, form: error.message }))
        } else {
          // Redirect to dashboard after successful signup and login
          router.push("/dashboard")
        }
      } catch (err: any) {
        setErrors((prev) => ({ ...prev, form: err.message || "An error occurred during sign up" }))
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 md:px-6">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs
            items={[
              { label: "Sign Up", href: "/signup" },
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
                  Create your Keytake account
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Join thousands of users transforming how they learn from videos
                </CardDescription>
              </motion.div>

              {/* Enhanced Progress indicator */}
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="relative">
                  {/* Progress bar background */}
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </div>
                  
                  {/* Step indicators */}
                  <div className="flex justify-between mt-6">
                    {Array.from({ length: totalSteps }).map((_, index) => {
                      const Icon = stepIcons[index]
                      const isCompleted = step > index + 1
                      const isCurrent = step === index + 1
                      
                      return (
                        <motion.div 
                          key={index} 
                          className="flex flex-col items-center"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                        >
                          <motion.div
                            className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              isCompleted
                                ? "bg-primary border-primary text-primary-foreground shadow-lg"
                                : isCurrent
                                  ? "border-primary bg-primary/10 text-primary shadow-md"
                                  : "border-muted-foreground/30 text-muted-foreground"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <AnimatePresence mode="wait">
                              {isCompleted ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <CheckCircle size={20} />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="icon"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Icon size={20} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                          <span className={`text-sm mt-2 font-medium transition-colors duration-300 ${
                            isCurrent ? "text-primary" : "text-muted-foreground"
                          }`}>
                            {stepTitles[index]}
                          </span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="px-8">
              <AnimatePresence mode="wait">
                <motion.form 
                  key={step}
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          className={`h-12 ${errors.email ? "border-destructive focus:ring-destructive" : "border-muted-foreground/20 focus:border-primary"} transition-all duration-200`}
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
                        <Label htmlFor="password" className="text-base font-medium">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => updateFormData("password", e.target.value)}
                          className={`h-12 ${errors.password ? "border-destructive focus:ring-destructive" : "border-muted-foreground/20 focus:border-primary"} transition-all duration-200`}
                        />
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

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-base font-medium">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                          className={`h-12 ${errors.confirmPassword ? "border-destructive focus:ring-destructive" : "border-muted-foreground/20 focus:border-primary"} transition-all duration-200`}
                        />
                        <AnimatePresence>
                          {errors.confirmPassword && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-destructive text-sm"
                            >
                              {errors.confirmPassword}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                          className={`h-12 ${errors.name ? "border-destructive focus:ring-destructive" : "border-muted-foreground/20 focus:border-primary"} transition-all duration-200`}
                        />
                        <AnimatePresence>
                          {errors.name && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-destructive text-sm"
                            >
                              {errors.name}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userType" className="text-base font-medium">I am a...</Label>
                        <Select
                          value={formData.userType}
                          onValueChange={(value) => updateFormData("userType", value as UserType)}
                        >
                          <SelectTrigger className={`h-12 ${errors.userType ? "border-destructive" : "border-muted-foreground/20"} transition-all duration-200`}>
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            {/* <SelectItem value="researcher">Researcher</SelectItem> */}
                            {/* <SelectItem value="educator">Educator</SelectItem> */}
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <AnimatePresence>
                          {errors.userType && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-destructive text-sm"
                            >
                              {errors.userType}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {step === 3 && formData.userType === "student" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="university" className="text-base font-medium">College/University</Label>
                        <Input
                          id="university"
                          placeholder="University of Example"
                          value={formData.university || ""}
                          onChange={(e) => updateFormData("university", e.target.value)}
                          className={`h-12 ${errors.university ? "border-destructive focus:ring-destructive" : "border-muted-foreground/20 focus:border-primary"} transition-all duration-200`}
                        />
                        <AnimatePresence>
                          {errors.university && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-destructive text-sm"
                            >
                              {errors.university}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fieldOfStudy" className="text-base font-medium">Field of Study</Label>
                        <Input
                          id="fieldOfStudy"
                          placeholder="Computer Science, Biology, etc."
                          value={formData.fieldOfStudy || ""}
                          onChange={(e) => updateFormData("fieldOfStudy", e.target.value)}
                          className={`h-12 ${errors.fieldOfStudy ? "border-destructive focus:ring-destructive" : "border-muted-foreground/20 focus:border-primary"} transition-all duration-200`}
                        />
                        <AnimatePresence>
                          {errors.fieldOfStudy && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-destructive text-sm"
                            >
                              {errors.fieldOfStudy}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearSemester" className="text-base font-medium">Year/Semester (Optional)</Label>
                        <Input
                          id="yearSemester"
                          placeholder="3rd Year, 2nd Semester, etc."
                          value={formData.yearSemester || ""}
                          onChange={(e) => updateFormData("yearSemester", e.target.value)}
                          className="h-12 border-muted-foreground/20 focus:border-primary transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && formData.userType === "professional" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="industry" className="text-base font-medium">Industry</Label>
                        <Input
                          id="industry"
                          placeholder="Technology, Healthcare, etc."
                          value={formData.industry || ""}
                          onChange={(e) => updateFormData("industry", e.target.value)}
                          className={`h-12 ${errors.industry ? "border-destructive focus:ring-destructive" : "border-muted-foreground/20 focus:border-primary"} transition-all duration-200`}
                        />
                        <AnimatePresence>
                          {errors.industry && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-destructive text-sm"
                            >
                              {errors.industry}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-base font-medium">Role/Position</Label>
                        <Input
                          id="role"
                          placeholder="Software Engineer, Manager, etc."
                          value={formData.role || ""}
                          onChange={(e) => updateFormData("role", e.target.value)}
                          className={`h-12 ${errors.role ? "border-destructive focus:ring-destructive" : "border-muted-foreground/20 focus:border-primary"} transition-all duration-200`}
                        />
                        <AnimatePresence>
                          {errors.role && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-destructive text-sm"
                            >
                              {errors.role}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="useCase" className="text-base font-medium">Primary Use Case (Optional)</Label>
                        <Input
                          id="useCase"
                          placeholder="Learning, Research, Training, etc."
                          value={formData.useCase || ""}
                          onChange={(e) => updateFormData("useCase", e.target.value)}
                          className="h-12 border-muted-foreground/20 focus:border-primary transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && !["student", "professional"].includes(formData.userType) && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="useCase" className="text-base font-medium">How will you use Keytake?</Label>
                        <Input
                          id="useCase"
                          placeholder="Describe your primary use case"
                          value={formData.useCase || ""}
                          onChange={(e) => updateFormData("useCase", e.target.value)}
                          className="h-12 border-muted-foreground/20 focus:border-primary transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {errors.form && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20"
                      >
                        {errors.form}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.form>
              </AnimatePresence>
            </CardContent>

            <CardFooter className="flex justify-between px-8 pb-8">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={step === 1 || isSubmitting} 
                className="flex items-center gap-2 h-12 px-6 hover:bg-muted/50 transition-all duration-200"
              >
                <ChevronLeft size={16} /> Back
              </Button>

              {step < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 h-12 px-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Next <ChevronRight size={16} />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-12 px-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>

          <motion.div 
            className="mt-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-medium transition-colors duration-200">
              Log in
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}