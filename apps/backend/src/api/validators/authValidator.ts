export interface RegisterBody {
  email: string
  password: string
}

export interface LoginBody {
  email: string
  password: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateRegister = (body: Partial<RegisterBody>): string | null => {
  if (!body.email || !EMAIL_REGEX.test(body.email)) return 'Valid email is required'
  if (!body.password || body.password.length < 6) return 'Password must be at least 6 characters'
  return null
}

export const validateLogin = (body: Partial<LoginBody>): string | null => {
  if (!body.email || !EMAIL_REGEX.test(body.email)) return 'Valid email is required'
  if (!body.password) return 'Password is required'
  return null
}
