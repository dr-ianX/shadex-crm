import { useState, useEffect } from 'react'
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
import { apiFetch } from '../api'

const NotificationBell = () => {
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const res = await apiFetch('/api/v1/notifications/unread-count')
      const data = await res.json()
      if (data.success) setCount(data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch('/api/v1/notifications')
      const data = await res.json()
      if (data.success) setNotifications(data.data)
    } catch (err) {
      console.error(err)
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
      await apiFetch(`/api/v1/notifications/${id}/read`, { method: 'PATCH' })
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
      setCount(Math.max(0, count - 1))
    } catch (err) {
      console.error(err)
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
                  sx={{ background: n.isRead ? 'transparent' : '#f0f7ff', borderRadius: 1, mb: 1, cursor: 'pointer' }}
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