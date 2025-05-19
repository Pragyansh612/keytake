"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User, Briefcase, GraduationCap, Beaker } from "lucide-react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// User type options
const userTypes = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "professional", label: "Professional", icon: Briefcase },
  { value: "researcher", label: "Researcher", icon: Beaker },
  { value: "other", label: "Other", icon: User },
]

// Industry options for professionals
const industries = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance" },
  { value: "marketing", label: "Marketing" },
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "legal", label: "Legal" },
  { value: "media", label: "Media & Entertainment" },
  { value: "retail", label: "Retail" },
  { value: "other", label: "Other" },
]

// Fields of study for students
const fieldsOfStudy = [
  { value: "computer_science", label: "Computer Science" },
  { value: "engineering", label: "Engineering" },
  { value: "business", label: "Business" },
  { value: "medicine", label: "Medicine" },
  { value: "arts", label: "Arts & Humanities" },
  { value: "science", label: "Natural Sciences" },
  { value: "social_science", label: "Social Sciences" },
  { value: "law", label: "Law" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
]

// Base form schema
const baseFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  userType: z.string(),
})

// Student-specific schema
const studentSchema = baseFormSchema.extend({
  institution: z.string().min(2, { message: "Please enter your institution name" }),
  fieldOfStudy: z.string().min(1, { message: "Please select your field of study" }),
  yearSemester: z.string().min(1, { message: "Please enter your current year/semester" }),
})

// Professional-specific schema
const professionalSchema = baseFormSchema.extend({
  industry: z.string().min(1, { message: "Please select your industry" }),
  role: z.string().min(2, { message: "Please enter your role/position" }),
  useCase: z.string().min(2, { message: "Please describe your primary use case" }),
})

// Researcher-specific schema
const researcherSchema = baseFormSchema.extend({
  institution: z.string().min(2, { message: "Please enter your institution name" }),
  researchField: z.string().min(2, { message: "Please enter your research field" }),
  useCase: z.string().min(2, { message: "Please describe your primary use case" }),
})

// Other-specific schema (minimal additional fields)
const otherSchema = baseFormSchema.extend({
  occupation: z.string().min(2, { message: "Please describe your occupation" }),
  useCase: z.string().min(2, { message: "Please describe your primary use case" }),
})

// Password confirmation validation
const formSchema = z.discriminatedUnion("userType", [
  studentSchema.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
  professionalSchema.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
  researcherSchema.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
  otherSchema.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
])

export function MultiStepSignup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Initialize form with all possible fields
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userType: "",
    },
  });
  
  const userType = form.watch("userType");
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form submitted:", values);
      
      // Redirect to dashboard or onboarding
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Move to next step if validation passes
  const handleNextStep = async () => {
    let isValid = false;
    
    if (step === 1) {
      // Validate email and password fields
      const result = await form.trigger(["email", "password", "confirmPassword"]);
      isValid = result;
    } else if (step === 2) {
      // Validate user type selection
      const result = await form.trigger("userType");
      isValid = result;
    } else {
      // Final step validation depends on user type
      isValid = await form.trigger();
    }
    
    if (isValid) {
      if (step < getTotalSteps()) {
        setStep(step + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };
  
  // Go back to previous step
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Get total number of steps based on user type
  const getTotalSteps = () => {
    return userType ? 3 : 2;
  };
  
  // Render step indicators
  const renderStepIndicators = () => {
    const totalSteps = getTotalSteps();
    
    return (
      <div className="flex justify-center mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors",
                step > index + 1
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : step === index + 1
                  ? "border-2 border-black dark:border-white"
                  : "border border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500"
              )}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "h-[2px] w-12",
                  step > index + 1
                    ? "bg-black dark:bg-white"
                    : "bg-gray-200 dark:bg-gray-800"
                )}
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create your account</CardTitle>
              <CardDescription className="text-center">
                Enter your email and create a secure password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>
                          At least 8 characters with uppercase, lowercase, and numbers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </CardContent>
          </>
        );
        
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Tell us about yourself</CardTitle>
              <CardDescription className="text-center">
                Select the option that best describes you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <div
                              key={type.value}
                              className={cn(
                                "border rounded-lg\
