import type { MRT_ColumnDef } from 'mantine-react-table'
import type { ReactNode } from 'react'
import { DataTable } from './DataTable'

type FinancialTableProps<TData extends Record<string, unknown>> = {
  data: TData[]
  columns: MRT_ColumnDef<TData>[]
  title?: string
  subtitle?: string
  footer?: ReactNode
  onRowClick?: (row: TData) => void
  toolbarActions?: ReactNode
}

export function FinancialTable<TData extends Record<string, unknown>>(props: FinancialTableProps<TData>) {
  return <DataTable {...props} />
}
