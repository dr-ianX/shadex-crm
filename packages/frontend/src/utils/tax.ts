import { TAX_RATE } from '../config'

export function applyTax(subtotal: number) {
  const tax = Number((subtotal * TAX_RATE).toFixed(2))
  const total = Number((subtotal + tax).toFixed(2))
  return { tax, total }
}

export function priceWithTax(unitPrice: number) {
  const tax = Number((unitPrice * TAX_RATE).toFixed(2))
  return Number((unitPrice + tax).toFixed(2))
}
