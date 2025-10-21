const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from project root
const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

// Configure ts-node for TypeScript migrations if available
try {
  require('ts-node').register({
    project: path.join(__dirname, 'tsconfig.json'),
    compilerOptions: {
      module: 'commonjs'
    }
  });
} catch (error) {
  // ts-node not available, will use compiled JS
}

// Base configuration
const baseConfig = {
  client: 'pg',
  pool: {
    min: 1,        // מינימום חיבור אחד תמיד פתוח
    max: 7         // מקסימום 7 חיבורים (כמו בפרויקט הנוכחי)
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',                // שינוי ל-TypeScript
    tableName: 'knex_migrations',   // טבלת המעקב תהיה ב-public schema
    disableTransactions: false
  },
  seeds: {
    directory: './seeds'
  }
};

module.exports = {
  development: {
    ...baseConfig,
    connection: {
      host: process.env.DB_HOST || 'db',        // 'db' כי זה שם הcontainer ב-docker-compose
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      database: process.env.DB_NAME || 'yaazoru',
      password: process.env.DB_PASSWORD || 'password',
      ssl: false
    },
    debug: false
  },

  production: {
    ...baseConfig,
    connection: {
      host: process.env.DB_HOST || 'database',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      database: process.env.DB_NAME || 'yaazoru',
      password: process.env.DB_PASSWORD,
      ssl: false
    },
    pool: {
      min: 2,      // ביצור - יותר חיבורים זמינים
      max: 10
    },
    debug: false
  }
};