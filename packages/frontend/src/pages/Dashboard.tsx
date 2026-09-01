import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material'
import {
  TrendingUp as RevenueIcon,
  Pending as PendingIcon,
  CheckCircle as CompletedIcon,
  Warning as AlertIcon,
  People as ClientsIcon,
  Campaign as LeadsIcon,
  RequestQuote as QuoteIcon,
  Work as ProjectsIcon,
} from '@mui/icons-material'
import type { ChipProps } from '@mui/material'
import Hero from '../components/Hero'
import { formatCurrency, formatNumber } from '../utils'
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
  Legend,
  LineChart,
  Line
} from 'recharts'

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    clients: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    leads: 0,
    activeLeads: 0,
    totalProducts: 0,
    lowStockCount: 0,
    totalRolls: 0,
    materialReserved: 0,
    projects: 0,
    activeProjects: 0,
    quotations: 0,
    quotedAmount: 0,
    averageTicket: 0,
  })
  const [recentQuotations, setRecentQuotations] = useState([])
  const [recentProjects, setRecentProjects] = useState([])
  const [recentLeads, setRecentLeads] = useState([])
  const [upcomingInstallations, setUpcomingInstallations] = useState<any[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [funnelData, setFunnelData] = useState<any[]>([])
  const [projectStatusData, setProjectStatusData] = useState<any[]>([])
  const [paymentsByMonth, setPaymentsByMonth] = useState<any[]>([])
  const [quotationsByMonth, setQuotationsByMonth] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [clientsRes, financeRes, leadsRes, productsRes, inventoryRes, quotationsRes, projectsRes, paymentsRes, installationsRes, appointmentsRes] = await Promise.all([
        apiFetch('/api/v1/clients'),
        apiFetch('/api/v1/finance/summary'),
        apiFetch('/api/v1/leads'),
        apiFetch('/api/v1/products'),
        apiFetch('/api/v1/inventory/stats'),
        apiFetch('/api/v1/quotations'),
        apiFetch('/api/v1/projects'),
        apiFetch('/api/v1/finance/payments'),
        apiFetch('/api/v1/installations'),
        apiFetch('/api/v1/appointments')
      ])

      const [clientsData, financeData, leadsData, productsData, inventoryData, quotationsData, projectsData, paymentsData, installationsData, appointmentsData] = await Promise.all([
        clientsRes.json(),
        financeRes.json(),
        leadsRes.json(),
        productsRes.json(),
        inventoryRes.json(),
        quotationsRes.json(),
        projectsRes.json(),
        paymentsRes.json(),
        installationsRes.json(),
        appointmentsRes.json()
      ])

      const allLeads = leadsData.success ? leadsData.data : []
      const allQuotations = quotationsData.success ? quotationsData.data : []
      const allProjects = projectsData.success ? projectsData.data : []

      const activeLeads = allLeads.filter((l: any) => !['WON', 'LOST'].includes(l.status)).length
      const quotedAmount = allQuotations.reduce((sum: number, q: any) => sum + (q.total || 0), 0)
      const acceptedQuotations = allQuotations.filter((q: any) => q.status === 'ACCEPTED')
      const totalRevenue = acceptedQuotations.reduce((sum: number, q: any) => sum + (q.total || 0), 0)
      const averageTicket = acceptedQuotations.length > 0 ? totalRevenue / acceptedQuotations.length : 0
      const activeProjects = allProjects.filter((p: any) => !['COMPLETED'].includes(p.status)).length

      setStats({
        clients: clientsData.success ? clientsData.data.length : 0,
        totalRevenue,
        pendingPayments: financeData.success ? financeData.data.pendingPayments : 0,
        leads: allLeads.length,
        activeLeads,
        totalProducts: productsData.success ? productsData.data.length : 0,
        lowStockCount: inventoryData.success ? inventoryData.data.lowStockCount : 0,
        totalRolls: inventoryData.success ? inventoryData.data.totalRolls : 0,
        materialReserved: inventoryData.success ? inventoryData.data.reservedRolls : 0,
        projects: allProjects.length,
        activeProjects,
        quotations: allQuotations.length,
        quotedAmount,
        averageTicket
      })

      setRecentQuotations(allQuotations.slice(0, 5))
      setRecentProjects(allProjects.slice(0, 5))
      setRecentLeads(allLeads.slice(0, 5))
      setUpcomingInstallations((installationsData.success ? installationsData.data : []).slice(0, 5))
      setUpcomingAppointments((appointmentsData.success ? appointmentsData.data : []).slice(0, 5))

      // Funnel data
      const statuses = ['NEW', 'CONTACTED', 'QUALIFYING', 'QUOTED', 'FOLLOW_UP', 'WON', 'LOST']
      setFunnelData(statuses.map(status => ({
        name: leadStatusLabels[status] || status,
        count: allLeads.filter((l: any) => l.status === status).length
      })))

      // Project status data
      const projectStatusCounts: Record<string, number> = {}
      allProjects.forEach((p: any) => {
        projectStatusCounts[p.status] = (projectStatusCounts[p.status] || 0) + 1
      })
      setProjectStatusData(Object.entries(projectStatusCounts).map(([status, count]) => ({
        name: projectStatusLabels[status] || status,
        value: count,
        color: getProjectStatusColor(status)
      })));

      // Payments by month
      const allPayments = paymentsData.success ? paymentsData.data : []
      const monthPayments: Record<string, number> = {}
      const monthQuotations: Record<string, number> = {}
      allPayments.forEach((p: any) => {
        const month = new Date(p.date).toLocaleString('es-MX', { month: 'short', year: '2-digit' })
        monthPayments[month] = (monthPayments[month] || 0) + (p.amount || 0)
      })
      allQuotations.forEach((q: any) => {
        const month = new Date(q.createdAt).toLocaleString('es-MX', { month: 'short', year: '2-digit' })
        monthQuotations[month] = (monthQuotations[month] || 0) + (q.total || 0)
      })
      setPaymentsByMonth(Object.entries(monthPayments).map(([month, amount]) => { return { month, amount }; }));
      setQuotationsByMonth(Object.entries(monthQuotations).map(([month, amount]) => { return { month, amount }; }));

      // Build alerts from data
      const newAlerts: any[] = []

      if (inventoryData.success && inventoryData.data.lowStockCount > 0) {
        newAlerts.push({
          type: 'Inventario',
          message: `${inventoryData.data.lowStockCount} productos con stock bajo`,
          severity: 'warning'
        })
      }

      if (financeData.success && financeData.data.pendingPayments > 0) {
        newAlerts.push({
          type: 'Finanzas',
          message: `Pagos pendientes por ${formatCurrency(financeData.data.pendingPayments, 'MXN')}`,
          severity: 'warning'
        })
      }

      if (activeLeads > 0) {
        newAlerts.push({
          type: 'Ventas',
          message: `${activeLeads} leads activos requieren seguimiento`,
          severity: 'info'
        })
      }

      setAlerts(newAlerts)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'Leads Activos', value: stats.activeLeads, icon: <LeadsIcon />, color: '#2aa6ff', change: 'Total' },
    { title: 'Cotizaciones', value: stats.quotations, icon: <QuoteIcon />, color: '#7c3aed', change: 'Total' },
    { title: 'Proyectos Activos', value: stats.activeProjects, icon: <ProjectsIcon />, color: '#10b981', change: 'Total' },
    { title: 'Clientes', value: stats.clients, icon: <ClientsIcon />, color: '#1a237e', change: 'Total' },
    { title: 'Ticket Promedio', value: stats.averageTicket, icon: <RevenueIcon />, color: '#2e7d32', change: 'MXN' },
    { title: 'Pendientes de Cobro', value: stats.pendingPayments, icon: <PendingIcon />, color: '#ed6c02', change: 'MXN' },
    { title: 'Productos', value: stats.totalProducts, icon: <CompletedIcon />, color: '#0288d1', change: 'Total' },
    { title: 'Rollos', value: stats.totalRolls, icon: <CompletedIcon />, color: '#0288d1', change: 'Total' },
    { title: 'Reservados', value: stats.materialReserved, icon: <CompletedIcon />, color: '#f59e0b', change: 'Total' },
    { title: 'Stock Bajo', value: stats.lowStockCount, icon: <AlertIcon />, color: '#d32f2f', change: 'Total' },
  ]

  const getStatusColor = (status: string): ChipProps['color'] => {
    switch (status) {
      case 'DRAFT': return 'default'
      case 'SENT': return 'info'
      case 'ACCEPTED': return 'success'
      case 'REJECTED': return 'error'
      case 'EXPIRED': return 'warning'
      default: return 'default'
    }
  }

  const getProjectStatusColor = (status: string) => {
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

  const formatStatus = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'Borrador',
      'SENT': 'Enviada',
      'ACCEPTED': 'Aceptada',
      'REJECTED': 'Rechazada',
      'EXPIRED': 'Expirada'
    }
    return labels[status] || status
  }

  const leadStatusLabels: Record<string, string> = {
    'NEW': 'Nuevo',
    'QUOTED': 'Cotizado',
    'WON': 'Ganado',
    'LOST': 'Perdido',
    'FOLLOW_UP': 'Seguimiento',
    'CONTACTED': 'Contactado',
    'QUALIFYING': 'Calificando',
    'INFO_COMPLETE': 'Info completa',
    'QUOTE_PREPARING': 'Preparando cot',
    'NEGOTIATION': 'Negociación',
    'DEPOSIT_PENDING': 'Anticipo pendiente'
  }

  const projectStatusLabels: Record<string, string> = {
    'INFO_COMPLETE': 'Info completa',
    'QUOTE_PREPARING': 'Preparando cot',
    'QUOTED': 'Cotizado',
    'WON': 'Ganado',
    'IN_INSTALLATION': 'En instalación',
    'COMPLETED': 'Completado',
    'WARRANTY_ACTIVE': 'Garantía activa'
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
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, mb: 3 }}>
        Dashboard
      </Typography>

      <Hero />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                height: '100%',
                borderTop: `4px solid ${stat.color}`,
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      backgroundColor: stat.change === 'MXN' ? 'rgba(42,166,255,0.1)' : '#e8f5e9',
                      color: stat.change === 'MXN' ? '#2aa6ff' : '#2e7d32'
                    }}
                  />
                </Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
                  {stat.title.includes('Ticket') || stat.title.includes('Cobro')
                    ? formatCurrency(stat.value, 'MXN')
                    : formatNumber(stat.value)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 360 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                Funnel de Leads
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2aa6ff" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 360 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                Proyectos por Estado
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {projectStatusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#2aa6ff'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 360 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                Ingresos por mes
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={paymentsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value, 'MXN')} />
                  <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 360 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                Cotizaciones por mes
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={quotationsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value, 'MXN')} />
                  <Bar dataKey="amount" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Quotations */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                Cotizaciones Recientes
                <Button size="small" onClick={() => navigate('/quotations')}>Ver todo</Button>
              </Typography>
              {recentQuotations.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Sin cotizaciones</Typography>
              ) : recentQuotations.map((quotation: any) => (
                <Box
                  key={quotation.id}
                  sx={{ py: 2, borderBottom: '1px solid #e0e0e0', '&:last-child': { borderBottom: 'none' } }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>{quotation.folio}</Typography>
                    <Chip label={formatStatus(quotation.status)} size="small" color={getStatusColor(quotation.status)} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      {quotation.client?.name || 'Cliente'} • {quotation.project?.name || 'Sin proyecto'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2aa6ff' }}>
                      {formatCurrency(quotation.total, 'MXN')}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Projects */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                Proyectos Activos
                <Button size="small" onClick={() => navigate('/projects')}>Ver todo</Button>
              </Typography>
              {recentProjects.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Sin proyectos</Typography>
              ) : recentProjects.map((project: any) => (
                <Box
                  key={project.id}
                  sx={{ py: 2, borderBottom: '1px solid #e0e0e0', '&:last-child': { borderBottom: 'none' } }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>{project.name}</Typography>
                    <Chip
                      label={project.status}
                      size="small"
                      sx={{ background: `${getProjectStatusColor(project.status)}20`, color: getProjectStatusColor(project.status), fontWeight: 600 }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {project.client?.name} {project.client?.lastName} • {project.location}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Leads */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                Leads Recientes
                <Button size="small" onClick={() => navigate('/leads')}>Ver todo</Button>
              </Typography>
              {recentLeads.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Sin leads</Typography>
              ) : recentLeads.map((lead: any) => (
                <Box
                  key={lead.id}
                  sx={{ py: 2, borderBottom: '1px solid #e0e0e0', '&:last-child': { borderBottom: 'none' } }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {lead.client?.name} {lead.client?.lastName}
                    </Typography>
                    <Chip label={leadStatusLabels[lead.status] || lead.status} size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {lead.problemDesc?.substring(0, 50)}...
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                Alertas
              </Typography>
              {alerts.length > 0 ? alerts.map((alert, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    py: 2,
                    borderBottom: index < alerts.length - 1 ? '1px solid #e0e0e0' : 'none'
                  }}
                >
                  <AlertIcon sx={{ color: alert.severity === 'error' ? '#d32f2f' : alert.severity === 'warning' ? '#ed6c02' : '#1976d2' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>{alert.type}</Typography>
                    <Typography variant="body2" color="text.secondary">{alert.message}</Typography>
                  </Box>
                </Box>
              )) : (
                <Typography variant="body2" color="text.secondary">No hay alertas activas</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Próximas instalaciones</Typography>
              {upcomingInstallations.length > 0 ? upcomingInstallations.map((inst: any) => (
                <Box key={inst.id} sx={{ py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{inst.project?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(inst.date).toLocaleString('es-MX')}</Typography>
                </Box>
              )) : (
                <Typography variant="body2" color="text.secondary">Sin instalaciones próximas</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Próximas citas</Typography>
              {upcomingAppointments.length > 0 ? upcomingAppointments.map((ap: any) => (
                <Box key={ap.id} sx={{ py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{ap.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(ap.startDate).toLocaleString('es-MX')}</Typography>
                </Box>
              )) : (
                <Typography variant="body2" color="text.secondary">Sin citas próximas</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard