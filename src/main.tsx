import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider, createTheme, rem } from '@mantine/core'
import App from './App'
import '@mantine/core/styles.css'

const theme = createTheme({
  primaryColor: 'cyan',
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '800',
    sizes: {
      h1: { 
        fontSize: rem(40),
        lineHeight: '1.2',
      }
    }
  },
  components: {
    Accordion: {
      defaultProps: {
        variant: 'separated',
        radius: 'md',
      },
      styles: {
        item: {
          border: '1px solid transparent',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&[data-active]': {
            transform: 'scale(1.01)',
          }
        }
      }
    },
    Button: {
      defaultProps: {
        radius: 'md',
      }
    },
    Select: {
      defaultProps: {
        radius: 'md',
      }
    }
  },
  colors: {
    'off-white': ['#fafafa', '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121'],
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <App />
    </MantineProvider>
  </React.StrictMode>,
)
