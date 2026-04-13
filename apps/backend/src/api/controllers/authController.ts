import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserModel from '../../models/User'
import env from '../../config/env'
import { validateRegister, validateLogin } from '../validators/authValidator'

export const register = async (req: Request, res: Response): Promise<void> => {
  const error = validateRegister(req.body)
  if (error) {
    res.status(400).json({ success: false, message: error })
    return
  }

  const { email, password } = req.body

  const existing = await UserModel.findOne({ email })
  if (existing) {
    res.status(409).json({ success: false, message: 'Email already in use' })
    return
  }

  const user = await UserModel.create({ email, password })
  const token = jwt.sign({ userId: user._id, email: user.email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  })

  res.status(201).json({
    success: true,
    message: 'Registered successfully',
    data: { token, user: { id: user._id, email: user.email } },
  })
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

  const token = jwt.sign({ userId: user._id, email: user.email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  })

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { token, user: { id: user._id, email: user.email } },
  })
}

export const getMe = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'OK', data: req.user })
}
