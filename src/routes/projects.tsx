import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { projectsQueryOptions } from '@/lib/github/queries'
import { ProjectCard } from '@/components/cards/project-card'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const { data: projects, isLoading, error } = useQuery(projectsQueryOptions())

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Projects</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="py-12 text-center text-muted-foreground">
          Could not load projects. A GitHub token with project read permissions
          is required.
        </p>
      ) : !projects || projects.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No open projects found.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
