import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
} from '@mui/material'
import { apiFetch } from '../api'

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const res = await apiFetch('/api/v1/audit')
      const data = await res.json()
      if (data.success) setLogs(data.data)
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
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Auditoría</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Historial de cambios realizados en el sistema
      </Typography>

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Entidad</TableCell>
                  <TableCell>Acción</TableCell>
                  <TableCell>Valores anteriores</TableCell>
                  <TableCell>Valores nuevos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.createdAt).toLocaleString('es-MX')}</TableCell>
                    <TableCell>{log.user?.name || log.user?.email}</TableCell>
                    <TableCell><Chip label={`${log.entity} ${log.entityId?.slice(0,8)}`} size="small" /></TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.oldValue || '—'}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.newValue || '—'}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Sin registros</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AuditLogs