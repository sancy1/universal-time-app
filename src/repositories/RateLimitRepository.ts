
// src/ repositories/RateLimitRepository.ts

import { Pool } from 'pg';
import { RateLimit } from '../models/RateLimit';

export class RateLimitRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getRateLimit(apiKeyId: string, endpoint: string): Promise<RateLimit | null> {
    const result = await this.pool.query(
      'SELECT * FROM rate_limits WHERE api_key_id = $1 AND endpoint = $2',
      [apiKeyId, endpoint]
    );
    return result.rows[0] || null;
  }

  async createOrUpdateRateLimit(apiKeyId: string, endpoint: string): Promise<RateLimit> {
    const result = await this.pool.query(
      `INSERT INTO rate_limits (api_key_id, endpoint, count, last_request)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (api_key_id, endpoint) 
       DO UPDATE SET count = rate_limits.count + 1, last_request = NOW()
       RETURNING *`,
      [apiKeyId, endpoint]
    );
    return result.rows[0];
  }

  async resetRateLimit(apiKeyId: string, endpoint: string): Promise<void> {
    await this.pool.query(
      'DELETE FROM rate_limits WHERE api_key_id = $1 AND endpoint = $2',
      [apiKeyId, endpoint]
    );
  }
}