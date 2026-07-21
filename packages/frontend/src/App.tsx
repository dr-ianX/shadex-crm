import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box, CssBaseline } from '@mui/material'
import Dashboard from './pages/Dashboard'
import Transformations from './pages/Transformations'
import TransformationDetail from './pages/TransformationDetail'
import Technologies from './pages/Technologies'
import Inventory from './pages/Inventory'
import Finance from './pages/Finance'
import Support from './pages/Support'
import Suppliers from './pages/Suppliers'
import Clients from './pages/Clients'
import ClientNew from './pages/ClientNew'
import ClientEdit from './pages/ClientEdit'
import ClientDetail from './pages/ClientDetail'
import Quotations from './pages/Quotations'
import Layout from './components/Layout'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/transformations" element={<Transformations />} />
                  <Route path="/transformations/:id" element={<TransformationDetail />} />
                  <Route path="/technologies" element={<Technologies />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/quotations" element={<Quotations />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/new" element={<ClientNew />} />
                  <Route path="/clients/:id/edit" element={<ClientEdit />} />
                  <Route path="/clients/:id" element={<ClientDetail />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Box>
    </Router>
  )
}

export default App