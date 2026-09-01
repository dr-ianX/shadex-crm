import { useState } from 'react'
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
  Alert,
  CircularProgress,
} from '@mui/material'
import { apiFetch } from '../api'

const ProductNew = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<any>({
    sku: '',
    family: 'CONTROL_SOLAR',
    commercialName: '',
    description: '',
    variant: '',
    vlt: '',
    color: '',
    thickness: '',
    width: '',
    rollLength: '',
    purchaseUnit: 'ROLL',
    inventoryUnit: 'ROLL',
    saleUnit: 'SQM',
    cost: '',
    costCurrency: 'USD',
    suggestedPrice: '',
    priceCurrency: 'MXN',
    supplier: '',
    warrantyYears: '',
    technicalSpec: '',
    restrictions: ''
  })

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async () => {
    if (!form.sku || !form.commercialName || !form.cost) {
      setError('SKU, nombre comercial y costo son obligatorios')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        cost: parseFloat(form.cost),
        suggestedPrice: form.suggestedPrice ? parseFloat(form.suggestedPrice) : null,
        vlt: form.vlt ? parseFloat(form.vlt) : null,
        thickness: form.thickness ? parseFloat(form.thickness) : null,
        width: form.width ? parseFloat(form.width) : null,
        rollLength: form.rollLength ? parseFloat(form.rollLength) : null,
        warrantyYears: form.warrantyYears ? parseInt(form.warrantyYears) : null
      }
      const res = await apiFetch('/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        navigate('/products')
      } else {
        setError(data.error || 'Error al crear producto')
      }
    } catch (err) {
      setError('Error al crear producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Nuevo Producto</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Agregar producto al catálogo maestro</Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="SKU" fullWidth value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Nombre comercial" fullWidth value={form.commercialName} onChange={(e) => handleChange('commercialName', e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Descripción" fullWidth multiline rows={2} value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Familia</InputLabel>
                <Select value={form.family} onChange={(e) => handleChange('family', e.target.value)}>
                  <MenuItem value="CONTROL_SOLAR">Control Solar</MenuItem>
                  <MenuItem value="SMARTFILM">SmartFilm</MenuItem>
                  <MenuItem value="SECURITY">Seguridad</MenuItem>
                  <MenuItem value="PRIVACY">Privacidad</MenuItem>
                  <MenuItem value="SPECIALTY">Alta Especialidad</MenuItem>
                  <MenuItem value="DIGITAL_LED">Medios Digitales</MenuItem>
                  <MenuItem value="STONEGUARD">Protección de Superficies</MenuItem>
                  <MenuItem value="SERVICES">Servicios</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Variante" fullWidth value={form.variant} onChange={(e) => handleChange('variant', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="VLT" fullWidth type="number" value={form.vlt} onChange={(e) => handleChange('vlt', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Color" fullWidth value={form.color} onChange={(e) => handleChange('color', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Espesor (mm)" fullWidth type="number" value={form.thickness} onChange={(e) => handleChange('thickness', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Garantía (años)" fullWidth type="number" value={form.warrantyYears} onChange={(e) => handleChange('warrantyYears', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Ancho (m)" fullWidth type="number" value={form.width} onChange={(e) => handleChange('width', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Largo del rollo (m)" fullWidth type="number" value={form.rollLength} onChange={(e) => handleChange('rollLength', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Compra</InputLabel>
                <Select value={form.purchaseUnit} onChange={(e) => handleChange('purchaseUnit', e.target.value)}>
                  <MenuItem value="ROLL">Rollo</MenuItem>
                  <MenuItem value="LINEAR_METER">Metro lineal</MenuItem>
                  <MenuItem value="SQM">m²</MenuItem>
                  <MenuItem value="PIECE">Pieza</MenuItem>
                  <MenuItem value="SERVICE">Servicio</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Inventario</InputLabel>
                <Select value={form.inventoryUnit} onChange={(e) => handleChange('inventoryUnit', e.target.value)}>
                  <MenuItem value="ROLL">Rollo</MenuItem>
                  <MenuItem value="LINEAR_METER">Metro lineal</MenuItem>
                  <MenuItem value="SQM">m²</MenuItem>
                  <MenuItem value="PIECE">Pieza</MenuItem>
                  <MenuItem value="SERVICE">Servicio</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Venta</InputLabel>
                <Select value={form.saleUnit} onChange={(e) => handleChange('saleUnit', e.target.value)}>
                  <MenuItem value="ROLL">Rollo</MenuItem>
                  <MenuItem value="LINEAR_METER">Metro lineal</MenuItem>
                  <MenuItem value="SQM">m²</MenuItem>
                  <MenuItem value="PIECE">Pieza</MenuItem>
                  <MenuItem value="SERVICE">Servicio</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Costo" fullWidth type="number" value={form.cost} onChange={(e) => handleChange('cost', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Moneda costo</InputLabel>
                <Select value={form.costCurrency} onChange={(e) => handleChange('costCurrency', e.target.value)}>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="MXN">MXN</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Precio sugerido" fullWidth type="number" value={form.suggestedPrice} onChange={(e) => handleChange('suggestedPrice', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Moneda precio</InputLabel>
                <Select value={form.priceCurrency} onChange={(e) => handleChange('priceCurrency', e.target.value)}>
                  <MenuItem value="MXN">MXN</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Proveedor" fullWidth value={form.supplier} onChange={(e) => handleChange('supplier', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Ficha técnica / URL" fullWidth value={form.technicalSpec} onChange={(e) => handleChange('technicalSpec', e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Restricciones" fullWidth multiline rows={2} value={form.restrictions} onChange={(e) => handleChange('restrictions', e.target.value)} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/products')}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Guardar Producto'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProductNew