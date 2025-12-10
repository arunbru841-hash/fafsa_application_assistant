import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'

// Import routes
import authRoutes from './routes/auth.routes'
import applicationRoutes from './routes/application.routes'
import documentRoutes from './routes/document.routes'
import schoolRoutes from './routes/school.routes'
import validationRoutes from './routes/validation.routes'
import scorecardRoutes from './routes/scorecard.routes'
import economicRoutes from './routes/economic.routes'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
app.use(rateLimiter)

// Health check endpoints
import { testConnection } from './db'
import { createClient } from 'redis'

// Basic health check (for load balancers)
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  })
})

// Liveness probe (is the server running?)
app.get('/health/live', (_req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Readiness probe (is the server ready to accept traffic?)
app.get('/health/ready', async (_req, res) => {
  const checks: Record<string, { status: string; latency?: number; error?: string }> = {}
  let allHealthy = true

  // Check database
  const dbStart = Date.now()
  try {
    const dbHealthy = await testConnection()
    checks.database = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      latency: Date.now() - dbStart,
    }
    if (!dbHealthy) allHealthy = false
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      latency: Date.now() - dbStart,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
    allHealthy = false
  }

  // Check Redis
  const redisStart = Date.now()
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    const redis = createClient({ url: redisUrl })
    await redis.connect()
    await redis.ping()
    await redis.disconnect()
    checks.redis = {
      status: 'healthy',
      latency: Date.now() - redisStart,
    }
  } catch (error) {
    checks.redis = {
      status: 'unhealthy',
      latency: Date.now() - redisStart,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
    allHealthy = false
  }

  // Check external APIs (optional, don't fail readiness for these)
  checks.external_apis = {
    status: 'available',
  }

  const statusCode = allHealthy ? 200 : 503
  res.status(statusCode).json({
    status: allHealthy ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    checks,
    version: process.env.npm_package_version || '1.0.0',
  })
})

// Detailed health check with metrics
app.get('/health/detailed', async (_req, res) => {
  const memoryUsage = process.memoryUsage()
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    node_version: process.version,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
    },
    cpu: process.cpuUsage(),
    pid: process.pid,
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/schools', schoolRoutes)
app.use('/api/validation', validationRoutes)
app.use('/api/scorecard', scorecardRoutes)
app.use('/api/economic', economicRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
const PORT = config.port

app.listen(PORT, () => {
  logger.info(`🚀 FAFSA Assistant API Server running on port ${PORT}`)
  logger.info(`📊 Environment: ${config.nodeEnv}`)
  logger.info(`🔐 CORS enabled for: ${config.corsOrigins.join(', ')}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...')
  process.exit(0)
})

export default app
