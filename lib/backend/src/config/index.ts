import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// Validate required environment variables
const requiredEnvVars = {
    BRAND_TOKEN: process.env.BRAND_TOKEN,
    BRAND_ID: process.env.BRAND_ID,
    ACCOUNT_TOKEN: process.env.ACCOUNT_TOKEN,
    AUTH_ID: process.env.AUTH_ID,
    ACCOUNT_ACTION: process.env.ACCOUNT_ACTION,
};

// Check for missing required variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

export const config = {
    env: process.env.NODE_ENV || 'development',
    database: {
        limit: Number(process.env.LIMIT) || 10,
        // Add other database-related config here
    },
    tranzila: {
        publicKey: process.env.TRANZILA_PUBLIC_KEY || '',
        privateKey: process.env.TRANZILA_PRIVATE_KEY || '',
        terminalName: process.env.TRANZILA_TERMINAL_NAME || '',
    },
    server: {
        port: Number(process.env.PORT) || 3000,
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
    // etc.
};

export default config;
