import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
  issueQueryOptions,
  issueCommentsInfiniteQueryOptions,
} from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  CircleDotIcon,
  CircleCheckIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
  LoaderIcon,
} from 'lucide-react'

export const Route = createFileRoute('/issues/$number')({
  component: IssueDetailPage,
})

function IssueDetailPage() {
  const { number } = Route.useParams()
  const issueNumber = parseInt(number, 10)

  const { data: issue, isLoading } = useQuery(
    issueQueryOptions(issueNumber),
  )
  const comments = useInfiniteQuery(
    issueCommentsInfiniteQueryOptions(issueNumber),
  )

  const commentsList = comments.data?.pages.flatMap((p) => p.data) ?? []

  const commentSentinelRef = useIntersectionObserver(
    comments.fetchNextPage,
    { enabled: comments.hasNextPage && !comments.isFetchingNextPage },
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!issue) {
    return <p className="py-12 text-center text-muted-foreground">Issue not found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/issues">
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
        </Link>
        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm text-muted-foreground hover:text-foreground"
        >
          <ExternalLinkIcon className="inline size-3" /> View on GitHub
        </a>
      </div>

      <div>
        <div className="flex items-center gap-2">
          {issue.state === 'open' ? (
            <Badge className="bg-green-600 text-white">
              <CircleDotIcon className="mr-1 size-3" /> Open
            </Badge>
          ) : (
            <Badge className="bg-purple-600 text-white">
              <CircleCheckIcon className="mr-1 size-3" /> Closed
            </Badge>
          )}
          {issue.labels.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              style={{
                borderColor: `#${label.color}`,
                color: `#${label.color}`,
              }}
            >
              {label.name}
            </Badge>
          ))}
        </div>
        <h1 className="mt-2 text-2xl font-bold">
          {issue.title}{' '}
          <span className="font-normal text-muted-foreground">
            #{issue.number}
          </span>
        </h1>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <img
            src={issue.user.avatar_url}
            alt={issue.user.login}
            className="size-5 rounded-full"
          />
          <span>{issue.user.login}</span>
          <span>
            opened {new Date(issue.created_at).toLocaleDateString()}
          </span>
          {issue.assignees.length > 0 && (
            <span>
              assigned to{' '}
              {issue.assignees.map((a) => a.login).join(', ')}
            </span>
          )}
        </div>
      </div>

      {issue.body && (
        <Card>
          <CardContent className="prose prose-invert max-w-none pt-6">
            <pre className="whitespace-pre-wrap text-sm">{issue.body}</pre>
          </CardContent>
        </Card>
      )}

      {commentsList.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Comments ({issue.comments})
          </h2>
          {commentsList.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <img
                  src={comment.user.avatar_url}
                  alt={comment.user.login}
                  className="size-6 rounded-full"
                />
                <span className="text-sm font-medium">
                  {comment.user.login}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm">
                  {comment.body}
                </pre>
              </CardContent>
            </Card>
          ))}
          <div ref={commentSentinelRef} className="flex justify-center py-2">
            {comments.isFetchingNextPage && (
              <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
