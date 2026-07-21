import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

const Suppliers: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, mb: 3 }}>
        Proveedores
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Módulo de Proveedores - Gestión de suministradores
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Gestión de proveedores de tecnologías, evaluaciones de desempeño y portal de proveedores.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Suppliers