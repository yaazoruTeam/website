import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Function to find project root by looking for .env file
const findProjectRoot = (startPath: string = __dirname): string => {
    let currentPath = startPath

    while (currentPath !== path.dirname(currentPath)) { // Until we reach filesystem root
        const envPath = path.join(currentPath, '.env')
        if (fs.existsSync(envPath)) {
            return currentPath
        }
        currentPath = path.dirname(currentPath)
    }

    // Fallback to process.cwd() if .env not found
    return process.cwd()
}

// Load environment variables from project root
const projectRoot = findProjectRoot()
const envPath = path.join(projectRoot, '.env')
dotenv.config({ path: envPath })

// Validate required environment variables
const requiredEnvVars = {
    BRAND_TOKEN: process.env.BRAND_TOKEN,
    BRAND_ID: process.env.BRAND_ID,
    ACCOUNT_TOKEN: process.env.ACCOUNT_TOKEN,
    AUTH_ID: process.env.AUTH_ID,
    ACCOUNT_ACTION: process.env.ACCOUNT_ACTION,
    APP_ACTION: process.env.APP_ACTION,
    GOOGLE_APPLICATION_CREDENTIALS_JSON: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    URL_SAMSUNG_API: process.env.URL_SAMSUNG_API,
    SAMSUNG_BEARER_TOKEN: process.env.SAMSUNG_BEARER_TOKEN,
};

// Check for missing required variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
})

export const config = {
    node_env: process.env.NODE_ENV || 'development',
    database: {
        limit: Number(process.env.LIMIT) || 10,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string),
        user: process.env.DB_USER,
        name: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
    },
    server: {
        port: Number(process.env.PORT) || 3006,
    },
    upload: {
        directory: process.env.UPLOAD_DIR || '/app/uploads',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    },
    tranzila: {
        publicKey: process.env.TRANZILA_PUBLIC_KEY || '',
        privateKey: process.env.TRANZILA_PRIVATE_KEY || '',
        terminalName: process.env.TRANZILA_TERMINAL_NAME || 'yaazorutok',
        expireMonth: parseInt(process.env.TRANZILA_EXPIRE_MONTH || '11'),
        expireYear: parseInt(process.env.TRANZILA_EXPIRE_YEAR || '2000'),
        cvv: process.env.TRANZILA_CVV || '',
        cardNumber: process.env.TRANZILA_CARD_NUMBER || '',
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
    samsung: {
        urlSamsungApi: process.env.URL_SAMSUNG_API as string,
        bearerToken: process.env.SAMSUNG_BEARER_TOKEN as string,
    },
    switchboard: {
        apiUrl: process.env.SWITCHBOARD_API_URL as string,
    }

};

export default config
