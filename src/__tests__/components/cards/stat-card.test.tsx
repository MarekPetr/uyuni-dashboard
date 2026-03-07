import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom'
import { StatCard } from '@/components/cards/stat-card'

afterEach(() => cleanup())

const MockIcon = ({ className }: { className?: string }) => (
  <svg data-testid="stat-icon" className={className} />
)

describe('StatCard', () => {
  it('renders the title', () => {
    render(<StatCard title="Open Issues" value={42} icon={MockIcon} />)
    expect(screen.getByTestId('stat-title')).toHaveTextContent('Open Issues')
  })

  it('renders a numeric value', () => {
    render(<StatCard title="Open Issues" value={42} icon={MockIcon} />)
    expect(screen.getByTestId('stat-value')).toHaveTextContent('42')
  })

  it('renders a string value', () => {
    render(<StatCard title="Status" value="Active" icon={MockIcon} />)
    expect(screen.getByTestId('stat-value')).toHaveTextContent('Active')
  })

  it('renders the icon', () => {
    render(<StatCard title="Open Issues" value={42} icon={MockIcon} />)
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument()
  })

  it('renders the description when provided', () => {
    render(
      <StatCard
        title="Open Issues"
        value={42}
        icon={MockIcon}
        description="Last 30 days"
      />,
    )
    expect(screen.getByTestId('stat-description')).toHaveTextContent(
      'Last 30 days',
    )
  })

  it('does not render description when absent', () => {
    render(<StatCard title="Open Issues" value={42} icon={MockIcon} />)
    expect(screen.queryByTestId('stat-description')).not.toBeInTheDocument()
  })

  it('shows loader when isLoading is true', () => {
    render(
      <StatCard title="Open Issues" value={42} icon={MockIcon} isLoading />,
    )
    expect(screen.getByTestId('stat-loader')).toBeInTheDocument()
  })

  it('does not show value when isLoading is true', () => {
    render(
      <StatCard title="Open Issues" value={42} icon={MockIcon} isLoading />,
    )
    expect(screen.queryByTestId('stat-value')).not.toBeInTheDocument()
  })

  it('does not show loader when isLoading is false', () => {
    render(
      <StatCard
        title="Open Issues"
        value={42}
        icon={MockIcon}
        isLoading={false}
      />,
    )
    expect(screen.queryByTestId('stat-loader')).not.toBeInTheDocument()
  })
})
