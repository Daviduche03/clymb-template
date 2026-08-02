import { Skeleton } from "@/components/ui/skeleton"

export function CartPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" role="status" aria-label="Loading your cart">
      <div className="mb-8 pb-6">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="mt-3 h-8 w-48" />
        <Skeleton className="mt-3 h-3.5 w-56" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-3.5 w-full" />
          ))}
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}