import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { apiFetch } from '../api'

const Search = () => {
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [results, setResults] = useState<any[]>([])
  const [tab, setTab] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) search()
  }, [query, tab])

  const search = async () => {
    if (!query) return
    setLoading(true)
    try {
      const res = await apiFetch(`/api/v1/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.success) setResults(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = tab === 'all' ? results : results.filter((r: any) => r.type === tab)

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Búsqueda avanzada</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Busca clientes, proyectos, cotizaciones y garantías
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
            />
            <Button variant="contained" startIcon={<SearchIcon />} onClick={search}>
              Buscar
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab value="all" label="Todos" />
        <Tab value="client" label="Clientes" />
        <Tab value="project" label="Proyectos" />
        <Tab value="quotation" label="Cotizaciones" />
        <Tab value="warranty" label="Garantías" />
      </Tabs>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Card>
          <CardContent>
            {filtered.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Sin resultados</Typography>
            ) : (
              <List>
                {filtered.map((r: any, i: number) => (
                  <ListItem key={i} divider>
                    <ListItemText
                      primary={r.name || r.title || r.folio || r.warrantyId}
                      secondary={`${r.type} — ${r.id?.slice(0, 8)}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default Search