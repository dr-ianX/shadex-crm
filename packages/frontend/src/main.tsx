import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.tsx'
import './index.css'
import { CurrencyProvider } from './context/CurrencyContext'

// SHADEX OS Theme - Deep night blue theme (dark mode)
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#041827', // deeper navy
      light: '#0f4a6b',
      dark: '#00121a',
      contrastText: '#e6f7ff',
    },
    secondary: {
      main: '#2aa6ff',
      light: '#67c7ff',
      dark: '#0077c2',
      contrastText: '#021226',
    },
    background: {
      default: '#040a12', // very deep near-black blue
      paper: '#071526',
    },
    text: {
      primary: '#e6f7ff',
      secondary: 'rgba(230,247,255,0.78)',
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 300, fontSize: '2.5rem' },
    h2: { fontWeight: 300, fontSize: '2rem' },
    h3: { fontWeight: 400, fontSize: '1.75rem' },
    h4: { fontWeight: 400, fontSize: '1.5rem' },
    h5: { fontWeight: 500, fontSize: '1.25rem' },
    h6: { fontWeight: 500, fontSize: '1rem' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'linear-gradient(180deg, rgba(20,40,60,0.18), rgba(7,20,30,0.08))',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.03)',
          transition: 'transform 220ms ease, box-shadow 220ms ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 18px 40px rgba(2,8,18,0.6)'
          }
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 700, padding: '8px 14px', transition: 'transform 160ms ease' },
        containedPrimary: { backgroundColor: '#0d3f5a', color: '#e6f7ff', '&:hover': { transform: 'translateY(-2px)' } },
        containedSecondary: { backgroundColor: '#2aa6ff', color: '#021226', '&:hover': { transform: 'translateY(-2px)' } },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(180deg, rgba(2,6,12,0.5), rgba(3,10,18,0.6))',
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid rgba(255,255,255,0.03)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#071526',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: 12,
          padding: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            background: 'rgba(255,255,255,0.02)'
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        hover: {
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' }
        }
      }
    }
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </ThemeProvider>
  </React.StrictMode>,
)