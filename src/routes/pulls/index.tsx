import { Link, createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestIcon,
  MessageSquareIcon,
} from 'lucide-react'
import type { PullRequestSearchParams } from '@/lib/github/types'
import { pullRequestsInfiniteQueryOptions } from '@/lib/github/queries'
import { Badge } from '@/components/ui/badge'
import { PullsFilterBar } from '@/components/filter-bar/pulls-filter-bar'
import { InfiniteList } from '@/components/infinite-list'

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(pullRequestsInfiniteQueryOptions(search))

  const pulls = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <div className="space-y-4">
      <PullsFilterBar
        search={search}
        onSearchChange={(s) => navigate({ search: s })}
      />
      <InfiniteList
        items={pulls}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        emptyMessage="No pull requests found."
        keyExtractor={(pr) => pr.id}
        renderItem={(pr) => (
          <Link
            to="/pulls/$number"
            params={{ number: String(pr.number) }}
            className="flex items-start gap-3 p-4 transition-colors hover:bg-accent/50"
          >
            {pr.merged_at ? (
              <GitMergeIcon className="mt-0.5 size-4 shrink-0 text-purple-500" />
            ) : pr.state === 'open' ? (
              <GitPullRequestIcon className="mt-0.5 size-4 shrink-0 text-green-500" />
            ) : (
              <GitPullRequestClosedIcon className="mt-0.5 size-4 shrink-0 text-red-500" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{pr.title}</span>
                {pr.draft && (
                  <Badge variant="secondary" className="text-xs">
                    Draft
                  </Badge>
                )}
                {pr.labels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: `#${label.color}`,
                      color: `#${label.color}`,
                    }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>#{pr.number}</span>
                <span>
                  opened {new Date(pr.created_at).toLocaleDateString()}
                </span>
                <span>by {pr.user.login}</span>
                <span>
                  {pr.head.ref} → {pr.base.ref}
                </span>
                {pr.comments > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquareIcon className="size-3" />
                    {pr.comments}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )}
      />
    </div>
  )
}
