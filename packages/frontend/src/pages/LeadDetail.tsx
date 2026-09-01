import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

const leadStatusLabels: Record<string, string> = {
  'NEW': 'Nuevo',
  'CONTACTED': 'Contactado',
  'QUALIFYING': 'Calificando',
  'INFO_PENDING': 'Información pendiente',
  'PHOTOS_PENDING': 'Fotos pendientes',
  'MEASURES_PENDING': 'Medidas pendientes',
  'INFO_COMPLETE': 'Información completa',
  'SOLUTION_DEFINED': 'Solución definida',
  'QUOTE_PREPARING': 'Preparando cotización',
  'QUOTED': 'Cotizado',
  'FOLLOW_UP': 'Seguimiento',
  'APPOINTMENT_SCHEDULED': 'Cita programada',
  'NEGOTIATION': 'Negociación',
  'DEPOSIT_PENDING': 'Anticipo pendiente',
  'WON': 'Ganado',
  'LOST': 'Perdido',
  'NURTURE': 'Nutrir / Futuro'
}

const LeadDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectStatus, setProjectStatus] = useState('INFO_COMPLETE')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLead()
  }, [id])

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/v1/leads/${id}`)
      const data = await response.json()
      if (data.success) {
        setLead(data.data)
        if (data.data.project) {
          setProjectName(data.data.project.name)
        }
      }
    } catch (err) {
      console.error('Error fetching lead:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    setCreating(true)
    setError('')

    try {
      const projectPayload = {
        name: projectName,
        leadId: lead.id,
        clientId: lead.clientId,
        location: lead.location || lead.client?.address || 'Pendiente',
        city: lead.city || lead.client?.city,
        description: projectDescription || lead.problemDesc,
        need: lead.mainNeed,
        product: lead.interestProduct,
        status: projectStatus,
        budget: lead.budget
      }

      const res = await apiFetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload)
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      navigate(`/projects/${data.data.id}`)
    } catch (err: any) {
      setError(err.message || 'Error al crear proyecto')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!lead) {
    return <Alert severity="error">Lead no encontrado</Alert>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Lead
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {lead.client?.name} {lead.client?.lastName}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          disabled={!!lead.project}
        >
          {lead.project ? 'Ya tiene proyecto' : 'Convertir en Proyecto'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Información del lead
                </Typography>
                <Chip
                  label={leadStatusLabels[lead.status] || lead.status}
                  sx={{
                    background: 'rgba(42,166,255,0.1)',
                    color: '#2aa6ff',
                    fontWeight: 600
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Cliente</Typography>
                  <Typography variant="body1">
                    {lead.client?.name} {lead.client?.lastName}
                    {lead.client?.companyName ? ` (${lead.client.companyName})` : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Teléfono</Typography>
                  <Typography variant="body1">{lead.client?.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
                  <Typography variant="body1">{lead.location || 'Pendiente'} {lead.city ? `- ${lead.city}` : ''}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Canal</Typography>
                  <Typography variant="body1">{lead.channel}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Situación a resolver</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
                    {lead.needs?.map((need: string) => (
                      <Chip key={need} label={need} size="small" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Descripción del problema</Typography>
                  <Typography variant="body1">{lead.problemDesc || 'Sin descripción'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Presupuesto</Typography>
                  <Typography variant="body1">{lead.budget ? `$${lead.budget.toLocaleString('es-MX')}` : 'No indicado'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Urgencia</Typography>
                  <Typography variant="body1">{lead.urgency}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Notas</Typography>
                  <Typography variant="body1">{lead.notes || 'Sin notas'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Acciones
              </Typography>
              <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => navigate('/leads')}>
                Volver a leads
              </Button>
              {lead.project && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Este lead ya fue convertido en el proyecto: <strong>{lead.project.name}</strong>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Proyecto desde Lead</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            label="Nombre del proyecto"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ej. Residencia Rodríguez — SmartFilm Sala"
          />
          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Estado inicial</InputLabel>
            <Select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
              <MenuItem value="INFO_COMPLETE">Información completa</MenuItem>
              <MenuItem value="QUOTE_PREPARING">Preparando cotización</MenuItem>
              <MenuItem value="QUOTED">Cotizado</MenuItem>
              <MenuItem value="WON">Ganado</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateProject} variant="contained" disabled={creating || !projectName}>
            {creating ? <CircularProgress size={24} /> : 'Crear Proyecto'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default LeadDetail