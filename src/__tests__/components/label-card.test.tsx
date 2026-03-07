import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom'
import type { Label } from '@/lib/github/types'
import { LabelCard } from '@/components/cards/label-card'

afterEach(() => cleanup())

const baseLabel: Label = {
  id: 1,
  node_id: '1',
  name: 'bug',
  color: 'ff0000',
  description: 'Something is broken',
  default: false,
}

describe('LabelCard', () => {
  it('renders the label name', () => {
    render(<LabelCard label={baseLabel} />)
    expect(screen.getByText('bug')).toBeInTheDocument()
  })

  it('renders the description when provided', () => {
    render(<LabelCard label={baseLabel} />)
    expect(screen.getByText('Something is broken')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    const label: Label = { ...baseLabel, description: null }
    render(<LabelCard label={label} />)
    expect(screen.queryByText('Something is broken')).not.toBeInTheDocument()
  })

  it('applies the label color to the color dot', () => {
    render(<LabelCard label={baseLabel} />)
    expect(screen.getByTestId('label-color-dot')).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)',
    })
  })

  it('applies the label color to the badge', () => {
    render(<LabelCard label={baseLabel} />)
    const badge = screen.getByText('bug')
    expect(badge).toHaveStyle({
      borderColor: 'rgb(255, 0, 0)',
      color: 'rgb(255, 0, 0)',
    })
  })

  it('does not render description when empty string', () => {
    const label: Label = { ...baseLabel, description: '' }
    render(<LabelCard label={label} />)
    expect(screen.queryByTestId('label-description')).not.toBeInTheDocument()
  })
})
