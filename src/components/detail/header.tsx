import type React from 'react'

export type DetailHeaderProps = {
  title: string
  number: number
  statusBadge: React.ReactNode
  labels: React.ReactNode
  meta: React.ReactNode
  footer?: React.ReactNode
}

export function DetailHeader({
  title,
  number,
  statusBadge,
  labels,
  meta,
  footer,
}: DetailHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {statusBadge}
        {labels}
      </div>
      <h1 className="mt-2 text-2xl font-bold">
        {title}{' '}
        <span className="font-normal text-muted-foreground">#{number}</span>
      </h1>
      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
        {meta}
      </div>
      {footer}
    </div>
  )
}
