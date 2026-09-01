import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Box, CssBaseline } from '@mui/material'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientNew from './pages/ClientNew'
import ClientEdit from './pages/ClientEdit'
import ClientDetail from './pages/ClientDetail'
import Projects from './pages/Projects'
import ProjectBoard from './pages/ProjectBoard'
import ProjectNew from './pages/ProjectNew'
import ProjectDetail from './pages/ProjectDetail'
import ProjectEdit from './pages/ProjectEdit'
import Quotations from './pages/Quotations'
import QuotationNew from './pages/QuotationNew'
import QuotationDetail from './pages/QuotationDetail'
import QuotationEdit from './pages/QuotationEdit'
import PaymentNew from './pages/PaymentNew'
import Products from './pages/Products'
import ProductNew from './pages/ProductNew'
import Inventory from './pages/Inventory'
import Finance from './pages/Finance'
import Agenda from './pages/Agenda'
import AppointmentNew from './pages/AppointmentNew'
import Reports from './pages/Reports'
import AuditLogs from './pages/AuditLogs'
import Search from './pages/Search'
import DataImport from './pages/DataImport'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calendar'
import Users from './pages/Users'
import Analytics from './pages/Analytics'
import SalesPerformance from './pages/SalesPerformance'
import CompanySettings from './pages/CompanySettings'
import Leads from './pages/Leads'
import LeadBoard from './pages/LeadBoard'
import LeadNew from './pages/LeadNew'
import LeadDetail from './pages/LeadDetail'
import Installations from './pages/Installations'
import InstallationNew from './pages/InstallationNew'
import InstallationDetail from './pages/InstallationDetail'
import Warranties from './pages/Warranties'
import WarrantyNew from './pages/WarrantyNew'
import WarrantyDetail from './pages/WarrantyDetail'
import Layout from './components/Layout'
import Login from './pages/Login'
import ChangePassword from './pages/ChangePassword'

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
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/leads/board" element={<LeadBoard />} />
                  <Route path="/leads/new" element={<LeadNew />} />
                  <Route path="/leads/:id" element={<LeadDetail />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/new" element={<ClientNew />} />
                  <Route path="/clients/:id/edit" element={<ClientEdit />} />
                  <Route path="/clients/:id" element={<ClientDetail />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/board" element={<ProjectBoard />} />
                  <Route path="/projects/new" element={<ProjectNew />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/projects/:id/edit" element={<ProjectEdit />} />
                  <Route path="/quotations" element={<Quotations />} />
                  <Route path="/quotations/new" element={<QuotationNew />} />
                  <Route path="/quotations/:id" element={<QuotationDetail />} />
                  <Route path="/quotations/:id/edit" element={<QuotationEdit />} />
                  <Route path="/payments/new" element={<PaymentNew />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/new" element={<ProductNew />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/agenda" element={<Agenda />} />
                  <Route path="/agenda/new" element={<AppointmentNew />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/audit" element={<AuditLogs />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/import" element={<DataImport />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/sales-performance" element={<SalesPerformance />} />
                  <Route path="/company" element={<CompanySettings />} />
                  <Route path="/installations" element={<Installations />} />
                  <Route path="/installations/new" element={<InstallationNew />} />
                  <Route path="/installations/:id" element={<InstallationDetail />} />
                  <Route path="/warranties" element={<Warranties />} />
                  <Route path="/warranties/new" element={<WarrantyNew />} />
                  <Route path="/warranties/:id" element={<WarrantyDetail />} />
                  <Route path="/change-password" element={<ChangePassword />} />
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