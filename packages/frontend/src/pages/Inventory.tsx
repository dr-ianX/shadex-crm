import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
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
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

const Inventory = () => {
  const [tab, setTab] = useState(0)
  const [stats, setStats] = useState({ totalRolls: 0, availableRolls: 0, totalItems: 0, lowStockCount: 0 })
  const [rolls, setRolls] = useState([])
  const [items, setItems] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [reserveOpen, setReserveOpen] = useState(false)
  const [consumeOpen, setConsumeOpen] = useState(false)
  const [selectedRoll, setSelectedRoll] = useState<any>(null)
  const [reserveForm, setReserveForm] = useState({ projectId: '', meters: '', reason: '' })
  const [consumeForm, setConsumeForm] = useState({ projectId: '', meters: '', reason: '' })
  const [projects, setProjects] = useState([])

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = async () => {
    try {
      const [statsRes, rollsRes, itemsRes, lowStockRes, projectsRes] = await Promise.all([
        apiFetch('/api/v1/inventory/stats'),
        apiFetch('/api/v1/inventory/rolls'),
        apiFetch('/api/v1/inventory/items'),
        apiFetch('/api/v1/inventory/low-stock'),
        apiFetch('/api/v1/projects')
      ])

      const [statsData, rollsData, itemsData, lowStockData, projectsData] = await Promise.all([
        statsRes.json(),
        rollsRes.json(),
        itemsRes.json(),
        lowStockRes.json(),
        projectsRes.json()
      ])

      if (statsData.success) setStats(statsData.data)
      if (rollsData.success) setRolls(rollsData.data)
      if (itemsData.success) setItems(itemsData.data)
      if (lowStockData.success) setLowStock(lowStockData.data)
      if (projectsData.success) setProjects(projectsData.data)
    } catch (error) {
      console.error('Error loading inventory data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'AVAILABLE': '#10b981',
      'RESERVED': '#f59e0b',
      'CONSUMED': '#6b7280',
      'DAMAGED': '#ef4444'
    }
    return colors[status] || '#gray'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'AVAILABLE': 'Disponible',
      'RESERVED': 'Reservado',
      'CONSUMED': 'Consumido',
      'DAMAGED': 'Dañado'
    }
    return labels[status] || status
  }

  const handleReserve = async () => {
    if (!selectedRoll || !reserveForm.projectId || !reserveForm.meters) return
    try {
      const res = await apiFetch(`/api/v1/inventory/rolls/${selectedRoll.id}/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: reserveForm.projectId,
          meters: parseFloat(reserveForm.meters),
          reason: reserveForm.reason
        })
      })
      const data = await res.json()
      if (data.success) {
        setReserveOpen(false)
        loadInventoryData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleConsume = async () => {
    if (!selectedRoll || !consumeForm.projectId || !consumeForm.meters) return
    try {
      const res = await apiFetch(`/api/v1/inventory/rolls/${selectedRoll.id}/consume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: consumeForm.projectId,
          meters: parseFloat(consumeForm.meters),
          reason: consumeForm.reason
        })
      })
      const data = await res.json()
      if (data.success) {
        setConsumeOpen(false)
        loadInventoryData()
      }
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, mb: 3 }}>
        Inventario
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Rollos', value: stats.totalRolls, color: '#2aa6ff' },
          { title: 'Rollos Disponibles', value: stats.availableRolls, color: '#10b981' },
          { title: 'Productos', value: stats.totalItems, color: '#7c3aed' },
          { title: 'Stock Bajo', value: stats.lowStockCount, color: '#ef4444' },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: item.color }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Rollos" />
          <Tab label="Productos" />
          <Tab label="Stock Bajo" />
        </Tabs>

        <CardContent>
          {tab === 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Código de Rollo</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Largo Total (m)</TableCell>
                    <TableCell>Largo Disponible (m)</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Estatus</TableCell>
                    <TableCell>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rolls.map((roll: any) => (
                    <TableRow key={roll.id}>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{roll.rollCode}</TableCell>
                      <TableCell>{roll.product?.commercialName}</TableCell>
                      <TableCell>{roll.totalLength}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {roll.availableLength}
                          <LinearProgress
                            variant="determinate"
                            value={(roll.availableLength / roll.totalLength) * 100}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{roll.location}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(roll.status)}
                          size="small"
                          sx={{
                            background: `${getStatusColor(roll.status)}20`,
                            color: getStatusColor(roll.status),
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="outlined" onClick={() => { setSelectedRoll(roll); setReserveForm({ projectId: '', meters: '', reason: '' }); setReserveOpen(true); }}>
                            Reservar
                          </Button>
                          <Button size="small" variant="contained" onClick={() => { setSelectedRoll(roll); setConsumeForm({ projectId: '', meters: '', reason: '' }); setConsumeOpen(true); }}>
                            Consumir
                          </Button>
                        </Box>
                      </TableCell>
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
                    <TableCell>Producto</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Stock Mínimo</TableCell>
                    <TableCell>Punto de Reorden</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.commercialName}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.minimumStock}</TableCell>
                      <TableCell>{item.reorderPoint}</TableCell>
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
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Stock Mínimo</TableCell>
                    <TableCell>Alerta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStock.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.commercialName}</TableCell>
                      <TableCell sx={{ color: '#ef4444', fontWeight: 600 }}>{item.quantity}</TableCell>
                      <TableCell>{item.minimumStock}</TableCell>
                      <TableCell>
                        <Chip label="Stock bajo" color="error" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={reserveOpen} onClose={() => setReserveOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reservar material</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedRoll?.rollCode} • {selectedRoll?.product?.commercialName} • Disponible: {selectedRoll?.availableLength} m
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Proyecto</InputLabel>
            <Select value={reserveForm.projectId} onChange={(e) => setReserveForm({ ...reserveForm, projectId: e.target.value })}>
              {projects.map((p: any) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Metros a reservar" type="number" fullWidth sx={{ mb: 2 }} value={reserveForm.meters} onChange={(e) => setReserveForm({ ...reserveForm, meters: e.target.value })} />
          <TextField label="Motivo" fullWidth value={reserveForm.reason} onChange={(e) => setReserveForm({ ...reserveForm, reason: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReserveOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleReserve}>Reservar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={consumeOpen} onClose={() => setConsumeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Consumir material</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedRoll?.rollCode} • {selectedRoll?.product?.commercialName}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Proyecto</InputLabel>
            <Select value={consumeForm.projectId} onChange={(e) => setConsumeForm({ ...consumeForm, projectId: e.target.value })}>
              {projects.map((p: any) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Metros a consumir" type="number" fullWidth sx={{ mb: 2 }} value={consumeForm.meters} onChange={(e) => setConsumeForm({ ...consumeForm, meters: e.target.value })} />
          <TextField label="Motivo" fullWidth value={consumeForm.reason} onChange={(e) => setConsumeForm({ ...consumeForm, reason: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConsumeOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleConsume}>Consumir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Inventory