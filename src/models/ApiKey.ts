
// src/models/ApiKey.tz

export interface ApiKey {
  id: string;
  key: string;
  is_active: boolean;
  request_count: number;
  last_used_at: Date | null;
  created_at: Date;
  expires_at: Date;
}

export interface ApiKeyInput {
  key: string;
  is_active?: boolean;
  request_count?: number;
}

export interface ApiKeyStats {
  total_requests: number;
  requests_today: number;
  last_used: Date | null;
}