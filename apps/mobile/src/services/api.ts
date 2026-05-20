import { StorageService } from './storage'

// process.env.EXPO_PUBLIC_* is replaced at bundle time by Metro
declare const process: { env: Record<string, string | undefined> }

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api'

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown) {
    super(`API error ${status}`)
    this.status = status
    this.data = data
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options

  const token = StorageService.getToken()

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.ok) {
    const text = await response.text()
    return (text ? JSON.parse(text) : undefined) as T
  }

  if (response.status === 401) StorageService.removeToken()
  const data = await response.json().catch(() => ({}))
  throw new ApiError(response.status, data)
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string, body?: unknown) => request<T>(path, { method: 'DELETE', body }),
}
