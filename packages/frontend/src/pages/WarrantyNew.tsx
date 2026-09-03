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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material'

const products = [
  { value: 'CONTROL_SOLAR', label: 'Control Solar' },
  { value: 'SMARTFILM', label: 'SmartFilm' },
  { value: 'SECURITY', label: 'Seguridad' },
  { value: 'PRIVACY', label: 'Privacidad' },
  { value: 'SPECIALTY', label: 'Especialidad' },
  { value: 'DIGITAL_LED', label: 'Digital/LED' },
  { value: 'STONEGUARD', label: 'StoneGuard' }
]

const WarrantyNew = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId')

  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<any>({
    projectId: projectId || '',
    clientId: '',
    installationId: '',
    productId: 'CONTROL_SOLAR',
    sku: '',
    lot: '',
    installerId: '',
    startDate: new Date().toISOString().split('T')[0],
    years: 5,
    coverage: 'Instalación y defectos de fábrica',
    exclusions: 'Daños por mal uso, alteraciones y terceros'
  })

  useEffect(() => {
    if (projectId) fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await apiFetch(`/api/v1/projects/${projectId}`)
      if (!response.ok) return
      const data = await response.json()
      if (data.success) {
        setProject(data.data)
        setForm((prev: any) => ({
          ...prev,
          projectId: data.data.id,
          clientId: data.data.clientId,
          installerId: data.data.installations?.[0]?.installerId || '',
          installationId: data.data.installations?.[0]?.id || ''
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
      const payload: any = {
        ...form,
        startDate: new Date(form.startDate).toISOString()
      }
      if (!payload.installationId) delete payload.installationId
      if (!payload.installerId) delete payload.installerId

      const response = await apiFetch('/api/v1/warranties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Error al generar garantía')

      navigate('/warranties')
    } catch (err: any) {
      setError(err.message || 'Error al generar garantía')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Generar Garantía
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        {project ? `Garantía para ${project.name}` : 'Crear garantía digital'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Familia de producto</InputLabel>
                <Select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
                  {products.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Años de garantía" fullWidth type="number" value={form.years} onChange={(e) => setForm({ ...form, years: parseInt(e.target.value) })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="SKU" fullWidth value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Lote" fullWidth value={form.lot} onChange={(e) => setForm({ ...form, lot: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Instalador" fullWidth value={form.installerId} onChange={(e) => setForm({ ...form, installerId: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Fecha de inicio" fullWidth type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Cobertura" fullWidth multiline rows={2} value={form.coverage} onChange={(e) => setForm({ ...form, coverage: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Exclusiones" fullWidth multiline rows={2} value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button onClick={() => navigate('/warranties')}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading || !form.projectId || !form.clientId}>
              {loading ? <CircularProgress size={24} /> : 'Generar Garantía'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default WarrantyNew