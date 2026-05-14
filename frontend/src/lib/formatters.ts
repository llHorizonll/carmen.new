import dayjs from 'dayjs'
import type { CurrencyCode } from './mockData'

const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number, currency: CurrencyCode = 'THB') {
  const symbol = currency === 'THB' ? '฿' : '$'
  const absolute = amountFormatter.format(Math.abs(value))
  return `${value < 0 ? '-' : ''}${symbol}${absolute}`
}

export function formatCompactAmount(value: number, currency: CurrencyCode = 'THB') {
  const symbol = currency === 'THB' ? '฿' : '$'
  const absolute = value.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })
  return `${value < 0 ? '-' : ''}${symbol}${absolute}`
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(0)}%`
}

export function formatNumber(value: number) {
  return value.toLocaleString('en-US')
}

export function formatDate(value: string) {
  return dayjs(value).format('DD MMM YYYY')
}

export function formatDateTime(value: string) {
  return dayjs(value).format('DD MMM YYYY HH:mm')
}

export function formatPeriodLabel(value: string) {
  return value.replace('FY', 'FY ')
}

export function formatDifference(value: number, currency: CurrencyCode = 'THB') {
  if (Math.abs(value) < 0.005) {
    return 'Balanced'
  }

  return formatCurrency(value, currency)
}
