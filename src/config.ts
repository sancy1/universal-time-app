
// src/config.ts

import dotenv from 'dotenv';

dotenv.config();

interface Config {
  databaseUrl: string;
  port: number;
  nodeEnv: string;
  isProduction: boolean;
}

const config: Config = {
  databaseUrl: process.env.DATABASE_URL || '',
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate required configuration
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required in environment variables');
}

export default config;