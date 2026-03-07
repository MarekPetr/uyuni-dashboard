import { LoaderIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { PieChart } from 'react-minimal-pie-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { languagesQueryOptions } from '@/lib/github/queries'
import { cn } from '@/lib/utils'

const COLORS = [
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#f97316',
  '#14b8a6',
  '#a855f7',
]

const TOP_N = 8

function prepareData(languages: Record<string, number>) {
  const total = Object.values(languages).reduce((sum, v) => sum + v, 0)
  if (total === 0) return []

  const sorted = Object.entries(languages).sort(([, a], [, b]) => b - a)
  const top = sorted.slice(0, TOP_N)
  const otherSum = sorted.slice(TOP_N).reduce((sum, [, v]) => sum + v, 0)

  const entries = top.map(([name, value], i) => ({
    title: name,
    value,
    color: COLORS[i % COLORS.length],
    percentage: ((value / total) * 100).toFixed(1),
  }))

  if (otherSum > 0) {
    entries.push({
      title: 'Other',
      value: otherSum,
      color: COLORS[TOP_N % COLORS.length],
      percentage: ((otherSum / total) * 100).toFixed(1),
    })
  }

  return entries
}

export function LanguageChart({ className }: { className?: string }) {
  const { data: languages, isLoading } = useQuery(languagesQueryOptions())
  const chartData = languages ? prepareData(languages) : []

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Languages</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        {isLoading ? (
          <div className="flex w-full justify-center py-8">
            <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="size-[100px] shrink-0 sm:size-[120px]">
              <PieChart
                data={chartData}
                lineWidth={30}
                paddingAngle={2}
                animate
              />
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {chartData.map((entry) => (
                <li key={entry.title} className="flex items-center gap-1.5">
                  <span
                    className="inline-block size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground">{entry.title}</span>
                  <span className="ml-auto font-medium tabular-nums">
                    {entry.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
