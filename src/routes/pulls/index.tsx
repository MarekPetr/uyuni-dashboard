import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { PullRequestSearchParams } from '@/lib/github/types'
import type { AxiosError } from 'axios'
import { pullRequestsInfiniteQueryOptions } from '@/lib/github/queries'
import { PullsFilterBar } from '@/components/filter-bar/pulls-filter-bar'
import { LoadingList } from '@/components/loading-list'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { PullRequestRow } from '@/components/pull-request-row'
import { InfiniteScrollFooter } from '@/components/infinite-scroll-footer'
import { RATE_LIMITS_EXCEEDED_MESSAGE } from '@/lib/github/client'

type PullsSearch = Omit<PullRequestSearchParams, 'page' | 'per_page'>

export const Route = createFileRoute('/pulls/')({
  component: PullRequestsPage,
  validateSearch: (search: Record<string, unknown>): PullsSearch => ({
    state: (search.state as PullsSearch['state']) ?? 'open',
    sort: (search.sort as PullsSearch['sort']) ?? 'created',
    direction: (search.direction as PullsSearch['direction']) ?? 'desc',
  }),
})

function PullRequestsPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(pullRequestsInfiniteQueryOptions(search))
  const pulls = data?.pages.flatMap((page) => page.data) ?? []
  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  const apiError = error as AxiosError | null
  const isError403 = apiError?.status === 403
  const errorMessage = isError403
    ? RATE_LIMITS_EXCEEDED_MESSAGE
    : 'No pull requests found.'

  return (
    <div className="space-y-4">
      <PullsFilterBar
        search={search}
        onSearchChange={(s) => navigate({ search: s })}
      />
      <LoadingList
        isLoading={isLoading}
        isEmpty={pulls.length === 0}
        emptyMessage={errorMessage}
        footer={
          <InfiniteScrollFooter
            sentinelRef={sentinelRef}
            isFetchingNextPage={isFetchingNextPage}
            isError={!!apiError}
            errorMessage={errorMessage}
          />
        }
      >
        {pulls.map((pullRequest) => (
          <PullRequestRow key={pullRequest.id} pullRequest={pullRequest} />
        ))}
      </LoadingList>
    </div>
  )
}
