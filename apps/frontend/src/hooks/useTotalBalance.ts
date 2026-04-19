import { useState, useEffect } from 'react'
import type { Currency } from 'shared'
import type { Account } from '@/types'

interface UseTotalBalanceResult {
  total: number | null
  isLoading: boolean
  isError: boolean
}

export const useTotalBalance = (accounts: Account[], baseCurrency: Currency): UseTotalBalanceResult => {
  const [total, setTotal] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (accounts.length === 0) {
      setTotal(0)
      setIsLoading(false)
      return
    }

    const foreignCurrencies = [...new Set(
      accounts
        .filter((a) => a.currency !== baseCurrency)
        .map((a) => a.currency)
    )]

    const fetchAndCalculate = async () => {
      setIsLoading(true)
      setIsError(false)

      try {
        let rates: Record<string, number> = {}

        if (foreignCurrencies.length > 0) {
          const symbols = foreignCurrencies.join(',')
          const res = await fetch(
            `https://api.frankfurter.app/latest?from=${baseCurrency}&symbols=${symbols}`
          )
          if (!res.ok) throw new Error()
          const data = await res.json()
          rates = data.rates
        }

        const sum = accounts.reduce((acc, account) => {
          if (account.currency === baseCurrency) return acc + account.balance
          const rate = rates[account.currency]
          return rate ? acc + account.balance / rate : acc
        }, 0)

        setTotal(sum)
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndCalculate()
  }, [accounts, baseCurrency])

  return { total, isLoading, isError }
}
