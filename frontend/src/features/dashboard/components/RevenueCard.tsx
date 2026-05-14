import { StatCard } from '../../../components/ui/StatCard'

export function RevenueCard({ value, delta }: { value: string; delta: string }) {
  return <StatCard label="Daily revenue" value={value} delta={delta} trend="up" />
}
