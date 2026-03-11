import { Spinner } from '@/components/spinner'

export type LoadingListProps = {
  isLoading: boolean
  isEmpty: boolean
  emptyMessage?: string | null
  children: React.ReactNode
  footer?: React.ReactNode
}

export function LoadingList({
  isLoading,
  isEmpty,
  emptyMessage = 'No items found.',
  children,
  footer,
}: LoadingListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="md" />
      </div>
    )
  }

  if (isEmpty && emptyMessage) {
    return (
      <p className="py-12 text-center text-muted-foreground">{emptyMessage}</p>
    )
  }

  return (
    <>
      <div className="divide-y divide-border rounded-md border">{children}</div>
      {footer}
    </>
  )
}
