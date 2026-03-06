import { Link, createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestIcon,
  LoaderIcon,
  MessageSquareIcon,
} from 'lucide-react'
import type { PullRequestSearchParams } from '@/lib/github/types'
import { pullRequestsInfiniteQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type PullsSearch = Omit<PullRequestSearchParams, 'page' | 'per_page'>

export const Route = createFileRoute('/pulls')({
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

  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  const pulls = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pull Requests</h1>
        <div className="flex items-center gap-2">
          <Select
            value={search.state ?? 'open'}
            onValueChange={(value) =>
              navigate({
                search: { ...search, state: value as PullsSearch['state'] },
              })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={search.sort ?? 'created'}
            onValueChange={(value) =>
              navigate({
                search: { ...search, sort: value as PullsSearch['sort'] },
              })
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="long-running">Long Running</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                search: {
                  ...search,
                  direction: search.direction === 'asc' ? 'desc' : 'asc',
                },
              })
            }
          >
            {search.direction === 'asc' ? '↑ Asc' : '↓ Desc'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : pulls.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No pull requests found.
        </p>
      ) : (
        <div className="divide-y divide-border rounded-md border">
          {pulls.map((pr) => (
            <Link
              key={pr.id}
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
                <div className="flex items-center gap-2">
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
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
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
