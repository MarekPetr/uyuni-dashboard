import { LoaderIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent } from '@/components/ui/card'
import { DetailPageNav } from '@/components/detail-page/nav'

export interface DetailPageProps {
  backTo: string
  externalUrl: string
  body: string | null | undefined
  notFoundMessage: string
  isLoading: boolean
  header: React.ReactNode
  footer?: React.ReactNode
}

export function DetailPage({
  backTo,
  externalUrl,
  body,
  notFoundMessage,
  isLoading,
  header,
  footer,
}: DetailPageProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!externalUrl) {
    return (
      <p className="py-12 text-center text-muted-foreground">{notFoundMessage}</p>
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