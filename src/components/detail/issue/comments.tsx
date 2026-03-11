import { useInfiniteQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { issueCommentsInfiniteQueryOptions } from '@/lib/github/queries'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { CommentCard } from '@/components/cards/comment-card'
import { InfiniteScrollFooter } from '@/components/infinite-scroll-footer'
import { RATE_LIMITS_EXCEEDED_MESSAGE } from '@/lib/github/client'

export type IssueCommentsProps = {
  issueNumber: number
  totalCount: number
}

export function IssueComments({ issueNumber, totalCount }: IssueCommentsProps) {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(issueCommentsInfiniteQueryOptions(issueNumber))

  const commentsList = data?.pages.flatMap((p) => p.data) ?? []

  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  if (commentsList.length === 0) return null

  const isError403 = (error as AxiosError | null)?.status === 403
  const errorMessage = isError403 ? RATE_LIMITS_EXCEEDED_MESSAGE : null

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Comments ({totalCount})</h2>
      {commentsList.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      <InfiniteScrollFooter
        sentinelRef={sentinelRef}
        isFetchingNextPage={isFetchingNextPage}
        isError={isError403}
        errorMessage={errorMessage}
      />
    </div>
  )
}
