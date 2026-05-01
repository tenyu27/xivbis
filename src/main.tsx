import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider, createTheme, rem } from '@mantine/core'
import App from './App'
import '@mantine/core/styles.css'

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { 
        fontSize: rem(40),
        lineHeight: '1.2',
      }
    }
  },
  colors: {
    // Customizing the gray palette or adding a custom background color
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
