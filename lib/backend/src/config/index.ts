import * as dotenv from 'dotenv';

// Load environment variables once
dotenv.config();

export const config = {
    database: {
        limit: Number(process.env.LIMIT) || 10,
        // Add other database-related config here
    },
    // Add other configuration sections as needed
    server: {
        port: Number(process.env.PORT) || 3000,
    },
    // etc.
};

export default config;
