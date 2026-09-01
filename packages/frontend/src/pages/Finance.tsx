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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { formatCurrency } from '../utils'

const Finance = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    totalExpenses: 0,
    pendingPayments: 0,
    netProfit: 0
  })
  const [payments, setPayments] = useState([])
  const [expenses, setExpenses] = useState([])
  const [receivables, setReceivables] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFinanceData()
  }, [])

  const loadFinanceData = async () => {
    try {
      const [summaryRes, paymentsRes, expensesRes, receivablesRes] = await Promise.all([
        apiFetch('/api/v1/finance/summary'),
        apiFetch('/api/v1/finance/payments'),
        apiFetch('/api/v1/finance/expenses'),
        apiFetch('/api/v1/finance/accounts-receivable?overdue=true')
      ])

      const [summaryData, paymentsData, expensesData, receivablesData] = await Promise.all([
        summaryRes.json(),
        paymentsRes.json(),
        expensesRes.json(),
        receivablesRes.json()
      ])

      if (summaryData.success) setSummary(summaryData.data)
      if (paymentsData.success) setPayments(paymentsData.data)
      if (expensesData.success) setExpenses(expensesData.data)
      if (receivablesData.success) setReceivables(receivablesData.data)
    } catch (error) {
      console.error('Error loading finance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'CONFIRMED': '#10b981',
      'PENDING': '#f59e0b',
      'CANCELLED': '#ef4444'
    }
    return colors[status] || '#gray'
  }

  const getPaymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'DEPOSIT': 'Anticipo',
      'PARTIAL': 'Parcialidad',
      'LIQUIDATION': 'Liquidación',
      'REFUND': 'Devolución',
      'ADJUSTMENT': 'Ajuste'
    }
    return labels[type] || type
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, mb: 0 }}>
          Finanzas
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/payments/new')}>
          Nuevo Pago
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Ingresos Totales', value: summary.totalRevenue, color: '#2e7d32' },
          { title: 'Pagos Recibidos', value: summary.totalPayments, color: '#2aa6ff' },
          { title: 'Gastos', value: summary.totalExpenses, color: '#ed6c02' },
          { title: 'Utilidad Neta', value: summary.netProfit, color: '#7c3aed' },
          { title: 'Por Cobrar', value: summary.pendingPayments, color: '#ef4444' },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: item.color }}>
                  {formatCurrency(item.value, 'MXN')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Pagos" />
          <Tab label="Cuentas por Cobrar" />
          <Tab label="Gastos" />
        </Tabs>

        <CardContent>
          {tab === 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Folio</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estatus</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.client?.name} {payment.client?.lastName}</TableCell>
                      <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                      <TableCell>{getPaymentTypeLabel(payment.type)}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status === 'CONFIRMED' ? 'Confirmado' : payment.status === 'PENDING' ? 'Pendiente' : payment.status === 'CANCELLED' ? 'Cancelado' : payment.status}
                          size="small"
                          sx={{
                            background: `${getPaymentStatusColor(payment.status)}20`,
                            color: getPaymentStatusColor(payment.status),
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString('es-MX')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tab === 1 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Folio</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Vencimiento</TableCell>
                    <TableCell>Días vencidos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {receivables.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.folio}</TableCell>
                      <TableCell>{item.client?.name} {item.client?.lastName}</TableCell>
                      <TableCell>{formatCurrency(item.amount, item.currency)}</TableCell>
                      <TableCell>{new Date(item.dueDate).toLocaleDateString('es-MX')}</TableCell>
                      <TableCell>
                        {Math.max(0, Math.floor((new Date().getTime() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24)))} días
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tab === 2 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Concepto</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Proyecto</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense: any) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.type}</TableCell>
                      <TableCell>{expense.project?.name || '-'}</TableCell>
                      <TableCell>{formatCurrency(expense.amount, 'MXN')}</TableCell>
                      <TableCell>{new Date(expense.expenseDate).toLocaleDateString('es-MX')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Finance