
// src/services/RateLimiterService.ts

import { Pool } from 'pg';

export class RateLimiterService {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async checkRateLimit(identifier: string, endpoint: string): Promise<{ allowed: boolean }> {
        // Implement your rate limiting logic here
        // Example implementation:
        try {
            const result = await this.pool.query(
                `INSERT INTO rate_limits (identifier, endpoint, count, last_request)
                 VALUES ($1, $2, 1, NOW())
                 ON CONFLICT (identifier, endpoint)
                 DO UPDATE SET 
                    count = CASE 
                        WHEN last_request > NOW() - INTERVAL '1 minute' THEN rate_limits.count + 1
                        ELSE 1
                    END,
                    last_request = NOW()
                 RETURNING count`,
                [identifier, endpoint]
            );

            const currentCount = result.rows[0]?.count || 0;
            const limit = identifier.startsWith('public:') ? 10 : 100;
            
            return {
                allowed: currentCount <= limit
            };
        } catch (error) {
            console.error('Rate limit check failed:', error);
            // Fail open in case of errors
            return { allowed: true };
        }
    }
}