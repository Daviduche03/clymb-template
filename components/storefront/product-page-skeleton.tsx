import { Skeleton } from "@/components/ui/skeleton"

export function ProductPageSkeleton() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto mb-6 mt-8 max-w-6xl px-4 sm:px-6 lg:px-8" role="status" aria-label="Loading product">
        <Skeleton className="mb-2 h-3.5 w-48" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-7 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Skeleton className="aspect-[4/5] w-full rounded-lg" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-6 h-11 w-full rounded-full" />
        </div>
      </div>
    </main>
  )
}