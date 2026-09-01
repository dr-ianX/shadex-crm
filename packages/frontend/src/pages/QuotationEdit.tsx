import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

const QuotationEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quotation, setQuotation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    fetchQuotation()
  }, [id])

  const fetchQuotation = async () => {
    try {
      const response = await fetch(`/api/v1/quotations/${id}`)
      const data = await response.json()
      if (data.success) {
        setQuotation(data.data)
        setForm({
          deposit: data.data.deposit || 0,
          liquidation: data.data.liquidation || 0,
          warrantyYears: data.data.warrantyYears || 10,
          validityDays: data.data.validityDays || 15,
          taxRate: data.data.taxRate || 0.16,
          includes: data.data.includes || '',
          excludes: data.data.excludes || '',
          terms: data.data.terms || '',
          notes: data.data.notes || '',
          observations: data.data.observations || ''
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        deposit: parseFloat(form.deposit),
        liquidation: parseFloat(form.liquidation),
        warrantyYears: parseInt(form.warrantyYears),
        validityDays: parseInt(form.validityDays),
        taxRate: parseFloat(form.taxRate)
      }
      const response = await fetch(`/api/v1/quotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      navigate(`/quotations/${id}`)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar cotización')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!quotation) {
    return <Alert severity="error">Cotización no encontrada</Alert>
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Editar Cotización
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        {quotation.folio}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField label="Anticipo" fullWidth type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })} helperText="Ej: 0.5 = 50%" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Liquidación" fullWidth type="number" value={form.liquidation} onChange={(e) => setForm({ ...form, liquidation: e.target.value })} helperText="Ej: 0.5 = 50%" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Años de garantía" fullWidth type="number" value={form.warrantyYears} onChange={(e) => setForm({ ...form, warrantyYears: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Días de vigencia" fullWidth type="number" value={form.validityDays} onChange={(e) => setForm({ ...form, validityDays: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Tasa de impuesto" fullWidth type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} helperText="Ej: 0.16 = 16%" />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Incluye" fullWidth multiline rows={2} value={form.includes} onChange={(e) => setForm({ ...form, includes: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Excluye" fullWidth multiline rows={2} value={form.excludes} onChange={(e) => setForm({ ...form, excludes: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Términos" fullWidth multiline rows={2} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Notas" fullWidth multiline rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Observaciones" fullWidth multiline rows={3} value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button onClick={() => navigate(`/quotations/${id}`)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={saving}>
              {saving ? <CircularProgress size={24} /> : 'Guardar Cambios'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default QuotationEdit