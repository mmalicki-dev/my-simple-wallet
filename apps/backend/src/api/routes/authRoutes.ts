import { Router } from 'express'
import { register, login, getMe, verifyEmail, forgotPassword, resetPassword, refresh, logout, updateProfile, requestEmailChange, confirmEmailChange } from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.get('/verify-email', verifyEmail)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/me', protect, getMe)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.put('/profile', protect, updateProfile)
router.post('/change-email', protect, requestEmailChange)
router.get('/confirm-email-change', confirmEmailChange)

export default router
