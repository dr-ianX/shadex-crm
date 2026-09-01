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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import { Add as AddIcon, Build as BuildIcon } from '@mui/icons-material'

const steps = ['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED']

const stepLabels: Record<string, string> = {
  'PENDING': 'Pendiente',
  'SCHEDULED': 'Programada',
  'IN_PROGRESS': 'En progreso',
  'COMPLETED': 'Completada'
}

const Installations = () => {
  const navigate = useNavigate()
  const [installations, setInstallations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstallations()
  }, [])

  const fetchInstallations = async () => {
    try {
      const response = await apiFetch('/api/v1/installations')
      const data = await response.json()
      if (data.success) {
        setInstallations(data.data)
      }
    } catch (error) {
      console.error('Error fetching installations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActiveStep = (status: string) => {
    return steps.indexOf(status)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': '#f59e0b',
      'SCHEDULED': '#2aa6ff',
      'IN_PROGRESS': '#7c3aed',
      'COMPLETED': '#10b981'
    }
    return colors[status] || '#gray'
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Instalaciones
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Gestión de órdenes de trabajo y evidencias
          </Typography>
        </Box>
        <Fab color="primary">
          <AddIcon />
        </Fab>
      </Box>

      <Grid container spacing={3}>
        {installations.map((installation: any) => (
          <Grid item xs={12} md={6} key={installation.id}>
            <Card 
              onClick={() => navigate(`/installations/${installation.id}`)}
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
                      {installation.workOrderFolio}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {installation.project?.name || 'Proyecto'}
                    </Typography>
                  </Box>
                  <Chip
                    label={stepLabels[installation.status] || installation.status}
                    sx={{
                      background: `${getStatusColor(installation.status)}20`,
                      color: getStatusColor(installation.status),
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Stepper 
                  activeStep={getActiveStep(installation.status)} 
                  alternativeLabel
                  sx={{ mb: 3 }}
                >
                  {steps.map((step) => (
                    <Step key={step}>
                      <StepLabel>{stepLabels[step]}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    <BuildIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                    {installation.installer?.name || 'Sin instalador'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    📅 {new Date(installation.scheduledDate).toLocaleDateString('es-MX')}
                  </Typography>
                </Box>

                {installation.client && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Cliente: {installation.client.name} {installation.client.lastName}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Installations