// src/repositories/TimezoneRepository.ts

import { Pool } from 'pg';

export interface Timezone { // <--- Added 'export' here
    id: number;
    name: string;
    display_name: string;
    utc_offset: string;
    is_dst: boolean;
    created_at: Date;
    updated_at: Date;
}

export class TimezoneRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    /**
     * Retrieves all timezones from the database.
     * @returns A promise that resolves to an array of Timezone objects.
     */
    async getAllTimezones(): Promise<Timezone[]> {
        try {
            const result = await this.pool.query<Timezone>('SELECT * FROM timezones ORDER BY display_name');
            return result.rows;
        } catch (error) {
            console.error('Error fetching all timezones:', error);
            throw error;
        }
    }

    /**
     * Retrieves popular timezones from the database.
     * Assumes a 'popular_timezones' table exists and is correctly populated.
     * @returns A promise that resolves to an array of Timezone objects.
     */
    async getPopularTimezones(): Promise<Timezone[]> {
        try {
            const result = await this.pool.query<Timezone>(`
                SELECT t.* FROM timezones t
                JOIN popular_timezones pt ON t.id = pt.timezone_id
                ORDER BY pt.display_order;
            `);
            return result.rows;
        } catch (error) {
            console.error('Error fetching popular timezones:', error);
            throw error;
        }
    }

    /**
     * Retrieves a single timezone by its IANA name.
     * @param timezoneName The IANA timezone name (e.g., 'America/New_York').
     * @returns A promise that resolves to a Timezone object or null if not found.
     */
    async getTimezoneByName(timezoneName: string): Promise<Timezone | null> {
        try {
            const result = await this.pool.query<Timezone>(
                'SELECT * FROM timezones WHERE name = $1',
                [timezoneName]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error fetching timezone by name ${timezoneName}:`, error);
            throw error;
        }
    }

    /**
     * Searches for timezones based on a query string in name or display_name.
     * @param query The search string.
     * @returns A promise that resolves to an array of matching Timezone objects.
     */
    async searchTimezones(query: string): Promise<Timezone[]> {
        try {
            const searchTerm = `%${query.toLowerCase()}%`;
            const result = await this.pool.query<Timezone>(
                'SELECT * FROM timezones WHERE LOWER(name) LIKE $1 OR LOWER(display_name) LIKE $1 ORDER BY display_name',
                [searchTerm]
            );
            return result.rows;
        } catch (error) {
            console.error('Error searching timezones:', error);
            throw error;
        }
    }

    /**
     * Retrieves the current time for a given timezone directly from the database.
     * @param timezoneName The IANA timezone name.
     * @returns A promise that resolves to an object containing current_time or null.
     */
    async getCurrentTimeInDbTimezone(timezoneName: string): Promise<{ current_time: string } | null> {
        try {
            const result = await this.pool.query<{ current_time: string }>(
                'SELECT NOW() AT TIME ZONE $1 as current_time',
                [timezoneName]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error getting current time for timezone ${timezoneName}:`, error);
            throw error;
        }
    }

    /**
     * Converts a given timestamp from one timezone to another using database functions.
     * @param fromTz The source IANA timezone name.
     * @param toTz The target IANA timezone name.
     * @param time The timestamp string to convert (e.g., '2023-10-27 10:00:00').
     * @returns A promise that resolves to an object with original_time and converted_time, or null.
     */
    async convertTimeInDbBetweenZones(fromTz: string, toTz: string, time: string): Promise<{ original_time: string, converted_time: string } | null> {
        try {
            const result = await this.pool.query<{ original_time: string, converted_time: string }>(
                `SELECT
                    $3::TIMESTAMP AT TIME ZONE $1 as original_time,
                    $3::TIMESTAMP AT TIME ZONE $1 AT TIME ZONE $2 as converted_time`,
                [fromTz, toTz, time]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error converting time from ${fromTz} to ${toTz}:`, error);
            throw error;
        }
    }
}
