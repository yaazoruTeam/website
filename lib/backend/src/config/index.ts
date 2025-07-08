import * as dotenv from 'dotenv'

// Load environment variables once
dotenv.config()

// Validate required environment variables
const requiredEnvVars = {
  ACCOUNT_ACTION: process.env.ACCOUNT_ACTION,
}

// Check for missing required variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

export const config = {
  database: {
    limit: Number(process.env.LIMIT) || 10,
    // Add other database-related config here
  },
  // Add other configuration sections as needed
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  widely: {
    urlAccountAction: process.env.ACCOUNT_ACTION as string, // כעת אנו יודעים שזה קיים
  },
  // etc.
}

export default config
