import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const Inventory: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, mb: 3 }}>
        Inventario
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Módulo de Inventario - Control de materiales y tecnologías
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Control de rollos, metros lineales, consumo por proyecto y gestión de stock.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Inventory