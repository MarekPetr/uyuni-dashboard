import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { pullRequestQueryOptions } from '@/lib/github/queries'
import { DetailPageLayout } from '@/components/detail/layout'
import { PullRequestHeader } from '@/components/detail/pull-header'
import { RATE_LIMITS_EXCEEDED_MESSAGE } from '@/lib/github/errors'

export const Route = createFileRoute('/pulls/$number')({
  component: PullRequestDetailPage,
})

function PullRequestDetailPage() {
  const { number } = Route.useParams()
  const prNumber = parseInt(number, 10)

  const {
    data: pr,
    error,
    isLoading,
  } = useQuery(pullRequestQueryOptions(prNumber))

  const apiError = error as AxiosError | null

  const notFoundMessage =
    apiError?.status === 403
      ? RATE_LIMITS_EXCEEDED_MESSAGE
      : 'Pull request not found.'

  return (
    <DetailPageLayout
      backTo="/pulls"
      externalUrl={pr?.html_url ?? ''}
      body={pr?.body}
      notFound={!!apiError}
      notFoundMessage={notFoundMessage}
      isLoading={isLoading}
      header={pr && <PullRequestHeader pr={pr} />}
    />
  )
}
