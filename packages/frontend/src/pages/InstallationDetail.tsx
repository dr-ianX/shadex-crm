import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { CheckCircle, PhotoCamera } from '@mui/icons-material'
import { apiFetch } from '../api'
import SmartFilmDetails from '../components/SmartFilmDetails'
import FileUpload from '../components/FileUpload'
import SignaturePad from '../components/SignaturePad'

const defaultChecklist: Record<string, string[]> = {
  BEFORE: [
    'Cristal inspeccionado',
    'Material correcto',
    'Área protegida',
    'Fotografías tomadas'
  ],
  DURING: [
    'Producto confirmado',
    'Consumo registrado',
    'Incidencias documentadas'
  ],
  AFTER: [
    'Limpieza',
    'Inspección',
    'Funcionamiento',
    'Fotografías',
    'Aceptación cliente',
    'Material sobrante',
    'Desperdicio'
  ]
}

const phaseLabels: Record<string, string> = {
  BEFORE: 'Antes',
  DURING: 'Durante',
  AFTER: 'Después'
}

const InstallationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [installation, setInstallation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [checklist, setChecklist] = useState<any[]>([])
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [evidenceDesc, setEvidenceDesc] = useState('')
  const [evidenceType, setEvidenceType] = useState('BEFORE')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchInstallation()
  }, [id])

  const fetchInstallation = async () => {
    try {
      const response = await apiFetch(`/api/v1/installations/${id}`)
      const data = await response.json()
      if (data.success) {
        setInstallation(data.data)
        if (data.data.checklists?.length > 0) {
          setChecklist(data.data.checklists)
        } else {
          initializeChecklist()
        }
      }
    } catch (err) {
      console.error('Error fetching installation:', err)
    } finally {
      setLoading(false)
    }
  }

  const initializeChecklist = () => {
    const items: any[] = []
    Object.entries(defaultChecklist).forEach(([phase, list]) => {
      list.forEach(item => {
        items.push({ phase, item, isCompleted: false, notes: '' })
      })
    })
    setChecklist(items)
  }

  const toggleItem = (index: number) => {
    const newChecklist = [...checklist]
    newChecklist[index].isCompleted = !newChecklist[index].isCompleted
    newChecklist[index].completedAt = newChecklist[index].isCompleted ? new Date().toISOString() : null
    setChecklist(newChecklist)
  }

  const updateNotes = (index: number, notes: string) => {
    const newChecklist = [...checklist]
    newChecklist[index].notes = notes
    setChecklist(newChecklist)
  }

  const saveChecklist = async () => {
    setSaving(true)
    setError('')
    try {
      const response = await apiFetch(`/api/v1/installations/${id}/checklist`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklistItems: checklist })
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error)
    } catch (err: any) {
      setError(err.message || 'Error al guardar checklist')
    } finally {
      setSaving(false)
    }
  }

  const completeInstallation = async () => {
    try {
      const response = await apiFetch(`/api/v1/installations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' })
      })
      const data = await response.json()
      if (data.success) setInstallation(data.data)
    } catch (err) {
      console.error('Error completing installation:', err)
    }
  }

  const addEvidence = async () => {
    if (!evidenceUrl) return
    setUploading(true)
    try {
      const response = await apiFetch(`/api/v1/installations/${id}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: evidenceType,
          fileUrl: evidenceUrl,
          description: evidenceDesc,
          uploadedAt: new Date().toISOString()
        })
      })
      const data = await response.json()
      if (data.success) {
        setInstallation({ ...installation, evidences: [...(installation.evidences || []), data.data] })
        setEvidenceUrl('')
        setEvidenceDesc('')
      }
    } catch (err) {
      console.error('Error adding evidence:', err)
    } finally {
      setUploading(false)
    }
  }

  const deleteEvidence = async (evidenceId: string) => {
    if (!confirm('¿Eliminar esta evidencia?')) return
    try {
      await apiFetch(`/api/v1/installations/evidence/${evidenceId}`, { method: 'DELETE' })
      setInstallation({ ...installation, evidences: installation.evidences?.filter((e: any) => e.id !== evidenceId) })
    } catch (err) {
      console.error('Error deleting evidence:', err)
    }
  }

  const evidenceTypeLabels: Record<string, string> = {
    'ARRIVAL': 'Llegada',
    'BEFORE': 'Antes',
    'AFTER': 'Después',
    'ISSUE': 'Incidencia'
  }

  const saveSignature = async (type: string, data: string) => {
    try {
      const current = (installation.signatures as any) || {}
      const res = await apiFetch(`/api/v1/installations/${id}/signatures`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, [type]: data })
      })
      const result = await res.json()
      if (result.success) setInstallation({ ...installation, signatures: result.data.signatures })
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'SCHEDULED': '#2aa6ff',
      'IN_PROGRESS': '#f59e0b',
      'COMPLETED': '#10b981',
      'CANCELLED': '#d32f2f'
    }
    return colors[status] || '#gray'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'SCHEDULED': 'Programada',
      'IN_PROGRESS': 'En progreso',
      'COMPLETED': 'Completada',
      'CANCELLED': 'Cancelada'
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!installation) {
    return <Alert severity="error">Instalación no encontrada</Alert>
  }

  const phases = ['BEFORE', 'DURING', 'AFTER']

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Orden {installation.workOrderId}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {installation.project?.name} • {installation.client?.name} {installation.client?.lastName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/installations')}>
            Volver
          </Button>
          {installation.status !== 'COMPLETED' && (
            <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={completeInstallation}>
              Cerrar Instalación
            </Button>
          )}
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Chip
        label={getStatusLabel(installation.status)}
        sx={{
          background: `${getStatusColor(installation.status)}20`,
          color: getStatusColor(installation.status),
          fontWeight: 600,
          mb: 3
        }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Detalles
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Proyecto</Typography>
                <Typography variant="body1">{installation.project?.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                <Typography variant="body1">{new Date(installation.date).toLocaleDateString('es-MX')}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Ubicación</Typography>
                <Typography variant="body1">{installation.location}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Producto</Typography>
                <Typography variant="body1">{installation.product}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Instalador</Typography>
                <Typography variant="body1">{installation.installerId}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Checklist
              </Typography>

              {phases.map(phase => (
                <Box key={phase} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#2aa6ff' }}>
                    {phaseLabels[phase]}
                  </Typography>
                  {checklist.filter((item: any) => item.phase === phase).map((item: any) => {
                    const realIndex = checklist.indexOf(item)
                    return (
                      <Box key={realIndex} sx={{ mb: 2, pl: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.isCompleted}
                              onChange={() => toggleItem(realIndex)}
                            />
                          }
                          label={item.item}
                        />
                        <TextField
                          size="small"
                          placeholder="Notas"
                          fullWidth
                          value={item.notes || ''}
                          onChange={(e) => updateNotes(realIndex, e.target.value)}
                        />
                      </Box>
                    )
                  })}
                </Box>
              ))}

              <Button variant="contained" onClick={saveChecklist} disabled={saving} fullWidth>
                {saving ? <CircularProgress size={24} /> : 'Guardar Checklist'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Evidencias
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select value={evidenceType} onChange={(e) => setEvidenceType(e.target.value)}>
                      <MenuItem value="ARRIVAL">{evidenceTypeLabels.ARRIVAL}</MenuItem>
                      <MenuItem value="BEFORE">{evidenceTypeLabels.BEFORE}</MenuItem>
                      <MenuItem value="AFTER">{evidenceTypeLabels.AFTER}</MenuItem>
                      <MenuItem value="ISSUE">{evidenceTypeLabels.ISSUE}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FileUpload onUpload={(urls) => setEvidenceUrl(urls[0])} />
                  {evidenceUrl && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {evidenceUrl}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button variant="contained" startIcon={<PhotoCamera />} onClick={addEvidence} disabled={uploading || !evidenceUrl} fullWidth>
                    {uploading ? <CircularProgress size={24} /> : 'Agregar'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Descripción" fullWidth value={evidenceDesc} onChange={(e) => setEvidenceDesc(e.target.value)} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                {installation.evidences?.map((ev: any) => (
                  <Grid item xs={12} sm={6} md={4} key={ev.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {evidenceTypeLabels[ev.type] || ev.type}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                          {new Date(ev.uploadedAt).toLocaleDateString('es-MX')}
                        </Typography>
                        <Box sx={{ mb: 1 }}>
                          <img src={ev.fileUrl} alt={ev.description} style={{ width: '100%', borderRadius: 4, maxHeight: 160, objectFit: 'cover' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {ev.description || 'Sin descripción'}
                        </Typography>
                        <Button size="small" color="error" onClick={() => deleteEvidence(ev.id)}>
                          Eliminar
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {installation.evidences?.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Sin evidencias registradas
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Firma del instalador</Typography>
                {installation.signatures?.installer ? (
                  <Box>
                    <Box component="img" src={installation.signatures.installer} sx={{ width: '100%', maxHeight: 150, border: '1px solid #ccc', borderRadius: 1 }} />
                    <Typography variant="caption" color="text.secondary">Guardada</Typography>
                  </Box>
                ) : (
                  <SignaturePad onSave={(data) => saveSignature('installer', data)} />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Firma del cliente</Typography>
                {installation.signatures?.client ? (
                  <Box>
                    <Box component="img" src={installation.signatures.client} sx={{ width: '100%', maxHeight: 150, border: '1px solid #ccc', borderRadius: 1 }} />
                    <Typography variant="caption" color="text.secondary">Guardada</Typography>
                  </Box>
                ) : (
                  <SignaturePad onSave={(data) => saveSignature('client', data)} />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <SmartFilmDetails installationId={installation.id} data={installation.smartFilmDetails} />
      </Box>
    </Box>
  )
}

export default InstallationDetail