import React, { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '../config'

type CurrencyState = {
  currency: string
  locale: string
  setCurrency: (c: string) => void
}

const CurrencyContext = createContext<CurrencyState | undefined>(undefined)

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('shadex:currency')
      return stored || DEFAULT_CURRENCY
    } catch (e) {
      return DEFAULT_CURRENCY
    }
  })
  const [locale] = useState<string>(DEFAULT_LOCALE)

  useEffect(() => {
    try {
      localStorage.setItem('shadex:currency', currency)
    } catch (e) {
      // ignore
    }
  }, [currency])

  const setCurrency = (c: string) => setCurrencyState(c)

  return (
    <CurrencyContext.Provider value={{ currency, locale, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
