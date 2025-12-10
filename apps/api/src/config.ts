import dotenv from 'dotenv'
import type { SignOptions } from 'jsonwebtoken'

dotenv.config()

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  
  // CORS
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  // Database (SQLite for development)
  database: {
    url: process.env.DATABASE_URL || 'file:./local.db',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  },
  
  // File uploads
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760', 10), // 10MB
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ],
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  
  // External APIs
  apis: {
    // College Scorecard API - School and cost data
    // Documentation: https://github.com/RTICWDT/open-data-maker/blob/master/API.md
    collegeScorecard: {
      baseUrl: 'https://api.data.gov/ed/collegescorecard/v1',
      apiKey: process.env.COLLEGE_SCORECARD_API_KEY || 'TNfceNc2F9Fr1gChFrCbDOkDuRbUFkfqczqJs70L',
      rateLimit: 1000, // requests per hour
    },
    
    // FRED API - Economic data from Federal Reserve
    // Documentation: https://fred.stlouisfed.org/docs/api/fred/
    fred: {
      baseUrl: 'https://api.stlouisfed.org/fred',
      apiKey: process.env.FRED_API_KEY || 'a02c38a0e9e3e707e05d9e2aa0be5b41',
      rateLimit: 120, // requests per minute
    },
    
    // Treasury Fiscal Data API - Interest rates and debt data
    // Documentation: https://fiscaldata.treasury.gov/api-documentation/
    // Note: No API key required
    treasury: {
      baseUrl: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service',
    },
  },
}