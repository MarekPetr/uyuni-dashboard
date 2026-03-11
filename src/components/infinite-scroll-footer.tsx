import { Spinner } from '@/components/spinner'

export type InfiniteScrollFooterProps = {
  sentinelRef: React.RefObject<HTMLDivElement | null>
  isFetchingNextPage: boolean
  isError: boolean
  errorMessage?: string | null
}

export function InfiniteScrollFooter({
  sentinelRef,
  isFetchingNextPage,
  isError,
  errorMessage,
}: InfiniteScrollFooterProps) {
  return (
    <div
      ref={sentinelRef}
      className="flex flex-col justify-center items-center py-4"
    >
      {isFetchingNextPage && <Spinner size="sm" />}
      {isError && errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
