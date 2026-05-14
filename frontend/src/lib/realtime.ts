import { isPocketBaseConfigured, getPocketBaseClient } from './pocketbase'
import type { ConnectionStatus, NotificationItem } from './mockData'

type RealtimeHandlers = {
  onStatus: (status: ConnectionStatus) => void
  onEvent: (event: NotificationItem) => void
}

const statusSequence: ConnectionStatus[] = ['live', 'live', 'reconnecting', 'live']

function createMockStream(handlers: RealtimeHandlers) {
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

function createPocketBaseStream(handlers: RealtimeHandlers) {
  const pb = getPocketBaseClient()
  if (!pb) {
    return createMockStream(handlers)
  }

  let active = true
  handlers.onStatus('live')

  const subscribe = async () => {
    try {
      await pb.collection('notifications').subscribe('*', (event) => {
        if (!active) {
          return
        }

        const record = event.record as Record<string, unknown>
        handlers.onEvent({
          id: String(record.id ?? `pb-${Date.now()}`),
          type: (record.type as NotificationItem['type']) ?? 'sync completed',
          title: String(record.title ?? 'Realtime update'),
          message: String(record.message ?? 'PocketBase realtime event received.'),
          timestamp: String(record.timestamp ?? new Date().toISOString()),
          read: Boolean(record.read ?? false),
        })
      })
    } catch {
      handlers.onStatus('offline')
    }
  }

  void subscribe()

  return () => {
    active = false
    void pb.collection('notifications').unsubscribe('*')
  }
}

export function startMockRealtime(handlers: RealtimeHandlers) {
  return isPocketBaseConfigured() ? createPocketBaseStream(handlers) : createMockStream(handlers)
}
