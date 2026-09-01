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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'

const steps = ['Cliente', 'Proyecto', 'Necesidad', 'Confirmar']

const ProjectNew = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState<any[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
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
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await apiFetch('/api/v1/clients')
      const data = await response.json()
      if (data.success) setClients(data.data)
    } catch (err) {
      console.error('Error fetching clients:', err)
    }
  }

  const handleNext = () => {
    if (activeStep === 0 && !form.clientId) {
      setError('Selecciona un cliente')
      return
    }
    if (activeStep === 1 && !form.name) {
      setError('El nombre del proyecto es requerido')
      return
    }
    setError('')
    setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
    setError('')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        budget: form.budget ? parseFloat(form.budget) : undefined
      }
      const response = await apiFetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      navigate(`/projects/${data.data.id}`)
    } catch (err: any) {
      setError(err.message || 'Error al crear proyecto')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
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
          </Grid>
        )
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Nombre del proyecto" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ubicación" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ciudad" fullWidth value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </Grid>
          </Grid>
        )
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField label="Producto / Solución" fullWidth value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Presupuesto estimado" fullWidth type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Necesidad" fullWidth multiline rows={2} value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Descripción" fullWidth multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Grid>
          </Grid>
        )
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Cliente</Typography><Typography variant="body1" sx={{ mb: 1 }}>{clients.find(c => c.id === form.clientId)?.name || ''}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Nombre</Typography><Typography variant="body1" sx={{ mb: 1 }}>{form.name}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Ubicación</Typography><Typography variant="body1" sx={{ mb: 1 }}>{form.location || '—'}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Ciudad</Typography><Typography variant="body1" sx={{ mb: 1 }}>{form.city || '—'}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Producto</Typography><Typography variant="body1" sx={{ mb: 1 }}>{form.product || '—'}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Presupuesto</Typography><Typography variant="body1" sx={{ mb: 1 }}>{form.budget || '—'}</Typography></Grid>
            <Grid item xs={12}><Typography variant="body2" color="text.secondary">Necesidad</Typography><Typography variant="body1" sx={{ mb: 1 }}>{form.need || '—'}</Typography></Grid>
            <Grid item xs={12}><Typography variant="body2" color="text.secondary">Descripción</Typography><Typography variant="body1">{form.description || '—'}</Typography></Grid>
          </Grid>
        )
      default:
        return null
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Nuevo Proyecto
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Sigue los pasos para crear un proyecto completo
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          {renderStep()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button onClick={activeStep === 0 ? () => navigate('/projects') : handleBack}>
              {activeStep === 0 ? 'Cancelar' : 'Atrás'}
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Crear Proyecto'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>Siguiente</Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProjectNew