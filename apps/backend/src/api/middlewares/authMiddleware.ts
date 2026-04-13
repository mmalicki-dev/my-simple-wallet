import { Request, Response, NextFunction } from 'express'
import passport from 'passport'

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: unknown, user: Express.User | false) => {
    if (err || !user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }
    req.user = user
    next()
  })(req, res, next)
}
