import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'node:crypto'
import UserModel from '../../models/User.js'
import env from '../../config/env.js'
import { sendVerificationEmail, sendPasswordResetEmail } from '../../config/email.js'
import { validate } from '../validators/authValidator.js'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from 'shared'

export const register: RequestHandler = async (req, res) => {
  const result = validate(registerSchema, req.body)
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error })
    return
  }

  const { email, name, password } = result.data

  const existing = await UserModel.findOne({ email })
  if (existing) {
    res.status(409).json({ success: false, message: 'Email already in use' })
    return
  }

  const verificationToken = randomBytes(32).toString('hex')
  await UserModel.create({ email, name, password, verificationToken })

  await sendVerificationEmail(email, name, verificationToken)

  res.status(201).json({
    success: true,
    message: 'Registered successfully. Please check your email to verify your account.',
  })
}

export const verifyEmail: RequestHandler = async (req, res) => {
  const { token } = req.query

  if (!token || typeof token !== 'string') {
    res.status(400).json({ success: false, message: 'Invalid or missing token' })
    return
  }

  const user = await UserModel.findOne({ verificationToken: token })
  if (!user) {
    res.status(400).json({ success: false, message: 'Invalid or expired verification token' })
    return
  }

  user.isVerified = true
  user.verificationToken = undefined
  await user.save()

  res.status(200).json({ success: true, message: 'Email verified successfully' })
}

export const login: RequestHandler = async (req, res) => {
  const result = validate(loginSchema, req.body)
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error })
    return
  }

  const { email, password } = result.data

  const user = await UserModel.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ success: false, message: 'Invalid credentials' })
    return
  }

  if (!user.isVerified) {
    res.status(403).json({ success: false, message: 'Please verify your email before logging in' })
    return
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { token, user: { id: user._id, email: user.email, name: user.name } },
  })
}

export const forgotPassword: RequestHandler = async (req, res) => {
  const result = validate(forgotPasswordSchema, req.body)
  if (!result.success) {
    res.status(400).json({ success: false, message: result.error })
    return
  }

  const user = await UserModel.findOne({ email: result.data.email })

  // Always respond the same way to prevent email enumeration
  if (!user) {
    res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' })
    return
  }

  const resetToken = randomBytes(32).toString('hex')
  user.passwordResetToken = resetToken
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  await user.save()

  await sendPasswordResetEmail(result.data.email, user.name, resetToken)

  res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' })
}

export const resetPassword: RequestHandler = async (req, res) => {
  const { token } = req.query
  const result = validate(resetPasswordSchema, req.body)

  if (!token || typeof token !== 'string') {
    res.status(400).json({ success: false, message: 'Invalid or missing token' })
    return
  }

  if (!result.success) {
    res.status(400).json({ success: false, message: result.error })
    return
  }

  const user = await UserModel.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  })

  if (!user) {
    res.status(400).json({ success: false, message: 'Invalid or expired reset token' })
    return
  }

  user.password = result.data.password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  res.status(200).json({ success: true, message: 'Password reset successfully' })
}

export const getMe: RequestHandler = (req, res) => {
  res.status(200).json({ success: true, message: 'OK', data: req.user })
}
