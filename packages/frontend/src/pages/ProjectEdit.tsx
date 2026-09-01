import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

const ProjectEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [clients, setClients] = useState<any[]>([])
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<any>({
    name: '',
    clientId: '',
    location: '',
    city: '',
    description: '',
    need: '',
    product: '',
    status: 'INFO_COMPLETE',
    budget: ''
  })

  useEffect(() => {
    fetchProject()
    fetchClients()
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/v1/projects/${id}`)
      const data = await response.json()
      if (data.success) {
        setProject(data.data)
        setForm({
          name: data.data.name || '',
          clientId: data.data.clientId || '',
          location: data.data.location || '',
          city: data.data.city || '',
          description: data.data.description || '',
          need: data.data.need || '',
          product: data.data.product || '',
          status: data.data.status || 'INFO_COMPLETE',
          budget: data.data.budget || ''
        })
      }
    } catch (err) {
      console.error('Error fetching project:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await apiFetch('/api/v1/clients')
      const data = await response.json()
      if (data.success) setClients(data.data)
    } catch (err) {
      console.error('Error fetching clients:', err)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        budget: form.budget ? parseFloat(form.budget) : undefined
      }
      const response = await fetch(`/api/v1/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      navigate(`/projects/${id}`)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar proyecto')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return
    try {
      const response = await fetch(`/api/v1/projects/${id}`, { method: 'DELETE' })
      if (response.ok) navigate('/projects')
    } catch (err) {
      console.error('Error deleting project:', err)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!project) {
    return <Alert severity="error">Proyecto no encontrado</Alert>
  }

  const statuses = [
    'INFO_COMPLETE', 'QUOTE_PREPARING', 'QUOTED', 'WON', 'IN_INSTALLATION', 'COMPLETED', 'WARRANTY_ACTIVE',
    'NEGOTIATION', 'DEPOSIT_PENDING', 'INSTALLATION_SCHEDULED', 'LIQUIDATION_PENDING'
  ]

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Editar Proyecto
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        {project.name}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Nombre del proyecto" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                  {clients.map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>{c.name} {c.lastName} — {c.companyName || c.email}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ubicación" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ciudad" fullWidth value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Producto / Solución" fullWidth value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Presupuesto estimado" fullWidth type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statuses.map(s => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Necesidad" fullWidth multiline rows={2} value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Descripción" fullWidth multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button color="error" onClick={handleDelete}>
              Eliminar
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button onClick={() => navigate(`/projects/${id}`)}>Cancelar</Button>
              <Button variant="contained" onClick={handleSubmit} disabled={saving || !form.name || !form.clientId}>
                {saving ? <CircularProgress size={24} /> : 'Guardar Cambios'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProjectEdit