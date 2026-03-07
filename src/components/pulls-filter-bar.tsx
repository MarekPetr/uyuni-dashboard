import type { PullRequestSearchParams } from '@/lib/github/types'
import { FilterBar } from '@/components/filter-bar'

export type PullsSearch = Omit<PullRequestSearchParams, 'page' | 'per_page'>

export interface PullsFilterBarProps {
  search: PullsSearch
  onSearchChange: (search: PullsSearch) => void
}

const SORT_OPTIONS = [
  { value: 'created', label: 'Created' },
  { value: 'updated', label: 'Updated' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'long-running', label: 'Long Running' },
]

export function PullsFilterBar({ search, onSearchChange }: PullsFilterBarProps) {
  return (
    <FilterBar
      title="Pull Requests"
      search={search}
      onSearchChange={onSearchChange}
      sortOptions={SORT_OPTIONS}
    />
  )
}