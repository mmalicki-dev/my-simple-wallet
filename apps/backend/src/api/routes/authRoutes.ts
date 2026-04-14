import { Router } from 'express'
import { register, login, getMe, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.get('/verify-email', verifyEmail)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/me', protect, getMe)

export default router
