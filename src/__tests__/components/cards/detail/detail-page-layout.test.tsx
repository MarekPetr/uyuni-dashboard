import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import '@testing-library/jest-dom'
import { DetailPageLayout } from '@/components/detail/layout'

vi.mock('@/components/detail/nav', () => ({
  DetailPageNav: ({
    backTo,
    externalUrl,
  }: {
    backTo: string
    externalUrl: string
  }) => (
    <div
      data-testid="detail-page-nav"
      data-back-to={backTo}
      data-external-url={externalUrl}
    />
  ),
}))

const defaultProps = {
  backTo: '/issues',
  externalUrl: 'https://github.com/issues/1',
  body: null,
  notFound: false,
  notFoundMessage: 'Issue not found.',
  isLoading: false,
  header: <div data-testid="header">Header</div>,
}

describe('DetailPageLayout', () => {
  it('shows spinner when loading', () => {
    render(<DetailPageLayout {...defaultProps} isLoading />)
    expect(screen.getByTestId('detail-page-spinner')).toBeInTheDocument()
  })

  it('shows not found message when notFound is true', () => {
    render(
      <DetailPageLayout
        {...defaultProps}
        notFound
        notFoundMessage="Issue not found."
      />,
    )
    expect(screen.getByText('Issue not found.')).toBeInTheDocument()
  })

  it('does not show not found message when loading', () => {
    render(<DetailPageLayout {...defaultProps} isLoading notFound />)
    expect(screen.queryByText('Issue not found.')).not.toBeInTheDocument()
  })

  it('renders header when not loading and not notFound', () => {
    render(<DetailPageLayout {...defaultProps} />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders nav with correct props', () => {
    render(<DetailPageLayout {...defaultProps} />)
    const nav = screen.getByTestId('detail-page-nav')
    expect(nav).toHaveAttribute('data-back-to', '/issues')
    expect(nav).toHaveAttribute(
      'data-external-url',
      'https://github.com/issues/1',
    )
  })

  it('renders body when provided', () => {
    render(<DetailPageLayout {...defaultProps} body="**Hello world**" />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('does not render body card when body is null', () => {
    render(<DetailPageLayout {...defaultProps} body={null} />)
    expect(screen.queryByText('prose')).not.toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <DetailPageLayout
        {...defaultProps}
        footer={<div data-testid="footer">Footer</div>}
      />,
    )
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })
})
