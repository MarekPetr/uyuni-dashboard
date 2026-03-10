import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  CircleDotIcon,
  FolderKanbanIcon,
  GitForkIcon,
  GitPullRequestIcon,
  StarIcon,
  TagIcon,
} from 'lucide-react'
import { LanguageChart } from '@/components/language-chart'
import {
  labelsCountQueryOptions,
  projectsCountQueryOptions,
  repositoryQueryOptions,
  searchCountQueryOptions,
} from '@/lib/github/queries'
import { StatCard } from '@/components/cards/stat-card'

export const Route = createFileRoute('/')({ component: DashboardPage })

function DashboardPage() {
  const repo = useQuery(repositoryQueryOptions())
  const openIssues = useQuery(searchCountQueryOptions('issue', 'open'))
  const closedIssues = useQuery(searchCountQueryOptions('issue', 'closed'))
  const openPRs = useQuery(searchCountQueryOptions('pr', 'open'))
  const closedPRs = useQuery(searchCountQueryOptions('pr', 'closed'))
  const labelsCount = useQuery(labelsCountQueryOptions())
  const projects = useQuery(projectsCountQueryOptions())

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Stars"
          value={repo.data?.stargazers_count}
          icon={StarIcon}
          isLoading={repo.isLoading}
        />
        <StatCard
          title="Forks"
          value={repo.data?.forks_count}
          icon={GitForkIcon}
          isLoading={repo.isLoading}
        />
        <LanguageChart className="sm:col-span-2 lg:col-span-1" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Open Issues"
          value={openIssues.data}
          icon={CircleDotIcon}
          isLoading={openIssues.isLoading}
        />
        <StatCard
          title="Closed Issues"
          value={closedIssues.data}
          icon={CircleDotIcon}
          isLoading={closedIssues.isLoading}
        />
        <StatCard
          title="Open PRs"
          value={openPRs.data}
          icon={GitPullRequestIcon}
          isLoading={openPRs.isLoading}
        />
        <StatCard
          title="Closed PRs"
          value={closedPRs.data}
          icon={GitPullRequestIcon}
          isLoading={closedPRs.isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Labels"
          value={labelsCount.data}
          icon={TagIcon}
          isLoading={labelsCount.isLoading}
        />
        <StatCard
          title="Open Projects"
          value={projects.data}
          icon={FolderKanbanIcon}
          isLoading={projects.isLoading}
        />
      </div>
    </div>
  )
}
