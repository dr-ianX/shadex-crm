import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

const leadStatuses = [
  { value: 'NEW', label: 'Nuevo', color: '#2aa6ff' },
  { value: 'CONTACTED', label: 'Contactado', color: '#00d4aa' },
  { value: 'DIAGNOSTIC', label: 'Diagnóstico', color: '#7c3aed' },
  { value: 'QUOTED', label: 'Cotizado', color: '#f59e0b' },
  { value: 'NEGOTIATING', label: 'Negociación', color: '#ec4899' },
  { value: 'WON', label: 'Ganado', color: '#10b981' },
  { value: 'LOST', label: 'Perdido', color: '#ef4444' },
]

const Leads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [funnelStats, setFunnelStats] = useState<Record<string, number>>({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchLeads()
    fetchFunnelStats()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await apiFetch('/api/v1/leads')
      const data = await response.json()
      if (data.success) {
        setLeads(data.data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFunnelStats = async () => {
    try {
      const response = await apiFetch('/api/v1/leads/funnel-stats')
      const data = await response.json()
      if (data.success) {
        setFunnelStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching funnel stats:', error)
    }
  }

  const totalLeads = Object.values(funnelStats).reduce((a: number, b: number) => a + b, 0)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Leads & Oportunidades
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Gestión del funnel de ventas
          </Typography>
        </Box>
        <Fab color="primary" onClick={() => navigate('/leads/new')}>
          <AddIcon />
        </Fab>
      </Box>

      {/* Funnel Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {leadStatuses.map((status) => {
          const count = funnelStats[status.value] || 0
          const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={status.value}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(42,166,255,0.05) 0%, rgba(42,166,255,0.02) 100%)',
                border: '1px solid rgba(42,166,255,0.1)'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {status.label}
                    </Typography>
                    <Chip 
                      label={count} 
                      sx={{ 
                        background: status.color,
                        color: 'white',
                        fontWeight: 700
                      }} 
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={percentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        background: status.color
                      }
                    }} 
                  />
                  <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                    {percentage.toFixed(1)}% del total
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Leads List */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Leads Recientes
      </Typography>
      <Grid container spacing={3}>
        {leads.slice(0, 6).map((lead: any) => (
          <Grid item xs={12} md={6} key={lead.id}>
            <Card 
              onClick={() => navigate(`/leads/${lead.id}`)}
              sx={{ 
                cursor: 'pointer',
                transition: 'all 300ms ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(42,166,255,0.1)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {lead.client?.name || 'Sin cliente'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {lead.problemDesc?.substring(0, 50)}...
                    </Typography>
                  </Box>
                  <Chip 
                    label={leadStatuses.find(s => s.value === lead.status)?.label || lead.status}
                    size="small"
                    sx={{ 
                      background: leadStatuses.find(s => s.value === lead.status)?.color || '#gray',
                      color: 'white'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    📍 {lead.city || 'Sin ubicación'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    📞 {lead.client?.phone || 'Sin teléfono'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Lead Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nuevo Lead</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Formulario de creación de leads - Por implementar
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Leads