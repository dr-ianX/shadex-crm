import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  IconButton,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'

const steps = ['Proyecto', 'Conceptos', 'Condiciones']

const QuotationNew = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedProjectId = searchParams.get('projectId')
  const [activeStep, setActiveStep] = useState(0)
  const [projects, setProjects] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<any>({
    projectId: '',
    clientId: '',
    location: '',
    validityDays: 15,
    taxRate: 0.16,
    deposit: 0.5,
    liquidation: 0.5,
    warrantyYears: 10,
    includes: '',
    excludes: '',
    terms: '50% anticipo / 50% liquidación',
    notes: '',
    items: []
  })
  const [currentItem, setCurrentItem] = useState<any>({
    productId: '',
    quantity: 1,
    unit: 'SQM',
    unitPrice: 0,
    discountPercent: 0
  })

  useEffect(() => {
    fetchProjects()
    fetchProducts()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await apiFetch('/api/v1/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
        if (preselectedProjectId) {
          const preselected = data.data.find((p: any) => p.id === preselectedProjectId)
          if (preselected) {
            setForm({
              ...form,
              projectId: preselected.id,
              clientId: preselected.clientId,
              location: preselected.location
            })
            setActiveStep(1)
          }
        }
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await apiFetch('/api/v1/products')
      const data = await response.json()
      if (data.success) setProducts(data.data)
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p: any) => p.id === projectId)
    if (project) {
      setForm({
        ...form,
        projectId,
        clientId: project.clientId,
        location: project.location
      })
    }
  }

  const addItem = () => {
    const product = products.find((p: any) => p.id === currentItem.productId)
    if (!product) return

    const newItem = {
      ...currentItem,
      description: product.commercialName,
      productId: product.id,
      unitPrice: currentItem.unitPrice || product.suggestedPrice || 0,
      subtotal: 0,
      discountAmount: 0,
      finalPrice: 0
    }

    setForm({ ...form, items: [...form.items, newItem] })
    setCurrentItem({ productId: '', quantity: 1, unit: 'SQM', unitPrice: 0, discountPercent: 0 })
  }

  const removeItem = (index: number) => {
    const newItems = [...form.items]
    newItems.splice(index, 1)
    setForm({ ...form, items: newItems })
  }

  const calculateTotals = () => {
    let subtotal = 0
    const items = form.items.map((item: any) => {
      const itemSubtotal = item.quantity * item.unitPrice
      const discountAmount = item.discountPercent ? itemSubtotal * (item.discountPercent / 100) : 0
      const finalPrice = itemSubtotal - discountAmount
      subtotal += finalPrice
      return { ...item, subtotal: itemSubtotal, discountAmount, finalPrice }
    })

    const taxAmount = subtotal * form.taxRate
    const total = subtotal + taxAmount

    return { items, subtotal, taxAmount, total }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const { items, subtotal, taxAmount, total } = calculateTotals()

      const payload = {
        projectId: form.projectId,
        clientId: form.clientId,
        location: form.location,
        validityDays: form.validityDays,
        taxRate: form.taxRate,
        deposit: form.deposit,
        liquidation: form.liquidation,
        warrantyYears: form.warrantyYears,
        includes: form.includes,
        excludes: form.excludes,
        terms: form.terms,
        notes: form.notes,
        subtotal,
        taxAmount,
        total,
        items
      }

      const response = await apiFetch('/api/v1/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      navigate('/quotations')
    } catch (err: any) {
      setError(err.message || 'Error al crear cotización')
    } finally {
      setLoading(false)
    }
  }

  const renderProjectStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Proyecto</InputLabel>
          <Select value={form.projectId} onChange={(e) => handleProjectChange(e.target.value)}>
            {projects.map((project: any) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name} — {project.client?.name} {project.client?.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField label="Ubicación" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Días de vigencia" fullWidth type="number" value={form.validityDays} onChange={(e) => setForm({ ...form, validityDays: parseInt(e.target.value) })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Años de garantía" fullWidth type="number" value={form.warrantyYears} onChange={(e) => setForm({ ...form, warrantyYears: parseInt(e.target.value) })} />
      </Grid>
    </Grid>
  )

  const renderItemsStep = () => (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Producto</InputLabel>
            <Select value={currentItem.productId} onChange={(e) => {
              const product: any = products.find((p: any) => p.id === e.target.value)
              setCurrentItem({ ...currentItem, productId: e.target.value, unitPrice: product?.suggestedPrice || 0, unit: product?.saleUnit || 'SQM' })
            }}>
              {products.map((product: any) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.commercialName} — ${product.suggestedPrice?.toLocaleString('es-MX')} / {product.saleUnit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField label="Cantidad" type="number" fullWidth value={currentItem.quantity} onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseFloat(e.target.value) })} />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField label="Unidad" fullWidth value={currentItem.unit} onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value })} />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField label="Precio unitario" type="number" fullWidth value={currentItem.unitPrice} onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: parseFloat(e.target.value) })} />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField label="Descuento %" type="number" fullWidth value={currentItem.discountPercent} onChange={(e) => setCurrentItem({ ...currentItem, discountPercent: parseFloat(e.target.value) })} />
        </Grid>
      </Grid>

      <Button variant="outlined" startIcon={<AddIcon />} onClick={addItem} disabled={!currentItem.productId} fullWidth sx={{ mb: 3 }}>
        Agregar concepto
      </Button>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Precio unit.</TableCell>
              <TableCell>Desc.</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {form.items.map((item: any, index: number) => {
              const product = products.find((p: any) => p.id === item.productId)
              const itemSubtotal = item.quantity * item.unitPrice
              const discountAmount = item.discountPercent ? itemSubtotal * (item.discountPercent / 100) : 0
              const finalPrice = itemSubtotal - discountAmount
              return (
                <TableRow key={index}>
                  <TableCell>{product?.commercialName || item.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>${item.unitPrice.toLocaleString('es-MX')}</TableCell>
                  <TableCell>{item.discountPercent}%</TableCell>
                  <TableCell>${finalPrice.toLocaleString('es-MX')}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => removeItem(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Subtotal: ${calculateTotals().subtotal.toLocaleString('es-MX')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          IVA ({(form.taxRate * 100).toFixed(0)}%): ${calculateTotals().taxAmount.toLocaleString('es-MX')}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2aa6ff' }}>
          Total: ${calculateTotals().total.toLocaleString('es-MX')}
        </Typography>
      </Box>
    </Box>
  )

  const renderConditionsStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField label="Anticipo" fullWidth type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: parseFloat(e.target.value) })} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Liquidación" fullWidth type="number" value={form.liquidation} onChange={(e) => setForm({ ...form, liquidation: parseFloat(e.target.value) })} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Términos comerciales" fullWidth multiline rows={2} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Incluye" fullWidth multiline rows={2} value={form.includes} onChange={(e) => setForm({ ...form, includes: e.target.value })} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="No incluye" fullWidth multiline rows={2} value={form.excludes} onChange={(e) => setForm({ ...form, excludes: e.target.value })} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Notas" fullWidth multiline rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </Grid>
    </Grid>
  )

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Nueva Cotización
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Genera propuesta desde un proyecto
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
          {activeStep === 0 && renderProjectStep()}
          {activeStep === 1 && renderItemsStep()}
          {activeStep === 2 && renderConditionsStep()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}>
              Anterior
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleSubmit} disabled={loading || form.items.length === 0}>
                {loading ? <CircularProgress size={24} /> : 'Crear Cotización'}
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

export default QuotationNew