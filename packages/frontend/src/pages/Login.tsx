import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Avatar,
  CssBaseline,
} from '@mui/material'
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function isAxiosLike(obj: unknown): obj is { response?: { data?: { error?: string } }; message?: string } {
    return typeof obj === 'object' && obj !== null && (('response' in obj) || ('message' in obj))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authService.login(email, password)
      navigate('/')
    } catch (err: unknown) {
      console.error(err)
      let msg = 'Login failed'

      if (isAxiosLike(err)) {
        if (err.response?.data?.error) msg = err.response.data.error
        else if (err.message) msg = err.message
      }

      setError(msg)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          <LockOutlinedIcon fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mt: 2, fontWeight: 300 }}>
          SHADEX OS
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sistema de Transformaciones Arquitectónicas
        </Typography>
        <Card sx={{ width: '100%', mt: 2 }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Iniciar Sesión
              </Button>
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          © 2024 SHADEX. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  )
}

export default Login