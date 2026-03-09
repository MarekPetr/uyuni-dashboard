import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom'
import type { IssueComment } from '@/lib/github/types'
import { CommentCard } from '@/components/cards/comment-card'

const mockComment: IssueComment = {
  id: 1,
  node_id: '1',
  user: {
    login: 'peterdev',
    id: 1,
    node_id: 'MDQ6VXNlcjE=',
    avatar_url: 'https://example.com/avatar.png',
    html_url: 'https://github.com/octocat',
    gravatar_id: '',
    type: 'User',
    site_admin: false,
  },
  body: '**Bold** and regular text',
  created_at: '2024-03-01T10:00:00Z',
  updated_at: '2011-04-14T16:00:49Z',
  author_association: 'COLLABORATOR',
  html_url: 'https://github.com/repo/issue/1',
}

describe('CommentCard', () => {
  beforeEach(() => {
    render(<CommentCard comment={mockComment} />)
  })

  it('renders the comment card', () => {
    expect(screen.getByTestId('comment-card')).toBeInTheDocument()
  })

  it('displays the author username', () => {
    expect(screen.getByTestId('comment-author')).toHaveTextContent('peterdev')
  })

  it('renders avatar with correct src and alt', () => {
    const avatar = screen.getByTestId('comment-avatar')
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.png')
    expect(avatar).toHaveAttribute('alt', 'peterdev')
  })

  it('formats and displays the date', () => {
    const date = screen.getByTestId('comment-date')
    expect(date).toHaveTextContent(
      new Date('2024-03-01T10:00:00Z').toLocaleDateString(),
    )
  })

  it('renders markdown body content', () => {
    const body = screen.getByTestId('comment-body')
    expect(body).toBeInTheDocument()
    expect(body.querySelector('strong')).toHaveTextContent('Bold')
  })
})
