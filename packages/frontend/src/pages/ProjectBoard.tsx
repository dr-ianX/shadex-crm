import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { apiFetch } from '../api'

const projectStatuses = [
  { key: 'INFO_COMPLETE', label: 'Info completa', color: '#2aa6ff' },
  { key: 'QUOTE_PREPARING', label: 'Preparando cot', color: '#7c3aed' },
  { key: 'QUOTED', label: 'Cotizado', color: '#f59e0b' },
  { key: 'WON', label: 'Ganado', color: '#10b981' },
  { key: 'IN_INSTALLATION', label: 'En instalación', color: '#ec4899' },
  { key: 'COMPLETED', label: 'Completado', color: '#6b7280' },
  { key: 'WARRANTY_ACTIVE', label: 'Garantía activa', color: '#2aa6ff' },
]

const ProjectBoard = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await apiFetch('/api/v1/projects')
      const data = await res.json()
      if (data.success) setProjects(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Tablero de Proyectos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/projects/new')}>
          Nuevo Proyecto
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {projectStatuses.map((status) => {
          const statusProjects = projects.filter((p: any) => p.status === status.key)
          return (
            <Box key={status.key} sx={{ minWidth: 280, maxWidth: 280 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: status.color }}>
                  {status.label}
                </Typography>
                <Chip label={statusProjects.length} size="small" sx={{ background: `${status.color}20`, color: status.color, fontWeight: 600 }} />
              </Box>

              {statusProjects.map((project: any) => (
                <Card
                  key={project.id}
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    borderTop: `3px solid ${status.color}`,
                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }
                  }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {project.client?.name} {project.client?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {project.location || 'Sin ubicación'}
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              {statusProjects.length === 0 && (
                <Box sx={{ p: 2, background: '#f9fafb', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Sin proyectos</Typography>
                </Box>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default ProjectBoard