import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import type { ChipProps } from '@mui/material'

const Transformations: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSector, setFilterSector] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // New transformation form state
  const [newName, setNewName] = useState('')
  const [newClient, setNewClient] = useState('')
  const [newSector, setNewSector] = useState('Residencial')
  const [newStatus, setNewStatus] = useState('Cotización')
  const [newBudget, setNewBudget] = useState(0)

  // Mock data - will be replaced with API calls
  const initialTransformations = [
    {
      id: '1',
      folioNumber: 'TRANS-2024-0045',
      name: 'Torre Mayor - Pisos 15-20',
      client: 'Corporativo ABC',
      sector: 'Corporativo',
      status: 'Instalación',
      priority: 'Alta',
      journeyPhase: 'Transform',
      estimatedBudget: 150000,
      startDate: '2024-01-15',
      progress: 75,
    },
    {
      id: '2',
      folioNumber: 'TRANS-2024-0046',
      name: 'Residencial Las Lomas - Casa Martínez',
      client: 'Carlos Martínez',
      sector: 'Residencial',
      status: 'Cotización',
      priority: 'Media',
      journeyPhase: 'Design',
      estimatedBudget: 25000,
      startDate: '2024-02-01',
      progress: 30,
    },
    {
      id: '3',
      folioNumber: 'TRANS-2024-0047',
      name: 'Hospital Central - Ala Sur',
      client: 'Salud MX',
      sector: 'Industrial',
      status: 'Levantamiento',
      priority: 'Alta',
      journeyPhase: 'Curate',
      estimatedBudget: 320000,
      startDate: '2024-02-10',
      progress: 15,
    },
    {
      id: '4',
      folioNumber: 'TRANS-2024-0048',
      name: 'Oficinas Polanco - Tech Solutions',
      client: 'Tech Solutions',
      sector: 'Corporativo',
      status: 'Diseño',
      priority: 'Media',
      journeyPhase: 'Design',
      estimatedBudget: 85000,
      startDate: '2024-02-15',
      progress: 50,
    },
    {
      id: '5',
      folioNumber: 'TRANS-2024-0049',
      name: 'Plaza Norte - Comercial',
      client: 'Grupo Comercial',
      sector: 'Comercial',
      status: 'Lead',
      priority: 'Baja',
      journeyPhase: 'Discover',
      estimatedBudget: 180000,
      startDate: null,
      progress: 5,
    },
  ]

  const [transformations, setTransformations] = useState(initialTransformations)

  const getStatusColor = (status: string): ChipProps['color'] => {
    switch (status) {
      case 'Instalación':
        return 'success'
      case 'Cotización':
        return 'info'
      case 'Levantamiento':
        return 'warning'
      case 'Diseño':
        return 'primary'
      case 'Lead':
        return 'default'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority: string): ChipProps['color'] => {
    switch (priority) {
      case 'Alta':
        return 'error'
      case 'Media':
        return 'warning'
      case 'Baja':
        return 'info'
      default:
        return 'default'
    }
  }

  const getJourneyColor = (phase: string) => {
    switch (phase) {
      case 'Discover':
        return '#9e9e9e'
      case 'Curate':
        return '#ff9800'
      case 'Design':
        return '#2196f3'
      case 'Transform':
        return '#4caf50'
      case 'Experience':
        return '#9c27b0'
      default:
        return '#9e9e9e'
    }
  }

  const filteredTransformations = transformations.filter((t) => {
    const matchesStatus = !filterStatus || t.status === filterStatus
    const matchesSector = !filterSector || t.sector === filterSector
    const matchesSearch =
      !searchTerm ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.folioNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.client.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSector && matchesSearch
  })

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 300 }}>
          Transformaciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nueva Transformación
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar por folio, nombre o cliente..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  label="Estado"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Lead">Lead</MenuItem>
                  <MenuItem value="Levantamiento">Levantamiento</MenuItem>
                  <MenuItem value="Cotización">Cotización</MenuItem>
                  <MenuItem value="Diseño">Diseño</MenuItem>
                  <MenuItem value="Instalación">Instalación</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sector</InputLabel>
                <Select
                  value={filterSector}
                  label="Sector"
                  onChange={(e) => setFilterSector(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Residencial">Residencial</MenuItem>
                  <MenuItem value="Comercial">Comercial</MenuItem>
                  <MenuItem value="Corporativo">Corporativo</MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Transformations Grid */}
      <Grid container spacing={3}>
        {filteredTransformations.map((transformation) => (
          <Grid item xs={12} md={6} lg={4} key={transformation.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip
                    label={transformation.status}
                    size="small"
                    color={getStatusColor(transformation.status)}
                  />
                  <Chip
                    label={transformation.priority}
                    size="small"
                    color={getPriorityColor(transformation.priority)}
                  />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  {transformation.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {transformation.folioNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cliente: {transformation.client}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Sector: {transformation.sector}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Journey: {transformation.journeyPhase}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transformation.progress}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#e0e0e0',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${transformation.progress}%`,
                        backgroundColor: getJourneyColor(transformation.journeyPhase),
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>
                  Presupuesto: ${transformation.estimatedBudget.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* New Transformation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nueva Transformación</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField label="Nombre del proyecto" fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Cliente" fullWidth value={newClient} onChange={(e) => setNewClient(e.target.value)} />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select value={newStatus} label="Estado" onChange={(e) => setNewStatus(e.target.value)}>
                  <MenuItem value="Lead">Lead</MenuItem>
                  <MenuItem value="Levantamiento">Levantamiento</MenuItem>
                  <MenuItem value="Cotización">Cotización</MenuItem>
                  <MenuItem value="Diseño">Diseño</MenuItem>
                  <MenuItem value="Instalación">Instalación</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sector</InputLabel>
                <Select value={newSector} label="Sector" onChange={(e) => setNewSector(e.target.value)}>
                  <MenuItem value="Residencial">Residencial</MenuItem>
                  <MenuItem value="Comercial">Comercial</MenuItem>
                  <MenuItem value="Corporativo">Corporativo</MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Presupuesto estimado" type="number" fullWidth value={newBudget} onChange={(e) => setNewBudget(Number(e.target.value))} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => {
            // Simple client-side create
            const newItem = {
              id: String(Date.now()),
              folioNumber: `TRANS-LOCAL-${Date.now()}`,
              name: newName || 'Proyecto sin nombre',
              client: newClient || 'Cliente sin nombre',
              sector: newSector,
              status: newStatus,
              priority: 'Media',
              journeyPhase: 'Discover',
              estimatedBudget: newBudget || 0,
              startDate: null,
              progress: 0,
            }
            setTransformations([newItem, ...transformations])
            setOpenDialog(false)
            // reset form
            setNewName('')
            setNewClient('')
            setNewSector('Residencial')
            setNewStatus('Cotización')
            setNewBudget(0)
          }}>Crear</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Transformations