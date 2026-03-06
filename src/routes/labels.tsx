import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { labelsQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Badge } from '@/components/ui/badge'
import { LoaderIcon } from 'lucide-react'

export const Route = createFileRoute('/labels')({
  component: LabelsPage,
})

function LabelsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(labelsQueryOptions())

  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  const labels = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Labels</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : labels.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No labels found.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {labels.map((label) => (
            <div
              key={label.id}
              className="flex items-center gap-3 rounded-md border p-3"
            >
              <div
                className="size-4 shrink-0 rounded-full"
                style={{ backgroundColor: `#${label.color}` }}
              />
              <div className="min-w-0">
                <Badge
                  variant="outline"
                  style={{
                    borderColor: `#${label.color}`,
                    color: `#${label.color}`,
                  }}
                >
                  {label.name}
                </Badge>
                {label.description && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {label.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  )
}
