import { DEFAULT_LOCALE, CURRENCY_OPTIONS } from '../config'

export function formatCurrency(value: number, currency: string = 'MXN', locale: string = DEFAULT_LOCALE) {
  try {
    return new Intl.NumberFormat(locale, { ...CURRENCY_OPTIONS, currency }).format(value)
  } catch (err) {
    // fallback
    return `${currency} ${Number(value).toFixed(2)}`
  }
}

export function formatNumber(value: number, locale: string = DEFAULT_LOCALE) {
  try {
    return new Intl.NumberFormat(locale).format(value)
  } catch (err) {
    return String(value)
  }
}
