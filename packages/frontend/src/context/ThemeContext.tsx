import { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { createTheme } from '@mui/material/styles'

interface ThemeContextType {
  mode: 'dark' | 'light'
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType>({ mode: 'dark', toggleMode: () => {} })

export const useThemeMode = () => useContext(ThemeContext)

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#041827', light: '#0f4a6b', dark: '#00121a', contrastText: '#e6f7ff' },
    secondary: { main: '#2aa6ff', light: '#67c7ff', dark: '#0077c2', contrastText: '#021226' },
    background: { default: '#040a12', paper: '#071526' },
    text: { primary: '#e6f7ff', secondary: 'rgba(230,247,255,0.78)' }
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }
})

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0f4a6b', light: '#2aa6ff', dark: '#041827', contrastText: '#fff' },
    secondary: { main: '#2aa6ff', light: '#67c7ff', dark: '#0077c2', contrastText: '#fff' },
    background: { default: '#f5f7fa', paper: '#fff' },
    text: { primary: '#1a1a1a', secondary: '#666' }
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }
})

export const themes = { dark: darkTheme, light: lightTheme }

export const ThemeModeProvider = ({ children, value }: { children: ReactNode, value?: { mode: 'dark' | 'light', toggleMode: () => void } }) => {
  const [mode, setMode] = useState<'dark' | 'light'>('dark')
  const context = useMemo(() => ({
    mode,
    toggleMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }), [mode])
  return (
    <ThemeContext.Provider value={value || context}>
      {children}
    </ThemeContext.Provider>
  )
}