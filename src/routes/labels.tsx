import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { labelsQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { LabelCard } from '@/components/cards/label-card'
import { Spinner } from '@/components/spinner'
import { LoadingGrid } from '@/components/loading-grid'

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
    <LoadingGrid
      title="Labels"
      isLoading={isLoading}
      isEmpty={labels.length === 0}
      emptyMessage="No labels found."
      footer={
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isFetchingNextPage && <Spinner size="sm" />}
        </div>
      }
    >
      {labels.map((label) => (
        <LabelCard key={label.id} label={label} />
      ))}
    </LoadingGrid>
  )
}
