import type { CardProps } from '@mantine/core'
import { Card } from '@mantine/core'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type PremiumCardProps = CardProps & {
  children: ReactNode
}

export function PremiumCard({ children, className, ...props }: PremiumCardProps) {
  return (
    <Card
      {...props}
      className={['premium-card', className].filter(Boolean).join(' ')}
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </Card>
  )
}
