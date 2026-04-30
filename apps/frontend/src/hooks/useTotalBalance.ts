import type { Currency } from 'shared'
import type { Account } from '@/types'
import { useGetExchangeRatesQuery } from '@/services/exchangeRateApi'

interface UseTotalBalanceResult {
  total: number | null
  isLoading: boolean
  isError: boolean
}

export const useTotalBalance = (accounts: Account[], baseCurrency: Currency): UseTotalBalanceResult => {
  const allSameCurrency = accounts.every((a) => a.currency === baseCurrency)
  const { data, isLoading, isError } = useGetExchangeRatesQuery(baseCurrency, { skip: allSameCurrency })

  if (allSameCurrency) {
    const total = accounts.reduce((acc, account) => acc + account.balance, 0)
    return { total, isLoading: false, isError: false }
  }

  if (isLoading || isError || !data) {
    return { total: null, isLoading, isError }
  }

  const total = accounts.reduce((acc, account) => {
    if (account.currency === baseCurrency) return acc + account.balance
    const rate = data.rates[account.currency]
    return rate ? acc + account.balance / rate : acc
  }, 0)

  return { total, isLoading: false, isError: false }
}
