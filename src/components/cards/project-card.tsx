import { ExternalLinkIcon } from 'lucide-react'
import type { Project } from '@/lib/github/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLinkIcon className="size-3" />
          </a>
        </CardTitle>
        <CardDescription>
          Created {new Date(project.createdAt).toLocaleDateString()} by{' '}
          {project.creator.login}
        </CardDescription>
      </CardHeader>
      {project.shortDescription && (
        <CardContent>
          <p
            data-testid="project-description"
            className="text-sm text-muted-foreground"
          >
            {project.shortDescription}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
