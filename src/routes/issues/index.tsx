import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import type { IssueSearchParams } from '@/lib/github/types'
import { issuesInfiniteQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { IssueRow } from '@/components/issue-row'
import { IssuesFilterBar } from '@/components/issues-filter-bar'

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

  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  const issues = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <div className="space-y-4">
      <IssuesFilterBar
        search={search}
        onSearchChange={(s) => navigate({ search: s })}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : issues.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No issues found.
        </p>
      ) : (
        <div className="divide-y divide-border rounded-md border">
          {issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
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
