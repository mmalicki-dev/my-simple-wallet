import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import type { Transaction } from '@/types'
import { useGetAccountsQuery } from '@/services/accountApi'
import { useGetTransactionsQuery } from '@/services/transactionApi'
import Spinner from '@/components/atoms/Spinner/Spinner'
import styles from './ChartViewer.module.css'

const PIE_COLORS = ['#5c6bc0', '#e07b39', '#43a047', '#e53935', '#8e24aa', '#00897b', '#f4511e', '#1e88e5']

type ChartType = 'bar' | 'pie' | 'line'
type Period = 'month' | '3months' | '6months' | 'year'

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Income vs Expenses' },
  { value: 'pie', label: 'By Category' },
  { value: 'line', label: 'Balance' },
]

const PERIODS: { value: Period; label: string }[] = [
  { value: 'month', label: 'This month' },
  { value: '3months', label: '3 months' },
  { value: '6months', label: '6 months' },
  { value: 'year', label: 'This year' },
]

const getDateRange = (period: Period): { from: string; to: string } => {
  const today = new Date()
  const to = today.toISOString().slice(0, 10)
  let from: Date
  switch (period) {
    case 'month':
      from = new Date(today.getFullYear(), today.getMonth(), 1)
      break
    case '3months':
      from = new Date(today.getFullYear(), today.getMonth() - 3, 1)
      break
    case '6months':
      from = new Date(today.getFullYear(), today.getMonth() - 6, 1)
      break
    case 'year':
      from = new Date(today.getFullYear(), 0, 1)
      break
  }
  return { from: from.toISOString().slice(0, 10), to }
}

const getBarData = (transactions: Transaction[]) => {
  const map = new Map<string, { income: number; expenses: number }>()
  for (const t of transactions) {
    const key = t.date.slice(0, 7)
    if (!map.has(key)) map.set(key, { income: 0, expenses: 0 })
    const entry = map.get(key)!
    if (t.type === 'income') entry.income += t.amount
    else entry.expenses += t.amount
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: new Date(month + '-15').toLocaleDateString('en', { month: 'short', year: '2-digit' }),
      ...data,
    }))
}

const getPieData = (transactions: Transaction[]) => {
  const map = new Map<string, number>()
  for (const t of transactions.filter((t) => t.type === 'expense')) {
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()].map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
}

const getLineData = (transactions: Transaction[]) => {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
  let balance = 0
  return sorted.map((t) => {
    balance += t.type === 'income' ? t.amount : -t.amount
    return {
      date: new Date(t.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      balance: Math.round(balance * 100) / 100,
    }
  })
}

const ChartViewer = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | 'all'>('all')
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [period, setPeriod] = useState<Period>('month')

  const { data: accounts = [], isLoading: accountsLoading } = useGetAccountsQuery()

  useEffect(() => {
    const defaultAcc = accounts.find((a) => a.isDefault)
    if (defaultAcc) setSelectedAccountId(defaultAcc._id)
  }, [accounts])

  const { from, to } = getDateRange(period)
  const { data: transactions = [], isLoading: txLoading } = useGetTransactionsQuery({
    from,
    to,
    ...(selectedAccountId !== 'all' && { accountId: selectedAccountId }),
  })

  const isLoading = accountsLoading || txLoading

  return (
    <div className={styles.viewer}>
      <div className={styles.controls}>
        {accountsLoading ? (
          <div className={styles.pillsPlaceholder} />
        ) : (
          <div className={styles.accountPills}>
            <button
              type="button"
              className={[styles.pill, selectedAccountId === 'all' ? styles.pillActive : ''].join(' ')}
              onClick={() => setSelectedAccountId('all')}
            >
              All
            </button>
            {accounts.map((acc) => (
              <button
                key={acc._id}
                type="button"
                className={[styles.pill, selectedAccountId === acc._id ? styles.pillActive : ''].join(' ')}
                onClick={() => setSelectedAccountId(acc._id)}
              >
                {acc.name}
              </button>
            ))}
          </div>
        )}

        <div className={styles.periodPills}>
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={[styles.pill, period === value ? styles.pillActive : ''].join(' ')}
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.typeToggle}>
          {CHART_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={[styles.typeBtn, chartType === value ? styles.typeBtnActive : ''].join(' ')}
              onClick={() => setChartType(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chart}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={getBarData(transactions)} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#5c6bc0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#e53935" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartType === 'pie' && (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={getPieData(transactions)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={2}
                  >
                    {getPieData(transactions).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}

            {chartType === 'line' && (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={getLineData(transactions)} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="balance" name="Balance" stroke="#5c6bc0" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ChartViewer
