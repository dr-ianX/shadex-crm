import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material'

const InstallationNew = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId')

  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<any>({
    projectId: projectId || '',
    clientId: '',
    installerId: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    product: '',
    areas: '',
    measures: '',
    materialReserved: '',
    tools: '',
    observations: ''
  })

  useEffect(() => {
    if (projectId) fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/v1/projects/${projectId}`)
      const data = await response.json()
      if (data.success) {
        setProject(data.data)
        setForm((prev: any) => ({
          ...prev,
          projectId: data.data.id,
          clientId: data.data.clientId,
          location: data.data.location,
          product: data.data.product,
          areas: data.data.spaces?.map((s: any) => s.name).join('\n')
        }))
      }
    } catch (err) {
      console.error('Error fetching project:', err)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...form,
        date: new Date(form.date).toISOString()
      }

      const response = await apiFetch('/api/v1/installations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      navigate('/installations')
    } catch (err: any) {
      setError(err.message || 'Error al programar instalación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Programar Instalación
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        {project ? `Orden de trabajo para ${project.name}` : 'Crear orden de trabajo'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField label="Instalador" fullWidth value={form.installerId} onChange={(e) => setForm({ ...form, installerId: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Fecha de instalación" fullWidth type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Ubicación" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Producto / Solución" fullWidth value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Áreas" fullWidth multiline rows={3} value={form.areas} onChange={(e) => setForm({ ...form, areas: e.target.value })} placeholder="Ventanal sala 01, Puerta entrada, etc." />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Medidas" fullWidth multiline rows={3} value={form.measures} onChange={(e) => setForm({ ...form, measures: e.target.value })} placeholder="Ancho x Alto por área" />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Material reservado" fullWidth multiline rows={2} value={form.materialReserved} onChange={(e) => setForm({ ...form, materialReserved: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Herramientas" fullWidth value={form.tools} onChange={(e) => setForm({ ...form, tools: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Observaciones" fullWidth multiline rows={3} value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button onClick={() => navigate('/installations')}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading || !form.installerId}>
              {loading ? <CircularProgress size={24} /> : 'Programar Instalación'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default InstallationNew