import { Link } from '@tanstack/react-router'
import { CircleCheckIcon, CircleDotIcon, MessageSquareIcon } from 'lucide-react'
import type { Issue } from '@/lib/github/types'
import { Badge } from '@/components/ui/badge'

export function IssueRow({ issue }: { issue: Issue }) {
  return (
    <Link
      to="/issues/$number"
      params={{ number: String(issue.number) }}
      className="flex items-start gap-3 p-4 transition-colors hover:bg-accent/50"
    >
      {issue.state === 'open' ? (
        <CircleDotIcon className="mt-0.5 size-4 shrink-0 text-green-500" />
      ) : (
        <CircleCheckIcon className="mt-0.5 size-4 shrink-0 text-purple-500" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{issue.title}</span>
          {issue.labels.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className="text-xs"
              style={{
                borderColor: `#${label.color}`,
                color: `#${label.color}`,
              }}
            >
              {label.name}
            </Badge>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span>#{issue.number}</span>
          <span>opened {new Date(issue.created_at).toLocaleDateString()}</span>
          <span>by {issue.user.login}</span>
          {issue.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquareIcon className="size-3" />
              {issue.comments}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
