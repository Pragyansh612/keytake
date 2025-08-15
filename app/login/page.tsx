import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginClientPage } from "./LoginClient"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Keytake account and continue your learning journey.",
}

function LoginPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 md:px-6">
      <div className="container max-w-md mx-auto">
        <div className="mt-8">
          <div className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm rounded-lg">
            <div className="text-center pb-8 pt-8">
              <Skeleton className="h-8 w-48 mx-auto mb-2" />
              <Skeleton className="h-5 w-64 mx-auto" />
            </div>
            <div className="px-8 pb-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="flex justify-between">
                  <div></div>
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginClientPage />
    </Suspense>
  )
}