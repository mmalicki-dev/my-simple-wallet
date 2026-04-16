import { Response } from 'express'

export const ok = (res: Response, data?: unknown, message?: string) =>
  res.status(200).json({ success: true, data, message })

export const created = (res: Response, data?: unknown) =>
  res.status(201).json({ success: true, data })

export const deleted = (res: Response, message = 'Deleted successfully') =>
  res.status(200).json({ success: true, message })
