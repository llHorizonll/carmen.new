import { Box, Group, Pagination, ScrollArea, Table, Text, TextInput } from '@mantine/core'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { PremiumCard } from '../ui/PremiumCard'

type ColumnSubset<TData extends Record<string, unknown>> = Pick<
  MRT_ColumnDef<TData>,
  'accessorKey' | 'header' | 'Cell' | 'mantineTableBodyCellProps' | 'size'
>

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

function getCellValue<TData extends Record<string, unknown>>(row: TData, key?: keyof TData & string) {
  if (!key) {
    return undefined
  }

  return row[key]
}

function asColumnSubset<TData extends Record<string, unknown>>(column: MRT_ColumnDef<TData>) {
  return column as ColumnSubset<TData>
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
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return data
    }

    const query = search.trim().toLowerCase()
    return data.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(query)))
  }, [data, search])

  const pageCount = Math.max(1, Math.ceil(filteredData.length / initialPageSize))
  const safePage = Math.min(page, pageCount)
  const pageData = filteredData.slice((safePage - 1) * initialPageSize, safePage * initialPageSize)

  return (
    <Box>
      <PremiumCard p="md" className="table-paper glass-border">
        <Group justify="space-between" align="flex-start" mb="sm" wrap="wrap">
          <Box>
            {title ? <Text className="ui-label" c="rgba(255,255,255,.82)" fw={700}>{title}</Text> : null}
            {subtitle ? (
              <Text size="xs" c="rgba(255,255,255,.72)">
                {subtitle}
              </Text>
            ) : null}
          </Box>
          <Group gap="sm" wrap="wrap">
            <TextInput placeholder="Search" value={search} onChange={(event) => setSearch(event.currentTarget.value)} size="xs" />
            {toolbarActions ? <Box>{toolbarActions}</Box> : null}
          </Group>
        </Group>

        <ScrollArea className="subtle-scroll" style={{ maxHeight: 760 }}>
          <Table highlightOnHover className="financial-table">
            <Table.Thead>
              <Table.Tr>
                {columns.map((column, index) => {
                  const col = asColumnSubset(column)
                  const cellProps = typeof col.mantineTableBodyCellProps === 'function' ? undefined : col.mantineTableBodyCellProps

                  return (
                  <Table.Th key={column.accessorKey ?? index} style={{ minWidth: col.size ?? 120, textAlign: cellProps?.align ?? 'left' }}>
                    {col.header ?? ''}
                  </Table.Th>
                  )
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pageData.map((row, rowIndex) => (
                <Table.Tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                {columns.map((column, colIndex) => {
                    const col = asColumnSubset(column)
                    const cellProps = typeof col.mantineTableBodyCellProps === 'function' ? undefined : col.mantineTableBodyCellProps
                    const value = getCellValue(row, col.accessorKey as keyof TData & string | undefined)
                    const cell = {
                      getValue: <TValue = unknown>() => value as TValue,
                    }

                    return (
                      <Table.Td key={col.accessorKey ?? colIndex} style={{ textAlign: cellProps?.align ?? 'left' }}>
                        {col.Cell ? col.Cell({ cell, row: { original: row } } as never) : String(value ?? '')}
                      </Table.Td>
                    )
                  })}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Group justify="space-between" mt="sm" wrap="wrap">
          <Text size="sm" c="dimmed">
            {filteredData.length} records
          </Text>
          <Pagination value={safePage} onChange={setPage} total={pageCount} />
        </Group>
      </PremiumCard>

      {footer ? (
        <PremiumCard p="md" className="table-footer mt-3">
          {footer}
        </PremiumCard>
      ) : null}
    </Box>
  )
}
