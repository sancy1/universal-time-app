// src/services/TimeService.ts

import { TimezoneRepository } from '../repositories/TimezoneRepository';
import { Pool } from 'pg';

export class TimeService {
    private timezoneRepo: TimezoneRepository;

    constructor(pool: Pool) {
        this.timezoneRepo = new TimezoneRepository(pool);
    }

    async getAllTimezones() {
        return this.timezoneRepo.getAllTimezones();
    }

    async getPopularTimezones() {
        return this.timezoneRepo.getPopularTimezones();
    }

    async searchTimezones(query: string) {
        return this.timezoneRepo.searchTimezones(query);
    }

    async getTimezoneInfo(timezone: string) {
        return this.timezoneRepo.getTimezoneByName(timezone);
    }

    async getCurrentTimeForTimezone(timezone: string) {
        const tzInfo = await this.timezoneRepo.getTimezoneByName(timezone);
        if (!tzInfo) {
            return null;
        }

        // Delegate the database query to the repository
        // Calls a public method on TimezoneRepository instead of accessing its private pool
        const currentTimeResult = await this.timezoneRepo.getCurrentTimeInDbTimezone(timezone);

        if (!currentTimeResult) {
            return null; // Handle case where query fails or returns no rows
        }

        return {
            timezone: tzInfo.name,
            display_name: tzInfo.display_name,
            utc_offset: tzInfo.utc_offset,
            is_dst: tzInfo.is_dst,
            current_time: currentTimeResult.current_time
        };
    }

    async convertTimeBetweenZones(fromTz: string, toTz: string, time: string) {
        const fromTzInfo = await this.timezoneRepo.getTimezoneByName(fromTz);
        const toTzInfo = await this.timezoneRepo.getTimezoneByName(toTz);

        if (!fromTzInfo || !toTzInfo) {
            return null;
        }

        // Delegate the database query to the repository
        // Calls a public method on TimezoneRepository instead of accessing its private pool
        const conversionResult = await this.timezoneRepo.convertTimeInDbBetweenZones(fromTz, toTz, time);

        if (!conversionResult) {
            return null; // Handle case where query fails or returns no rows
        }

        return {
            original_time: conversionResult.original_time,
            original_timezone: fromTzInfo.name,
            original_display_name: fromTzInfo.display_name,
            converted_time: conversionResult.converted_time,
            converted_timezone: toTzInfo.name,
            converted_display_name: toTzInfo.display_name
        };
    }
}
