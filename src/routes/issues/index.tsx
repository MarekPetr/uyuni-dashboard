import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { IssueSearchParams } from '@/lib/github/types'
import { issuesInfiniteQueryOptions } from '@/lib/github/queries'
import { IssueRow } from '@/components/issues-row'
import { IssuesFilterBar } from '@/components/filter-bar/issues-filter-bar'
import { InfiniteList } from '@/components/infinite-list'

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

  return (
    <div className="space-y-4">
      <IssuesFilterBar
        search={search}
        onSearchChange={(s) => navigate({ search: s })}
      />
      <InfiniteList
        items={issues}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        emptyMessage="No issues found."
        keyExtractor={(issue) => issue.id}
        renderItem={(issue) => <IssueRow issue={issue} />}
      />
    </div>
  )
}
