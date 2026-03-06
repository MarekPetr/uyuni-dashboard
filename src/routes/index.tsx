import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  CircleDotIcon,
  FolderKanbanIcon,
  GitForkIcon,
  GitPullRequestIcon,
  StarIcon,
  TagIcon,
} from 'lucide-react'
import {
  issuesInfiniteQueryOptions,
  labelsQueryOptions,
  projectsQueryOptions,
  pullRequestsInfiniteQueryOptions,
  repositoryQueryOptions,
} from '@/lib/github/queries'
import { StatCard } from '@/components/stat-card'

export const Route = createFileRoute('/')({ component: DashboardPage })

function DashboardPage() {
  const repo = useQuery(repositoryQueryOptions())
  const openIssues = useInfiniteQuery(
    issuesInfiniteQueryOptions({ state: 'open' }),
  )
  const closedIssues = useInfiniteQuery(
    issuesInfiniteQueryOptions({ state: 'closed' }),
  )
  const openPRs = useInfiniteQuery(
    pullRequestsInfiniteQueryOptions({ state: 'open' }),
  )
  const closedPRs = useInfiniteQuery(
    pullRequestsInfiniteQueryOptions({ state: 'closed' }),
  )
  const labels = useInfiniteQuery(labelsQueryOptions())
  const projects = useQuery(projectsQueryOptions())

  const openIssueCount = repo.data?.open_issues_count
  const totalLabels = labels.data?.pages.flatMap((p) => p.data).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {repo.data?.full_name ?? 'Loading...'}
        </h1>
        {repo.data?.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {repo.data.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Stars"
          value={repo.data?.stargazers_count ?? 0}
          icon={StarIcon}
          isLoading={repo.isLoading}
        />
        <StatCard
          title="Forks"
          value={repo.data?.forks_count ?? 0}
          icon={GitForkIcon}
          isLoading={repo.isLoading}
        />
        <StatCard
          title="Open Issues"
          value={openIssueCount ?? 0}
          icon={CircleDotIcon}
          isLoading={repo.isLoading}
        />
        <StatCard
          title="Language"
          value={repo.data?.language ?? 'N/A'}
          icon={TagIcon}
          isLoading={repo.isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Open Issues"
          value={openIssues.data?.pages[0]?.data.length ?? 0}
          description="First page loaded"
          icon={CircleDotIcon}
          isLoading={openIssues.isLoading}
        />
        <StatCard
          title="Closed Issues"
          value={closedIssues.data?.pages[0]?.data.length ?? 0}
          description="First page loaded"
          icon={CircleDotIcon}
          isLoading={closedIssues.isLoading}
        />
        <StatCard
          title="Open PRs"
          value={openPRs.data?.pages[0]?.data.length ?? 0}
          description="First page loaded"
          icon={GitPullRequestIcon}
          isLoading={openPRs.isLoading}
        />
        <StatCard
          title="Closed PRs"
          value={closedPRs.data?.pages[0]?.data.length ?? 0}
          description="First page loaded"
          icon={GitPullRequestIcon}
          isLoading={closedPRs.isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Labels"
          value={totalLabels ?? 0}
          icon={TagIcon}
          isLoading={labels.isLoading}
        />
        <StatCard
          title="Open Projects"
          value={projects.data?.length ?? 0}
          description={projects.error ? 'Requires auth token' : undefined}
          icon={FolderKanbanIcon}
          isLoading={projects.isLoading}
        />
      </div>
    </div>
  )
}
