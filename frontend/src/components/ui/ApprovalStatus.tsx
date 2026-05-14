import { Badge } from '@mantine/core'

type ApprovalStatusProps = {
  value: string
}

export function ApprovalStatus({ value }: ApprovalStatusProps) {
  const color = value === 'Approved' || value === 'Posted' ? 'teal' : value === 'Pending' ? 'yellow' : value === 'Escalated' ? 'red' : 'gray'

  return (
    <Badge color={color} variant="light" tt="none">
      {value}
    </Badge>
  )
}
