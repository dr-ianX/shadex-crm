import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Divider,
  TextField,
  Popper,
  Paper,
  ClickAwayListener,
  ListItem as MuiListItem,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  AttachMoney as FinanceIcon,
  RequestQuote as QuoteIcon,
  People as ClientsIcon,
  Campaign as LeadsIcon,
  VerifiedUser as WarrantyIcon,
  Build as InstallationIcon,
  Category as ProductsIcon,
  Work as ProjectsIcon,
  Search as SearchIcon,
  Event as AppointmentIcon,
  Assessment as ReportsIcon,
  Brightness4 as LightIcon,
  Brightness7 as DarkIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import {
  Collapse,
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import NotificationBell from './NotificationBell'
import { apiFetch } from '../api'
import { useThemeMode } from '../context/ThemeContext'

const drawerWidth = 280

const menuGroups = [
  {
    title: 'Ventas',
    icon: <LeadsIcon />,
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
      { text: 'Leads', icon: <LeadsIcon />, path: '/leads' },
      { text: 'Leads Board', icon: <LeadsIcon />, path: '/leads/board' },
      { text: 'Clientes', icon: <ClientsIcon />, path: '/clients' },
      { text: 'Proyectos', icon: <ProjectsIcon />, path: '/projects' },
      { text: 'Tablero', icon: <ProjectsIcon />, path: '/projects/board' },
      { text: 'Cotizaciones', icon: <QuoteIcon />, path: '/quotations' },
    ],
  },
  {
    title: 'Productos',
    icon: <ProductsIcon />,
    items: [
      { text: 'Productos', icon: <ProductsIcon />, path: '/products' },
      { text: 'Inventario', icon: <InventoryIcon />, path: '/inventory' },
    ],
  },
  {
    title: 'Operaciones',
    icon: <InstallationIcon />,
    items: [
      { text: 'Instalaciones', icon: <InstallationIcon />, path: '/installations' },
      { text: 'Agenda', icon: <AppointmentIcon />, path: '/agenda' },
      { text: 'Garantías', icon: <WarrantyIcon />, path: '/warranties' },
      { text: 'Tareas', icon: <ReportsIcon />, path: '/tasks' },
      { text: 'Calendario', icon: <AppointmentIcon />, path: '/calendar' },
    ],
  },
  {
    title: 'Finanzas',
    icon: <FinanceIcon />,
    items: [
      { text: 'Finanzas', icon: <FinanceIcon />, path: '/finance' },
    ],
  },
  {
    title: 'Reportes',
    icon: <ReportsIcon />,
    items: [
      { text: 'Buscar', icon: <SearchIcon />, path: '/search' },
      { text: 'Importar', icon: <ClientsIcon />, path: '/import' },
      { text: 'Analytics', icon: <ReportsIcon />, path: '/analytics' },
      { text: 'Vendedores', icon: <ReportsIcon />, path: '/sales-performance' },
      { text: 'Auditoría', icon: <ReportsIcon />, path: '/audit' },
    ],
  },
  {
    title: 'Configuración',
    icon: <SettingsIcon />,
    items: [
      { text: 'Usuarios', icon: <ClientsIcon />, path: '/users' },
      { text: 'Empresa', icon: <ClientsIcon />, path: '/company' },
    ],
  },
]

interface LayoutProps {
  children: React.ReactNode
}

const SearchBar = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await apiFetch(`/api/v1/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (data.success) setResults(data.data)
      } catch (err) {
        console.error(err)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  const handleClick = (r: any) => {
    navigate(r.path)
    setOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${encodeURIComponent(query)}`)
      setOpen(false)
    }
  }

  const typeLabels: Record<string, string> = {
    CLIENT: 'Cliente',
    PROJECT: 'Proyecto',
    QUOTATION: 'Cotización',
    WARRANTY: 'Garantía'
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative', width: { xs: 120, sm: 280, md: 360 } }}>
        <TextField
          size="small"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setAnchorEl(e.currentTarget)
          }}
          onFocus={(e) => {
            setAnchorEl(e.currentTarget)
            if (query.length >= 2) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)', mr: 1, fontSize: 18 }} />,
            sx: {
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 2,
              color: 'white',
              '& input::placeholder': { color: 'rgba(255,255,255,0.4)' }
            }
          }}
          fullWidth
        />
        <Popper open={open && results.length > 0} anchorEl={anchorEl} placement="bottom-start" style={{ zIndex: 1400 }}>
          <Paper sx={{ width: { xs: 280, sm: 360, md: 420 }, maxHeight: 320, overflow: 'auto', mt: 1, background: 'rgba(6,18,30,0.98)', border: '1px solid rgba(42,166,255,0.2)' }}>
            {results.map((r: any, index: number) => (
              <MuiListItem
                key={index}
                onClick={() => handleClick(r)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(42,166,255,0.1)' },
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                    {r.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                    {typeLabels[r.type] || r.type} • {r.subtitle}
                  </Typography>
                </Box>
              </MuiListItem>
            ))}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    menuGroups.forEach((g) => {
      initial[g.title] = g.items.some((i) => location.pathname === i.path)
    })
    return initial
  })
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, toggleMode } = useThemeMode()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const [logoGlow, setLogoGlow] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setLogoGlow(prev => (prev + 1) % 360), 50)
    return () => clearInterval(interval)
  }, [])

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', py: 1.5 }}>
          <Box 
            component="img" 
            src="/assets/shadex-logo.svg" 
            alt="Shadex" 
            sx={{ 
              height: 42, 
              width: 42, 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 8px rgba(42,166,255,0.4))',
              animation: 'logoGlow 15s ease-in-out infinite'
            }} 
          />
          <Box>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: 0.5, background: 'linear-gradient(135deg, #ffffff 0%, #8ab4f8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SHADEX OS
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(232,236,239,0.6)', fontWeight: 500 }}>
              QUOD TANGO MUTO
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider sx={{ my: 0.5 }} />

      <List sx={{ px: 1.5, py: 1, flex: 1 }}>
        {menuGroups.map((group) => {
          const isOpen = !!openGroups[group.title]
          const hasActive = group.items.some((i) => location.pathname === i.path)
          return (
            <Box key={group.title} sx={{ mb: 1 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setOpenGroups((prev) => ({ ...prev, [group.title]: !prev[group.title] }))}
                  selected={hasActive}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, rgba(42,166,255,0.2) 0%, rgba(42,166,255,0.08) 100%)',
                      borderLeft: '3px solid #2aa6ff',
                    },
                    '&:hover': {
                      background: 'rgba(42,166,255,0.1)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: hasActive ? '#2aa6ff' : 'rgba(232,236,239,0.7)', minWidth: 40 }}>
                    {group.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={group.title}
                    primaryTypographyProps={{
                      sx: {
                        color: hasActive ? '#e8ecef' : 'rgba(232,236,239,0.8)',
                        fontWeight: hasActive ? 700 : 600,
                        fontSize: '0.92rem'
                      }
                    }}
                  />
                  {isOpen ? <ExpandLess sx={{ color: 'rgba(232,236,239,0.6)' }} /> : <ExpandMore sx={{ color: 'rgba(232,236,239,0.6)' }} />}
                </ListItemButton>
              </ListItem>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 2 }}>
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                          onClick={() => navigate(item.path)}
                          selected={isActive}
                          sx={{
                            borderRadius: 2,
                            py: 1.0,
                            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                            '&.Mui-selected': {
                              background: 'linear-gradient(135deg, rgba(42,166,255,0.2) 0%, rgba(42,166,255,0.08) 100%)',
                              borderLeft: '3px solid #2aa6ff',
                            },
                            '&:hover': {
                              background: 'rgba(42,166,255,0.1)',
                            }
                          }}
                        >
                          <ListItemIcon sx={{ color: isActive ? '#2aa6ff' : 'rgba(232,236,239,0.7)', minWidth: 40 }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              sx: {
                                color: isActive ? '#e8ecef' : 'rgba(232,236,239,0.8)',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '0.88rem'
                              }
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )
                  })}
                </List>
              </Collapse>
            </Box>
          )
        })}
      </List>

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          background: 'linear-gradient(135deg, rgba(42,166,255,0.1) 0%, rgba(42,166,255,0.02) 100%)',
          border: '1px solid rgba(42,166,255,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2aa6ff, #0d4a6b)',
              boxShadow: '0 0 15px rgba(42,166,255,0.5)'
            }} />
            <Typography variant="caption" sx={{ color: 'rgba(232,236,239,0.7)', fontWeight: 500 }}>
              Sistema Operativo
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(232,236,239,0.5)', display: 'block' }}>
            v1.0.0 — SHADEX
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          minHeight: 56,
          background: 'linear-gradient(180deg, rgba(2,8,14,0.98) 0%, rgba(3,10,18,0.95) 100%)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              borderRadius: 1.5,
              transition: 'all 200ms ease',
              '&:hover': {
                backgroundColor: 'rgba(42,166,255,0.1)',
              }
            }}
          >
            <MenuIcon sx={{ color: 'primary.main' }} />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, minWidth: 0 }}>
            <Box 
              component="img" 
              src="/assets/shadex-logo.png" 
              alt="Shadex" 
              sx={{ 
                height: 38, 
                width: 38, 
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 6px rgba(42,166,255,0.3))',
                animation: 'logoGlow 15s ease-in-out infinite'
              }} 
            />
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', minWidth: 0 }}>
              <Typography variant="h6" noWrap component="div" sx={{ 
                fontWeight: 700, 
                letterSpacing: 0.5,
                background: 'linear-gradient(135deg, #ffffff 0%, #8ab4f8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Sistema de Transformaciones Arquitectónicas
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'rgba(232,236,239,0.5)', 
                fontWeight: 500
              }}>
                Innovación & Diseño
              </Typography>
            </Box>
          </Box>

          <SearchBar />
          
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2.5, ml: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.8, borderRadius: 2, background: 'rgba(42,166,255,0.08)', border: '1px solid rgba(42,166,255,0.15)' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#e8ecef' }}>
                USD
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={toggleMode}>
              {mode === 'dark' ? <DarkIcon /> : <LightIcon />}
            </IconButton>
            <NotificationBell />

            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderRadius: 2, background: 'rgba(42,166,255,0.08)', border: '1px solid rgba(42,166,255,0.15)', transition: 'all 300ms ease' }}>
              <Avatar sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'primary.main',
                background: 'linear-gradient(135deg, #2aa6ff, #0d4a6b)',
                boxShadow: '0 4px 12px rgba(42,166,255,0.3)'
              }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>A</Typography>
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', ml: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#e8ecef', fontSize: '0.75rem' }}>
                  Admin User
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(232,236,239,0.5)', fontSize: '0.65rem' }}>
                  Online
                </Typography>
              </Box>
            </Box>
          </Box>
          </Box>
        </Toolbar>

        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
          <Box
            sx={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: `conic-gradient(from ${logoGlow}deg, transparent 0deg, rgba(42,166,255,0.03) 60deg, transparent 120deg)`,
              animation: 'rotate 15s linear infinite'
            }}
          />
        </Box>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }, position: 'relative' }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, rgba(6,18,30,0.98) 0%, rgba(4,12,20,0.95) 100%)',
              borderRight: '1px solid rgba(255,255,255,0.04)',
              color: '#e8ecef',
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #02080e 0%, #06121e 50%, #030a12 100%)',
          color: '#e8ecef',
          mt: '64px'
        }}
      >
        <Box className="layout-animate" sx={{ opacity: 1, transform: 'translateY(0)' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout