import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FilterBar } from '@/components/filter-bar/filter-bar'
import '@testing-library/jest-dom'

const sortOptions = [
  { value: 'created', label: 'Created' },
  { value: 'updated', label: 'Updated' },
]

const defaultSearch = {
  state: 'open',
  sort: 'created',
  direction: 'asc' as const,
}

describe('FilterBar', () => {
  it('renders the title', () => {
    render(
      <FilterBar
        title="Pull Requests"
        search={defaultSearch}
        onSearchChange={vi.fn()}
        sortOptions={sortOptions}
      />,
    )
    expect(screen.getByTestId('filter-bar-title')).toHaveTextContent(
      'Pull Requests',
    )
  })

  it('toggles direction from asc to desc when button is clicked', async () => {
    const onSearchChange = vi.fn()
    render(
      <FilterBar
        title="Pull Requests"
        search={defaultSearch}
        onSearchChange={onSearchChange}
        sortOptions={sortOptions}
      />,
    )
    await userEvent.click(screen.getByTestId('filter-bar-direction'))
    expect(onSearchChange).toHaveBeenCalledWith({
      ...defaultSearch,
      direction: 'desc',
    })
  })

  it('toggles direction from desc to asc when button is clicked', async () => {
    const onSearchChange = vi.fn()
    render(
      <FilterBar
        title="Pull Requests"
        search={{ ...defaultSearch, direction: 'desc' }}
        onSearchChange={onSearchChange}
        sortOptions={sortOptions}
      />,
    )
    await userEvent.click(screen.getByTestId('filter-bar-direction'))
    expect(onSearchChange).toHaveBeenCalledWith({
      ...defaultSearch,
      direction: 'asc',
    })
  })

  it('shows asc label when direction is asc', () => {
    render(
      <FilterBar
        title="Pull Requests"
        search={defaultSearch}
        onSearchChange={vi.fn()}
        sortOptions={sortOptions}
      />,
    )
    expect(screen.getByTestId('filter-bar-direction')).toHaveTextContent(
      '↑ Asc',
    )
  })

  it('shows desc label when direction is desc', () => {
    render(
      <FilterBar
        title="Pull Requests"
        search={{ ...defaultSearch, direction: 'desc' }}
        onSearchChange={vi.fn()}
        sortOptions={sortOptions}
      />,
    )
    expect(screen.getByTestId('filter-bar-direction')).toHaveTextContent(
      '↓ Desc',
    )
  })
})
