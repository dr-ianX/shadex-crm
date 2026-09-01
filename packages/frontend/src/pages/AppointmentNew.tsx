import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material'

const types = [
  { value: 'CALL', label: 'Llamada' },
  { value: 'VIDEO_CALL', label: 'Videollamada' },
  { value: 'SURVEY', label: 'Levantamiento' },
  { value: 'VISIT', label: 'Visita' },
  { value: 'SMARTFILM_DEMO', label: 'Demo SmartFilm' },
  { value: 'INSTALLATION', label: 'Instalación' },
  { value: 'DELIVERY', label: 'Entrega' },
  { value: 'FOLLOW_UP', label: 'Seguimiento' },
  { value: 'WARRANTY', label: 'Garantía' }
]

const AppointmentNew = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<any>({
    clientId: '',
    projectId: '',
    type: 'VISIT',
    date: new Date().toISOString().slice(0, 16),
    duration: 60,
    location: '',
    notes: '',
    status: 'SCHEDULED'
  })

  useEffect(() => {
    fetchClients()
    fetchProjects()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await apiFetch('/api/v1/clients')
      const data = await res.json()
      if (data.success) setClients(data.data)
    } catch (err) { console.error(err) }
  }

  const fetchProjects = async () => {
    try {
      const res = await apiFetch('/api/v1/projects')
      const data = await res.json()
      if (data.success) setProjects(data.data)
    } catch (err) { console.error(err) }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        duration: parseInt(form.duration),
        date: new Date(form.date).toISOString()
      }
      const res = await apiFetch('/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      navigate('/agenda')
    } catch (err: any) {
      setError(err.message || 'Error al crear cita')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Nueva Cita
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Programar visita, llamada o seguimiento
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {types.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Fecha y hora" fullWidth type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Duración (min)" fullWidth type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ubicación" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                  {clients.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.name} {c.lastName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Proyecto (opcional)</InputLabel>
                <Select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                  {projects.map((p: any) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Notas" fullWidth multiline rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button onClick={() => navigate('/agenda')}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading || !form.clientId}>
              {loading ? <CircularProgress size={24} /> : 'Crear Cita'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AppointmentNew