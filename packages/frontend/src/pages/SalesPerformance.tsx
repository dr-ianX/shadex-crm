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
} from '@mui/material'
import { apiFetch } from '../api'
import { formatCurrency } from '../utils/currency'

const SalesPerformance = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await apiFetch('/api/v1/sales-performance')
      const result = await res.json()
      if (result.success) setData(result.data)
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
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Rendimiento de vendedores</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Métricas por ejecutivo
      </Typography>

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ejecutivo</TableCell>
                  <TableCell>Leads</TableCell>
                  <TableCell>Cotizaciones</TableCell>
                  <TableCell>Cotizado</TableCell>
                  <TableCell>Aceptadas</TableCell>
                  <TableCell>Venta aceptada</TableCell>
                  <TableCell>Cobrado</TableCell>
                  <TableCell>Win rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row: any) => (
                  <TableRow key={row.userId}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.leads}</TableCell>
                    <TableCell>{row.quotations}</TableCell>
                    <TableCell>{formatCurrency(row.quotedTotal, 'MXN')}</TableCell>
                    <TableCell>{row.acceptedQuotations}</TableCell>
                    <TableCell>{formatCurrency(row.acceptedTotal, 'MXN')}</TableCell>
                    <TableCell>{formatCurrency(row.collected, 'MXN')}</TableCell>
                    <TableCell>{row.winRate.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SalesPerformance