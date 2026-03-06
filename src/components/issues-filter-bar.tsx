import type { IssueSearchParams } from '@/lib/github/types'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type IssuesSearch = Omit<IssueSearchParams, 'page' | 'per_page'>

export interface IssuesFilterBarProps {
  search: IssuesSearch
  onSearchChange: (search: IssuesSearch) => void
}

export function IssuesFilterBar({
  search,
  onSearchChange,
}: IssuesFilterBarProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Issues</h1>
      <div className="flex items-center gap-2">
        <Select
          value={search.state ?? 'open'}
          onValueChange={(value) =>
            onSearchChange({
              ...search,
              state: value as IssuesSearch['state'],
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
              sort: value as IssuesSearch['sort'],
            })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="comments">Comments</SelectItem>
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
