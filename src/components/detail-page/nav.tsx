import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, ExternalLinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface DetailPageNavProps {
  backTo: string
  externalUrl: string
}

export function DetailPageNav({ backTo, externalUrl }: DetailPageNavProps) {
  return (
    <div className="flex items-center gap-2">
      <Link to={backTo}>
        <Button variant="ghost" size="sm">
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>
      </Link>
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto text-sm text-muted-foreground hover:text-foreground"
      >
        <ExternalLinkIcon className="inline size-3" /> View on GitHub
      </a>
    </div>
  )
}
