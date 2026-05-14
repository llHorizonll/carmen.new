import { createTheme, rem } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
  headings: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    fontWeight: '700',
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
          letterSpacing: rem(0.1),
        },
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
          fontSize: rem(11),
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 700,
        },
      },
    },
  },
})
