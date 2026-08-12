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
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Architecture as TransformationIcon,
  Science as TechnologyIcon,
  Inventory as InventoryIcon,
  AttachMoney as FinanceIcon,
  Support as SupportIcon,
  Business as SupplierIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  RequestQuote as QuoteIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const drawerWidth = 280

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Transformaciones', icon: <TransformationIcon />, path: '/transformations' },
  { text: 'Tecnologías', icon: <TechnologyIcon />, path: '/technologies' },
  { text: 'Inventario', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Finanzas', icon: <FinanceIcon />, path: '/finance' },
  { text: 'Cotizaciones', icon: <QuoteIcon />, path: '/quotations' },
  { text: 'Clientes', icon: <DashboardIcon />, path: '/clients' },
  { text: 'Soporte', icon: <SupportIcon />, path: '/support' },
  { text: 'Proveedores', icon: <SupplierIcon />, path: '/suppliers' },
]

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = window.innerWidth < 960
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Efecto de brillo animado para el logo
  const [logoGlow, setLogoGlow] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoGlow((prev) => (prev + 1) % 360)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Animación de entrada suave para el contenido principal usando CSS transitions
  useEffect(() => {
    const mainContent = document.querySelector('.layout-animate') as HTMLElement
    if (mainContent) {
      // Aplicar animación de entrada con CSS
      mainContent.style.opacity = '0'
      ;(mainContent as any).style.transform = 'translateY(20px)'
      ;(mainContent as any).style.transition = 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }, [])

  const drawerContent = (
    <Box className="layout-animate" sx={{ opacity: 0, transform: 'translateY(-20px)', transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
          {/* Logo con efecto de brillo animado */}
          <Box 
            component="img" 
            src="/assets/shadex-logo.png" 
            alt="Shadex" 
            sx={{ 
              height: 40, 
              width: 40, 
              objectFit: 'contain', 
              borderRadius: 1.5,
              filter: 'drop-shadow(0 0 8px rgba(42,166,255,0.4))'
            }} 
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: 0.5, background: 'linear-gradient(135deg, #ffffff 0%, #8ab4f8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SHADEX OS
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(232,236,239,0.6)', fontWeight: 500 }}>
              Transformaciones Arquitectónicas
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ borderRadius: 1 }} className="layout-animate">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      
      {/* Efecto de brillo sutil en el AppBar */}
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

      <Divider sx={{ my: 0.5 }} />
      
      {/* Menú con animación de entrada escalonada */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1, opacity: 0, animationDelay: `${index * 50}ms` }} className="layout-animate">
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path)
                if (isMobile) setMobileOpen(false)
              }}
              sx={{
                borderRadius: 2.5,
                px: 3,
                py: 1.8,
                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(42,166,255,0.15)',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(42,166,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(42,166,255,0.2)',
                    transform: 'translateX(4px)',
                  },
                },
                '&:hover:not(.Mui-selected)': {
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  transform: 'translateX(2px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 48,
                  py: 1.2,
                  color: location.pathname === item.path ? '#ffffff' : 'rgba(42,166,255,0.7)',
                  transition: 'all 300ms ease',
                  '& .MuiSvgIcon-root': {
                    fontSize: 24,
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  transition: 'all 200ms ease',
                }} 
              />
              {location.pathname === item.path && (
                <Box sx={{ ml: 'auto' }}>
                  <Box 
                    sx={{ 
                      width: 4, 
                      height: 4, 
                      borderRadius: '50%', 
                      background: '#2aa6ff',
                      boxShadow: '0 0 10px rgba(42,166,255,0.8)'
                    }} 
                  />
                </Box>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 0.5 }} />
      
      {/* Configuración con efecto de pulso */}
      <List sx={{ px: 2, mt: 2 }}>
        <ListItem disablePadding className="layout-animate">
          <ListItemButton
            onClick={() => navigate('/settings')}
            sx={{
              borderRadius: 2.5,
              py: 1.8,
              transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.04)',
                transform: 'translateX(2px)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 48, py: 1.2 }}>
              <SettingsIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText 
              primary="Configuración" 
              sx={{ fontWeight: 500 }} 
            />
            <Box sx={{ ml: 'auto', color: 'rgba(42,166,255,0.4)' }}>
              <ChevronLeftIcon sx={{ transform: 'rotate(-90deg)', fontSize: 20 }} />
            </Box>
          </ListItemButton>
        </ListItem>
      </List>
      
      {/* Footer del drawer con efecto sutil */}
      <Box 
        sx={{ 
          mt: 3, 
          px: 2, 
          py: 2, 
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(232,236,239,0.3)' }}>
          SHADEX OS v1.0
        </Typography>
        <Box 
          sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #2aa6ff, #0d4a6b)',
            boxShadow: '0 0 15px rgba(42,166,255,0.5)'
          }} 
        />
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* AppBar con diseño moderno */}
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
            {/* Logo con efecto de brillo */}
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
            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <Typography variant="h6" noWrap component="div" sx={{ 
                fontWeight: 700, 
                letterSpacing: 0.5,
                background: 'linear-gradient(135deg, #ffffff 0%, #8ab4f8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' }
              }}>
                Sistema de Transformaciones Arquitectónicas
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'rgba(232,236,239,0.5)', 
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' }
              }}>
                Innovación & Diseño
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            {/* Currency switcher */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', px: 1.5, py: 0.8, borderRadius: 2, background: 'rgba(42,166,255,0.08)', border: '1px solid rgba(42,166,255,0.15)' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#e8ecef' }}>
                USD
              </Typography>
            </Box>
            
            {/* User info con efecto hover */}
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
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#e8ecef', fontSize: '0.75rem' }}>
                  Admin User
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(232,236,239,0.5)', fontSize: '0.65rem' }}>
                  Online
                </Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
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
              borderRight: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(8px)',
              transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(42,166,255,0.03) 0%, transparent 100%)',
              }
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8.5,
          backgroundColor: 'background.default',
          minHeight: '100vh',
          transition: 'all 300ms ease',
        }}
      >
        <Box className="layout-animate" sx={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout as React.FC<LayoutProps>