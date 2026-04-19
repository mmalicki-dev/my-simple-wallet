import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Currency } from 'shared'

interface ExchangeRatesResponse {
  base: Currency
  rates: Partial<Record<Currency, number>>
}

export const exchangeRateApi = createApi({
  reducerPath: 'exchangeRateApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/frankfurter' }),
  endpoints: (builder) => ({
    getExchangeRates: builder.query<ExchangeRatesResponse, Currency>({
      query: (baseCurrency) => `/latest?from=${baseCurrency}`,
      keepUnusedDataFor: 60 * 60 * 24,
    }),
  }),
})

export const { useGetExchangeRatesQuery } = exchangeRateApi
