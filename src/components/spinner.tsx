import { LoaderIcon } from 'lucide-react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

const spinnerVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      sm: 'size-5',
      md: 'size-6',
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

type SpinnerProps = VariantProps<typeof spinnerVariants>

export function Spinner({ size }: SpinnerProps) {
  return <LoaderIcon className={spinnerVariants({ size })} />
}
