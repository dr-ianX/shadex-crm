import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Fab,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

const typeLabels: Record<string, string> = {
  'CALL': 'Llamada',
  'VIDEO_CALL': 'Videollamada',
  'SURVEY': 'Levantamiento',
  'VISIT': 'Visita',
  'SMARTFILM_DEMO': 'Demo SmartFilm',
  'INSTALLATION': 'Instalación',
  'DELIVERY': 'Entrega',
  'FOLLOW_UP': 'Seguimiento',
  'WARRANTY': 'Garantía'
}

const statusLabels: Record<string, string> = {
  'SCHEDULED': 'Programada',
  'CONFIRMED': 'Confirmada',
  'COMPLETED': 'Completada',
  'CANCELLED': 'Cancelada',
  'NO_SHOW': 'No asistió',
  'RESCHEDULED': 'Reprogramada'
}

const statusColors: Record<string, string> = {
  'SCHEDULED': '#2aa6ff',
  'CONFIRMED': '#10b981',
  'COMPLETED': '#7c3aed',
  'CANCELLED': '#ef4444',
  'NO_SHOW': '#6b7280',
  'RESCHEDULED': '#f59e0b'
}

const Agenda = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await apiFetch('/api/v1/appointments')
      const data = await response.json()
      if (data.success) setAppointments(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/v1/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchAppointments()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta cita?')) return
    try {
      await fetch(`/api/v1/appointments/${id}`, { method: 'DELETE' })
      fetchAppointments()
    } catch (err) {
      console.error(err)
    }
  }

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
            Agenda
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Citas, visitas y seguimientos
          </Typography>
        </Box>
        <Fab color="primary" onClick={() => navigate('/agenda/new')}>
          <AddIcon />
        </Fab>
      </Box>

      <Grid container spacing={3}>
        {appointments.map((a: any) => (
          <Grid item xs={12} md={6} key={a.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {typeLabels[a.type] || a.type}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {new Date(a.date).toLocaleString('es-MX')}
                    </Typography>
                  </Box>
                  <Chip
                    label={statusLabels[a.status] || a.status}
                    sx={{
                      background: `${statusColors[a.status] || '#2aa6ff'}20`,
                      color: statusColors[a.status] || '#2aa6ff',
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {a.client?.name} {a.client?.lastName} {a.project ? `• ${a.project.name}` : ''}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    📍 {a.location || 'Pendiente'}
                  </Typography>
                  {a.duration && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      ⏱ {a.duration} min
                    </Typography>
                  )}
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {a.notes || 'Sin notas'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {a.status !== 'COMPLETED' && a.status !== 'CANCELLED' && (
                    <Button size="small" variant="outlined" onClick={() => handleStatus(a.id, 'COMPLETED')}>
                      Completar
                    </Button>
                  )}
                  {a.status !== 'CANCELLED' && (
                    <Button size="small" variant="outlined" color="error" onClick={() => handleStatus(a.id, 'CANCELLED')}>
                      Cancelar
                    </Button>
                  )}
                  <Button size="small" variant="text" color="error" onClick={() => handleDelete(a.id)}>
                    Eliminar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {appointments.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Sin citas programadas
          </Typography>
          <Button variant="contained" onClick={() => navigate('/agenda/new')}>
            Crear primera cita
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Agenda