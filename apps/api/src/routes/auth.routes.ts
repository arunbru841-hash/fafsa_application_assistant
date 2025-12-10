import { Router } from 'express'
import { 
  register, 
  login, 
  getCurrentUser, 
  updateProfile,
  changePassword,
  refreshToken,
  logout
} from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'
import { strictRateLimiter } from '../middleware/rateLimiter'

const router = Router()

// Public routes (rate limited)
router.post('/register', strictRateLimiter, register)
router.post('/login', strictRateLimiter, login)
router.post('/refresh-token', strictRateLimiter, refreshToken)

// Protected routes
router.get('/me', authenticate, getCurrentUser)
router.patch('/profile', authenticate, updateProfile)
router.post('/change-password', authenticate, changePassword)
router.post('/logout', authenticate, logout)

export default router
