import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { pullRequestQueryOptions } from '@/lib/github/queries'
import { DetailPage } from '@/components/detail-page'
import { PullRequestHeader } from '@/components/detail-page/pull-header'

export const Route = createFileRoute('/pulls/$number')({
  component: PullRequestDetailPage,
})

function PullRequestDetailPage() {
  const { number } = Route.useParams()
  const prNumber = parseInt(number, 10)

  const { data: pr, isLoading } = useQuery(pullRequestQueryOptions(prNumber))

  return (
    <DetailPage
      backTo="/pulls"
      externalUrl={pr?.html_url ?? ''}
      body={pr?.body}
      notFoundMessage="Pull request not found."
      isLoading={isLoading}
      header={pr && <PullRequestHeader pr={pr} />}
    />
  )
}