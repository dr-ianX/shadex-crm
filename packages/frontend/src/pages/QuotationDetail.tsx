import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { CheckCircle, Cancel, PictureAsPdf, Payment, Delete as DeleteIcon, Edit as EditIcon, ContentCopy as VersionIcon, Print as PrintIcon } from '@mui/icons-material'
import { apiFetch } from '../api'

const QuotationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quotation, setQuotation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    fetchQuotation()
  }, [id])

  const fetchQuotation = async () => {
    try {
      const response = await apiFetch(`/api/v1/quotations/${id}`)
      const data = await response.json()
      if (data.success) setQuotation(data.data)
    } catch (err) {
      console.error('Error fetching quotation:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    setActionLoading(true)
    setError('')
    try {
      const response = await apiFetch(`/api/v1/quotations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
      setQuotation(data.data)
      setConfirmOpen(false)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar cotización')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta cotización?')) return
    try {
      const response = await apiFetch(`/api/v1/quotations/${id}`, { method: 'DELETE' })
      if (response.ok) navigate('/quotations')
    } catch (err) {
      console.error('Error deleting quotation:', err)
    }
  }

  const handleNewVersion = async () => {
    if (!confirm('¿Crear nueva versión de esta cotización?')) return
    try {
      const res = await apiFetch(`/api/v1/quotations/${id}/version`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        navigate(`/quotations/${data.data.id}`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handlePrint = () => {
    const w = window.open('', '_blank')
    if (!w) return
    const html = `
      <html>
        <head>
          <title>Cotización ${quotation.folio}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #1a237e; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f5f5f5; }
            .total { font-weight: bold; font-size: 1.2em; text-align: right; margin-top: 20px; }
            .footer { margin-top: 40px; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <h1>SHADEX</h1>
          <h2>Cotización ${quotation.folio}</h2>
          <p><strong>Cliente:</strong> ${quotation.client?.name || ''} ${quotation.client?.lastName || ''}</p>
          <p><strong>Proyecto:</strong> ${quotation.project?.name || ''}</p>
          <p><strong>Vigencia:</strong> ${quotation.validityDays} días</p>
          <table>
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Cantidad</th>
                <th>Precio unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${quotation.items?.map((item: any) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unitPrice}</td>
                  <td>${item.subtotal}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p class="total">Total: ${quotation.total} ${quotation.currency}</p>
          <div class="footer">
            <p>${quotation.terms || ''}</p>
          </div>
        </body>
      </html>
    `
    w.document.write(html)
    w.document.close()
    w.print()
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'DRAFT': '#gray',
      'SENT': '#2aa6ff',
      'ACCEPTED': '#10b981',
      'REJECTED': '#d32f2f',
      'EXPIRED': '#f59e0b'
    }
    return colors[status] || '#gray'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'Borrador',
      'SENT': 'Enviada',
      'ACCEPTED': 'Aceptada',
      'REJECTED': 'Rechazada',
      'EXPIRED': 'Expirada'
    }
    return labels[status] || status
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Cotización {quotation.folio}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {quotation.client?.name} {quotation.client?.lastName} • {quotation.project?.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/quotations/${id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={() => window.open(`/api/v1/quotations/${id}/pdf`, '_blank')}
          >
            PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Imprimir
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Eliminar
          </Button>
          {quotation.status !== 'ACCEPTED' && quotation.status !== 'REJECTED' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => setConfirmOpen(true)}
            >
              Aceptar
            </Button>
          )}
          {quotation.status !== 'ACCEPTED' && (
            <Button
              variant="outlined"
              startIcon={<VersionIcon />}
              onClick={handleNewVersion}
            >
              Nueva versión
            </Button>
          )}
          {quotation.status !== 'ACCEPTED' && quotation.status !== 'REJECTED' && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={() => handleUpdateStatus('REJECTED')}
            >
              Rechazar
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Payment />}
            onClick={() => navigate(`/payments/new?quotationId=${id}&projectId=${quotation.projectId}`)}
          >
            Registrar Pago
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Conceptos
                </Typography>
                <Chip
                  label={getStatusLabel(quotation.status)}
                  sx={{
                    background: `${getStatusColor(quotation.status)}20`,
                    color: getStatusColor(quotation.status),
                    fontWeight: 600
                  }}
                />
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Unidad</TableCell>
                      <TableCell>Precio unit.</TableCell>
                      <TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quotation.items?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product?.commercialName || item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>${item.unitPrice?.toLocaleString('es-MX')}</TableCell>
                        <TableCell>${item.subtotal?.toLocaleString('es-MX')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Typography variant="body1" color="text.secondary">
                  Subtotal: ${quotation.subtotal?.toLocaleString('es-MX')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  IVA ({(quotation.taxRate * 100).toFixed(0)}%): ${quotation.taxAmount?.toLocaleString('es-MX')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2aa6ff' }}>
                  Total: ${quotation.total?.toLocaleString('es-MX')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Condiciones
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Anticipo</Typography>
                <Typography variant="body1">{quotation.deposit ? `${quotation.deposit * 100}%` : 'No definido'}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Liquidación</Typography>
                <Typography variant="body1">{quotation.liquidation ? `${quotation.liquidation * 100}%` : 'No definido'}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Vigencia</Typography>
                <Typography variant="body1">{quotation.validityDays} días</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Garantía</Typography>
                <Typography variant="body1">{quotation.warrantyYears} años</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Términos</Typography>
                <Typography variant="body1">{quotation.terms || 'Sin términos'}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>¿Aceptar cotización?</DialogTitle>
        <DialogContent>
          <Typography>
            Al aceptar, el proyecto <strong>{quotation.project?.name}</strong> cambiará a estado <strong>Ganado</strong> y la cotización quedará inmutable.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={() => handleUpdateStatus('ACCEPTED')} variant="contained" color="success" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : 'Aceptar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default QuotationDetail