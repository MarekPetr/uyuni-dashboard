import { Link } from '@tanstack/react-router'
import {
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestIcon,
  MessageSquareIcon,
} from 'lucide-react'
import type { PullRequest } from '@/lib/github/types'
import { Badge } from '@/components/ui/badge'
import { LabelBadge } from '@/components/label'

export type PullRequestRowpullRequestops = {
  pullRequest: PullRequest
}

export function PullRequestRow({ pullRequest }: PullRequestRowpullRequestops) {
  return (
    <Link
      to="/pulls/$number"
      params={{ number: String(pullRequest.number) }}
      className="flex items-start gap-3 p-4 transition-colors hover:bg-accent/50"
    >
      {pullRequest.merged_at ? (
        <GitMergeIcon className="mt-0.5 size-4 shrink-0 text-purple-500" />
      ) : pullRequest.state === 'open' ? (
        <GitPullRequestIcon className="mt-0.5 size-4 shrink-0 text-green-500" />
      ) : (
        <GitPullRequestClosedIcon className="mt-0.5 size-4 shrink-0 text-red-500" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{pullRequest.title}</span>
          {pullRequest.draft && (
            <Badge variant="secondary" className="text-xs">
              Draft
            </Badge>
          )}
          {pullRequest.labels.map((label) => (
            <LabelBadge key={label.id} label={label} className="text-xs" />
          ))}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>#{pullRequest.number}</span>
          <span>
            opened {new Date(pullRequest.created_at).toLocaleDateString()}
          </span>
          <span>by {pullRequest.user.login}</span>
          <span>
            {pullRequest.head.ref} → {pullRequest.base.ref}
          </span>
          {pullRequest.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquareIcon className="size-3" />
              {pullRequest.comments}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
