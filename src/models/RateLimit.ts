
// src/models/RateLimit.tz

export interface RateLimit {
  api_key_id: string;
  endpoint: string;
  count: number;
  last_request: Date;
}

export interface RateLimitInput {
  api_key_id: string;
  endpoint: string;
  count?: number;
}