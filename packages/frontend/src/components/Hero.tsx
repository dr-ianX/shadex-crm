import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Hero: React.FC = () => {
  const navigate = useNavigate()
  return (
    <Box 
      sx={{ 
        mb: 4, 
        p: 4, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, rgba(42,166,255,0.08) 0%, rgba(13,74,107,0.08) 100%)',
        border: '1px solid rgba(42,166,255,0.15)',
        boxShadow: '0 8px 32px rgba(42,166,255,0.1)',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(42,166,255,0.2)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 300, 
          mb: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #8ab4f8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 0.5,
        }}
      >
        Bienvenido a SHADEX OS
      </Typography>
      <Typography 
        variant="subtitle1" 
        color="text.secondary" 
        sx={{ mb: 2, fontWeight: 400, lineHeight: 1.6 }}
      >
        Plataforma para gestionar transformaciones arquitectónicas, cotizaciones y proyectos con un flujo claro y seguro.
      </Typography>
      <Button 
        color="secondary" 
        variant="contained" 
        onClick={() => navigate('/quotations/new')}
        sx={{ 
          borderRadius: 2,
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: 0.5,
          px: 4,
          py: 1.2,
          background: 'linear-gradient(135deg, #2aa6ff 0%, #0d4a6b 100%)',
          boxShadow: '0 4px 14px rgba(42,166,255,0.3)',
          transition: 'all 200ms ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #4bb8ff 0%, #1a7399 100%)',
            boxShadow: '0 6px 20px rgba(42,166,255,0.4)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        Crear Cotización
      </Button>
    </Box>
  )
}

export default Hero
