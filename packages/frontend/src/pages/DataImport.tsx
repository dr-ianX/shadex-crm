import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  LinearProgress,
} from '@mui/material'
import { UploadFile as UploadIcon } from '@mui/icons-material'
import { apiFetch } from '../api'

const DataImport = () => {
  const [csv, setCsv] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleImport = async () => {
    if (!csv.trim()) return
    setLoading(true)
    setResult(null)
    const rows = csv.split('\n').filter(r => r.trim())
    let created = 0
    let errors = 0
    const lines = rows[0].startsWith('name') ? rows.slice(1) : rows

    for (const line of lines) {
      const cols = line.split(',').map(c => c.trim())
      if (cols.length < 4) continue
      const [name, lastName, phone, email, company, type] = cols
      const payload = {
        name,
        lastName,
        phone,
        email,
        companyName: company || '',
        type: (type || 'RESIDENTIAL').toUpperCase()
      }
      try {
        const res = await apiFetch('/api/v1/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (data.success) created++
        else errors++
      } catch (err) {
        errors++
      }
    }
    setResult({ created, errors, total: lines.length })
    setLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setCsv(text)
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Importar clientes</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Sube un CSV con columnas: name, lastName, phone, email, companyName, type
      </Typography>

      {result && (
        <Alert severity={result.errors > 0 ? 'warning' : 'success'} sx={{ mb: 3 }}>
          Importados: {result.created} de {result.total}. Errores: {result.errors}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" component="label">
              <UploadIcon sx={{ mr: 1 }} /> Cargar CSV
              <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
            </Button>
          </Box>
          <TextField
            multiline
            rows={10}
            fullWidth
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder="name,lastName,phone,email,companyName,type"
          />
          {loading && <LinearProgress sx={{ mt: 2 }} />}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleImport} disabled={loading}>
              Importar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default DataImport