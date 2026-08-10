import React from 'react'
import { MenuItem, Select, SelectChangeEvent, Box, Typography } from '@mui/material'
import { useCurrency } from '../context/CurrencyContext'
import tokens from '../tokens'

const CurrencySwitcher: React.FC = () => {
  const { currency, setCurrency } = useCurrency()

  const handleChange = (e: SelectChangeEvent<string>) => {
    setCurrency(e.target.value as string)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>Moneda</Typography>
      <Select value={currency} onChange={handleChange} size="small" sx={{ color: 'text.primary', background: 'rgba(255,255,255,0.02)', borderRadius: 1 }}>
        <MenuItem value={tokens.currency.default}>{tokens.currency.default}</MenuItem>
        <MenuItem value={tokens.currency.secondary}>{tokens.currency.secondary}</MenuItem>
      </Select>
    </Box>
  )
}

export default CurrencySwitcher
