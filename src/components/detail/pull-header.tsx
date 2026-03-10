import {
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestIcon,
} from 'lucide-react'
import type { PullRequest } from '@/lib/github/types'
import { Badge } from '@/components/ui/badge'
import { DetailHeader } from '@/components/detail/header'
import { LabelBadge } from '@/components/label'

export type PullRequestHeaderProps = {
  pr: PullRequest
}

const getPRStatus = (pr: PullRequest) => {
  if (pr.merged_at) {
    return { icon: GitMergeIcon, label: 'Merged', color: 'bg-purple-600' }
  }
  if (pr.state === 'open') {
    return { icon: GitPullRequestIcon, label: 'Open', color: 'bg-green-600' }
  }
  return {
    icon: GitPullRequestClosedIcon,
    label: 'Closed',
    color: 'bg-red-600',
  }
}

export function PullRequestHeader({ pr }: PullRequestHeaderProps) {
  const {
    icon: StatusIcon,
    label: statusLabel,
    color: statusColor,
  } = getPRStatus(pr)

  return (
    <DetailHeader
      title={pr.title}
      number={pr.number}
      statusBadge={
        <Badge className={`${statusColor} text-white`}>
          <StatusIcon className="mr-1 size-3" /> {statusLabel}
        </Badge>
      }
      labels={
        <>
          {pr.draft && <Badge variant="secondary">Draft</Badge>}
          {pr.labels.map((label) => (
            <LabelBadge key={label.id} label={label} />
          ))}
        </>
      }
      meta={
        <>
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
        </>
      }
      footer={
        pr.merged_at && (
          <p className="mt-1 text-sm text-muted-foreground">
            Merged on {new Date(pr.merged_at).toLocaleDateString()}
          </p>
        )
      }
    />
  )
}
