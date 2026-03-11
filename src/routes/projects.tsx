import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { projectsQueryOptions } from '@/lib/github/queries'
import { ProjectCard } from '@/components/cards/project-card'
import { LoadingGrid } from '@/components/loading-grid'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Spinner } from '@/components/spinner'
import { RATE_LIMITS_EXCEEDED_MESSAGE } from '@/lib/github/errors'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(projectsQueryOptions())
  const sentinelRef = useIntersectionObserver(fetchNextPage, {
    enabled: hasNextPage && !isFetchingNextPage,
  })
  const projects = data?.pages.flatMap((page) => page.data) ?? []

  const isError403 = (error as AxiosError | null)?.status === 403
  const emptyMessage = isError403
    ? RATE_LIMITS_EXCEEDED_MESSAGE
    : 'No open projects found.'

  return (
    <LoadingGrid
      title="Projects"
      isLoading={isLoading}
      isEmpty={projects.length === 0}
      emptyMessage={emptyMessage}
      footer={
        <div
          ref={sentinelRef}
          className="flex justify-center items-center py-4"
        >
          {isFetchingNextPage && <Spinner size="sm" />}
          {isError403 && (
            <p className="text-sm text-muted-foreground">
              {RATE_LIMITS_EXCEEDED_MESSAGE}
            </p>
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
