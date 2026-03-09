import { LoaderIcon } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

export type InfiniteListProps<T> = {
  items: Array<T>
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  emptyMessage: string
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string | number
}

export function InfiniteList<T>({
  items,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  emptyMessage,
  renderItem,
  keyExtractor,
}: InfiniteListProps<T>) {
  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">{emptyMessage}</p>
    )
  }

  return (
    <>
      <div className="divide-y divide-border rounded-md border">
        {items.map((item) => (
          <div key={keyExtractor(item)}>{renderItem(item)}</div>
        ))}
      </div>
      <div ref={sentinelRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
        )}
      </div>
    </>
  )
}
