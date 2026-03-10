import { CircleCheckIcon, CircleDotIcon } from 'lucide-react'
import type { Issue } from '@/lib/github/types'
import { Badge } from '@/components/ui/badge'
import { DetailHeader } from '@/components/detail/header'
import { LabelBadge } from '@/components/label'

export type IssueHeaderProps = {
  issue: Issue
}

export function IssueHeader({ issue }: IssueHeaderProps) {
  return (
    <DetailHeader
      title={issue.title}
      number={issue.number}
      statusBadge={
        issue.state === 'open' ? (
          <Badge className="bg-green-600 text-white">
            <CircleDotIcon className="mr-1 size-3" /> Open
          </Badge>
        ) : (
          <Badge className="bg-purple-600 text-white">
            <CircleCheckIcon className="mr-1 size-3" /> Closed
          </Badge>
        )
      }
      labels={issue.labels.map((label) => (
        <LabelBadge key={label.id} label={label} />
      ))}
      meta={
        <>
          <img
            src={issue.user.avatar_url}
            alt={issue.user.login}
            className="size-5 rounded-full"
          />
          <span>{issue.user.login}</span>
          <span>opened {new Date(issue.created_at).toLocaleDateString()}</span>
          {issue.assignees.length > 0 && (
            <span>
              assigned to {issue.assignees.map((a) => a.login).join(', ')}
            </span>
          )}
        </>
      }
    />
  )
}
