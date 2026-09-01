import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { apiFetch } from '../api'

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([])
  const [newTask, setNewTask] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await apiFetch('/api/v1/tasks')
      const data = await res.json()
      if (data.success) setTasks(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async () => {
    if (!newTask.trim()) return
    try {
      const res = await apiFetch('/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newTask, priority })
      })
      const data = await res.json()
      if (data.success) {
        setTasks([data.data, ...tasks])
        setNewTask('')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleComplete = async (task: any) => {
    try {
      const res = await apiFetch(`/api/v1/tasks/${task.id}/${task.isCompleted ? 'complete' : 'complete'}`, { method: 'PATCH' })
      const data = await res.json()
      if (data.success) setTasks(tasks.map(t => t.id === task.id ? data.data : t))
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTask = async (id: string) => {
    if (!confirm('¿Eliminar tarea?')) return
    try {
      await apiFetch(`/api/v1/tasks/${id}`, { method: 'DELETE' })
      setTasks(tasks.filter(t => t.id !== id))
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
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Tareas</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Seguimiento de actividades y recordatorios
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Nueva tarea"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createTask()}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Prioridad</InputLabel>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <MenuItem value="LOW">Baja</MenuItem>
                <MenuItem value="MEDIUM">Media</MenuItem>
                <MenuItem value="HIGH">Alta</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={createTask}>Agregar</Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {tasks.length === 0 ? (
            <Typography variant="body2" color="text.secondary">Sin tareas</Typography>
          ) : (
            <List>
              {tasks.map((task: any) => (
                <ListItem
                  key={task.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => deleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ background: task.isCompleted ? '#f5f5f5' : 'transparent' }}
                >
                  <Checkbox
                    checked={task.isCompleted}
                    onChange={() => toggleComplete(task)}
                  />
                  <ListItemText
                    primary={task.description}
                    secondary={`${task.priority} — ${task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-MX') : 'Sin fecha'}`}
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

export default Tasks