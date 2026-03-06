import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestIcon,
  LoaderIcon,
} from 'lucide-react'
import { pullRequestQueryOptions } from '@/lib/github/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

  const StatusIcon = pr.merged_at
    ? GitMergeIcon
    : pr.state === 'open'
      ? GitPullRequestIcon
      : GitPullRequestClosedIcon

  const statusLabel = pr.merged_at
    ? 'Merged'
    : pr.state === 'open'
      ? 'Open'
      : 'Closed'

  const statusColor = pr.merged_at
    ? 'bg-purple-600'
    : pr.state === 'open'
      ? 'bg-green-600'
      : 'bg-red-600'

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

      <div>
        <div className="flex items-center gap-2">
          <Badge className={`${statusColor} text-white`}>
            <StatusIcon className="mr-1 size-3" /> {statusLabel}
          </Badge>
          {pr.draft && <Badge variant="secondary">Draft</Badge>}
          {pr.labels.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              style={{
                borderColor: `#${label.color}`,
                color: `#${label.color}`,
              }}
            >
              {label.name}
            </Badge>
          ))}
        </div>
        <h1 className="mt-2 text-2xl font-bold">
          {pr.title}{' '}
          <span className="font-normal text-muted-foreground">
            #{pr.number}
          </span>
        </h1>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <img
            src={pr.user.avatar_url}
            alt={pr.user.login}
            className="size-5 rounded-full"
          />
          <span>{pr.user.login}</span>
          <span>opened {new Date(pr.created_at).toLocaleDateString()}</span>
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            {pr.head.ref}
          </span>
          <span>→</span>
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            {pr.base.ref}
          </span>
        </div>
        {pr.merged_at && (
          <p className="mt-1 text-sm text-muted-foreground">
            Merged on {new Date(pr.merged_at).toLocaleDateString()}
          </p>
        )}
      </div>

      {pr.body && (
        <Card>
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap text-sm">{pr.body}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
