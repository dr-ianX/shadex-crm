import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material'
import { apiFetch } from '../api'
import { authService } from '../services/authService'

const ChangePassword = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ current: '', new: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (form.new !== form.confirm) {
      setError('La nueva contraseña no coincide')
      return
    }
    if (form.new.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.new })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => {
        authService.logout()
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Cambiar Contraseña
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Cada usuario puede modificar su propia contraseña
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>Contraseña actualizada. Inicia sesión de nuevo.</Alert>}

      <Card>
        <CardContent>
          <TextField label="Contraseña actual" type="password" fullWidth sx={{ mb: 2 }} value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
          <TextField label="Nueva contraseña" type="password" fullWidth sx={{ mb: 2 }} value={form.new} onChange={(e) => setForm({ ...form, new: e.target.value })} />
          <TextField label="Confirmar nueva contraseña" type="password" fullWidth sx={{ mb: 3 }} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />

          <Button variant="contained" onClick={handleSubmit} disabled={loading} fullWidth>
            {loading ? <CircularProgress size={24} /> : 'Actualizar Contraseña'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ChangePassword