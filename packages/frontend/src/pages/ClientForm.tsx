import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Stack,
} from '@mui/material'
import { ClientFormData } from '../types/api'

const clientTypes = ['Regular', 'VIP', 'New']
const statuses = ['Active', 'Inactive', 'Archived']

const ClientForm: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ClientFormData>({
    code: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    clientType: 'Regular',
    status: 'Active',
    notes: '',
  })

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/v1/clients/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success) setForm(data.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const setField = (key: keyof ClientFormData, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('shadex_token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      const payload = { ...form }
      let res
      if (id) {
        res = await fetch(`/api/v1/clients/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
      } else {
        res = await fetch('/api/v1/clients', { method: 'POST', headers, body: JSON.stringify(payload) })
      }
      const body = await res.json()
      if (body && body.success) {
        if (id) navigate(`/clients/${id}`)
        else navigate(`/clients/${body.data.id}`)
      } else {
        alert('Failed to save client')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to save client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{id ? 'Editar Cliente' : 'Nuevo Cliente'}</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Código" value={form.code} onChange={(e) => setField('code', e.target.value)} fullWidth />
            <TextField label="Nombre" value={form.name} onChange={(e) => setField('name', e.target.value)} fullWidth required />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Email" value={form.email} onChange={(e) => setField('email', e.target.value)} fullWidth />
            <TextField label="Teléfono" value={form.phone} onChange={(e) => setField('phone', e.target.value)} fullWidth />
          </Box>
          <TextField label="Dirección" value={form.address} onChange={(e) => setField('address', e.target.value)} fullWidth />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Ciudad" value={form.city} onChange={(e) => setField('city', e.target.value)} fullWidth />
            <TextField label="Estado" value={form.state} onChange={(e) => setField('state', e.target.value)} fullWidth />
            <TextField label="País" value={form.country} onChange={(e) => setField('country', e.target.value)} fullWidth />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Código Postal" value={form.zipCode} onChange={(e) => setField('zipCode', e.target.value)} fullWidth />
            <TextField label="Persona de Contacto" value={form.contactPerson} onChange={(e) => setField('contactPerson', e.target.value)} fullWidth />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Contacto Email" value={form.contactEmail} onChange={(e) => setField('contactEmail', e.target.value)} fullWidth />
            <TextField label="Contacto Teléfono" value={form.contactPhone} onChange={(e) => setField('contactPhone', e.target.value)} fullWidth />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField select label="Tipo" value={form.clientType} onChange={(e) => setField('clientType', e.target.value)} sx={{ minWidth: 160 }}>
              {clientTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField select label="Estado" value={form.status} onChange={(e) => setField('status', e.target.value)} sx={{ minWidth: 160 }}>
              {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Box>
          <TextField label="Notas" value={form.notes} onChange={(e) => setField('notes', e.target.value)} fullWidth multiline minRows={3} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>{id ? 'Guardar' : 'Crear'}</Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}

export default ClientForm
