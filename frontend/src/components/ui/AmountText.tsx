import { Text } from '@mantine/core'

type AmountTextProps = {
  value: string
  align?: 'left' | 'right'
  tone?: 'default' | 'positive' | 'negative'
  size?: string
}

export function AmountText({ value, align = 'right', tone = 'default', size = 'sm' }: AmountTextProps) {
  return (
    <Text
      component="span"
      ta={align}
      fw={600}
      size={size}
      className={[
        'mono',
        'fin-number',
        tone === 'negative' ? 'amount-negative' : '',
        tone === 'positive' ? 'amount-positive' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {value}
    </Text>
  )
}
