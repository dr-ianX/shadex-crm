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
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material'
import { Add as AddIcon, Block as BlockIcon } from '@mui/icons-material'
import { apiFetch } from '../api'

const roles = ['ADMIN', 'SALES', 'OPERATIONS', 'INSTALLER', 'FINANCE', 'WAREHOUSE', 'SUPPORT']

const Users = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'SALES', phone: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await apiFetch('/api/v1/users')
      const data = await res.json()
      if (data.success) setUsers(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const res = await apiFetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setUsers([data.data, ...users])
        setOpen(false)
        setForm({ name: '', email: '', password: '', role: 'SALES', phone: '' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleActive = async (id: string) => {
    try {
      const res = await apiFetch(`/api/v1/users/${id}/toggle`, { method: 'PATCH' })
      const data = await res.json()
      if (data.success) setUsers(users.map(u => u.id === id ? data.data : u))
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Usuarios</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Nuevo usuario
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Chip label={u.role} size="small" /></TableCell>
                    <TableCell>{u.phone || '—'}</TableCell>
                    <TableCell>
                      <Chip label={u.isActive ? 'Activo' : 'Inactivo'} color={u.isActive ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Button size="small" startIcon={<BlockIcon />} onClick={() => toggleActive(u.id)}>
                        {u.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo usuario</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Nombre" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Email" fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextField label="Contraseña" type="password" fullWidth value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <TextField label="Teléfono" fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {roles.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreate} variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Users