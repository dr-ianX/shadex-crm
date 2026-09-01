import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material'
import { QrCode, Add as AddIcon } from '@mui/icons-material'
import { apiFetch } from '../api'

const WarrantyDetail = () => {
  const { id } = useParams()
  const [warranty, setWarranty] = useState<any>(null)
  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newClaim, setNewClaim] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchWarranty()
  }, [id])

  const fetchWarranty = async () => {
    try {
      const response = await apiFetch(`/api/v1/warranties/${id}`)
      const data = await response.json()
      if (data.success) {
        setWarranty(data.data)
        setClaims(data.data.claims || [])
      }
    } catch (err) {
      console.error('Error fetching warranty:', err)
    } finally {
      setLoading(false)
    }
  }

  const addClaim = async () => {
    if (!newClaim.trim()) return
    setSaving(true)
    try {
      const response = await apiFetch(`/api/v1/warranties/${id}/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newClaim })
      })
      const data = await response.json()
      if (data.success) {
        setClaims([data.data, ...claims])
        setNewClaim('')
      }
    } catch (err) {
      console.error('Error creating claim:', err)
    } finally {
      setSaving(false)
    }
  }

  const updateClaimStatus = async (claimId: string, status: string) => {
    try {
      const response = await apiFetch(`/api/v1/warranties/${id}/claims/${claimId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await response.json()
      if (data.success) {
        setClaims(claims.map(c => c.id === claimId ? data.data : c))
      }
    } catch (err) {
      console.error('Error updating claim:', err)
    }
  }

  const claimStatusLabels: Record<string, string> = {
    'OPEN': 'Abierto',
    'IN_PROGRESS': 'En progreso',
    'RESOLVED': 'Resuelto',
    'CLOSED': 'Cerrado'
  }

  const isActive = warranty && new Date(warranty.endDate) > new Date()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!warranty) {
    return <Alert severity="error">Garantía no encontrada</Alert>
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Garantía {warranty.warrantyId}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        {warranty.project?.name} • {warranty.client?.name} {warranty.client?.lastName}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Detalles de la garantía
                </Typography>
                <Chip
                  label={isActive ? 'Vigente' : 'Expirada'}
                  sx={{
                    background: isActive ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                    color: isActive ? '#10b981' : '#ef4444',
                    fontWeight: 600
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Producto</Typography>
                  <Typography variant="body1">{warranty.productId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">SKU</Typography>
                  <Typography variant="body1">{warranty.sku || 'Pendiente'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Lote</Typography>
                  <Typography variant="body1">{warranty.lot || 'Pendiente'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Años de cobertura</Typography>
                  <Typography variant="body1">{warranty.years}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Inicio</Typography>
                  <Typography variant="body1">{new Date(warranty.startDate).toLocaleDateString('es-MX')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Vencimiento</Typography>
                  <Typography variant="body1">{new Date(warranty.endDate).toLocaleDateString('es-MX')}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Cobertura</Typography>
                  <Typography variant="body1">{warranty.coverage || 'Sin cobertura'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Exclusiones</Typography>
                  <Typography variant="body1">{warranty.exclusions || 'Sin exclusiones'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                QR de Verificación
              </Typography>
              <Box sx={{ 
                p: 3, 
                background: 'rgba(42,166,255,0.05)', 
                borderRadius: 2,
                border: '1px dashed rgba(42,166,255,0.3)',
                textAlign: 'center'
              }}>
                <QrCode sx={{ color: '#2aa6ff', fontSize: 80, mb: 2 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2aa6ff', wordBreak: 'break-all' }}>
                  {warranty.qrCode}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Escanea para verificar validez
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                URL pública: <strong>shadex.com.mx/warranty/{warranty.qrCode}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Reclamos de Garantía
        </Typography>

        <Card>
          <CardContent>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField label="Nuevo reclamo" fullWidth multiline rows={2} value={newClaim} onChange={(e) => setNewClaim(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={addClaim} disabled={saving || !newClaim.trim()}>
                  {saving ? <CircularProgress size={24} /> : 'Agregar Reclamo'}
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {claims.length === 0 && (
              <Typography variant="body2" color="text.secondary">Sin reclamos registrados</Typography>
            )}

            {claims.map((claim: any) => (
              <Box key={claim.id} sx={{ mb: 3, p: 2, background: '#f9fafb', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Typography variant="body1">{claim.description}</Typography>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Estatus</InputLabel>
                    <Select value={claim.status} onChange={(e) => updateClaimStatus(claim.id, e.target.value)}>
                      <MenuItem value="OPEN">{claimStatusLabels.OPEN}</MenuItem>
                      <MenuItem value="IN_PROGRESS">{claimStatusLabels.IN_PROGRESS}</MenuItem>
                      <MenuItem value="RESOLVED">{claimStatusLabels.RESOLVED}</MenuItem>
                      <MenuItem value="CLOSED">{claimStatusLabels.CLOSED}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Reportado: {new Date(claim.reportedAt).toLocaleDateString('es-MX')}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default WarrantyDetail