import { Skeleton } from "@/components/ui/skeleton"
import { GlassPanel } from "@/components/glass-panel"

export default function BlogPostLoading() {
  return (
    <div className="page-transition">
      <section className="w-full py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="container max-w-4xl">
          {/* Breadcrumbs skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Header skeleton */}
          <GlassPanel className="p-8 mb-8 border-foreground/10">
            <Skeleton className="h-12 w-3/4 mb-6" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
            </div>
            
            <Skeleton className="h-5 w-32 mb-4" />
          </GlassPanel>

          {/* Content skeleton */}
          <GlassPanel className="p-8 border-foreground/10">
            <div className="space-y-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-4/5" />
              
              <div className="py-4">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
              
              <div className="py-4">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
              </div>
              
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              
              <div className="py-6">
                {/* Code block skeleton */}
                <div className="rounded-lg bg-muted/30 p-4 my-6">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
              
              {/* Image placeholder skeleton */}
              <div className="my-8">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3 mt-2 mx-auto" />
              </div>
              
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-4/5" />
              
              {/* Quote block skeleton */}
              <div className="border-l-4 pl-6 py-2 my-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
              
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>
            
            {/* Tags skeleton */}
            <div className="mt-10 pt-6 border-t border-foreground/10">
              <Skeleton className="h-5 w-20 mb-4" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>
            </div>
            
            {/* Author bio skeleton */}
            <div className="mt-10 pt-6 border-t border-foreground/10">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
                <div className="space-y-3 flex-grow">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="flex gap-3 mt-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Related posts skeleton */}
            <div className="mt-10 pt-6 border-t border-foreground/10">
              <Skeleton className="h-6 w-40 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="h-40 w-full rounded-lg mb-3" />
                    <Skeleton className="h-5 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center gap-2 mt-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Comments skeleton */}
            <div className="mt-10 pt-6 border-t border-foreground/10">
              <Skeleton className="h-6 w-32 mb-6" />
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Comment form skeleton */}
              <div className="mt-8 pt-4 border-t border-foreground/10">
                <Skeleton className="h-5 w-48 mb-4" />
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-grow space-y-4">
                    <Skeleton className="h-24 w-full rounded-md" />
                    <div className="flex justify-end">
                      <Skeleton className="h-10 w-32 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>
          
          {/* Newsletter signup skeleton */}
          <GlassPanel className="p-8 mt-8 border-foreground/10">
            <div className="text-center">
              <Skeleton className="h-8 w-64 mx-auto mb-4" />
              <Skeleton className="h-5 w-full max-w-lg mx-auto mb-6" />
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Skeleton className="h-12 flex-grow rounded-md" />
                <Skeleton className="h-12 w-32 rounded-md" />
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  )
}