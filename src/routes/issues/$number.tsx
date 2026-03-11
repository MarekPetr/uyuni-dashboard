import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { issueQueryOptions } from '@/lib/github/queries'
import { DetailPageLayout } from '@/components/detail/layout'
import { IssueHeader } from '@/components/detail/issue/header'
import { IssueComments } from '@/components/detail/issue/comments'
import { RATE_LIMITS_EXCEEDED_MESSAGE } from '@/lib/github/errors'

export const Route = createFileRoute('/issues/$number')({
  component: IssueDetailPage,
})

function IssueDetailPage() {
  const { number } = Route.useParams()
  const issueNumber = parseInt(number, 10)

  const {
    data: issue,
    error,
    isLoading,
  } = useQuery(issueQueryOptions(issueNumber))

  const apiError = error as AxiosError | null

  const notFoundMessage =
    apiError?.status === 403 ? RATE_LIMITS_EXCEEDED_MESSAGE : 'Issue not found.'

  return (
    <DetailPageLayout
      backTo="/issues"
      externalUrl={issue?.html_url ?? ''}
      body={issue?.body}
      notFoundMessage={notFoundMessage}
      notFound={!!apiError}
      isLoading={isLoading}
      header={issue && <IssueHeader issue={issue} />}
      footer={
        issue && (
          <IssueComments
            issueNumber={issueNumber}
            totalCount={issue.comments}
          />
        )
      }
    />
  )
}
