import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { IssueSearchParams } from '@/lib/github/types'
import { issuesInfiniteQueryOptions } from '@/lib/github/queries'
import { IssueRow } from '@/components/issue-row'
import { IssuesFilterBar } from '@/components/filter-bar/issues-filter-bar'
import { LoadingList } from '@/components/loading-list'
import { Spinner } from '@/components/spinner'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(issuesInfiniteQueryOptions(search))
  const issues = data?.pages.flatMap((page) => page.data) ?? []
  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  return (
    <div className="space-y-4">
      <IssuesFilterBar
        search={search}
        onSearchChange={(s) => navigate({ search: s })}
      />
      <LoadingList
        isLoading={isLoading}
        isEmpty={issues.length === 0}
        emptyMessage="No issues found."
        footer={
          <div ref={sentinelRef} className="flex justify-center py-4">
            {isFetchingNextPage && <Spinner size="sm" />}
          </div>
        }
      >
        {issues.map((issue) => (
          <div key={issue.id}>
            <IssueRow issue={issue} />
          </div>
        ))}
      </LoadingList>
    </div>
  )
}
