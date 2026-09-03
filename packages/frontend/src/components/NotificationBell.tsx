import { useState, useEffect, useRef } from 'react'
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { Notifications as NotificationsIcon } from '@mui/icons-material'
import { authService } from '../services/authService'

const POLL_INTERVAL = 60000

const NotificationBell = () => {
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stoppedRef = useRef(false)

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const fetchUnreadCount = async () => {
    const token = authService.getAccessToken()
    if (!token || stoppedRef.current) return

    try {
      const res = await authService.fetchWithAuth('/api/v1/notifications/unread-count')
      if (res.status === 401) {
        stoppedRef.current = true
        stopPolling()
        return
      }
      if (!res.ok) return
      const data = await res.json()
      if (data.success) setCount(data.data)
    } catch (err) {
      // Network errors on polling are expected when the service is idle; stay silent.
    }
  }

  const startPolling = () => {
    if (!authService.getAccessToken() || intervalRef.current) return
    stoppedRef.current = false
    fetchUnreadCount()
    intervalRef.current = setInterval(() => {
      if (document.hidden || !authService.getAccessToken()) return
      fetchUnreadCount()
    }, POLL_INTERVAL)
  }

  useEffect(() => {
    startPolling()
    const handleVisibility = () => {
      if (document.hidden) return
      if (!intervalRef.current && authService.getAccessToken()) {
        startPolling()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      stopPolling()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const fetchNotifications = async () => {
    const token = authService.getAccessToken()
    if (!token) return
    try {
      const res = await authService.fetchWithAuth('/api/v1/notifications')
      if (!res.ok) return
      const data = await res.json()
      if (data.success) setNotifications(data.data)
    } catch (err) {
      // silent
    }
  }

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchor(e.currentTarget)
    fetchNotifications()
  }

  const handleClose = () => {
    setAnchor(null)
  }

  const markAsRead = async (id: string) => {
    try {
      const res = await authService.fetchWithAuth(`/api/v1/notifications/${id}/read`, { method: 'PATCH' })
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
        setCount(Math.max(0, count - 1))
      }
    } catch (err) {
      // silent
    }
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={count} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ width: 360, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Notificaciones</Typography>
          {notifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary">Sin notificaciones</Typography>
          ) : (
            <List dense>
              {notifications.map((n: any) => (
                <ListItem
                  key={n.id}
                  sx={{ background: n.isRead ? 'transparent' : 'rgba(90,125,176,0.12)', borderRadius: 1, mb: 1, cursor: 'pointer' }}
                  onClick={() => markAsRead(n.id)}
                >
                  <ListItemText
                    primary={n.title}
                    secondary={n.message}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  )
}

export default NotificationBell
