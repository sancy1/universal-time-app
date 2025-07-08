
// src/models/UserPreferences.ts

export interface UserPreferences {
  id: string;
  api_key_id: string;
  default_timezone: string | null;
  clock_style: 'analog' | 'digital';
  theme_preference: 'light' | 'dark' | 'system';
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferencesInput {
  api_key_id: string;
  default_timezone?: string;
  clock_style?: 'analog' | 'digital';
  theme_preference?: 'light' | 'dark' | 'system';
}