import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { labelsQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { LabelCard } from '@/components/cards/label-card'
import { Spinner } from '@/components/spinner'

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
          <Spinner size="md" />
        </div>
      ) : labels.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No labels found.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {labels.map((label) => (
            <LabelCard key={label.id} label={label} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="flex justify-center py-4">
        {isFetchingNextPage && <Spinner size="sm" />}
      </div>
    </div>
  )
}
