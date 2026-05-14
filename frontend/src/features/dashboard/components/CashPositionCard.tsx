import { StatCard } from '../../../components/ui/StatCard'

export function CashPositionCard({ value, delta }: { value: string; delta: string }) {
  return <StatCard label="Cash position" value={value} delta={delta} trend="up" hint="Live liquidity" />
}
