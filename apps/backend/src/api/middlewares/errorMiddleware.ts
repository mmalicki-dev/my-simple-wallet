import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../lib/AppError.js'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message })
    return
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: err.message })
    return
  }

  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: 'Invalid ID format' })
    return
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field'
    res.status(409).json({ success: false, message: `${field} already exists` })
    return
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token' })
    return
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired' })
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({ success: false, message: err.errors[0].message })
    return
  }

  console.error(err)
  res.status(500).json({ success: false, message: 'Internal server error' })
}
