import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const Support: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, mb: 3 }}>
        Soporte
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Módulo de Soporte - Gestión de incidencias y garantías
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Control de casos de soporte, garantías, retrabajos y preservación de conocimiento.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Support