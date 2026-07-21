import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Paper, Button } from '@mui/material'

const ClientDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/v1/clients/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data && data.success) setClient(data.data) })
      .catch((err) => console.error(err))
  }, [id])

  if (!client) return <Typography>Cargando...</Typography>

  return (
    <Box>
      <Typography variant="h5">{client.name}</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography><strong>Código:</strong> {client.code}</Typography>
        <Typography><strong>Email:</strong> {client.email}</Typography>
        <Typography><strong>Teléfono:</strong> {client.phone}</Typography>
        <Typography><strong>Dirección:</strong> {client.address || '-'}</Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => navigate(`/clients/${client.id}/edit`)}>Editar</Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default ClientDetail
