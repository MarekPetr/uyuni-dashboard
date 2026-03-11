import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { IssueSearchParams } from '@/lib/github/types'
import type { AxiosError } from 'axios'
import { issuesInfiniteQueryOptions } from '@/lib/github/queries'
import { IssueRow } from '@/components/issue-row'
import { IssuesFilterBar } from '@/components/filter-bar/issues-filter-bar'
import { LoadingList } from '@/components/loading-list'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { RATE_LIMITS_EXCEEDED_MESSAGE } from '@/lib/github/errors'
import { InfiniteScrollFooter } from '@/components/infinite-scroll-footer'

type IssuesSearch = Omit<IssueSearchParams, 'page' | 'per_page'>

export const Route = createFileRoute('/issues/')({
  component: IssuesPage,
  validateSearch: (search: Record<string, unknown>): IssuesSearch => ({
    state: (search.state as IssuesSearch['state']) ?? 'open',
    sort: (search.sort as IssuesSearch['sort']) ?? 'created',
    direction: (search.direction as IssuesSearch['direction']) ?? 'desc',
  }),
})

function IssuesPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(issuesInfiniteQueryOptions(search))
  const issues = data?.pages.flatMap((page) => page.data) ?? []
  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  const apiError = error as AxiosError | null
  const errorMessage =
    apiError?.status === 403 ? RATE_LIMITS_EXCEEDED_MESSAGE : 'No issues found.'

  return (
    <div className="space-y-4">
      <IssuesFilterBar
        search={search}
        onSearchChange={(s) => navigate({ search: s })}
      />
      <LoadingList
        isLoading={isLoading}
        isEmpty={issues.length === 0}
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
        {issues.map((issue) => (
          <IssueRow key={issue.id} issue={issue} />
        ))}
      </LoadingList>
    </div>
  )
}
