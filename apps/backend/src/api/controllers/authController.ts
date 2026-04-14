import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import UserModel from '../../models/User.js'
import env from '../../config/env.js'
import { sendVerificationEmail, sendPasswordResetEmail } from '../../config/email.js'
import { validateRegister, validateLogin } from '../validators/authValidator.js'

export const register = async (req: Request, res: Response): Promise<void> => {
  const error = validateRegister(req.body)
  if (error) {
    res.status(400).json({ success: false, message: error })
    return
  }

  const { email, name, password } = req.body

  const existing = await UserModel.findOne({ email })
  if (existing) {
    res.status(409).json({ success: false, message: 'Email already in use' })
    return
  }

  const verificationToken = crypto.randomBytes(32).toString('hex')
  await UserModel.create({ email, name, password, verificationToken })

  await sendVerificationEmail(email, name, verificationToken)

  res.status(201).json({
    success: true,
    message: 'Registered successfully. Please check your email to verify your account.',
  })
}

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
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

export const login = async (req: Request, res: Response): Promise<void> => {
  const error = validateLogin(req.body)
  if (error) {
    res.status(400).json({ success: false, message: error })
    return
  }

  const { email, password } = req.body

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

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body

  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required' })
    return
  }

  const user = await UserModel.findOne({ email })

  // Always respond the same way to prevent email enumeration
  if (!user) {
    res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' })
    return
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  user.passwordResetToken = resetToken
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  await user.save()

  await sendPasswordResetEmail(email, user.name, resetToken)

  res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' })
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query
  const { password } = req.body

  if (!token || typeof token !== 'string') {
    res.status(400).json({ success: false, message: 'Invalid or missing token' })
    return
  }

  if (!password || password.length < 6) {
    res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
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

  user.password = password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  res.status(200).json({ success: true, message: 'Password reset successfully' })
}

export const getMe = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'OK', data: req.user })
}
