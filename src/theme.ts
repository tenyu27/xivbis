import { createTheme, rem } from '@mantine/core'

/**
 * All non-prop styling lives here (see AGENTS.md: no custom CSS files, no inline styles).
 */
export const theme = createTheme({
  primaryColor: 'aether',
  primaryShade: { light: 6, dark: 5 },
  fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, sans-serif',
  defaultRadius: 'lg',
  autoContrast: true,
  colors: {
    aether: [
      '#e5fbff',
      '#d1f2f9',
      '#a6e2ef',
      '#77d2e5',
      '#51c4dd',
      '#3abcd8',
      '#28b8d7',
      '#16a1bf',
      '#008fac',
      '#007c98',
    ],
    // Neutral surface ramp used for light-mode backgrounds.
    surface: [
      '#ffffff',
      '#fbfcfd',
      '#f4f6f8',
      '#eceff3',
      '#e2e6ec',
      '#d4dae2',
      '#b9c1cc',
      '#8d97a5',
      '#5f6875',
      '#3b424d',
    ],
  },
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '800',
    sizes: {
      h1: { fontSize: rem(52), lineHeight: '1.05' },
      h2: { fontSize: rem(24), lineHeight: '1.2' },
      h3: { fontSize: rem(18), lineHeight: '1.3' },
    },
  },
  components: {
    Paper: {
      // `variant="toolbar"` is the filter bar: in flow at first, pinned to the
      // top once the page scrolls past it. Nothing else is fixed.
      // Theme styles become inline styles, so the pinned state cannot be a
      // selector here. Toolbar only sets `shadow` once it sticks, so that prop
      // doubles as the pinned flag for the divider.
      styles: (_theme: unknown, props: { variant?: string; shadow?: string }) =>
        props.variant === 'toolbar'
          ? {
              root: {
                position: 'sticky' as const,
                top: 0,
                zIndex: 100,
                borderRadius: 0,
                borderBottom: `1px solid ${
                  props.shadow ? 'var(--mantine-color-default-border)' : 'transparent'
                }`,
              },
            }
          : { root: {} },
    },
    SimpleGrid: {
      styles: {
        root: {
          alignItems: 'start',
        },
      },
    },
    Card: {
      styles: {
        root: {
          transition: 'transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
        },
      },
    },
    Tabs: {
      styles: {
        list: {
          flexWrap: 'nowrap',
        },
        tab: {
          fontWeight: 600,
          transition: 'background-color 120ms ease, color 120ms ease',
        },
      },
    },
    Button: {
      styles: {
        root: {
          transition: 'transform 120ms ease, background-color 120ms ease',
        },
        // Long set names must wrap instead of being clipped mid-word.
        label: {
          whiteSpace: 'normal',
          textAlign: 'left',
          lineHeight: 1.4,
        },
        section: {
          alignSelf: 'center',
        },
      },
    },
    Anchor: {
      defaultProps: { underline: 'hover' },
    },
  },
})
