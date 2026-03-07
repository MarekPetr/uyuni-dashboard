import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon, ExternalLinkIcon, LoaderIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { pullRequestQueryOptions } from '@/lib/github/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PullRequestHeader } from '@/components/pulls/pull-header'

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
      <div className="flex items-center gap-2">
        <Link to="/pulls">
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
        </Link>
        <a
          href={pr.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm text-muted-foreground hover:text-foreground"
        >
          <ExternalLinkIcon className="inline size-3" /> View on GitHub
        </a>
      </div>

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