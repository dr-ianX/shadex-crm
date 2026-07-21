import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const Finance: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, mb: 3 }}>
        Finanzas
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Módulo de Finanzas - Gestión de flujo de caja
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Control de anticipos, abonos, liquidaciones y saldos pendientes por transformación.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Finance