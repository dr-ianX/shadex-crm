import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Fab,
  Button,
} from '@mui/material'
import { Add as AddIcon, VerifiedUser as WarrantyIcon } from '@mui/icons-material'

const Warranties = () => {
  const navigate = useNavigate()
  const [warranties, setWarranties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWarranties()
  }, [])

  const fetchWarranties = async () => {
    try {
      const response = await apiFetch('/api/v1/warranties')
      const data = await response.json()
      if (data.success) {
        setWarranties(data.data)
      }
    } catch (error) {
      console.error('Error fetching warranties:', error)
    } finally {
      setLoading(false)
    }
  }

  const isActive = (endDate: string) => new Date(endDate) > new Date()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Garantías
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Garantías digitales con QR
          </Typography>
        </Box>
        <Fab color="primary" onClick={() => navigate('/warranties/new')}>
          <AddIcon />
        </Fab>
      </Box>

      <Grid container spacing={3}>
        {warranties.map((warranty: any) => (
          <Grid item xs={12} md={6} key={warranty.id}>
            <Card 
              onClick={() => navigate(`/warranties/${warranty.id}`)}
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 300ms ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(42,166,255,0.1)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {warranty.warrantyId}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {warranty.project?.name || 'Proyecto'}
                    </Typography>
                  </Box>
                  <Chip
                    label={isActive(warranty.endDate) ? 'Vigente' : 'Expirada'}
                    sx={{
                      background: isActive(warranty.endDate) ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                      color: isActive(warranty.endDate) ? '#10b981' : '#ef4444',
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Cliente: {warranty.client?.name} {warranty.client?.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Inicio: {new Date(warranty.startDate).toLocaleDateString('es-MX')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Vencimiento: {new Date(warranty.endDate).toLocaleDateString('es-MX')}
                  </Typography>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  background: 'rgba(42,166,255,0.05)', 
                  borderRadius: 2,
                  border: '1px dashed rgba(42,166,255,0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Código QR
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2aa6ff', wordBreak: 'break-all' }}>
                      {warranty.qrCode}
                    </Typography>
                  </Box>
                  <WarrantyIcon sx={{ color: '#2aa6ff', fontSize: 40 }} />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" size="small" fullWidth onClick={(e) => { e.stopPropagation(); navigate(`/warranties/${warranty.id}`) }}>
                    Ver detalle
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Warranties