import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  Science as TechnologyIcon,
  PhotoLibrary as PhotoIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import type { ChipProps } from '@mui/material'

const TransformationDetail: React.FC = () => {
  const navigate = useNavigate()

  // Mock data - will be replaced with API call
  const transformation = {
    id: '1',
    folioNumber: 'TRANS-2024-0045',
    name: 'Torre Mayor - Pisos 15-20',
    client: 'Corporativo ABC',
    sector: 'Corporativo',
    status: 'Instalación',
    priority: 'Alta',
    journeyPhase: 'Transform',
    estimatedBudget: 150000,
    actualBudget: 142500,
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    progress: 75,
    description: 'Instalación de películas solares arquitectónicas en oficinas corporativas de Torre Mayor, pisos 15 al 20. Incluye 85 ventanas con tratamiento de control solar y reducción UV.',
    architect: 'Arq. Roberto Sánchez',
    address: 'Paseo de la Reforma 505, Cuauhtémoc, CDMX',
    technologies: [
      { name: '3M Prestige Series 70', quantity: 85, unit: 'm²' },
      { name: '3M Solar Control Silver', quantity: 45, unit: 'm²' },
    ],
    journey: [
      { phase: 'Discover', status: 'completed', date: '2024-01-15' },
      { phase: 'Curate', status: 'completed', date: '2024-01-20' },
      { phase: 'Design', status: 'completed', date: '2024-01-25' },
      { phase: 'Transform', status: 'in-progress', date: '2024-02-01' },
      { phase: 'Experience', status: 'pending', date: null },
    ],
  }

  const getStatusColor = (status: string): ChipProps['color'] => {
    switch (status) {
      case 'Instalación':
        return 'success'
      case 'Cotización':
        return 'info'
      case 'Levantamiento':
        return 'warning'
      case 'Diseño':
        return 'primary'
      default:
        return 'default'
    }
  }

  const getJourneyStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50'
      case 'in-progress':
        return '#2196f3'
      case 'pending':
        return '#9e9e9e'
      default:
        return '#9e9e9e'
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/transformations')}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 300, flexGrow: 1 }}>
          {transformation.name}
        </Typography>
        <Button variant="outlined" startIcon={<EditIcon />} sx={{ mr: 2 }}>
          Editar
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Información General
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label={transformation.status} color={getStatusColor(transformation.status)} />
                  <Chip
                    label={transformation.priority}
                    color="error"
                    size="small"
                  />
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Folio
                  </Typography>
                  <Typography variant="body1">{transformation.folioNumber}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Cliente
                  </Typography>
                  <Typography variant="body1">{transformation.client}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Sector
                  </Typography>
                  <Typography variant="body1">{transformation.sector}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Arquitecto
                  </Typography>
                  <Typography variant="body1">{transformation.architect}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Dirección
                  </Typography>
                  <Typography variant="body1">{transformation.address}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Descripción
                  </Typography>
                  <Typography variant="body1">{transformation.description}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Journey Timeline */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Journey - Ciclo de Vida
              </Typography>
              {transformation.journey.map((step, index) => (
                <Box key={step.phase} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: getJourneyStatusColor(step.status),
                        mr: 2,
                      }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {step.phase}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {step.date || 'Pendiente'}
                    </Typography>
                  </Box>
                  {index < transformation.journey.length - 1 && (
                    <Box
                      sx={{
                        height: 20,
                        width: 2,
                        backgroundColor: '#e0e0e0',
                        ml: 5,
                      }}
                    />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Budget Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Presupuesto
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                ${transformation.estimatedBudget.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Actual: ${transformation.actualBudget.toLocaleString()}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Progreso: {transformation.progress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={transformation.progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Technologies Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TechnologyIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Tecnologías
                </Typography>
              </Box>
              {transformation.technologies.map((tech, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 1,
                    borderBottom:
                      index < transformation.technologies.length - 1
                        ? '1px solid #e0e0e0'
                        : 'none',
                  }}
                >
                  <Typography variant="body1">{tech.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tech.quantity} {tech.unit}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Acciones Rápidas
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TimelineIcon />}
                sx={{ mb: 1 }}
              >
                Ver Timeline
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PhotoIcon />}
                sx={{ mb: 1 }}
              >
                Ver Documentos
              </Button>
              <Button fullWidth variant="outlined" startIcon={<MoneyIcon />}>
                Ver Finanzas
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TransformationDetail