import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  CircularProgress,
  Alert,
} from '@mui/material'

const needs = [
  'TEMPERATURE_REDUCTION',
  'UV_PROTECTION',
  'SOLAR_CONTROL',
  'MAINTAIN_VIEWS',
  'PERMANENT_PRIVACY',
  'DYNAMIC_PRIVACY',
  'SMARTFILM',
  'SECURITY',
  'GLASS_PROTECTION',
  'TECH_INTEGRATION',
  'LED_DISPLAY',
  'DESIGN_DECORATION',
  'SURFACE_PROTECTION',
  'AUTOMOTIVE',
  'OTHER'
]

const steps = ['Cliente', 'Necesidad', 'Detalles', 'Confirmar']

const LeadNew = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<any>({
    clientId: '',
    clientType: 'NEW',
    newClient: { name: '', lastName: '', phone: '', whatsapp: '', email: '', companyName: '', city: '', address: '', type: 'RESIDENTIAL' },
    needs: [],
    problemDesc: '',
    mainNeed: '',
    budget: '',
    urgency: 'NORMAL',
    interestProduct: '',
    location: '',
    city: '',
    propertyType: 'RESIDENTIAL',
    channel: 'WhatsApp',
    campaignSource: '',
    attribution: {
      source: '',
      medium: '',
      campaign: '',
      campaignId: '',
      adset: '',
      ad: '',
      utmSource: '',
      utmCampaign: '',
      landingPage: ''
    },
    notes: '',
    nextAction: '',
    followUpDate: ''
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

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      let clientId = form.clientId

      if (form.clientType === 'NEW') {
        const clientRes = await apiFetch('/api/v1/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.newClient)
        })
        const clientData = await clientRes.json()
        if (!clientData.success) throw new Error(clientData.error)
        clientId = clientData.data.id
      }

      const leadPayload = {
        clientId,
        needs: form.needs,
        problemDesc: form.problemDesc,
        mainNeed: form.mainNeed,
        budget: parseFloat(form.budget) || null,
        urgency: form.urgency,
        interestProduct: form.interestProduct,
        location: form.location,
        city: form.city,
        propertyType: form.propertyType,
        channel: form.channel,
        campaignSource: form.campaignSource,
        attribution: form.attribution,
        notes: form.notes,
        nextAction: form.nextAction,
        followUpDate: form.followUpDate ? new Date(form.followUpDate).toISOString() : null,
        status: 'NEW'
      }

      const leadRes = await apiFetch('/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      })
      const leadData = await leadRes.json()
      if (!leadData.success) throw new Error(leadData.error)

      navigate('/leads')
    } catch (err: any) {
      setError(err.message || 'Error al crear lead')
    } finally {
      setLoading(false)
    }
  }

  const renderClientStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Tipo de cliente</InputLabel>
          <Select value={form.clientType} onChange={(e) => setForm({ ...form, clientType: e.target.value })}>
            <MenuItem value="NEW">Nuevo cliente</MenuItem>
            <MenuItem value="EXISTING">Cliente existente</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {form.clientType === 'EXISTING' ? (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Cliente</InputLabel>
            <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              {clients.map((client: any) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name} {client.lastName} {client.companyName ? `(${client.companyName})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ) : (
        <>
          <Grid item xs={12} sm={6}>
            <TextField label="Nombre" fullWidth value={form.newClient.name} onChange={(e) => setForm({ ...form, newClient: { ...form.newClient, name: e.target.value } })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Apellido" fullWidth value={form.newClient.lastName} onChange={(e) => setForm({ ...form, newClient: { ...form.newClient, lastName: e.target.value } })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Teléfono" fullWidth value={form.newClient.phone} onChange={(e) => setForm({ ...form, newClient: { ...form.newClient, phone: e.target.value } })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="WhatsApp" fullWidth value={form.newClient.whatsapp} onChange={(e) => setForm({ ...form, newClient: { ...form.newClient, whatsapp: e.target.value } })} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" fullWidth value={form.newClient.email} onChange={(e) => setForm({ ...form, newClient: { ...form.newClient, email: e.target.value } })} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Empresa (opcional)" fullWidth value={form.newClient.companyName} onChange={(e) => setForm({ ...form, newClient: { ...form.newClient, companyName: e.target.value } })} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Ciudad" fullWidth value={form.newClient.city} onChange={(e) => setForm({ ...form, newClient: { ...form.newClient, city: e.target.value } })} />
          </Grid>
        </>
      )}
    </Grid>
  )

  const renderNeedStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          options={needs}
          value={form.needs}
          onChange={(_, v) => setForm({ ...form, needs: v })}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => <TextField {...params} label="¿Qué situación quiere resolver?" placeholder="Selecciona una o varias" />}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Descripción del problema (palabras del cliente)" fullWidth multiline rows={4} value={form.problemDesc} onChange={(e) => setForm({ ...form, problemDesc: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Necesidad principal</InputLabel>
          <Select value={form.mainNeed} onChange={(e) => setForm({ ...form, mainNeed: e.target.value })}>
            {needs.map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Urgencia</InputLabel>
          <Select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
            <MenuItem value="LOW">Baja</MenuItem>
            <MenuItem value="NORMAL">Normal</MenuItem>
            <MenuItem value="HIGH">Alta</MenuItem>
            <MenuItem value="CRITICAL">Crítica</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )

  const renderDetailsStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField label="Presupuesto aproximado" fullWidth type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Producto de interés" fullWidth value={form.interestProduct} onChange={(e) => setForm({ ...form, interestProduct: e.target.value })} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Ubicación del proyecto" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Ciudad" fullWidth value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Tipo de inmueble</InputLabel>
          <Select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
            <MenuItem value="RESIDENTIAL">Residencial</MenuItem>
            <MenuItem value="COMMERCIAL">Comercial</MenuItem>
            <MenuItem value="CORPORATE">Corporativo</MenuItem>
            <MenuItem value="GOVERNMENT">Gobierno</MenuItem>
            <MenuItem value="HOSPITALITY">Hotelería</MenuItem>
            <MenuItem value="HEALTH">Salud</MenuItem>
            <MenuItem value="EDUCATION">Educación</MenuItem>
            <MenuItem value="AUTOMOTIVE">Automotriz</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Canal de entrada</InputLabel>
          <Select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
            <MenuItem value="WhatsApp">WhatsApp</MenuItem>
            <MenuItem value="Web">Web</MenuItem>
            <MenuItem value="Phone">Teléfono</MenuItem>
            <MenuItem value="Referral">Referido</MenuItem>
            <MenuItem value="Social">Redes sociales</MenuItem>
            <MenuItem value="Other">Otro</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Campaña / Fuente" fullWidth value={form.campaignSource} onChange={(e) => setForm({ ...form, campaignSource: e.target.value })} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>Atribución</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="Source" fullWidth value={form.attribution.source} onChange={(e) => setForm({ ...form, attribution: { ...form.attribution, source: e.target.value } })} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="Medium" fullWidth value={form.attribution.medium} onChange={(e) => setForm({ ...form, attribution: { ...form.attribution, medium: e.target.value } })} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="Campaign" fullWidth value={form.attribution.campaign} onChange={(e) => setForm({ ...form, attribution: { ...form.attribution, campaign: e.target.value } })} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="UTM Source" fullWidth value={form.attribution.utmSource} onChange={(e) => setForm({ ...form, attribution: { ...form.attribution, utmSource: e.target.value } })} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="UTM Campaign" fullWidth value={form.attribution.utmCampaign} onChange={(e) => setForm({ ...form, attribution: { ...form.attribution, utmCampaign: e.target.value } })} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="Landing Page" fullWidth value={form.attribution.landingPage} onChange={(e) => setForm({ ...form, attribution: { ...form.attribution, landingPage: e.target.value } })} />
      </Grid>
    </Grid>
  )

  const renderConfirmStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField label="Notas" fullWidth multiline rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Siguiente acción" fullWidth value={form.nextAction} onChange={(e) => setForm({ ...form, nextAction: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Fecha de seguimiento" fullWidth type="datetime-local" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} InputLabelProps={{ shrink: true }} />
      </Grid>
    </Grid>
  )

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Nuevo Lead
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Captura una oportunidad paso a paso
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Box sx={{ minHeight: 300 }}>
            {activeStep === 0 && renderClientStep()}
            {activeStep === 1 && renderNeedStep()}
            {activeStep === 2 && renderDetailsStep()}
            {activeStep === 3 && renderConfirmStep()}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}>
              Anterior
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Crear Lead'}
              </Button>
            ) : (
              <Button variant="contained" onClick={() => setActiveStep(s => s + 1)}>
                Siguiente
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LeadNew