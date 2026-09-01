import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Card, CardContent, Grid, Button, CircularProgress, Alert } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

const ClientDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetchClient()
  }, [id])

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/v1/clients/${id}`)
      const data = await response.json()
      if (data.success) setClient(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este cliente? Se eliminarán también sus proyectos, cotizaciones y datos asociados.')) return
    try {
      const response = await fetch(`/api/v1/clients/${id}`, { method: 'DELETE' })
      if (response.ok) navigate('/clients')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!client) {
    return <Alert severity="error">Cliente no encontrado</Alert>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {client.name} {client.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {client.companyName || client.email}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/clients/${client.id}/edit`)}>
            Editar
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
            Eliminar
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Email</Typography>
              <Typography variant="body1">{client.email || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Teléfono</Typography>
              <Typography variant="body1">{client.phone || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Empresa</Typography>
              <Typography variant="body1">{client.companyName || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
              <Typography variant="body1">{client.address || client.location || '-'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Notas</Typography>
              <Typography variant="body1">{client.notes || 'Sin notas'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ClientDetail