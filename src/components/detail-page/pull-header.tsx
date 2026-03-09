import {
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestIcon,
} from 'lucide-react'
import type { PullRequest } from '@/lib/github/types'
import { Badge } from '@/components/ui/badge'

export type PullRequestHeaderProps = {
  pr: PullRequest
}

export function PullRequestHeader({ pr }: PullRequestHeaderProps) {
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
        <span className="font-normal text-muted-foreground">#{pr.number}</span>
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
  )
}
