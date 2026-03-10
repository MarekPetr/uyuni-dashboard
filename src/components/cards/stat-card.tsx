import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/spinner'

export type StatCardProps = {
  title: string
  value?: string | number
  description?: string
  icon: React.ComponentType<{ className?: string }>
  isLoading?: boolean
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium" data-testid="stat-title">
          {title}
        </CardTitle>
        <Icon
          className="size-4 text-muted-foreground"
          data-testid="stat-icon"
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Spinner size="sm" data-testid="stat-loader" />
        ) : (
          <>
            <div className="text-2xl font-bold" data-testid="stat-value">
              {value ?? '-'}
            </div>
            {description && (
              <CardDescription
                className="text-xs"
                data-testid="stat-description"
              >
                {description}
              </CardDescription>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
