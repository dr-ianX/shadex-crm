// SHADEX OS - Tema oscuro funcional, sobrio y dinámico
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5a7db0',
      light: '#8ab4f8',
      dark: '#3c5a8c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6b7c8e',
      light: '#9aa7b5',
      dark: '#4a5563',
      contrastText: '#ffffff',
    },
    success: {
      main: '#3fcf8f',
      light: '#6ee7b7',
      dark: '#21a667',
    },
    warning: {
      main: '#f2b84d',
      light: '#fcd34d',
      dark: '#d6982a',
    },
    error: {
      main: '#ef6b6b',
      light: '#fca5a5',
      dark: '#c04444',
    },
    background: {
      default: '#0b0d10',
      paper: '#111318',
    },
    text: {
      primary: '#e2e8f0',
      secondary: 'rgba(226,232,240,0.65)',
      disabled: 'rgba(226,232,240,0.35)',
    },
  },

  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.75rem',
      letterSpacing: '-0.02em',
      color: '#e2e8f0',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.015em',
      color: '#e2e8f0',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
      color: '#e2e8f0',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#e2e8f0',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
      color: '#e2e8f0',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.95rem',
      color: '#e2e8f0',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.25px',
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          background: '#14171d',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.05)',
          transition: 'all 220ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            borderColor: 'rgba(90,125,176,0.25)',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.25px',
          padding: '9px 18px',
          transition: 'all 180ms ease',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(90,125,176,0.18)',
          },
        },
        containedPrimary: {
          backgroundColor: '#5a7db0',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#6b8fc4',
          },
        },
        containedSecondary: {
          backgroundColor: '#6b7c8e',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#7d8ea0',
          },
        },
        outlined: {
          border: '1px solid rgba(90,125,176,0.35)',
          color: '#8ab4f8',
          '&:hover': {
            borderColor: 'rgba(90,125,176,0.7)',
            background: 'rgba(90,125,176,0.08)',
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#0d1014',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          boxShadow: 'none',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0f1216',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'rgba(226,232,240,0.6)',
          '&.Mui-selected': {
            color: '#ffffff',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          height: 'auto',
          padding: '4px 10px',
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
          letterSpacing: '0.2px',
          backgroundColor: 'rgba(90,125,176,0.12)',
          color: '#8ab4f8',
          border: '1px solid rgba(90,125,176,0.15)',
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#151920',
          color: '#e2e8f0',
          fontWeight: 600,
          letterSpacing: '0.3px',
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          '& tr': {
            transition: 'background-color 180ms ease',
            '&:hover': {
              backgroundColor: 'rgba(90,125,176,0.05)',
            },
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.03)',
            '& fieldset': {
              border: '1px solid rgba(255,255,255,0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(90,125,176,0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5a7db0',
              boxShadow: '0 0 0 3px rgba(90,125,176,0.12)',
            },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.06)',
          background: '#111318',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111318',
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0b0d10',
        },
      },
    },
  },

  shape: {
    borderRadius: 8,
  },

  transitions: {
    duration: {
      shortest: 120,
      shorter: 180,
      short: 220,
      standard: 280,
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.4, 0, 1, 0)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
})

export default theme
