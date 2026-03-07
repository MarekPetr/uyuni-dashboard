import { useInfiniteQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { issueCommentsInfiniteQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export interface IssueCommentsProps {
  issueNumber: number
  totalCount: number
}

export function IssueComments({ issueNumber, totalCount }: IssueCommentsProps) {
  const comments = useInfiniteQuery(
    issueCommentsInfiniteQueryOptions(issueNumber),
  )

  const commentsList = comments.data?.pages.flatMap((p) => p.data) ?? []

  const sentinelRef = useIntersectionObserver(comments.fetchNextPage, {
    enabled: comments.hasNextPage && !comments.isFetchingNextPage,
  })

  if (commentsList.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Comments ({totalCount})</h2>
      {commentsList.map((comment) => (
        <Card key={comment.id}>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <img
              src={comment.user.avatar_url}
              alt={comment.user.login}
              className="size-6 rounded-full"
            />
            <span className="text-sm font-medium">{comment.user.login}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <ReactMarkdown>{comment.body}</ReactMarkdown>
          </CardContent>
        </Card>
      ))}
      <div ref={sentinelRef} className="flex justify-center py-2">
        {comments.isFetchingNextPage && (
          <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  )
}