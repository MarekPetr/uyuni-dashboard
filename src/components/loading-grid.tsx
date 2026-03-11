import { Spinner } from './spinner'

export type LoadingGridProps = {
  title: string
  isLoading: boolean
  isEmpty: boolean
  emptyMessage?: string | null
  isError: boolean
  errorMessage?: string | null
  children: React.ReactNode
  footer?: React.ReactNode
}

export function LoadingGrid({
  title,
  isLoading,
  isEmpty,
  emptyMessage = 'No items found.',
  isError,
  errorMessage = 'Some error occured.',
  children,
  footer,
}: LoadingGridProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="md" />
        </div>
      ) : isError && errorMessage ? (
        <p className="py-12 text-center text-destructive">{errorMessage}</p>
      ) : isEmpty && emptyMessage ? (
        <p className="py-12 text-center text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3'">
            {children}
          </div>
          {footer}
        </>
      )}
    </div>
  )
}
