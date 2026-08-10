export const DEFAULT_CURRENCY = 'MXN'
export const SECONDARY_CURRENCY = 'USD'
export const DEFAULT_LOCALE = 'es-MX'
export const TAX_RATE = 0.16

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const CURRENCY_OPTIONS: Intl.NumberFormatOptions = {
  style: 'currency',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}
