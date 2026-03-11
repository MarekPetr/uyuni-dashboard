import { useInfiniteQuery } from '@tanstack/react-query'
import { issueCommentsInfiniteQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { CommentCard } from '@/components/cards/comment-card'
import { InfiniteScrollFooter } from '@/components/infinite-scroll-footer'
import { getErrorMessage } from '@/lib/github/error'

export type IssueCommentsProps = {
  issueNumber: number
  totalCount: number
}

export function IssueComments({ issueNumber, totalCount }: IssueCommentsProps) {
  const {
    data,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(issueCommentsInfiniteQueryOptions(issueNumber))

  const commentsList = data?.pages.flatMap((p) => p.data) ?? []

  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  if (commentsList.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Comments ({totalCount})</h2>
      {commentsList.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      <InfiniteScrollFooter
        sentinelRef={sentinelRef}
        isFetchingNextPage={isFetchingNextPage}
        isError={isError}
        errorMessage={getErrorMessage(error)}
      />
    </div>
  )
}
