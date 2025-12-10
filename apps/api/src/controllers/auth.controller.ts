import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { config } from '../config'
import { AppError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'

// User type definition
interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'user' | 'staff' | 'admin'
  verified: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required').max(35),
  lastName: z.string().min(1, 'Last name is required').max(35),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(35).optional(),
  lastName: z.string().min(1).max(35).optional(),
  email: z.string().email().max(254).optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

// In-memory user store (replace with database in production)
const users: User[] = []

// Generate JWT tokens
const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )

  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = registerSchema.parse(req.body)

    // Check if user exists
    const existingUser = users.find((u) => u.email.toLowerCase() === validated.email.toLowerCase())
    if (existingUser) {
      throw new AppError('An account with this email already exists', 400)
    }

    // Hash password with stronger salt
    const hashedPassword = await bcrypt.hash(validated.password, 12)

    // Create user
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: validated.email.toLowerCase(),
      firstName: validated.firstName,
      lastName: validated.lastName,
      password: hashedPassword,
      role: 'user',
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    users.push(user)

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user)

    logger.info(`User registered: ${user.id}`)

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
      },
      accessToken,
      refreshToken,
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400))
    }
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = loginSchema.parse(req.body)

    // Find user
    const user = users.find((u) => u.email.toLowerCase() === validated.email.toLowerCase())
    if (!user) {
      // Use generic message to prevent email enumeration
      throw new AppError('Invalid email or password', 401)
    }

    // Check password
    const isValidPassword = await bcrypt.compare(validated.password, user.password)
    if (!isValidPassword) {
      logger.warn(`Failed login attempt for: ${user.email}`)
      throw new AppError('Invalid email or password', 401)
    }

    // Update last login
    user.lastLoginAt = new Date()

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user)

    logger.info(`User logged in: ${user.id}`)

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
      },
      accessToken,
      refreshToken,
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400))
    }
    next(error)
  }
}

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new AppError('Unauthorized', 401)
    }

    const user = users.find((u) => u.id === userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new AppError('Unauthorized', 401)
    }

    const validated = updateProfileSchema.parse(req.body)
    
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      throw new AppError('User not found', 404)
    }

    // Check if email is being changed and if it's already in use
    if (validated.email) {
      const emailInUse = users.find(
        (u) => u.email.toLowerCase() === validated.email!.toLowerCase() && u.id !== userId
      )
      if (emailInUse) {
        throw new AppError('Email already in use', 400)
      }
    }

    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...validated,
      email: validated.email ? validated.email.toLowerCase() : users[userIndex].email,
      updatedAt: new Date(),
    }
    users[userIndex] = updatedUser

    logger.info(`User profile updated: ${userId}`)

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        verified: updatedUser.verified,
      },
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400))
    }
    next(error)
  }
}

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      throw new AppError('Unauthorized', 401)
    }

    const validated = changePasswordSchema.parse(req.body)
    
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      throw new AppError('User not found', 404)
    }

    const user = users[userIndex]

    // Verify current password
    const isValidPassword = await bcrypt.compare(validated.currentPassword, user.password)
    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 400)
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validated.newPassword, 12)

    // Update password
    users[userIndex] = {
      ...user,
      password: hashedPassword,
      updatedAt: new Date(),
    }

    logger.info(`User password changed: ${userId}`)

    res.json({
      message: 'Password changed successfully',
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400))
    }
    next(error)
  }
}

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken: token } = req.body

    if (!token) {
      throw new AppError('Refresh token is required', 400)
    }

    // Verify refresh token
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; type: string }
    
    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 400)
    }

    const user = users.find((u) => u.id === decoded.userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user)

    logger.info(`Token refreshed for user: ${user.id}`)

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid refresh token', 401))
    }
    next(error)
  }
}

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId

    // In production, add the token to a blacklist or invalidate refresh tokens
    logger.info(`User logged out: ${userId}`)

    res.json({
      message: 'Logged out successfully',
    })
  } catch (error) {
    next(error)
  }
}
