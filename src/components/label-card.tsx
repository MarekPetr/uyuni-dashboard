import type { Label } from '@/lib/github/types'
import { Badge } from '@/components/ui/badge'

export interface LabelCardProps {
  label: Label
}

export function LabelCard({ label }: LabelCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <div
        className="size-4 shrink-0 rounded-full"
        style={{ backgroundColor: `#${label.color}` }}
      />
      <div className="min-w-0">
        <Badge
          variant="outline"
          style={{
            borderColor: `#${label.color}`,
            color: `#${label.color}`,
          }}
        >
          {label.name}
        </Badge>
        {label.description && (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {label.description}
          </p>
        )}
      </div>
    </div>
  )
}
