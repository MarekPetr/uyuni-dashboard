import { CircleCheckIcon, CircleDotIcon } from 'lucide-react'
import type { Issue } from '@/lib/github/types'
import { Badge } from '@/components/ui/badge'

export type IssueHeaderProps = {
  issue: Issue
}

export function IssueHeader({ issue }: IssueHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {issue.state === 'open' ? (
          <Badge className="bg-green-600 text-white">
            <CircleDotIcon className="mr-1 size-3" /> Open
          </Badge>
        ) : (
          <Badge className="bg-purple-600 text-white">
            <CircleCheckIcon className="mr-1 size-3" /> Closed
          </Badge>
        )}
        {issue.labels.map((label) => (
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
        {issue.title}{' '}
        <span className="font-normal text-muted-foreground">
          #{issue.number}
        </span>
      </h1>
      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
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
      </div>
    </div>
  )
}
