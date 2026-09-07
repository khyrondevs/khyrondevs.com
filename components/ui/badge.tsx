import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full text-xs font-mono tracking-wider uppercase px-3 py-1',
  {
    variants: {
      variant: {
        accent: 'bg-accent/10 text-accent border border-accent/20',
        muted: 'bg-elevated text-fg-muted border border-border',
        outline: 'border border-border text-fg-subtle',
      },
    },
    defaultVariants: { variant: 'muted' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
