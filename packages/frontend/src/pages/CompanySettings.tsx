import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Save as SaveIcon } from '@mui/icons-material'
import { apiFetch } from '../api'

const CompanySettings = () => {
  const [company, setCompany] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCompany()
  }, [])

  const fetchCompany = async () => {
    try {
      const res = await apiFetch('/api/v1/company')
      const data = await res.json()
      if (data.success) setCompany(data.data || {})
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await apiFetch('/api/v1/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company)
      })
      const data = await res.json()
      if (data.success) setSuccess('Datos guardados correctamente')
      else throw new Error(data.error)
    } catch (err: any) {
      setError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setCompany({ ...company, [field]: value })
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
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Configuración de la empresa</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Datos fiscales y generales de SHADEX
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Nombre comercial" fullWidth value={company.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Razón social" fullWidth value={company.legalName || ''} onChange={(e) => handleChange('legalName', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="RFC" fullWidth value={company.rfc || ''} onChange={(e) => handleChange('rfc', e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Dirección fiscal" fullWidth multiline rows={2} value={company.fiscalAddress || ''} onChange={(e) => handleChange('fiscalAddress', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Código postal fiscal" fullWidth value={company.fiscalZipCode || ''} onChange={(e) => handleChange('fiscalZipCode', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Régimen fiscal" fullWidth value={company.taxRegime || ''} onChange={(e) => handleChange('taxRegime', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Teléfono" fullWidth value={company.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" fullWidth value={company.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Sitio web" fullWidth value={company.website || ''} onChange={(e) => handleChange('website', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Eslogan" fullWidth value={company.tagline || ''} onChange={(e) => handleChange('tagline', e.target.value)} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
              {saving ? <CircularProgress size={24} /> : 'Guardar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CompanySettings