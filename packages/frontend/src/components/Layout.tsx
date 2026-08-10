import React, { useState } from 'react'
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
  useTheme,
  useMediaQuery,
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
const CurrencySwitcherLazy = React.lazy(() => import('./CurrencySwitcher'))

const drawerWidth = 260

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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawerContent = (
    <Box>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="img" src="/assets/shadex-logo.png" alt="Shadex" sx={{ height: 36, width: 36, objectFit: 'contain', borderRadius: 1 }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            SHADEX OS
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path)
                if (isMobile) setMobileOpen(false)
              }}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'inherit' : 'primary.main',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 2, mt: 2 }}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Configuración" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'linear-gradient(180deg, rgba(2,12,22,0.5), rgba(4,14,24,0.7))',
          color: 'text.primary',
          boxShadow: '0 6px 18px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Box component="img" src="/assets/shadex-logo.png" alt="Shadex" sx={{ height: 36, width: 36, objectFit: 'contain' }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
              Sistema de Transformaciones Arquitectónicas
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Currency switcher */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              {/* CurrencySwitcher will be lazy-loaded to keep initial bundle small */}
              {/* eslint-disable-next-line react/jsx-no-bind */}
              <React.Suspense fallback={<div style={{ width: 72 }} />}>
                <CurrencySwitcherLazy />
              </React.Suspense>
            </Box>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Admin User
            </Typography>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              A
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, rgba(6,18,30,0.9), rgba(4,12,20,0.85))',
              borderRight: '1px solid rgba(255,255,255,0.03)',
              backdropFilter: 'blur(4px)'
            },          }}        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Layout