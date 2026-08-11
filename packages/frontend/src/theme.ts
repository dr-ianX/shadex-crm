// SHADEX CRM - Moderno Theme con diseño premium
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0d4a6b', // Navy profundo
      light: '#1a7399',
      dark: '#082e42',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2aa6ff', // Cyan brillante
      light: '#5ecfff',
      dark: '#1a8bd8',
      contrastText: '#000000',
    },
    success: {
      main: '#00e676', // Verde vibrante
      light: '#69f0ae',
      dark: '#00c853',
    },
    warning: {
      main: '#ffab00', // Amarillo cálido
      light: '#ffe57f',
      dark: '#ff9100',
    },
    error: {
      main: '#ff5252', // Rojo vibrante
      light: '#ff8a80',
      dark: '#ff3d3d',
    },
    background: {
      default: '#040608', // Negro azulado profundo
      paper: '#070a0f',
    },
    text: {
      primary: '#e8ecef',
      secondary: 'rgba(232,236,239,0.7)',
      disabled: 'rgba(232,236,239,0.3)',
    },
  },
  
  // Tipografía moderna - Inter font
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", sans-serif',
    h1: {
      fontWeight: 300,
      fontSize: '3rem',
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #ffffff 30%, #8ab4f8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 300,
      fontSize: '2.25rem',
      letterSpacing: '-0.015em',
      background: 'linear-gradient(135deg, #ffffff 30%, #8ab4f8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h3: {
      fontWeight: 400,
      fontSize: '1.75rem',
      background: 'linear-gradient(135deg, #ffffff 30%, #8ab4f8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  },
  
  // Componentes con efectos modernos
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(145deg, rgba(20,30,40,0.8) 0%, rgba(7,14,22,0.9) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(42,166,255,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
            borderColor: 'rgba(42,166,255,0.3)',
          },
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.5px',
          padding: '10px 20px',
          transition: 'all 200ms ease',
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(42,166,255,0.25)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0d4a6b 0%, #1a7399 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #0f5a7b 0%, #2083b9 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #2aa6ff 0%, #5ecfff 100%)',
          color: '#001f3f',
          '&:hover': {
            background: 'linear-gradient(135deg, #4bb8ff 0%, #7addff 100%)',
          },
        },
        outlined: {
          border: '1px solid rgba(42,166,255,0.3)',
          color: '#2aa6ff',
          '&:hover': {
            borderColor: '#2aa6ff',
            background: 'rgba(42,166,255,0.08)',
          },
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(180deg, rgba(2,8,14,0.95) 0%, rgba(3,10,18,0.98) 100%)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        },
      },
    },
    
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, rgba(6,18,30,0.98) 0%, rgba(4,12,20,0.95) 100%)',
          backdropFilter: 'blur(8px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'rgba(42,166,255,0.7)',
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
          padding: '6px 12px',
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
          letterSpacing: '0.3px',
        },
      },
    },
    
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(180deg, rgba(10,30,45,0.95) 0%, rgba(7,20,30,0.9) 100%)',
          color: '#e8ecef',
          fontWeight: 600,
          letterSpacing: '0.5px',
        },
      },
    },
    
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& tr': {
            transition: 'background-color 200ms ease',
            '&:hover': {
              backgroundColor: 'rgba(42,166,255,0.08)',
            },
          },
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(42,166,255,0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2aa6ff',
              boxShadow: '0 0 0 3px rgba(42,166,255,0.15)',
            },
          },
        },
      },
    },
    
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'transparent',
        },
      },
    },
  },
  
  shape: {
    borderRadius: 12,
  },
  
  // Animaciones suaves
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.4, 0, 1, 0)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
});

export default theme
