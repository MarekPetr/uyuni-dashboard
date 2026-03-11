import ReactMarkdown from 'react-markdown'
import { Card, CardContent } from '@/components/ui/card'
import { DetailPageNav } from '@/components/detail/nav'
import { Spinner } from '@/components/spinner'

export type DetailPageLayoutProps = {
  backTo: string
  externalUrl: string
  body: string | null | undefined
  notFound: boolean
  notFoundMessage: string
  isLoading: boolean
  header: React.ReactNode
  footer?: React.ReactNode
}

export function DetailPageLayout({
  backTo,
  externalUrl,
  body,
  notFound,
  notFoundMessage,
  isLoading,
  header,
  footer,
}: DetailPageLayoutProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="md" data-testid="detail-page-spinner" />
      </div>
    )
  }

  if (notFound) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {notFoundMessage}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <DetailPageNav backTo={backTo} externalUrl={externalUrl} />
      {header}
      {body && (
        <Card>
          <CardContent className="prose prose-invert max-w-none pt-6">
            <ReactMarkdown>{body}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
      {footer}
    </div>
  )
}
