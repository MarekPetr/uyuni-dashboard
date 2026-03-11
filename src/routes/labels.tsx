import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { labelsQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { LabelCard } from '@/components/cards/label-card'
import { Spinner } from '@/components/spinner'
import { LoadingGrid } from '@/components/loading-grid'
import { RATE_LIMITS_EXCEEDED_MESSAGE } from '@/lib/github/client'

export const Route = createFileRoute('/labels')({
  component: LabelsPage,
})

function LabelsPage() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(labelsQueryOptions())
  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })
  const labels = data?.pages.flatMap((page) => page.data) ?? []

  const isError403 = (error as AxiosError | null)?.status === 403
  const errorMessage = isError403
    ? RATE_LIMITS_EXCEEDED_MESSAGE
    : 'No labels found.'

  return (
    <LoadingGrid
      title="Labels"
      isLoading={isLoading}
      isEmpty={labels.length === 0}
      emptyMessage={errorMessage}
      footer={
        <div
          ref={sentinelRef}
          className="flex justify-center items-center py-4"
        >
          {isFetchingNextPage && <Spinner size="sm" />}
          {isError403 && (
            <p className="text-sm text-muted-foreground">
              {RATE_LIMITS_EXCEEDED_MESSAGE}
            </p>
          )}
        </div>
      }
    >
      {labels.map((label) => (
        <LabelCard key={label.id} label={label} />
      ))}
    </LoadingGrid>
  )
}
