import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { projectsQueryOptions } from '@/lib/github/queries'
import { ProjectCard } from '@/components/cards/project-card'
import { LoadingGrid } from '@/components/loading-grid'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Spinner } from '@/components/spinner'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(projectsQueryOptions())
  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })
  const projects = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <LoadingGrid
      title="Projects"
      isLoading={isLoading}
      isEmpty={projects.length === 0}
      emptyMessage="No open projects found."
      footer={
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isFetchingNextPage && <Spinner size="sm" />}
        </div>
      }
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </LoadingGrid>
  )
}
