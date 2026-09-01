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
  LinearProgress,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

const Projects = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await apiFetch('/api/v1/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'INFO_COMPLETE': '#2aa6ff',
      'QUOTE_PREPARING': '#f59e0b',
      'QUOTED': '#7c3aed',
      'WON': '#10b981',
      'IN_INSTALLATION': '#ec4899',
      'COMPLETED': '#6b7280',
      'WARRANTY_ACTIVE': '#2aa6ff'
    }
    return colors[status] || '#gray'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'INFO_COMPLETE': 'Información completa',
      'QUOTE_PREPARING': 'Preparando cotización',
      'QUOTED': 'Cotizado',
      'WON': 'Ganado',
      'IN_INSTALLATION': 'En instalación',
      'COMPLETED': 'Completado',
      'WARRANTY_ACTIVE': 'Garantía activa'
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Proyectos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Centro de operación de transformaciones
          </Typography>
        </Box>
        <Fab color="primary" onClick={() => navigate('/projects/new')}>
          <AddIcon />
        </Fab>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project: any) => (
          <Grid item xs={12} md={6} key={project.id}>
            <Card 
              onClick={() => navigate(`/projects/${project.id}`)}
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
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {project.client?.name} {project.client?.lastName}
                    </Typography>
                  </Box>
                  <Chip
                    label={getStatusLabel(project.status)}
                    size="small"
                    sx={{
                      background: `${getStatusColor(project.status)}20`,
                      color: getStatusColor(project.status),
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {project.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    📍 {project.location}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    💰 {project.quotations?.length || 0} cotización(es)
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={project.status === 'COMPLETED' ? 100 : project.status === 'WON' ? 60 : 30}
                  sx={{ height: 6, borderRadius: 3, mb: 2 }}
                />

                <Button variant="outlined" size="small" fullWidth>
                  Ver detalle
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Projects