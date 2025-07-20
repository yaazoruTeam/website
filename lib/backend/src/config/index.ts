import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../../../../.env') })

// Validate required environment variables
const requiredEnvVars = {
    BRAND_TOKEN: process.env.BRAND_TOKEN,
    BRAND_ID: process.env.BRAND_ID,
    ACCOUNT_TOKEN: process.env.ACCOUNT_TOKEN,
    AUTH_ID: process.env.AUTH_ID,
    ACCOUNT_ACTION: process.env.ACCOUNT_ACTION,
    APP_ACTION: process.env.APP_ACTION,
    GOOGLE_APPLICATION_CREDENTIALS_JSON: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
};

// Check for missing required variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

export const config = {
    env: process.env.NODE_ENV || 'development',
    database: {
        limit: Number(process.env.LIMIT) || 10,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string),
        user: process.env.DB_USER,
        name: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
    },
    server: {
        port: Number(process.env.PORT) || 3000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    },
    tranzila: {
        publicKey: process.env.TRANZILA_PUBLIC_KEY || '',
        privateKey: process.env.TRANZILA_PRIVET_KEY || '',
    },
    widely: {
        brandToken: process.env.BRAND_TOKEN as string,
        brandId: Number(process.env.BRAND_ID) || 1,
        accountToken: process.env.ACCOUNT_TOKEN as string,
        accountId: Number(process.env.ACCOUNT_ID) || 1,
        authId: Number(process.env.AUTH_ID) || 0,
        urlAccountAction: process.env.ACCOUNT_ACTION as string,
        urlAppAction: process.env.APP_ACTION as string,
    },
    google: {
        applicationCredentialsJson: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON as string,
    },
};

export default config
