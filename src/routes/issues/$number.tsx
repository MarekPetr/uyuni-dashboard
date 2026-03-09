import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { issueQueryOptions } from '@/lib/github/queries'
import { DetailPageLayout } from '@/components/detail/layout'
import { IssueHeader } from '@/components/detail/issue/header'
import { IssueComments } from '@/components/detail/issue/comments'

export const Route = createFileRoute('/issues/$number')({
  component: IssueDetailPage,
})

function IssueDetailPage() {
  const { number } = Route.useParams()
  const issueNumber = parseInt(number, 10)

  const { data: issue, isLoading } = useQuery(issueQueryOptions(issueNumber))

  return (
    <DetailPageLayout
      backTo="/issues"
      externalUrl={issue?.html_url ?? ''}
      body={issue?.body}
      notFoundMessage="Issue not found."
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
