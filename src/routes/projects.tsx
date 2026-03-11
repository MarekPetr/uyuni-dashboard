import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { projectsQueryOptions } from '@/lib/github/queries'
import { ProjectCard } from '@/components/cards/project-card'
import { LoadingGrid } from '@/components/loading-grid'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Spinner } from '@/components/spinner'
import { getErrorMessage } from '@/lib/github/error'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const {
    data,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(projectsQueryOptions())
  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })
  const projects = data?.pages.flatMap((page) => page.data) ?? []

  const errorMessage = getErrorMessage(error)
  const isEmpty = projects.length === 0

  return (
    <LoadingGrid
      title="Projects"
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyMessage="No projects found"
      isError={isError}
      errorMessage={errorMessage}
      footer={
        <div
          ref={sentinelRef}
          className="flex justify-center items-center py-4"
        >
          {isFetchingNextPage && <Spinner size="sm" />}
          {!isEmpty && isError && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </div>
      }
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </LoadingGrid>
  )
}
