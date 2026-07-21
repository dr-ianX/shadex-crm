import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const Technologies: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, mb: 3 }}>
        Tecnologías
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Módulo de Tecnologías - Catálogo de capacidades de transformación
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Este módulo permitirá gestionar el catálogo completo de tecnologías de SHADEX,
            incluyendo datos técnicos, comerciales y de inventario.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Technologies