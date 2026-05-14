// @ts-expect-error shim for MRT compatibility
export * from '../../node_modules/@mantine/core/esm/index.mjs'

export function packSx(sx: unknown) {
  if (!sx) {
    return {}
  }

  if (Array.isArray(sx)) {
    return sx.reduce<Record<string, unknown>>((accumulator, item) => {
      const value = packSx(item) as Record<string, unknown>
      return { ...accumulator, ...value }
    }, {})
  }

  if (typeof sx === 'function') {
    try {
      return packSx(sx({ colorScheme: 'dark' } as never))
    } catch {
      return {}
    }
  }

  if (typeof sx === 'object') {
    return sx as Record<string, unknown>
  }

  return {}
}
