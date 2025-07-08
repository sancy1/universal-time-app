// // src/controllers/TimeController.ts
// import { Request, Response } from 'express';
// import { TimeService } from '../services/TimeService';
// import { Pool } from 'pg';

// export class TimeController {
//     private timeService: TimeService;

//     constructor(pool: Pool) {
//         this.timeService = new TimeService(pool);
//     }

//     async getTimezones(_req: Request, res: Response) {
//         try {
//             const timezones = await this.timeService.getAllTimezones();
//             res.json(timezones);
//         } catch (error) {
//             console.error('Error fetching timezones:', error);
//             res.status(500).json({ error: 'Failed to fetch timezones' });
//         }
//     }

//     async getPopularTimezones(_req: Request, res: Response) {
//         try {
//             const timezones = await this.timeService.getPopularTimezones();
//             res.json(timezones);
//         } catch (error) {
//             console.error('Error fetching popular timezones:', error);
//             res.status(500).json({ error: 'Failed to fetch popular timezones' });
//         }
//     }

//     async searchTimezones(req: Request, res: Response) {
//         try {
//             const { query } = req.query;
//             if (!query || typeof query !== 'string') {
//                 res.status(400).json({ error: 'Query parameter is required' });
//                 return; // Explicit return
//             }

//             const timezones = await this.timeService.searchTimezones(query);
//             res.json(timezones);
//         } catch (error) {
//             console.error('Error searching timezones:', error);
//             res.status(500).json({ error: 'Failed to search timezones' });
//         }
//     }

//     async getCurrentTime(req: Request, res: Response) {
//         try {
//             const { timezone } = req.query;
//             if (!timezone || typeof timezone !== 'string') {
//                 res.status(400).json({ error: 'Timezone parameter is required' });
//                 return; // Explicit return
//             }

//             const timeInfo = await this.timeService.getCurrentTimeForTimezone(timezone);
//             if (!timeInfo) {
//                 res.status(404).json({ error: 'Timezone not found' });
//                 return; // Explicit return
//             }

//             res.json({
//                 time: timeInfo.current_time,
//                 timezone: timeInfo.timezone,
//                 display_name: timeInfo.display_name,
//                 utc_offset: timeInfo.utc_offset,
//                 is_dst: timeInfo.is_dst,
//                 timestamp: Math.floor(new Date(timeInfo.current_time).getTime() / 1000)
//             });
//         } catch (error) {
//             console.error('Error getting current time:', error);
//             res.status(500).json({ error: 'Failed to get current time' });
//         }
//     }

//     async convertTime(req: Request, res: Response) {
//         try {
//             const { from, to, time } = req.query;

//             if (!from || !to || !time ||
//                 typeof from !== 'string' ||
//                 typeof to !== 'string' ||
//                 typeof time !== 'string') {
//                 res.status(400).json({
//                     error: 'from, to, and time parameters are required'
//                 });
//                 return; // Explicit return
//             }

//             const result = await this.timeService.convertTimeBetweenZones(from, to, time);
//             if (!result) {
//                 res.status(404).json({ error: 'One or more timezones not found' });
//                 return; // Explicit return
//             }

//             res.json({
//                 original_time: result.original_time,
//                 original_timezone: result.original_timezone,
//                 original_display_name: result.original_display_name,
//                 converted_time: result.converted_time,
//                 converted_timezone: result.converted_timezone,
//                 converted_display_name: result.converted_display_name
//             });
//         } catch (error) {
//             console.error('Error converting time:', error);
//             res.status(500).json({ error: 'Failed to convert time' });
//         }
//     }
// }


























// src/controllers/TimeController.ts
import { Request, Response } from 'express';
import { TimeService } from '../services/TimeService';
import { Pool } from 'pg';

/**
 * @swagger
 * tags:
 *   name: Time
 *   description: Time-related operations
 */
export class TimeController {
    private timeService: TimeService;

    constructor(pool: Pool) {
        this.timeService = new TimeService(pool);
    }

    /**
     * @swagger
     * /api/timezones:
     *   get:
     *     summary: Get all available timezones
     *     tags: [Time]
     *     responses:
     *       200:
     *         description: List of all timezones
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Timezone'
     *       500:
     *         description: Internal server error
     */
    async getTimezones(_req: Request, res: Response) {
        try {
            const timezones = await this.timeService.getAllTimezones();
            res.json(timezones);
        } catch (error) {
            console.error('Error fetching timezones:', error);
            res.status(500).json({ error: 'Failed to fetch timezones' });
        }
    }

    /**
     * @swagger
     * /api/timezones/popular:
     *   get:
     *     summary: Get popular timezones
     *     tags: [Time]
     *     responses:
     *       200:
     *         description: List of popular timezones
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Timezone'
     *       500:
     *         description: Internal server error
     */
    async getPopularTimezones(_req: Request, res: Response) {
        try {
            const timezones = await this.timeService.getPopularTimezones();
            res.json(timezones);
        } catch (error) {
            console.error('Error fetching popular timezones:', error);
            res.status(500).json({ error: 'Failed to fetch popular timezones' });
        }
    }

    /**
     * @swagger
     * /api/timezones/search:
     *   get:
     *     summary: Search timezones
     *     tags: [Time]
     *     parameters:
     *       - in: query
     *         name: query
     *         schema:
     *           type: string
     *         required: true
     *         description: Search term for timezones
     *     responses:
     *       200:
     *         description: List of matching timezones
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Timezone'
     *       400:
     *         description: Missing query parameter
     *       500:
     *         description: Internal server error
     */
    async searchTimezones(req: Request, res: Response) {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                res.status(400).json({ error: 'Query parameter is required' });
                return;
            }

            const timezones = await this.timeService.searchTimezones(query);
            res.json(timezones);
        } catch (error) {
            console.error('Error searching timezones:', error);
            res.status(500).json({ error: 'Failed to search timezones' });
        }
    }

    /**
     * @swagger
     * /api/time:
     *   get:
     *     summary: Get current time for a timezone
     *     tags: [Time]
     *     parameters:
     *       - in: query
     *         name: timezone
     *         schema:
     *           type: string
     *         required: true
     *         description: IANA timezone identifier (e.g., America/New_York)
     *     responses:
     *       200:
     *         description: Current time information
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/TimeResponse'
     *       400:
     *         description: Missing timezone parameter
     *       404:
     *         description: Timezone not found
     *       500:
     *         description: Internal server error
     */
    async getCurrentTime(req: Request, res: Response) {
        try {
            const { timezone } = req.query;
            if (!timezone || typeof timezone !== 'string') {
                res.status(400).json({ error: 'Timezone parameter is required' });
                return;
            }

            const timeInfo = await this.timeService.getCurrentTimeForTimezone(timezone);
            if (!timeInfo) {
                res.status(404).json({ error: 'Timezone not found' });
                return;
            }

            res.json({
                time: timeInfo.current_time,
                timezone: timeInfo.timezone,
                display_name: timeInfo.display_name,
                utc_offset: timeInfo.utc_offset,
                is_dst: timeInfo.is_dst,
                timestamp: Math.floor(new Date(timeInfo.current_time).getTime() / 1000)
            });
        } catch (error) {
            console.error('Error getting current time:', error);
            res.status(500).json({ error: 'Failed to get current time' });
        }
    }

    /**
     * @swagger
     * /api/convert:
     *   get:
     *     summary: Convert time between timezones
     *     tags: [Time]
     *     parameters:
     *       - in: query
     *         name: from
     *         schema:
     *           type: string
     *         required: true
     *         description: Source timezone (e.g., America/New_York)
     *       - in: query
     *         name: to
     *         schema:
     *           type: string
     *         required: true
     *         description: Target timezone (e.g., Europe/London)
     *       - in: query
     *         name: time
     *         schema:
     *           type: string
     *         required: true
     *         description: Time to convert in ISO format (e.g., 2024-03-15T14:30:00)
     *     responses:
     *       200:
     *         description: Converted time information
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 original_time:
     *                   type: string
     *                   example: '2024-03-15T14:30:00'
     *                 original_timezone:
     *                   type: string
     *                   example: 'America/New_York'
     *                 original_display_name:
     *                   type: string
     *                   example: 'New York, USA (EST)'
     *                 converted_time:
     *                   type: string
     *                   example: '2024-03-15T19:30:00'
     *                 converted_timezone:
     *                   type: string
     *                   example: 'Europe/London'
     *                 converted_display_name:
     *                   type: string
     *                   example: 'London, UK (GMT)'
     *       400:
     *         description: Missing required parameters
     *       404:
     *         description: One or more timezones not found
     *       500:
     *         description: Internal server error
     */
    async convertTime(req: Request, res: Response) {
        try {
            const { from, to, time } = req.query;
            if (!from || !to || !time || 
                typeof from !== 'string' || 
                typeof to !== 'string' || 
                typeof time !== 'string') {
                res.status(400).json({ 
                    error: 'from, to, and time parameters are required' 
                });
                return;
            }

            const result = await this.timeService.convertTimeBetweenZones(from, to, time);
            if (!result) {
                res.status(404).json({ error: 'One or more timezones not found' });
                return;
            }

            res.json({
                original_time: result.original_time,
                original_timezone: result.original_timezone,
                original_display_name: result.original_display_name,
                converted_time: result.converted_time,
                converted_timezone: result.converted_timezone,
                converted_display_name: result.converted_display_name
            });
        } catch (error) {
            console.error('Error converting time:', error);
            res.status(500).json({ error: 'Failed to convert time' });
        }
    }
}