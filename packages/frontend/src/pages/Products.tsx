import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api'
import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Fab,
  TextField,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await apiFetch('/api/v1/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiFetch('/api/v1/products/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filteredProducts = products.filter((p: any) =>
    p.commercialName?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase()) ||
    p.family?.toLowerCase().includes(search.toLowerCase())
  )

  const getFamilyColor = (family: string) => {
    const colors: Record<string, string> = {
      'CONTROL SOLAR': '#f59e0b',
      'SMART FILM': '#2aa6ff',
      'LED': '#10b981',
      'SERVICIOS': '#8b5cf6'
    }
    return colors[family] || '#2aa6ff'
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Catálogo de Productos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {products.length} productos en {categories.length} familias
          </Typography>
        </Box>
        <Fab color="primary" onClick={() => navigate('/products/new')}>
          <AddIcon />
        </Fab>
      </Box>

      {/* Categories */}
      <TextField label="Buscar producto" fullWidth sx={{ mb: 3 }} value={search} onChange={(e) => setSearch(e.target.value)} />

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {categories.map((category: string) => (
          <Chip
            key={category}
            label={category}
            sx={{
              background: `${getFamilyColor(category)}20`,
              color: getFamilyColor(category),
              border: `1px solid ${getFamilyColor(category)}40`,
              fontWeight: 600,
              px: 2,
              py: 2.5
            }}
          />
        ))}
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product: any) => (
          <Grid item xs={12} md={6} lg={4} key={product.id}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 300ms ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(42,166,255,0.1)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Chip
                    label={product.sku}
                    size="small"
                    sx={{ 
                      background: 'rgba(42,166,255,0.1)',
                      color: '#2aa6ff',
                      fontWeight: 600
                    }}
                  />
                  <Chip
                    label={product.family}
                    size="small"
                    sx={{
                      background: `${getFamilyColor(product.family)}20`,
                      color: getFamilyColor(product.family),
                      fontWeight: 600
                    }}
                  />
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {product.commercialName}
                </Typography>
                
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {product.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2aa6ff' }}>
                    ${product.suggestedPrice?.toLocaleString('es-MX')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {product.variant}
                  </Typography>
                </Box>
                
                {product.color && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 16, 
                      height: 16, 
                      borderRadius: '50%', 
                      background: product.color,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {product.color}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Products