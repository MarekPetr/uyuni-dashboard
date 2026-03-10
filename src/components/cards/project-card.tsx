import { ExternalLinkIcon } from 'lucide-react'
import type { Project } from '@/lib/github/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createProjectUrl } from '@/lib/github/client'

export type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {project.title}
          <a
            href={createProjectUrl(project.number)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLinkIcon className="size-3" />
          </a>
        </CardTitle>
        <CardDescription>
          Created {new Date(project.created_at).toLocaleDateString()} by{' '}
          {project.creator.login}
        </CardDescription>
      </CardHeader>
      {project.short_description && (
        <CardContent>
          <p
            data-testid="project-description"
            className="text-sm text-muted-foreground"
          >
            {project.short_description}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
