"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { useAuth, SignUpData } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

type UserType = "student" | "professional" | "researcher" | "educator" | "other"

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
        // Convert form data to SignUpData format
        if (!formData.name) {
        setErrors(prev => ({ ...prev, name: "Name is required" }));
        setIsSubmitting(false);
        return;
      }
      
        const signUpData: SignUpData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          userType: formData.userType,
          university: formData.university,
          fieldOfStudy: formData.fieldOfStudy,
          yearSemester: formData.yearSemester,
          industry: formData.industry,
          role: formData.role,
          useCase: formData.useCase,
        }

        const { error, data } = await signUp(signUpData)

        if (error) {
          setErrors((prev) => ({ ...prev, form: error.message }))
        } else {
          // Redirect to dashboard or confirmation page
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
    <div className="container max-w-4xl py-8 px-4 md:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sign Up", href: "/signup" },
        ]}
      />

      <div className="mt-8">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create your Keytake account</CardTitle>
            <CardDescription>Join thousands of users transforming how they learn from videos</CardDescription>

            {/* Progress indicator */}
            <div className="mt-6">
              <div className="relative">
                {/* Progress bar background */}
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  {/* Progress bar fill */}
                  <div 
                    style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black dark:bg-white transition-all duration-300 ease-in-out"
                  ></div>
                </div>
                
                {/* Step indicators */}
                <div className="flex justify-between -mt-2">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                          step > index + 1
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : step === index + 1
                              ? "border-2 border-black dark:border-white"
                              : "border border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {step > index + 1 ? <CheckCircle size={14} /> : index + 1}
                      </div>
                      <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                        {index === 0 ? "Account" : index === 1 ? "Profile" : "Details"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className={errors.email ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className={errors.password ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      className={errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      className={errors.name ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userType">I am a...</Label>
                    <Select
                      value={formData.userType}
                      onValueChange={(value) => updateFormData("userType", value as UserType)}
                    >
                      <SelectTrigger className={errors.userType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="researcher">Researcher</SelectItem>
                        <SelectItem value="educator">Educator</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.userType && <p className="text-red-500 text-sm">{errors.userType}</p>}
                  </div>
                </div>
              )}

              {step === 3 && formData.userType === "student" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">College/University</Label>
                    <Input
                      id="university"
                      placeholder="University of Example"
                      value={formData.university || ""}
                      onChange={(e) => updateFormData("university", e.target.value)}
                      className={errors.university ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.university && <p className="text-red-500 text-sm">{errors.university}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                      id="fieldOfStudy"
                      placeholder="Computer Science, Biology, etc."
                      value={formData.fieldOfStudy || ""}
                      onChange={(e) => updateFormData("fieldOfStudy", e.target.value)}
                      className={errors.fieldOfStudy ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.fieldOfStudy && <p className="text-red-500 text-sm">{errors.fieldOfStudy}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearSemester">Year/Semester</Label>
                    <Input
                      id="yearSemester"
                      placeholder="3rd Year, 2nd Semester, etc."
                      value={formData.yearSemester || ""}
                      onChange={(e) => updateFormData("yearSemester", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 3 && formData.userType === "professional" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      placeholder="Technology, Healthcare, etc."
                      value={formData.industry || ""}
                      onChange={(e) => updateFormData("industry", e.target.value)}
                      className={errors.industry ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role/Position</Label>
                    <Input
                      id="role"
                      placeholder="Software Engineer, Manager, etc."
                      value={formData.role || ""}
                      onChange={(e) => updateFormData("role", e.target.value)}
                      className={errors.role ? "border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="useCase">Primary Use Case</Label>
                    <Input
                      id="useCase"
                      placeholder="Learning, Research, Training, etc."
                      value={formData.useCase || ""}
                      onChange={(e) => updateFormData("useCase", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 3 && !["student", "professional"].includes(formData.userType) && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="useCase">How will you use Keytake?</Label>
                    <Input
                      id="useCase"
                      placeholder="Describe your primary use case"
                      value={formData.useCase || ""}
                      onChange={(e) => updateFormData("useCase", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {errors.form && (
                <div className="mt-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                  {errors.form}
                </div>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={step === 1 || isSubmitting} 
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Back
            </Button>

            {step < totalSteps ? (
              <Button 
                onClick={handleNext} 
                disabled={isSubmitting}
                className="flex items-center gap-1 bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Next <ChevronRight size={16} />
              </Button>
            ) : (
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-black dark:text-white hover:underline font-medium">
            Log in
          </a>
        </div>
      </div>
    </div>
  )
}