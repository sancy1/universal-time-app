
// src/repositories/UserPreferencesRepository.ts

import { Pool } from 'pg';
import { UserPreferences, UserPreferencesInput } from '../models/UserPreferences';

export class UserPreferencesRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getPreferencesByApiKey(apiKeyId: string): Promise<UserPreferences | null> {
    const result = await this.pool.query(
      'SELECT * FROM user_preferences WHERE api_key_id = $1',
      [apiKeyId]
    );
    return result.rows[0] || null;
  }

  async createPreferences(input: UserPreferencesInput): Promise<UserPreferences> {
    const result = await this.pool.query(
      `INSERT INTO user_preferences 
       (api_key_id, default_timezone, clock_style, theme_preference)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        input.api_key_id,
        input.default_timezone || null,
        input.clock_style || 'analog',
        input.theme_preference || 'system'
      ]
    );
    return result.rows[0];
  }

  async updatePreferences(apiKeyId: string, input: Partial<UserPreferencesInput>): Promise<UserPreferences> {
    const existing = await this.getPreferencesByApiKey(apiKeyId);
    if (!existing) {
      return this.createPreferences({
        api_key_id: apiKeyId,
        ...input
      });
    }

    const result = await this.pool.query(
      `UPDATE user_preferences 
       SET 
         default_timezone = COALESCE($2, default_timezone),
         clock_style = COALESCE($3, clock_style),
         theme_preference = COALESCE($4, theme_preference),
         updated_at = NOW()
       WHERE api_key_id = $1
       RETURNING *`,
      [
        apiKeyId,
        input.default_timezone,
        input.clock_style,
        input.theme_preference
      ]
    );
    return result.rows[0];
  }
}