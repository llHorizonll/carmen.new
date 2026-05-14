import { Box, Group, Stack, Text } from '@mantine/core'
import {
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
  useMantineReactTable,
} from 'mantine-react-table'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { PremiumCard } from '../ui/PremiumCard'

export type DataTableProps<TData extends Record<string, unknown>> = {
  data: TData[]
  columns: MRT_ColumnDef<TData>[]
  title?: string
  subtitle?: string
  onRowClick?: (row: TData) => void
  toolbarActions?: ReactNode
  footer?: ReactNode
  initialPageSize?: number
}

export function DataTable<TData extends Record<string, unknown>>({
  data,
  columns,
  title,
  subtitle,
  onRowClick,
  toolbarActions,
  footer,
  initialPageSize = 10,
}: DataTableProps<TData>) {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })
  const [sorting, setSorting] = useState<MRT_SortingState>([])

  const table = useMantineReactTable({
    columns,
    data,
    enableColumnFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: true,
    enablePagination: true,
    enableStickyHeader: true,
    enableColumnActions: false,
    enableGlobalFilter: true,
    manualPagination: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
      showColumnFilters: true,
      showGlobalFilter: true,
    },
    initialState: {
      density: 'xs',
      showGlobalFilter: true,
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
    mantineTableProps: {
      className: 'financial-table',
      highlightOnHover: true,
      striped: false,
    },
    mantinePaperProps: {
      withBorder: true,
      radius: 'lg',
      className: 'table-paper glass-border',
    },
    mantineTableContainerProps: {
      className: 'subtle-scroll',
      style: { maxHeight: 760 },
    },
    mantineTopToolbarProps: {
      className: 'table-toolbar',
    },
    renderTopToolbarCustomActions: () => (
      <Group justify="space-between" style={{ width: '100%' }}>
        {title ? (
          <Stack gap={2}>
            <Text fw={700}>{title}</Text>
            {subtitle ? <Text size="xs" c="dimmed">{subtitle}</Text> : null}
          </Stack>
        ) : (
          <span />
        )}
        {toolbarActions ? <Box>{toolbarActions}</Box> : null}
      </Group>
    ),
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => onRowClick?.(row.original),
      style: {
        cursor: onRowClick ? 'pointer' : 'default',
      },
    }),
  })

  return (
    <Stack gap="sm">
      <MantineReactTable table={table} />
      {footer ? (
        <PremiumCard p="md" className="table-footer">
          {footer}
        </PremiumCard>
      ) : null}
    </Stack>
  )
}
