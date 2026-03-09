import type { Label } from '@/lib/github/types'
import { Badge } from '@/components/ui/badge'

export function LabelBadge({ label, className }: { label: Label, className?: string }) {
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
