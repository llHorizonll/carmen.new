import { Badge } from '@mantine/core'

type StatusBadgeProps = {
  value: string
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const color =
    value === 'Posted' || value === 'Approved' || value === 'Active' || value === 'Collected' || value === 'Success'
      ? 'teal'
      : value === 'Pending' || value === 'Pending Approval' || value === 'Draft' || value === 'Open' || value === 'Review'
        ? 'yellow'
        : value === 'Overdue' || value === 'Blocked' || value === 'Failed' || value === 'Escalated'
          ? 'red'
          : 'gray'

  return (
    <Badge variant="light" color={color} tt="none" className="status-badge">
      {value}
    </Badge>
  )
}
