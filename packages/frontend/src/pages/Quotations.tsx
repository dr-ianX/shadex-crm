import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  TableContainer,
  Stack,
  Divider,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'

import { LineItem, Quotation, Client, Transformation } from '../types/api'

const Quotations: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [clientName, setClientName] = useState<string>('')
  const [description, setDescription] = useState('Trabajo de muestra')
  const [lines, setLines] = useState<LineItem[]>([
    { id: String(Date.now()), description: 'Trabajo de muestra', quantity: 1, unitPrice: 1000, lineTotal: 1000 },
  ])
  const taxPercent = 16
  const [transformations, setTransformations] = useState<Transformation[]>([])
  const [selectedTransformationId, setSelectedTransformationId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/v1/quotations')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success) setQuotations(data.data as Quotation[])
      })
      .catch((err) => console.error(err))

    // Try to load clients; if endpoint missing, allow manual entry
    fetch('/api/v1/clients')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success) setClients(data.data as Client[])
      })
      .catch(() => setClients([]))

    // Load transformations for selection
    fetch('/api/v1/transformations')
      .then((r) => r.json())
      .then((data) => { if (data && data.success) setTransformations(data.data as Transformation[]) })
      .catch(() => setTransformations([]))
  }, [])

  const addLine = () => {
    const newLine: LineItem = { id: String(Date.now()), description: '', quantity: 1, unitPrice: 0, lineTotal: 0 }
    setLines((s) => [...s, newLine])
  }

  const updateLine = (id: string, updates: Partial<LineItem>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates, lineTotal: (updates.quantity ?? l.quantity) * (updates.unitPrice ?? l.unitPrice) } : l)))
  }

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  const subtotal = lines.reduce((s, l) => s + Number(l.lineTotal || 0), 0)
  const taxAmount = Number(((subtotal * taxPercent) / 100).toFixed(2))
  const total = Number((subtotal + taxAmount).toFixed(2))

  const handleCreate = async () => {
    const payload = {
      clientId: selectedClientId || undefined,
      transformationId: selectedTransformationId || undefined,
      createdBy: clientName || (clients.find((c) => c.id === selectedClientId)?.name ?? null),
      notes: description,
      lines: lines.map((l) => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice })),
      taxPercent,
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const token = localStorage.getItem('shadex_token')
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch('/api/v1/quotations', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })
    const body = await res.json()
    if (body && body.success) {
      setQuotations((s) => [body.data, ...s])
      setOpen(false)
      // reset form
      setLines([{ id: String(Date.now()), description: 'Trabajo de muestra', quantity: 1, unitPrice: 1000, lineTotal: 1000 }])
      setDescription('Trabajo de muestra')
      setSelectedClientId(null)
    } else {
      alert('Failed to create quotation')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Cotizaciones</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Nueva Cotización</Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>IVA</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Creado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotations.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{q.quotationNumber}</TableCell>
                  <TableCell>{q.status}</TableCell>
                  <TableCell>{q.subtotal}</TableCell>
                  <TableCell>{q.taxAmount}</TableCell>
                  <TableCell>{q.totalAmount}</TableCell>
                  <TableCell>{q.createdAt ? new Date(q.createdAt).toLocaleString() : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Nueva Cotización</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {clients.length > 0 ? (
                <Select sx={{ minWidth: 240 }} value={selectedClientId ?? ''} displayEmpty onChange={(e) => setSelectedClientId(e.target.value as string)}>
                  <MenuItem value="">-- Seleccionar cliente --</MenuItem>
                  {clients.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              ) : (
                <TextField fullWidth label="Cliente (nombre)" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              )}

              <Select sx={{ minWidth: 240 }} value={selectedTransformationId ?? ''} displayEmpty onChange={(e) => setSelectedTransformationId(e.target.value as string)}>
                <MenuItem value="">-- Sin proyecto --</MenuItem>
                {transformations.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.name || t.folioNumber}</MenuItem>
                ))}
              </Select>
            </Box>

            <TextField fullWidth label="Notas / Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />

            <Divider />

            <Typography variant="subtitle1">Líneas</Typography>
            <Paper variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio Unitario</TableCell>
                    <TableCell>Importe</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>
                        <TextField fullWidth value={line.description} onChange={(e) => updateLine(line.id, { description: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <TextField type="number" value={line.quantity} onChange={(e) => updateLine(line.id, { quantity: Number(e.target.value) })} />
                      </TableCell>
                      <TableCell>
                        <TextField type="number" value={line.unitPrice} onChange={(e) => updateLine(line.id, { unitPrice: Number(e.target.value) })} />
                      </TableCell>
                      <TableCell>{(line.lineTotal || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="error" onClick={() => removeLine(line.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button startIcon={<AddIcon />} onClick={addLine}>Agregar línea</Button>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography>Subtotal: {subtotal.toFixed(2)}</Typography>
                <Typography>IVA ({taxPercent}%): {taxAmount.toFixed(2)}</Typography>
                <Typography variant="h6">Total: {total.toFixed(2)}</Typography>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate}>Crear</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Quotations
