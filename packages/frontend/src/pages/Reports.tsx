import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material'
import { formatCurrency } from '../utils'
import { apiFetch } from '../api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState<any[]>([])
  const [quotations, setQuotations] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [l, q, p, i] = await Promise.all([
        apiFetch('/api/v1/leads'),
        apiFetch('/api/v1/quotations'),
        apiFetch('/api/v1/finance/payments'),
        apiFetch('/api/v1/inventory/rolls')
      ])
      const [ld, qd, pd, id] = await Promise.all([l.json(), q.json(), p.json(), i.json()])
      if (ld.success) setLeads(ld.data)
      if (qd.success) setQuotations(qd.data)
      if (pd.success) setPayments(pd.data)
      if (id.success) setInventory(id.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = (filename: string, rows: string[][]) => {
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportLeads = () => {
    const rows = [['Nombre', 'Status', 'Canal', 'Campaña', 'Ciudad', 'Fecha']]
    leads.forEach(l => rows.push([
      `${l.client?.name || ''} ${l.client?.lastName || ''}`,
      l.status,
      l.channel || '',
      l.campaignSource || '',
      l.city || '',
      new Date(l.createdAt).toLocaleDateString('es-MX')
    ]))
    downloadCSV('leads.csv', rows)
  }

  const exportQuotations = () => {
    const rows = [['Folio', 'Cliente', 'Total', 'Estatus', 'Fecha']]
    quotations.forEach(q => rows.push([
      q.folio,
      `${q.client?.name || ''} ${q.client?.lastName || ''}`,
      q.total,
      q.status,
      new Date(q.createdAt).toLocaleDateString('es-MX')
    ]))
    downloadCSV('cotizaciones.csv', rows)
  }

  const exportPayments = () => {
    const rows = [['Fecha', 'Cliente', 'Monto', 'Moneda', 'Tipo', 'Método']]
    payments.forEach(p => rows.push([
      new Date(p.date).toLocaleDateString('es-MX'),
      `${p.client?.name || ''} ${p.client?.lastName || ''}`,
      p.amount,
      p.currency,
      p.type,
      p.method
    ]))
    downloadCSV('pagos.csv', rows)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const leadStatusCounts: Record<string, number> = {}
  leads.forEach((l: any) => { leadStatusCounts[l.status] = (leadStatusCounts[l.status] || 0) + 1 })
  const leadChart = Object.entries(leadStatusCounts).map(([status, count]) => ({ name: status, count }))

  const quotationStatusCounts: Record<string, number> = {}
  let quotedTotal = 0
  let acceptedTotal = 0
  quotations.forEach((q: any) => {
    quotationStatusCounts[q.status] = (quotationStatusCounts[q.status] || 0) + 1
    quotedTotal += q.total || 0
    if (q.status === 'ACCEPTED') acceptedTotal += q.total || 0
  })
  const quotationChart = Object.entries(quotationStatusCounts).map(([status, count]) => ({ name: status, count }))

  const totalPayments = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
  const paymentsByType: Record<string, number> = {}
  payments.forEach((p: any) => { paymentsByType[p.type] = (paymentsByType[p.type] || 0) + (p.amount || 0) })

  const colors = ['#2aa6ff', '#10b981', '#f59e0b', '#ef4444', '#7c3aed', '#ec4899']

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Reportes</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" onClick={exportLeads}>Exportar leads</Button>
          <Button variant="outlined" size="small" onClick={exportQuotations}>Exportar cotizaciones</Button>
          <Button variant="outlined" size="small" onClick={exportPayments}>Exportar pagos</Button>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Resumen comercial y operativo
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Leads</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{leads.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Cotizaciones</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{quotations.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Cotizado</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{formatCurrency(quotedTotal, 'MXN')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Aceptado</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{formatCurrency(acceptedTotal, 'MXN')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Ingresos</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{formatCurrency(totalPayments, 'MXN')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 340 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Leads por estado</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={leadChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2aa6ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 340 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Cotizaciones por estado</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={quotationChart} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {quotationChart.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Pagos por tipo</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Monto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(paymentsByType).map(([type, amount]) => (
                  <TableRow key={type}>
                    <TableCell>{type}</TableCell>
                    <TableCell align="right">{formatCurrency(amount, 'MXN')}</TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">Sin pagos</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Inventario de rollos</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Lote</TableCell>
                  <TableCell>Longitud total</TableCell>
                  <TableCell>Longitud usada</TableCell>
                  <TableCell>Disponible</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.slice(0, 20).map((roll: any) => (
                  <TableRow key={roll.id}>
                    <TableCell>{roll.product?.commercialName || roll.sku}</TableCell>
                    <TableCell>{roll.lotNumber || '—'}</TableCell>
                    <TableCell>{roll.totalLength}</TableCell>
                    <TableCell>{roll.usedLength}</TableCell>
                    <TableCell>{roll.availableLength}</TableCell>
                    <TableCell>{roll.status}</TableCell>
                  </TableRow>
                ))}
                {inventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Sin rollos</TableCell>
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

export default Reports