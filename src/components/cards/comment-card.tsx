import ReactMarkdown from 'react-markdown'
import type { Comment } from '@/lib/github/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export type CommentCardProps = {
  comment: Comment
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card key={comment.id}>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <img
          src={comment.user.avatar_url}
          alt={comment.user.login}
          className="size-6 rounded-full"
        />
        <span className="text-sm font-medium">{comment.user.login}</span>
        <span className="text-xs text-muted-foreground">
          {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </CardHeader>
      <CardContent className="prose prose-invert max-w-none">
        <ReactMarkdown>{comment.body}</ReactMarkdown>
      </CardContent>
    </Card>
  )
}
