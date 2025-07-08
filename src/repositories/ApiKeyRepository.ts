
// src/repositories/ApiKeyRepository.ts

import { Pool } from 'pg';
import { ApiKey, ApiKeyStats } from '../models/ApiKey';

export class ApiKeyRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createApiKey(key: string): Promise<ApiKey> {
    const result = await this.pool.query(
      'INSERT INTO api_keys (key) VALUES ($1) RETURNING *',
      [key]
    );
    return result.rows[0];
  }

  async getApiKey(key: string): Promise<ApiKey | null> {
    const result = await this.pool.query('SELECT * FROM api_keys WHERE key = $1', [key]);
    return result.rows[0] || null;
  }

  async getApiKeyById(id: string): Promise<ApiKey | null> {
    const result = await this.pool.query('SELECT * FROM api_keys WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateApiKeyUsage(key: string): Promise<ApiKey> {
    const result = await this.pool.query(
      `UPDATE api_keys 
       SET request_count = request_count + 1, last_used_at = NOW() 
       WHERE key = $1 
       RETURNING *`,
      [key]
    );
    return result.rows[0];
  }

  async getApiKeyStats(key: string): Promise<ApiKeyStats> {
    const statsResult = await this.pool.query(
      `SELECT 
         request_count as total_requests,
         (SELECT COUNT(*) FROM api_request_logs 
          WHERE api_key_id = (SELECT id FROM api_keys WHERE key = $1) 
          AND created_at >= CURRENT_DATE) as requests_today,
         last_used_at as last_used
       FROM api_keys 
       WHERE key = $1`,
      [key]
    );
    
    return statsResult.rows[0] || {
      total_requests: 0,
      requests_today: 0,
      last_used: null
    };
  }
}

