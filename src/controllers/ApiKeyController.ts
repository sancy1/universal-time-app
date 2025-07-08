// // src/controllers/ApiKeyController.ts

// import { Request, Response } from 'express';
// import { ApiKeyService } from '../services/ApiKeyService';
// import { Pool } from 'pg';

// export class ApiKeyController {
//     private apiKeyService: ApiKeyService;

//     constructor(pool: Pool) {
//         this.apiKeyService = new ApiKeyService(pool);
//     }

//     async generateApiKey(_req: Request, res: Response) {
//         try {
//             const key = await this.apiKeyService.generateApiKey();
//             res.json({ api_key: key });
//         } catch (error) {
//             console.error('Error generating API key:', error);
//             res.status(500).json({ error: 'Failed to generate API key' });
//         }
//     }

//     async validateApiKey(req: Request, res: Response) {
//         try {
//             const { key } = req.query;
//             if (!key || typeof key !== 'string') {
//                 res.status(400).json({ error: 'API key parameter is required' });
//                 return; // Explicit return
//             }

//             const { valid, limitExceeded } = await this.apiKeyService.validateApiKey(key, req.path);
//             res.json({ valid, limitExceeded });
//         } catch (error) {
//             console.error('Error validating API key:', error);
//             res.status(500).json({ error: 'Failed to validate API key' });
//             return; // Explicit return
//         }
//     }

//     async getApiKeyStats(req: Request, res: Response) {
//         try {
//             const { key } = req.query;
//             if (!key || typeof key !== 'string') {
//                 res.status(400).json({ error: 'API key parameter is required' });
//                 return; // Explicit return
//             }

//             const stats = await this.apiKeyService.getApiKeyStats(key);
//             res.json(stats);
//         } catch (error) {
//             console.error('Error getting API key stats:', error);
//             res.status(500).json({ error: 'Failed to get API key stats' });
//             return; // Explicit return
//         }
//     }
// }






















// src/controllers/ApiKeyController.ts
import { Request, Response } from 'express';
import { ApiKeyService } from '../services/ApiKeyService';
import { Pool } from 'pg';

/**
 * @swagger
 * tags:
 *   name: API Keys
 *   description: API key management
 */
export class ApiKeyController {
    private apiKeyService: ApiKeyService;

    constructor(pool: Pool) {
        this.apiKeyService = new ApiKeyService(pool);
    }

    /**
     * @swagger
     * /api/generate-key:
     *   get:
     *     summary: Generate a new API key
     *     tags: [API Keys]
     *     responses:
     *       200:
     *         description: Generated API key
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiKey'
     *       500:
     *         description: Internal server error
     */
    async generateApiKey(_req: Request, res: Response) {
        try {
            const key = await this.apiKeyService.generateApiKey();
            res.json({ api_key: key });
        } catch (error) {
            console.error('Error generating API key:', error);
            res.status(500).json({ error: 'Failed to generate API key' });
        }
    }

    /**
     * @swagger
     * /api/validate-key:
     *   get:
     *     summary: Validate an API key
     *     tags: [API Keys]
     *     parameters:
     *       - in: query
     *         name: key
     *         schema:
     *           type: string
     *         required: true
     *         description: API key to validate
     *     responses:
     *       200:
     *         description: Validation result
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 valid:
     *                   type: boolean
     *                   description: Whether the key is valid
     *                 limitExceeded:
     *                   type: boolean
     *                   description: Whether rate limit is exceeded
     *       400:
     *         description: Missing API key parameter
     *       500:
     *         description: Internal server error
     */
    async validateApiKey(req: Request, res: Response) {
        try {
            const { key } = req.query;
            if (!key || typeof key !== 'string') {
                res.status(400).json({ error: 'API key parameter is required' });
                return;
            }

            const { valid, limitExceeded } = await this.apiKeyService.validateApiKey(key, req.path);
            res.json({ valid, limitExceeded });
        } catch (error) {
            console.error('Error validating API key:', error);
            res.status(500).json({ error: 'Failed to validate API key' });
        }
    }

    /**
     * @swagger
     * /api/key-stats:
     *   get:
     *     summary: Get API key usage statistics
     *     tags: [API Keys]
     *     parameters:
     *       - in: query
     *         name: key
     *         schema:
     *           type: string
     *         required: true
     *         description: API key to get stats for
     *     responses:
     *       200:
     *         description: API key statistics
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 total_requests:
     *                   type: integer
     *                   description: Total requests made with this key
     *                 requests_today:
     *                   type: integer
     *                   description: Requests made today
     *                 last_used:
     *                   type: string
     *                   format: date-time
     *                   description: When the key was last used
     *       400:
     *         description: Missing API key parameter
     *       500:
     *         description: Internal server error
     */
    async getApiKeyStats(req: Request, res: Response) {
        try {
            const { key } = req.query;
            if (!key || typeof key !== 'string') {
                res.status(400).json({ error: 'API key parameter is required' });
                return;
            }

            const stats = await this.apiKeyService.getApiKeyStats(key);
            res.json(stats);
        } catch (error) {
            console.error('Error getting API key stats:', error);
            res.status(500).json({ error: 'Failed to get API key stats' });
        }
    }
}