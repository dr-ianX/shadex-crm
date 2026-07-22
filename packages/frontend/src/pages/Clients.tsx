import React, { useEffect, useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Box, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Link } from '@mui/material'
import { Client } from '../types/api'

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/v1/clients')
      .then((r) => r.json())
      .then((data) => { if (data && data.success) setClients(data.data as Client[]) })
      .catch((err) => console.error(err))
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Clientes</Typography>
        <Button variant="contained" onClick={() => navigate('/clients/new')}>Nuevo Cliente</Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>{c.code}</TableCell>
                <TableCell><Link component={RouterLink} to={`/clients/${c.id}`}>{c.name}</Link></TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

export default Clients
