import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from '../config'
import * as schema from './schema'
import { logger } from '../utils/logger'

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL || config.database.url

// For migrations and CLI operations
export const migrationClient = postgres(connectionString, { max: 1 })

// For application queries
const queryClient = postgres(connectionString, { 
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
})

export const db = drizzle(queryClient, { schema })

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    await queryClient`SELECT 1`
    logger.info('✅ Database connection successful')
    return true
  } catch (error) {
    logger.error('❌ Database connection failed:', error)
    return false
  }
}

// Graceful shutdown
export async function closeConnection(): Promise<void> {
  try {
    await queryClient.end()
    logger.info('Database connection closed')
  } catch (error) {
    logger.error('Error closing database connection:', error)
  }
}
