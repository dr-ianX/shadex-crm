import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
} from '@mui/material'
import { apiFetch } from '../api'

const defaultDetails = {
  model: '',
  color: '',
  transparencyOn: '',
  transparencyOff: '',
  voltage: '',
  power: '',
  transformer: '',
  circuits: '',
  controlType: '',
  switchType: '',
  remote: '',
  app: '',
  automation: '',
  residentialIntegration: '',
  connections: '',
  testsPerformed: ''
}

const SmartFilmDetails = ({ installationId, data }: { installationId: string, data?: any }) => {
  const [details, setDetails] = useState<any>(defaultDetails)

  useEffect(() => {
    if (data) setDetails({ ...defaultDetails, ...data })
  }, [data])

  const handleSave = async () => {
    try {
      await apiFetch(`/api/v1/installations/${installationId}/smart-film`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      })
      alert('Datos SmartFilm guardados')
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (field: string, value: string) => {
    setDetails({ ...details, [field]: value })
  }

  const fields = [
    { key: 'model', label: 'Modelo / Línea' },
    { key: 'color', label: 'Color' },
    { key: 'transparencyOn', label: 'Transparencia ON' },
    { key: 'transparencyOff', label: 'Transparencia OFF' },
    { key: 'voltage', label: 'Voltaje' },
    { key: 'power', label: 'Potencia' },
    { key: 'transformer', label: 'Transformador' },
    { key: 'circuits', label: 'Número de circuitos' },
    { key: 'controlType', label: 'Tipo de control' },
    { key: 'switchType', label: 'Interruptor' },
    { key: 'remote', label: 'Control remoto' },
    { key: 'app', label: 'App' },
    { key: 'automation', label: 'Automatización' },
    { key: 'residentialIntegration', label: 'Integración residencial' },
    { key: 'connections', label: 'Conexiones' },
    { key: 'testsPerformed', label: 'Pruebas realizadas' },
  ]

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Detalles SmartFilm
        </Typography>
        <Grid container spacing={2}>
          {fields.map((f) => (
            <Grid item xs={12} sm={6} md={3} key={f.key}>
              <TextField
                label={f.label}
                fullWidth
                size="small"
                value={details[f.key] || ''}
                onChange={(e) => handleChange(f.key, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SmartFilmDetails