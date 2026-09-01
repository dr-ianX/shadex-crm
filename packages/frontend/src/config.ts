export const DEFAULT_CURRENCY = 'MXN'
export const SECONDARY_CURRENCY = 'USD'
export const DEFAULT_LOCALE = 'es-MX'
export const TAX_RATE = 0.16

// API URL - Por defecto usa la misma URL del frontend (servicio único)
// Render configurará VITE_API_URL con el URL del backend, o se puede usar relative para SPA única
export const API_URL = import.meta.env.VITE_API_URL || '/'

export const CURRENCY_OPTIONS: Intl.NumberFormatOptions = {
  style: 'currency',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}
