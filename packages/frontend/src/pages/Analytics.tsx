import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material'
import { apiFetch } from '../api'
import { formatCurrency } from '../utils/currency'

const Analytics = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await apiFetch('/api/v1/analytics')
      const result = await res.json()
      if (result.success) setData(result.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const cards = [
    { title: 'Tasa de conversión', value: `${data.conversionRate}%`, color: '#2aa6ff' },
    { title: 'Win rate cotizaciones', value: `${data.winRate}%`, color: '#10b981' },
    { title: 'Cotizado total', value: formatCurrency(data.quotedTotal, 'MXN'), color: '#f59e0b' },
    { title: 'Aceptado total', value: formatCurrency(data.acceptedTotal, 'MXN'), color: '#10b981' },
    { title: 'Ingresos confirmados', value: formatCurrency(data.revenue, 'MXN'), color: '#2e7d32' },
    { title: 'Proyectos activos', value: data.activeProjects, color: '#7c3aed' },
    { title: 'Proyectos completados', value: data.completedProjects, color: '#6b7280' },
    { title: 'Valor inventario', value: formatCurrency(data.inventoryValue, 'MXN'), color: '#0288d1' },
  ]

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Analytics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Métricas de negocio y operación
      </Typography>

      <Grid container spacing={3}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.title}>
            <Card sx={{ borderTop: `4px solid ${c.color}` }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">{c.title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>{c.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Analytics