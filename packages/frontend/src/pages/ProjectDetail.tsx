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
} from '@mui/material'
import { Add as AddIcon, Assignment as QuoteIcon, VerifiedUser as WarrantyIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { apiFetch } from '../api'
import { formatCurrency } from '../utils/currency'
import ProjectSpaces from '../components/ProjectSpaces'

const projectStatusLabels: Record<string, string> = {
  'INFO_COMPLETE': 'Información completa',
  'QUOTE_PREPARING': 'Preparando cotización',
  'QUOTED': 'Cotizado',
  'WON': 'Ganado',
  'IN_INSTALLATION': 'En instalación',
  'COMPLETED': 'Completado',
  'WARRANTY_ACTIVE': 'Garantía activa'
}

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<any>(null)
  const [profit, setProfit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await apiFetch(`/api/v1/projects/${id}`)
      const data = await response.json()
      if (data.success) setProject(data.data)
      const profitRes = await apiFetch(`/api/v1/projects/${id}/profitability`)
      const profitData = await profitRes.json()
      if (profitData.success) setProfit(profitData.data)
    } catch (err) {
      console.error('Error fetching project:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return
    try {
      const response = await apiFetch(`/api/v1/projects/${id}`, { method: 'DELETE' })
      if (response.ok) navigate('/projects')
    } catch (err) {
      console.error('Error deleting project:', err)
    }
  }

  const handleEdit = () => {
    navigate(`/projects/${id}/edit`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!project) {
    return <Alert severity="error">Proyecto no encontrado</Alert>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {project.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {project.client?.name} {project.client?.lastName} • {project.location}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Eliminar
          </Button>
          <Button
            variant="outlined"
            startIcon={<QuoteIcon />}
            onClick={() => navigate(`/quotations/new?projectId=${project.id}`)}
          >
            Nueva Cotización
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/installations/new?projectId=${project.id}`)}
          >
            Programar Instalación
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<WarrantyIcon />}
            onClick={() => navigate(`/warranties/new?projectId=${project.id}`)}
          >
            Generar Garantía
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Información del proyecto
                </Typography>
                <Chip
                  label={projectStatusLabels[project.status] || project.status}
                  sx={{
                    background: 'rgba(42,166,255,0.1)',
                    color: '#2aa6ff',
                    fontWeight: 600
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Cliente</Typography>
                  <Typography variant="body1">
                    {project.client?.name} {project.client?.lastName}
                    {project.client?.companyName ? ` (${project.client.companyName})` : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Teléfono</Typography>
                  <Typography variant="body1">{project.client?.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
                  <Typography variant="body1">{project.location}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Ciudad</Typography>
                  <Typography variant="body1">{project.city || 'Pendiente'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Descripción</Typography>
                  <Typography variant="body1">{project.description || 'Sin descripción'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Necesidad</Typography>
                  <Typography variant="body1">{project.need || 'Pendiente'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Producto/Solución</Typography>
                  <Typography variant="body1">{project.product || 'Pendiente'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Acciones
              </Typography>
              <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => navigate('/projects')}>
                Volver a proyectos
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Cotizaciones
              </Typography>
              {project.quotations?.length === 0 ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Aún no hay cotizaciones para este proyecto.
                  </Typography>
                  <Button variant="contained" onClick={() => navigate(`/quotations/new?projectId=${project.id}`)}>
                    Crear primera cotización
                  </Button>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Folio</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>IVA</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {project.quotations.map((q: any) => (
                        <TableRow key={q.id}>
                          <TableCell>{q.folio}</TableCell>
                          <TableCell>{q.status}</TableCell>
                          <TableCell>${q.subtotal?.toLocaleString('es-MX')}</TableCell>
                          <TableCell>${q.taxAmount?.toLocaleString('es-MX')}</TableCell>
                          <TableCell>${q.total?.toLocaleString('es-MX')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {profit && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Rentabilidad</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Venta total</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(profit.totalRevenue, 'MXN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Costo estimado</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(profit.estimatedCost, 'MXN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Utilidad bruta</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(profit.grossProfit, 'MXN')}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Margen</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{profit.margin}%</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <ProjectSpaces projectId={project.id} />
      </Box>
    </Box>
  )
}

export default ProjectDetail