export interface RegisterBody {
  email: string
  name: string
  password: string
}

export interface LoginBody {
  email: string
  password: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateRegister = (body: Partial<RegisterBody>): string | null => {
  if (!body.email || !EMAIL_REGEX.test(body.email)) return 'Valid email is required'
  if (!body.name || body.name.trim().length < 2) return 'Name must be at least 2 characters'
  if (!body.password || body.password.length < 6) return 'Password must be at least 6 characters'
  return null
}

export const validateLogin = (body: Partial<LoginBody>): string | null => {
  if (!body.email || !EMAIL_REGEX.test(body.email)) return 'Valid email is required'
  if (!body.password) return 'Password is required'
  return null
}
