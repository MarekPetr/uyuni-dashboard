import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type SortOption = {
  value: string
  label: string
}

export type FilterBarProps<
  T extends { state?: string; sort?: string; direction?: 'asc' | 'desc' },
> = {
  title: string
  search: T
  onSearchChange: (search: T) => void
  sortOptions: Array<SortOption>
  sortWidth?: string
}

export function FilterBar<
  T extends { state?: string; sort?: string; direction?: 'asc' | 'desc' },
>({ title, search, onSearchChange, sortOptions }: FilterBarProps<T>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={search.state ?? 'open'}
          onValueChange={(value) =>
            onSearchChange({ ...search, state: value as T['state'] })
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
            onSearchChange({ ...search, sort: value as T['sort'] })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
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
