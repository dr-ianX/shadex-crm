import { DEFAULT_CURRENCY, SECONDARY_CURRENCY, DEFAULT_LOCALE, CURRENCY_OPTIONS } from './config'

// Design tokens for SHADEX UI
const tokens = {
  colors: {
    primary: '#041827',
    primaryLight: '#0f4a6b',
    primaryDark: '#00121a',
    accent: '#2aa6ff',
    background: '#040a12',
    paper: '#071526',
    textPrimary: '#e6f7ff',
    textSecondary: 'rgba(230,247,255,0.78)'
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    sizes: {
      h1: '2.5rem',
      h2: '2rem',
      body: '1rem',
      small: '0.875rem'
    }
  },
  spacing: {
    unit: 8
  },
  currency: {
    default: DEFAULT_CURRENCY,
    secondary: SECONDARY_CURRENCY,
    locale: DEFAULT_LOCALE,
    options: CURRENCY_OPTIONS
  }
}

export default tokens
