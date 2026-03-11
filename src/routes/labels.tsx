import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { labelsQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { LabelCard } from '@/components/cards/label-card'
import { Spinner } from '@/components/spinner'
import { LoadingGrid } from '@/components/loading-grid'
import { getErrorMessage } from '@/lib/github/error'

export const Route = createFileRoute('/labels')({
  component: LabelsPage,
})

function LabelsPage() {
  const {
    data,
    isError,
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

  const apiError = error as AxiosError | null
  const errorMessage = getErrorMessage(apiError)

  const isEmpty = labels.length === 0

  return (
    <LoadingGrid
      title="Labels"
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="No labels found"
      isError={isError}
      errorMessage={errorMessage}
      footer={
        <div
          ref={sentinelRef}
          className="flex justify-center items-center py-4"
        >
          {isFetchingNextPage && <Spinner size="sm" />}
          {!isEmpty && apiError && (
            <p className="text-sm text-destructive">{errorMessage}</p>
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
