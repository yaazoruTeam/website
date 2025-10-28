import 'reflect-metadata'
import { DataSource } from 'typeorm'
import config from './config'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
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
