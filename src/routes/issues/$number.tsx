import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon, ExternalLinkIcon, LoaderIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { issueQueryOptions } from '@/lib/github/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IssueComments } from '@/components/issues/issue-comments'
import { IssueHeader } from '@/components/issues/issue-header'
import { DetailPageNav } from '@/components/detail-page-nav'

export const Route = createFileRoute('/issues/$number')({
  component: IssueDetailPage,
})

function IssueDetailPage() {
  const { number } = Route.useParams()
  const issueNumber = parseInt(number, 10)

  const { data: issue, isLoading } = useQuery(issueQueryOptions(issueNumber))

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!issue) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Issue not found.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <DetailPageNav backTo="/issues" externalUrl={issue.html_url} />

      <IssueHeader issue={issue} />

      {issue.body && (
        <Card>
          <CardContent className="prose prose-invert max-w-none pt-6">
            <ReactMarkdown>{issue.body}</ReactMarkdown>
          </CardContent>
        </Card>
      )}

      <IssueComments issueNumber={issueNumber} totalCount={issue.comments} />
    </div>
  )
}
