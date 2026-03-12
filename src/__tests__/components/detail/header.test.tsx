import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import '@testing-library/jest-dom'
import { DetailHeader } from '@/components/detail/header'

const defaultProps = {
  title: 'Fix login bug',
  number: 42,
  statusBadge: <div data-testid="status-badge">Open</div>,
  labels: <div data-testid="labels">bug</div>,
  meta: <div data-testid="meta">opened 2 days ago</div>,
}

describe('DetailHeader', () => {
  it('renders the title with number', () => {
    render(<DetailHeader {...defaultProps} />)
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
    expect(screen.getByText('#42')).toBeInTheDocument()
  })

  it('renders the status badge', () => {
    render(<DetailHeader {...defaultProps} />)
    expect(screen.getByTestId('status-badge')).toBeInTheDocument()
  })

  it('renders labels', () => {
    render(<DetailHeader {...defaultProps} />)
    expect(screen.getByTestId('labels')).toBeInTheDocument()
  })

  it('renders meta', () => {
    render(<DetailHeader {...defaultProps} />)
    expect(screen.getByTestId('meta')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <DetailHeader
        {...defaultProps}
        footer={<div data-testid="footer">Footer content</div>}
      />,
    )
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('does not render footer when not provided', () => {
    render(<DetailHeader {...defaultProps} />)
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument()
  })
})
