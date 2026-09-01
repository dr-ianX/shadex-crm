import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { apiFetch } from '../api'

const leadStatuses = [
  { key: 'NEW', label: 'Nuevo', color: '#2aa6ff' },
  { key: 'CONTACTED', label: 'Contactado', color: '#7c3aed' },
  { key: 'QUALIFYING', label: 'Calificando', color: '#f59e0b' },
  { key: 'QUOTED', label: 'Cotizado', color: '#ec4899' },
  { key: 'FOLLOW_UP', label: 'Seguimiento', color: '#ed6c02' },
  { key: 'WON', label: 'Ganado', color: '#10b981' },
  { key: 'LOST', label: 'Perdido', color: '#6b7280' },
]

const LeadBoard = () => {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await apiFetch('/api/v1/leads')
      const data = await res.json()
      if (data.success) setLeads(data.data)
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Tablero de Leads</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/leads/new')}>
          Nuevo Lead
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {leadStatuses.map((status) => {
          const statusLeads = leads.filter((l: any) => l.status === status.key)
          return (
            <Box key={status.key} sx={{ minWidth: 280, maxWidth: 280 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: status.color }}>
                  {status.label}
                </Typography>
                <Chip label={statusLeads.length} size="small" sx={{ background: `${status.color}20`, color: status.color, fontWeight: 600 }} />
              </Box>

              {statusLeads.map((lead: any) => (
                <Card
                  key={lead.id}
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    borderTop: `3px solid ${status.color}`,
                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }
                  }}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {lead.client?.name} {lead.client?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {lead.mainNeed || lead.needs?.join(', ')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {lead.city || lead.location || 'Sin ubicación'}
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              {statusLeads.length === 0 && (
                <Box sx={{ p: 2, background: '#f9fafb', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Sin leads</Typography>
                </Box>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default LeadBoard