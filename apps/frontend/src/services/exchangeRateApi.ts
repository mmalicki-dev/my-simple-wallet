import type { Currency } from 'shared'
import { api } from '@/redux/api'

interface ExchangeRatesResponse {
  base: Currency
  rates: Partial<Record<Currency, number>>
}

export const exchangeRateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExchangeRates: builder.query<ExchangeRatesResponse, Currency>({
      query: (baseCurrency) => `/exchange-rates/${baseCurrency}`,
      keepUnusedDataFor: 60 * 60 * 24,
    }),
  }),
})

export const { useGetExchangeRatesQuery } = exchangeRateApi
