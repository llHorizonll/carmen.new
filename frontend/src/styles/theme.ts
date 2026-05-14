import { createTheme, rem } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
  fontFamilyMonospace: '"JetBrains Mono", "IBM Plex Mono", monospace',
  colors: {
    dark: ['#C9D1D9', '#B4BDC6', '#8B949E', '#6E7681', '#484F58', '#30363D', '#21262D', '#161B22', '#0D1117', '#090C10'],
  },
  headings: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    fontWeight: '700',
  },
  other: {
    textWeight: 500,
  },
  components: {
    AppShell: {
      styles: {
        main: {
          background: 'transparent',
        },
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          letterSpacing: rem(0.04),
        },
      },
    },
    Text: {
      defaultProps: {
        fw: 500,
      },
    },
    Card: {
      defaultProps: {
        withBorder: true,
        radius: 'lg',
      },
    },
    Paper: {
      defaultProps: {
        withBorder: true,
        radius: 'lg',
      },
    },
    Table: {
      styles: {
        th: {
          fontSize: rem(12),
          textTransform: 'none',
          letterSpacing: '0.04em',
          fontWeight: 600,
        },
      },
    },
  },
})
