import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { AppError } from './errorHandler'

export interface AuthUser {
  userId: string
  email: string
  role?: string
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get('authorization') || req.headers?.authorization
    const token = typeof authHeader === 'string' ? authHeader.replace('Bearer ', '') : undefined

    if (!token) {
      throw new AppError('Authentication required', 401)
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: string
      email: string
      role?: string
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401))
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token expired', 401))
    }
    next(error)
  }
}

// Optional authentication - doesn't fail if no token provided
export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get('authorization') || req.headers?.authorization
    const token = typeof authHeader === 'string' ? authHeader.replace('Bearer ', '') : undefined

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        userId: string
        email: string
        role?: string
      }

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      }
    }
    next()
  } catch {
    // Token invalid, but continue without user
    next()
  }
}

// Role-based authorization middleware
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401))
    }
    
    if (!roles.includes(req.user.role || 'student')) {
      return next(new AppError('Insufficient permissions', 403))
    }
    
    next()
  }
}
