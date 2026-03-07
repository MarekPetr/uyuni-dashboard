import type { IssueSearchParams } from '@/lib/github/types'
import { FilterBar } from '@/components/filter-bar/filter-bar'

export type IssuesSearch = Omit<IssueSearchParams, 'page' | 'per_page'>

export interface IssuesFilterBarProps {
  search: IssuesSearch
  onSearchChange: (search: IssuesSearch) => void
}

const SORT_OPTIONS = [
  { value: 'created', label: 'Created' },
  { value: 'updated', label: 'Updated' },
  { value: 'comments', label: 'Comments' },
]

export function IssuesFilterBar({ search, onSearchChange }: IssuesFilterBarProps) {
  return (
    <FilterBar
      title="Issues"
      search={search}
      onSearchChange={onSearchChange}
      sortOptions={SORT_OPTIONS}
    />
  )
}