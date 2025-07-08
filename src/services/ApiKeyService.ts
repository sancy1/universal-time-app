
// src/services/ApiKeyService.ts

import { ApiKeyRepository } from '../repositories/ApiKeyRepository';
import { RateLimitRepository } from '../repositories/RateLimitRepository';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export class ApiKeyService {
  private apiKeyRepo: ApiKeyRepository;
  private rateLimitRepo: RateLimitRepository;

  constructor(pool: Pool) {
    this.apiKeyRepo = new ApiKeyRepository(pool);
    this.rateLimitRepo = new RateLimitRepository(pool);
  }

  async generateApiKey(): Promise<string> {
    const key = `ut_${uuidv4().replace(/-/g, '')}`;
    await this.apiKeyRepo.createApiKey(key);
    return key;
  }

  async validateApiKey(key: string, endpoint: string): Promise<{ valid: boolean; limitExceeded: boolean }> {
    const apiKey = await this.apiKeyRepo.getApiKey(key);
    if (!apiKey || !apiKey.is_active) {
      return { valid: false, limitExceeded: false };
    }

    // Check rate limits
    const rateLimit = await this.rateLimitRepo.getRateLimit(apiKey.id, endpoint);
    const requestCount = rateLimit?.count || 0;
    
    // Free tier limit: 100 requests per minute
    const limitExceeded = requestCount >= 100;

    return { 
      valid: true, 
      limitExceeded 
    };
  }

  async trackApiUsage(key: string, endpoint: string): Promise<void> {
    const apiKey = await this.apiKeyRepo.getApiKey(key);
    if (!apiKey) return;

    // Update API key usage stats
    await this.apiKeyRepo.updateApiKeyUsage(key);
    
    // Update rate limits
    await this.rateLimitRepo.createOrUpdateRateLimit(apiKey.id, endpoint);
  }

  async getApiKeyStats(key: string) {
    return this.apiKeyRepo.getApiKeyStats(key);
  }
}