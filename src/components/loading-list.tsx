import { Spinner } from '@/components/spinner'

export type LoadingListProps = {
  isLoading: boolean
  isEmpty: boolean
  emptyMessage?: string | null
  isError: boolean
  errorMessage?: string | null
  children: React.ReactNode
  footer?: React.ReactNode
}

export function LoadingList({
  isLoading,
  isEmpty,
  emptyMessage = 'No items found.',
  isError,
  errorMessage = 'Some error occured.',
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

  if (isError && errorMessage) {
    return <p className="py-12 text-center text-destructive">{errorMessage}</p>
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
