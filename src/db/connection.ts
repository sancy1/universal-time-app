
// src/db/connection.ts

import { Pool } from 'pg';
import config from '../config';

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.isProduction 
    ? { 
        rejectUnauthorized: true,
        ca: process.env.SSL_CERT?.replace(/\\n/g, '\n') 
      }
    : { 
        rejectUnauthorized: false 
      },
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});

// Event listeners for connection pool
pool.on('connect', () => {
  if (config.nodeEnv !== 'test') {
    console.log('Connected to PostgreSQL database');
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (config.nodeEnv === 'development') {
    console.log('Executed query', { text, duration, rows: res.rowCount });
  }
  return res;
};

export default pool;