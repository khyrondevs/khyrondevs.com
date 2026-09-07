import { cn } from '@/lib/utils'

interface BentoCardProps {
  children: React.ReactNode
  className?: string
  highlight?: boolean // accent border left
  as?: 'div' | 'article' | 'li'
}

export function BentoCard({
  children,
  className,
  highlight = false,
  as: Tag = 'div',
}: BentoCardProps) {
  return (
    <Tag
      className={cn(
        'rounded-lg border border-border bg-elevated p-6 flex flex-col gap-4',
        highlight && 'border-l-2 border-l-accent',
        className
      )}
    >
      {children}
    </Tag>
  )
}
