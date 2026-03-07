import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon, ExternalLinkIcon, LoaderIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { pullRequestQueryOptions } from '@/lib/github/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PullRequestHeader } from '@/components/pulls/pull-header'
import { DetailPageNav } from '@/components/detail-page-nav'

export const Route = createFileRoute('/pulls/$number')({
  component: PullRequestDetailPage,
})

function PullRequestDetailPage() {
  const { number } = Route.useParams()
  const prNumber = parseInt(number, 10)

  const { data: pr, isLoading } = useQuery(pullRequestQueryOptions(prNumber))

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!pr) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Pull request not found.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <DetailPageNav backTo="/pulls" externalUrl={pr.html_url} />

      <PullRequestHeader pr={pr} />

      {pr.body && (
        <Card>
          <CardContent className="prose prose-invert max-w-none pt-6">
            <ReactMarkdown>{pr.body}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
