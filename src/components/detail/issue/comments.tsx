import { useInfiniteQuery } from '@tanstack/react-query'
import { issueCommentsInfiniteQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { CommentCard } from '@/components/cards/comment-card'
import { Spinner } from '@/components/spinner'

export type IssueCommentsProps = {
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
        <CommentCard key={comment.id} comment={comment} />
      ))}
      <div ref={sentinelRef} className="flex justify-center py-2">
        {comments.isFetchingNextPage && <Spinner size="sm" />}
      </div>
    </div>
  )
}
