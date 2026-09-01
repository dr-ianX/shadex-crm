import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material'
import { apiFetch } from '../api'

const Calendar = () => {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const [iRes, aRes] = await Promise.all([apiFetch('/api/v1/installations'), apiFetch('/api/v1/appointments')])
      const [iData, aData] = await Promise.all([iRes.json(), aRes.json()])
      const installations = (iData.success ? iData.data : []).map((x: any) => ({ ...x, kind: 'Instalación', date: new Date(x.date) }))
      const appointments = (aData.success ? aData.data : []).map((x: any) => ({ ...x, kind: 'Cita', date: new Date(x.startDate) }))
      const sorted = [...installations, ...appointments].sort((a: any, b: any) => a.date - b.date)
      setEvents(sorted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
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
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Calendario</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Instalaciones y citas programadas
      </Typography>

      <Card>
        <CardContent>
          {events.length === 0 ? (
            <Typography variant="body2" color="text.secondary">Sin eventos</Typography>
          ) : (
            <List>
              {events.map((e: any) => (
                <ListItem key={e.id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={e.kind} size="small" color={e.kind === 'Instalación' ? 'primary' : 'secondary'} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{e.project?.name || e.title}</Typography>
                      </Box>
                    }
                    secondary={e.date.toLocaleString('es-MX')}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Calendar