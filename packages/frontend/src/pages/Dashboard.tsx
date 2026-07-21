import React from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
} from '@mui/material'
import {
  Architecture as TransformationIcon,
  TrendingUp as RevenueIcon,
  Pending as PendingIcon,
  CheckCircle as CompletedIcon,
  Warning as AlertIcon,
} from '@mui/icons-material'
import type { ChipProps } from '@mui/material'

const Dashboard: React.FC = () => {
  // Mock data - will be replaced with API calls
  const stats = [
    {
      title: 'Transformaciones Activas',
      value: 24,
      icon: <TransformationIcon />,
      color: '#1a237e',
      change: '+12%',
    },
    {
      title: 'Ingresos del Mes',
      value: '$1,250,000',
      icon: <RevenueIcon />,
      color: '#2e7d32',
      change: '+8%',
    },
    {
      title: 'Pendientes de Cobro',
      value: 8,
      icon: <PendingIcon />,
      color: '#ed6c02',
      change: '-2',
    },
    {
      title: 'Completadas este Mes',
      value: 15,
      icon: <CompletedIcon />,
      color: '#0288d1',
      change: '+5',
    },
  ]

  const recentTransformations = [
    {
      id: 1,
      folio: 'TRANS-2024-0045',
      name: 'Torre Mayor - Pisos 15-20',
      client: 'Corporativo ABC',
      status: 'Instalación',
      priority: 'Alta',
      progress: 75,
    },
    {
      id: 2,
      folio: 'TRANS-2024-0046',
      name: 'Residencial Las Lomas',
      client: 'Carlos Martínez',
      status: 'Cotización',
      priority: 'Media',
      progress: 30,
    },
    {
      id: 3,
      folio: 'TRANS-2024-0047',
      name: 'Hospital Central',
      client: 'Salud MX',
      status: 'Levantamiento',
      priority: 'Alta',
      progress: 15,
    },
    {
      id: 4,
      folio: 'TRANS-2024-0048',
      name: 'Oficinas Polanco',
      client: 'Tech Solutions',
      status: 'Diseño',
      priority: 'Media',
      progress: 50,
    },
  ]

  const alerts = [
    {
      type: 'Inventario',
      message: 'Stock bajo: 3M Prestige Series 70',
      severity: 'warning',
    },
    {
      type: 'Soporte',
      message: 'Caso crítico: Burbujas Torre Mayor',
      severity: 'error',
    },
    {
      type: 'Finanzas',
      message: 'Pago vencido: Residencial Las Lomas',
      severity: 'warning',
    },
  ]

  const getStatusColor = (status: string): ChipProps['color'] => {
    switch (status) {
      case 'Instalación':
        return 'success'
      case 'Cotización':
        return 'info'
      case 'Levantamiento':
        return 'warning'
      case 'Diseño':
        return 'primary'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority: string): ChipProps['color'] => {
    switch (priority) {
      case 'Alta':
        return 'error'
      case 'Media':
        return 'warning'
      case 'Baja':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                height: '100%',
                borderTop: `4px solid ${stat.color}`,
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      backgroundColor: stat.change.startsWith('+') ? '#e8f5e9' : '#ffebee',
                      color: stat.change.startsWith('+') ? '#2e7d32' : '#c62828',
                    }}
                  />
                </Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Transformations */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Transformaciones Recientes
              </Typography>
              {recentTransformations.map((transformation) => (
                <Box
                  key={transformation.id}
                  sx={{
                    py: 2,
                    borderBottom: '1px solid #e0e0e0',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {transformation.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={transformation.status}
                        size="small"
                        color={getStatusColor(transformation.status)}
                      />
                      <Chip
                        label={transformation.priority}
                        size="small"
                        color={getPriorityColor(transformation.priority)}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {transformation.folio} • {transformation.client}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transformation.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={transformation.progress}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Alertas
              </Typography>
              {alerts.map((alert, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    py: 2,
                    borderBottom: index < alerts.length - 1 ? '1px solid #e0e0e0' : 'none',
                  }}
                >
                  <AlertIcon
                    sx={{
                      color:
                        alert.severity === 'error'
                          ? '#d32f2f'
                          : alert.severity === 'warning'
                          ? '#ed6c02'
                          : '#1976d2',
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {alert.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {alert.message}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard