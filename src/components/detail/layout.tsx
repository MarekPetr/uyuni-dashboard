import ReactMarkdown from 'react-markdown'
import { Card, CardContent } from '@/components/ui/card'
import { DetailPageNav } from '@/components/detail/nav'
import { Spinner } from '@/components/spinner'

export type DetailPageLayoutProps = {
  backTo: string
  externalUrl: string
  body: string | null | undefined
  isError: boolean
  errorMessage?: string | null
  isLoading: boolean
  header: React.ReactNode
  footer?: React.ReactNode
}

export function DetailPageLayout({
  backTo,
  externalUrl,
  body,
  isError,
  errorMessage = 'Not found.',
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

  if (isError && errorMessage) {
    return <p className="py-12 text-center text-desctructive">{errorMessage}</p>
  }

  return (
    <div className="space-y-6">
      <DetailPageNav backTo={backTo} externalUrl={externalUrl} />
      {header}
      {body && (
        <Card data-testid="detail-page-body">
          <CardContent className="prose prose-invert max-w-none pt-6">
            <ReactMarkdown>{body}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
      {footer}
    </div>
  )
}
