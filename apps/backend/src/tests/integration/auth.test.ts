import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../app'
import { UserModel } from '../../models/index'

// Mock the email service so no real emails are sent during tests
vi.mock('../../config/email', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}))

const validUser = {
  email: 'test@example.com',
  name: 'John Doe',
  password: 'password123',
}

describe('Auth endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('registers a new user and returns 201', async () => {
      const res = await request(app).post('/api/auth/register').send(validUser)

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
    })

    it('saves user to the database', async () => {
      await request(app).post('/api/auth/register').send(validUser)

      const user = await UserModel.findOne({ email: validUser.email })
      expect(user).not.toBeNull()
      expect(user?.name).toBe(validUser.name)
    })

    it('saves user as unverified', async () => {
      await request(app).post('/api/auth/register').send(validUser)

      const user = await UserModel.findOne({ email: validUser.email })
      expect(user?.isVerified).toBe(false)
    })

    it('hashes the password', async () => {
      await request(app).post('/api/auth/register').send(validUser)

      const user = await UserModel.findOne({ email: validUser.email })
      expect(user?.password).not.toBe(validUser.password)
    })

    it('returns 409 when email already in use', async () => {
      await request(app).post('/api/auth/register').send(validUser)
      const res = await request(app).post('/api/auth/register').send(validUser)

      expect(res.status).toBe(409)
      expect(res.body.success).toBe(false)
    })

    it('returns 400 with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, email: 'not-an-email' })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('returns 400 with missing name', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: validUser.email, password: validUser.password })

      expect(res.status).toBe(400)
    })

    it('returns 400 with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, password: '123' })

      expect(res.status).toBe(400)
    })
  })

  describe('GET /api/auth/verify-email', () => {
    it('verifies user with valid token', async () => {
      await request(app).post('/api/auth/register').send(validUser)
      const user = await UserModel.findOne({ email: validUser.email })

      const res = await request(app)
        .get(`/api/auth/verify-email?token=${user?.verificationToken}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })

    it('marks user as verified in database', async () => {
      await request(app).post('/api/auth/register').send(validUser)
      const user = await UserModel.findOne({ email: validUser.email })

      await request(app).get(`/api/auth/verify-email?token=${user?.verificationToken}`)

      const updatedUser = await UserModel.findOne({ email: validUser.email })
      expect(updatedUser?.isVerified).toBe(true)
      expect(updatedUser?.verificationToken).toBeUndefined()
    })

    it('returns 400 with invalid token', async () => {
      const res = await request(app).get('/api/auth/verify-email?token=invalidtoken')

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('returns 400 with missing token', async () => {
      const res = await request(app).get('/api/auth/verify-email')

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser)
      const user = await UserModel.findOne({ email: validUser.email })
      await request(app).get(`/api/auth/verify-email?token=${user?.verificationToken}`)
    })

    it('logs in with valid credentials and returns token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.token).toBeDefined()
      expect(res.body.data.user.email).toBe(validUser.email)
    })

    it('returns 401 with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: 'wrongpassword' })

      expect(res.status).toBe(401)
    })

    it('returns 401 with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: validUser.password })

      expect(res.status).toBe(401)
    })

    it('returns 403 when user is not verified', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'unverified@example.com',
        name: 'Unverified User',
        password: 'password123',
      })

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'unverified@example.com', password: 'password123' })

      expect(res.status).toBe(403)
    })
  })

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser)
    })

    it('returns 200 for existing email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: validUser.email })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })

    it('returns 200 for non-existing email (prevents enumeration)', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nobody@example.com' })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })

    it('saves reset token to database', async () => {
      await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: validUser.email })

      const user = await UserModel.findOne({ email: validUser.email })
      expect(user?.passwordResetToken).toBeDefined()
      expect(user?.passwordResetExpires).toBeDefined()
    })
  })

  describe('POST /api/auth/reset-password', () => {
    let resetToken: string

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser)
      await request(app).post('/api/auth/forgot-password').send({ email: validUser.email })
      const user = await UserModel.findOne({ email: validUser.email })
      resetToken = user?.passwordResetToken ?? ''
    })

    it('resets password with valid token', async () => {
      const res = await request(app)
        .post(`/api/auth/reset-password?token=${resetToken}`)
        .send({ password: 'newpassword123' })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
    })

    it('clears reset token after successful reset', async () => {
      await request(app)
        .post(`/api/auth/reset-password?token=${resetToken}`)
        .send({ password: 'newpassword123' })

      const user = await UserModel.findOne({ email: validUser.email })
      expect(user?.passwordResetToken).toBeUndefined()
      expect(user?.passwordResetExpires).toBeUndefined()
    })

    it('can login with new password after reset', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'reset@example.com', name: 'Reset User', password: 'password123' })
      const newUser = await UserModel.findOne({ email: 'reset@example.com' })
      await request(app).get(`/api/auth/verify-email?token=${newUser?.verificationToken}`)
      await request(app).post('/api/auth/forgot-password').send({ email: 'reset@example.com' })
      const updatedUser = await UserModel.findOne({ email: 'reset@example.com' })
      const token = updatedUser?.passwordResetToken ?? ''

      await request(app)
        .post(`/api/auth/reset-password?token=${token}`)
        .send({ password: 'newpassword123' })

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'reset@example.com', password: 'newpassword123' })

      expect(res.status).toBe(200)
    })

    it('returns 400 with invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password?token=invalidtoken')
        .send({ password: 'newpassword123' })

      expect(res.status).toBe(400)
    })

    it('returns 400 with short password', async () => {
      const res = await request(app)
        .post(`/api/auth/reset-password?token=${resetToken}`)
        .send({ password: '123' })

      expect(res.status).toBe(400)
    })
  })
})
