import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { apiFetch } from '../api'

const ProjectSpaces = ({ projectId }: { projectId: string }) => {
  const [spaces, setSpaces] = useState<any[]>([])
  const [form, setForm] = useState<any>({
    name: '',
    width: '',
    height: '',
    quantity: 1,
    unit: 'mm',
    notes: ''
  })

  useEffect(() => {
    fetchSpaces()
  }, [projectId])

  const fetchSpaces = async () => {
    try {
      const res = await apiFetch(`/api/v1/projects/${projectId}/spaces`)
      const data = await res.json()
      if (data.success) setSpaces(data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAdd = async () => {
    if (!form.name || !form.width || !form.height) return
    try {
      const res = await apiFetch(`/api/v1/projects/${projectId}/spaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setSpaces([...spaces, data.data])
        setForm({ name: '', width: '', height: '', quantity: 1, unit: 'mm', notes: '' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (spaceId: string) => {
    if (!confirm('¿Eliminar este espacio?')) return
    try {
      await apiFetch(`/api/v1/spaces/${spaceId}`, { method: 'DELETE' })
      setSpaces(spaces.filter((s: any) => s.id !== spaceId))
    } catch (err) {
      console.error(err)
    }
  }

  const totalArea = spaces.reduce((sum: number, s: any) => sum + (s.areaSqm || 0), 0)

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Levantamiento / Espacios
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField label="Nombre" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ventanal sala 01" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Ancho" fullWidth type="number" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Alto" fullWidth type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField label="Cantidad" fullWidth type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Unidad</InputLabel>
              <Select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <MenuItem value="mm">mm</MenuItem>
                <MenuItem value="cm">cm</MenuItem>
                <MenuItem value="m">m</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Notas" fullWidth value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" onClick={handleAdd} fullWidth>
              Agregar espacio
            </Button>
          </Grid>
        </Grid>

        {spaces.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Área total: <strong>{totalArea.toFixed(2)} m²</strong>
            </Typography>
          </Box>
        )}

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Medidas</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>m²</TableCell>
                <TableCell>Notas</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {spaces.map((space: any) => (
                <TableRow key={space.id}>
                  <TableCell>{space.name}</TableCell>
                  <TableCell>{space.width} × {space.height} mm</TableCell>
                  <TableCell>{space.quantity}</TableCell>
                  <TableCell>{space.areaSqm?.toFixed(2)}</TableCell>
                  <TableCell>{space.notes || '-'}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => handleDelete(space.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default ProjectSpaces