import { describe, it, expect } from 'vitest'
import { validate } from '../../api/validators/authValidator'
import { registerSchema, loginSchema } from 'shared'

describe('validate()', () => {
  describe('registerSchema', () => {
    it('returns success with valid data', () => {
      const result = validate(registerSchema, {
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password123',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
        expect(result.data.name).toBe('John Doe')
      }
    })

    it('fails with invalid email', () => {
      const result = validate(registerSchema, {
        email: 'not-an-email',
        name: 'John Doe',
        password: 'password123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Valid email is required')
      }
    })

    it('fails with name too short', () => {
      const result = validate(registerSchema, {
        email: 'test@example.com',
        name: 'J',
        password: 'password123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Name must be at least 2 characters')
      }
    })

    it('fails with password too short', () => {
      const result = validate(registerSchema, {
        email: 'test@example.com',
        name: 'John Doe',
        password: '123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Password must be at least 6 characters')
      }
    })

    it('fails with missing fields', () => {
      const result = validate(registerSchema, {})

      expect(result.success).toBe(false)
    })

    it('trims whitespace from name', () => {
      const result = validate(registerSchema, {
        email: 'test@example.com',
        name: '  John  ',
        password: 'password123',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John')
      }
    })
  })

  describe('loginSchema', () => {
    it('returns success with valid data', () => {
      const result = validate(loginSchema, {
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.success).toBe(true)
    })

    it('fails with missing password', () => {
      const result = validate(loginSchema, {
        email: 'test@example.com',
      })

      expect(result.success).toBe(false)
    })

    it('fails with invalid email', () => {
      const result = validate(loginSchema, {
        email: 'not-an-email',
        password: 'password123',
      })

      expect(result.success).toBe(false)
    })
  })
})
