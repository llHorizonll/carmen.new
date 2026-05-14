import type { ConnectionStatus, NotificationItem } from './mockData'

type RealtimeHandlers = {
  onStatus: (status: ConnectionStatus) => void
  onEvent: (event: NotificationItem) => void
}

const statusSequence: ConnectionStatus[] = ['live', 'live', 'reconnecting', 'live']

export function startMockRealtime(handlers: RealtimeHandlers) {
  let active = true
  let counter = 0

  const emit = () => {
    if (!active) {
      return
    }

    const nextStatus = statusSequence[counter % statusSequence.length]
    handlers.onStatus(nextStatus)

    const eventType = ['invoice approved', 'journal posted', 'sync completed', 'anomaly detected', 'user mentioned', 'report exported'] as const
    const type = eventType[counter % eventType.length]

    const event: NotificationItem = {
      id: `live-${Date.now()}-${counter}`,
      type,
      title:
        type === 'invoice approved'
          ? 'AP invoice approved'
          : type === 'journal posted'
            ? 'Journal posted'
            : type === 'sync completed'
              ? 'Sync completed'
              : type === 'anomaly detected'
                ? 'Anomaly detected'
                : type === 'user mentioned'
                  ? 'You were mentioned'
                  : 'Report exported',
      message:
        type === 'invoice approved'
          ? 'Invoice approved for payment run.'
          : type === 'journal posted'
            ? 'Journal posted to the GL.'
            : type === 'sync completed'
              ? 'PocketBase sync completed.'
              : type === 'anomaly detected'
                ? 'Hotel revenue anomaly detected.'
                : type === 'user mentioned'
                  ? 'A finance teammate tagged you.'
                  : 'Trial balance export finished.',
      timestamp: new Date().toISOString(),
      read: false,
    }

    handlers.onEvent(event)
    counter += 1
  }

  handlers.onStatus('live')
  const timer = window.setInterval(emit, 4500)
  const boot = window.setTimeout(emit, 1200)

  return () => {
    active = false
    window.clearInterval(timer)
    window.clearTimeout(boot)
  }
}
