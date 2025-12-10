import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from '../config'

async function runMigrations() {
  console.log('🔄 Running database migrations...')
  
  const connectionString = process.env.DATABASE_URL || config.database.url
  
  const migrationClient = postgres(connectionString, { max: 1 })
  const db = drizzle(migrationClient)
  
  try {
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('✅ Migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await migrationClient.end()
  }
}

runMigrations()
