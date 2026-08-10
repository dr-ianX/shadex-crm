import React from 'react'
import { Box, Typography, Button } from '@mui/material'

const Hero: React.FC = () => {
  return (
    <Box sx={{ mb: 4, p: 4, borderRadius: 2, background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}>
      <Typography variant="h3" sx={{ fontWeight: 300, mb: 1 }}>
        Bienvenido a SHADEX OS
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        Plataforma para gestionar transformaciones arquitectónicas, cotizaciones y proyectos con un flujo claro y seguro.
      </Typography>
      <Button color="secondary" variant="contained" sx={{ borderRadius: 8 }}>Crear Cotización</Button>
    </Box>
  )
}

export default Hero
