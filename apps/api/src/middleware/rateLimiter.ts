import rateLimit from 'express-rate-limit'
import { config } from '../config'

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the request limit. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Too many attempts. Please try again later.',
  },
})
