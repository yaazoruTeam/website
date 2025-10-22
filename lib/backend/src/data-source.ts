import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'

// Load environment variables immediately
dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local' })

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'yaazoru',
  // ה-migrations table יהיה בpublic schema
  // כל הטבלאות האחרות יהיו בyaazoru schema (מוגדר בEntity)
  synchronize: false, // כבוי - משתמשים רק במיגרציות
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  migrationsRun: true, // הרצת מיגרציות אוטומטית בהתחלת האפליקציה
})

/**
 * Initialize database and run migrations automatically
 */
export async function initializeDatabase() {
  try {
    if (AppDataSource.isInitialized) {
      console.log('✅ Database already initialized')
      return
    }

    await AppDataSource.initialize()
    console.log('✅ Database connection established')
    
    console.log('📦 Running migrations automatically...')
    await AppDataSource.runMigrations()
    console.log('✅ All migrations completed successfully')

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  }
}

export async function closeDatabase() {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy()
    console.log('✅ Database connection closed')
  }
}
