import type { Label } from '@/lib/github/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export interface LabelCardProps {
  label: Label
}

export function LabelCard({ label }: LabelCardProps) {
  return (
    <Card size="sm">
      <CardContent>
        <div className="flex items-center gap-3">
          <div
            data-testid="label-color-dot"
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
              <p
                data-testid="label-description"
                className="mt-1 truncate text-xs text-muted-foreground"
              >
                {label.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
