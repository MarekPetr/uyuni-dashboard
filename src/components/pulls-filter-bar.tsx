import type { PullRequestSearchParams } from '@/lib/github/types'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type PullsSearch = Omit<PullRequestSearchParams, 'page' | 'per_page'>

export interface PullsFilterBarProps {
  search: PullsSearch
  onSearchChange: (search: PullsSearch) => void
}

export function PullsFilterBar({
  search,
  onSearchChange,
}: PullsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h1 className="text-2xl font-bold">Pull Requests</h1>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={search.state ?? 'open'}
          onValueChange={(value) =>
            onSearchChange({
              ...search,
              state: value as PullsSearch['state'],
            })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={search.sort ?? 'created'}
          onValueChange={(value) =>
            onSearchChange({
              ...search,
              sort: value as PullsSearch['sort'],
            })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="long-running">Long Running</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onSearchChange({
              ...search,
              direction: search.direction === 'asc' ? 'desc' : 'asc',
            })
          }
        >
          {search.direction === 'asc' ? '↑ Asc' : '↓ Desc'}
        </Button>
      </div>
    </div>
  )
}
