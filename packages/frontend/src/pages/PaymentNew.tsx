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

const paymentTypes = [
  { value: 'DEPOSIT', label: 'Anticipo' },
  { value: 'PARTIAL', label: 'Parcialidad' },
  { value: 'LIQUIDATION', label: 'Liquidación' },
  { value: 'REFUND', label: 'Devolución' },
  { value: 'ADJUSTMENT', label: 'Ajuste' }
]

const paymentMethods = [
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'SPEI', label: 'SPEI' },
  { value: 'MERCADO_PAGO', label: 'Mercado Pago' },
  { value: 'CARD', label: 'Tarjeta' },
  { value: 'CASH', label: 'Efectivo' },
  { value: 'OTHER', label: 'Otro' }
]

const PaymentNew = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const quotationId = searchParams.get('quotationId')
  const projectId = searchParams.get('projectId')

  const [quotation, setQuotation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<any>({
    quotationId: quotationId || '',
    projectId: projectId || '',
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'DEPOSIT',
    method: 'TRANSFER',
    amount: '',
    currency: 'MXN',
    reference: '',
    notes: ''
  })

  useEffect(() => {
    if (quotationId) {
      fetchQuotation()
    }
  }, [quotationId])

  const fetchQuotation = async () => {
    try {
      const response = await fetch(`/api/v1/quotations/${quotationId}`)
      const data = await response.json()
      if (data.success) {
        setQuotation(data.data)
        setForm((prev: any) => ({
          ...prev,
          quotationId: data.data.id,
          projectId: data.data.projectId,
          clientId: data.data.clientId,
          amount: data.data.deposit ? data.data.total * data.data.deposit : ''
        }))
      }
    } catch (err) {
      console.error('Error fetching quotation:', err)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        date: new Date(form.date).toISOString(),
        status: 'CONFIRMED'
      }

      const response = await apiFetch('/api/v1/finance/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      navigate('/finance')
    } catch (err: any) {
      setError(err.message || 'Error al registrar pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Registrar Pago
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        {quotation ? `Cotización ${quotation.folio} — Total ${quotation.total?.toLocaleString('es-MX')} MXN` : 'Captura un pago del cliente'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de pago</InputLabel>
                <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {paymentTypes.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Método de pago</InputLabel>
                <Select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                  {paymentMethods.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Monto" fullWidth type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Fecha" fullWidth type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Referencia / Comprobante" fullWidth value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Notas" fullWidth multiline rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button onClick={() => navigate('/finance')}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading || !form.amount}>
              {loading ? <CircularProgress size={24} /> : 'Registrar Pago'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default PaymentNew