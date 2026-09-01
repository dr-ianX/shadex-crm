import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.tsx'
import './index.css'
import { CurrencyProvider } from './context/CurrencyContext'
import { ThemeModeProvider, useThemeMode, themes } from './context/ThemeContext'

const ThemedApp = () => {
  const { mode } = useThemeMode()
  return (
    <ThemeProvider theme={themes[mode]}>
      <CssBaseline />
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <ThemedApp />
    </ThemeModeProvider>
  </React.StrictMode>,
)
