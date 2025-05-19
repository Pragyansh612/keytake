import { Skeleton } from "@/components/ui/skeleton"
import { GlassPanel } from "@/components/glass-panel"

export default function BlogLoading() {
  return (
    <div className="page-transition">
      <section className="w-full py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="container">
          {/* Breadcrumbs skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Header skeleton */}
          <div className="max-w-3xl mx-auto mb-12">
            <Skeleton className="h-12 w-64 mb-6" />
            <Skeleton className="h-6 w-full max-w-md" />
          </div>

          {/* Search and Filter skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <Skeleton className="h-10 w-full md:w-64" />
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          {/* Bento Grid Layout skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
            {/* Featured Post skeleton */}
            <div className="md:col-span-8 md:row-span-2">
              <GlassPanel className="h-full p-8 border-foreground/10">
                <div className="flex flex-col h-full">
                  <div className="mb-4 flex items-center gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>

                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </GlassPanel>
            </div>

            {/* Trending Post skeleton */}
            <div className="md:col-span-4">
              <GlassPanel className="h-full p-6 border-foreground/10">
                <div className="flex flex-col h-full">
                  <div className="mb-3 flex items-center gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>

                  <Skeleton className="h-8 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />

                  <div className="flex items-center justify-between mt-auto">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </GlassPanel>
            </div>

            {/* Regular Posts skeletons */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="md:col-span-4">
                <GlassPanel className="h-full p-6 border-foreground/10">
                  <div className="flex flex-col h-full">
                    <Skeleton className="h-5 w-16 mb-3" />
                    <Skeleton className="h-7 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                </GlassPanel>
              </div>
            ))}
          </div>

          {/* More Articles skeleton */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-8 w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <GlassPanel key={index} className="p-6 border-foreground/10">
                  <div className="flex flex-col h-full">
                    <Skeleton className="h-5 w-16 mb-3" />
                    <Skeleton className="h-7 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>

          {/* Newsletter Signup skeleton */}
          <GlassPanel className="p-8 md:p-12 text-center border-foreground/10">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-full max-w-lg mx-auto mb-2" />
            <Skeleton className="h-4 w-full max-w-md mx-auto mb-8" />
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-32" />
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  )
}
