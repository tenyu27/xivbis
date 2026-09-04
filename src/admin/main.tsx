import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { AdminApp } from './AdminApp'
import { theme } from '../theme'
import '@mantine/core/styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <AdminApp />
    </MantineProvider>
  </React.StrictMode>,
)
