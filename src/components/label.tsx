import type { Label } from '@/lib/github/types'
import { Badge } from '@/components/ui/badge'

export type LabelBadgeProps = {
  label: Label
  className?: string
}

export function LabelBadge({ label, className }: LabelBadgeProps) {
  return (
    <Badge
      key={label.id}
      variant="outline"
      style={{ borderColor: `#${label.color}`, color: `#${label.color}` }}
      className={className}
    >
      {label.name}
    </Badge>
  )
}
