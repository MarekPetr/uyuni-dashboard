import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom'
import type { Project } from '@/lib/github/types'
import { ProjectCard } from '@/components/cards/project-card'

afterEach(() => cleanup())

const baseProject: Project = {
  id: 1,
  number: 1,
  title: 'Uyuni Roadmap',
  created_at: '2024-01-15T10:00:00Z',
  creator: { login: 'octocat' },
  short_description: 'Tracking progress of Uyuni development',
  closed_at: 'false',
  updated_at: '2024-01-15T10:00:00Z',
}

describe('ProjectCard', () => {
  it('renders the project title', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByText('Uyuni Roadmap')).toBeInTheDocument()
  })

  it('renders the link with target blank and noopener', () => {
    render(<ProjectCard project={baseProject} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the creator login', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByText(/octocat/)).toBeInTheDocument()
  })

  it('renders the formatted creation date', () => {
    render(<ProjectCard project={baseProject} />)
    const expected = new Date(baseProject.created_at).toLocaleDateString()
    expect(screen.getByText(new RegExp(expected))).toBeInTheDocument()
  })

  it('renders the short description when provided', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByTestId('project-description')).toHaveTextContent(
      'Tracking progress of Uyuni development',
    )
  })

  it('does not render short description when absent', () => {
    const project: Project = { ...baseProject, short_description: null }
    render(<ProjectCard project={project} />)
    expect(screen.queryByTestId('project-description')).not.toBeInTheDocument()
  })
})
