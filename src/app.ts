

// // src/app.ts

// import express, { Express, Request, Response } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import pool from './db/connection';
// import config from './config';
// import { TimeController } from './controllers/TimeController';
// import { ApiKeyController } from './controllers/ApiKeyController';
// import { ApiKeyService } from './services/ApiKeyService';

// export const createApp = (): Express => {
//   const app: Express = express();
  
//   // Middlewares
//   app.use(cors());
//   app.use(helmet());
//   app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));

//   // Initialize controllers
//   const timeController = new TimeController(pool);
//   const apiKeyController = new ApiKeyController(pool);
//   const apiKeyService = new ApiKeyService(pool);

//   // API key middleware
//   app.use(async (req: Request, res: Response, next) => {
//     // Skip for health check and API key generation
//     if (req.path === '/health' || req.path === '/api/generate-key') {
//       return next();
//     }

//     const apiKey = req.query.api_key as string | undefined;
    
//     // Public endpoints have rate limits (10 req/min)
//     const isPublic = !apiKey;
//     const rateLimitKey = isPublic ? 'public' : apiKey;
//     const endpoint = req.path;

//     if (isPublic) {
//       // Check public rate limits
//       const publicIp = req.ip;
//       // Implement IP-based rate limiting here if needed
//       // For simplicity, we'll just use the API key service
//     }

//     const { valid, limitExceeded } = await apiKeyService.validateApiKey(
//       apiKey || 'public', 
//       endpoint
//     );

//     if (!valid) {
//       return res.status(401).json({ error: 'Invalid API key' });
//     }

//     if (limitExceeded) {
//       return res.status(429).json({ 
//         error: 'Rate limit exceeded',
//         message: isPublic 
//           ? 'Get a free API key for higher limits (100 req/min)' 
//           : 'You have exceeded your rate limit'
//       });
//     }

//     // Track API usage
//     if (apiKey) {
//       await apiKeyService.trackApiUsage(apiKey, endpoint);
//     }

//     next();
//   });

//   // Routes
//   app.get('/', (_req: Request, res: Response) => {
//     res.send('Universal Time API is running');
//   });

//   // Health check
//   app.get('/health', async (_req: Request, res: Response) => {
//     try {
//       await pool.query('SELECT 1');
//       res.status(200).json({ 
//         status: 'OK',
//         database: 'Connected',
//         environment: config.nodeEnv,
//         timestamp: new Date().toISOString()
//       });
//     } catch (err: any) {
//       res.status(503).json({
//         status: 'DOWN',
//         database: 'Disconnected',
//         error: err.message,
//         timestamp: new Date().toISOString()
//       });
//     }
//   });

//   // Time API routes
//   app.get('/api/timezones', (req, res) => timeController.getTimezones(req, res));
//   app.get('/api/timezones/popular', (req, res) => timeController.getPopularTimezones(req, res));
//   app.get('/api/timezones/search', (req, res) => timeController.searchTimezones(req, res));
//   app.get('/api/time', (req, res) => timeController.getCurrentTime(req, res));
//   app.get('/api/convert', (req, res) => timeController.convertTime(req, res));

//   // API Key routes
//   app.get('/api/generate-key', (req, res) => apiKeyController.generateApiKey(req, res));
//   app.get('/api/validate-key', (req, res) => apiKeyController.validateApiKey(req, res));
//   app.get('/api/key-stats', (req, res) => apiKeyController.getApiKeyStats(req, res));

//   // Error handling middleware
//   app.use((err: Error, _req: Request, res: Response, _next: Function) => {
//     console.error(err.stack);
//     res.status(500).json({
//       error: 'Internal Server Error',
//       message: config.nodeEnv === 'development' ? err.message : undefined
//     });
//   });

//   return app;
// };
















// // src/app.ts

// import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import pool from './db/connection';
// import config from './config';
// import { TimeController } from './controllers/TimeController';
// import { ApiKeyController } from './controllers/ApiKeyController';
// import { ApiKeyService } from './services/ApiKeyService';

// export const createApp = (): Express => {
//     const app: Express = express();

//     // Middlewares
//     app.use(cors());
//     app.use(helmet());
//     app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));

//     // Initialize controllers
//     const timeController = new TimeController(pool);
//     const apiKeyController = new ApiKeyController(pool);
//     const apiKeyService = new ApiKeyService(pool);

//     // API key middleware - Wrap async handler in a try-catch to pass errors to next
//     app.use(async (req: Request, res: Response, next: NextFunction): Promise<void> => { // Explicitly type next as Promise<void>
//         try {
//             // Skip for health check and API key generation
//             if (req.path === '/health' || req.path === '/api/generate-key') {
//                 return next();
//             }

//             const apiKey = req.query.api_key as string | undefined;

//             // Public endpoints have rate limits (10 req/min)
//             const isPublic = !apiKey;
//             // const rateLimitKey = isPublic ? 'public' : apiKey; // rateLimitKey not used directly here
//             const endpoint = req.path;

//             if (isPublic) {
//                 // Check public rate limits
//                 const publicIp = req.ip;
//                 // Implement IP-based rate limiting here if needed
//                 // For simplicity, we'll just use the API key service
//             }

//             const { valid, limitExceeded } = await apiKeyService.validateApiKey(
//                 apiKey || 'public',
//                 endpoint
//             );

//             if (!valid) {
//                 res.status(401).json({ error: 'Invalid API key' });
//                 return; // Explicitly return after sending response
//             }

//             if (limitExceeded) {
//                 res.status(429).json({
//                     error: 'Rate limit exceeded',
//                     message: isPublic
//                         ? 'Get a free API key for higher limits (100 req/min)'
//                         : 'You have exceeded your rate limit'
//                 });
//                 return; // Explicitly return after sending response
//             }

//             // Track API usage
//             if (apiKey) {
//                 await apiKeyService.trackApiUsage(apiKey, endpoint);
//             }

//             next();
//         } catch (error) {
//             next(error); // Pass any errors to the error handling middleware
//         }
//     });

//     // Routes
//     app.get('/', (_req: Request, res: Response) => {
//         res.send('Universal Time API is running');
//     });

//     // Health check
//     app.get('/health', async (_req: Request, res: Response) => {
//         try {
//             await pool.query('SELECT 1');
//             res.status(200).json({
//                 status: 'OK',
//                 database: 'Connected',
//                 environment: config.nodeEnv,
//                 timestamp: new Date().toISOString()
//             });
//         } catch (err: any) {
//             res.status(503).json({
//                 status: 'DOWN',
//                 database: 'Disconnected',
//                 error: err.message,
//                 timestamp: new Date().toISOString()
//             });
//         }
//     });

//     // Time API routes - Use .bind(timeController) and cast to RequestHandler
//     app.get('/api/timezones', timeController.getTimezones.bind(timeController) as RequestHandler); // Corrected method name
//     app.get('/api/timezones/popular', timeController.getPopularTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/timezones/search', timeController.searchTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/time', timeController.getCurrentTime.bind(timeController) as RequestHandler);
//     app.get('/api/convert', timeController.convertTime.bind(timeController) as RequestHandler);

//     // API Key routes - Use .bind(apiKeyController) and cast to RequestHandler
//     app.get('/api/generate-key', apiKeyController.generateApiKey.bind(apiKeyController) as RequestHandler);
//     app.get('/api/validate-key', apiKeyController.validateApiKey.bind(apiKeyController) as RequestHandler);
//     app.get('/api/key-stats', apiKeyController.getApiKeyStats.bind(apiKeyController) as RequestHandler);

//     // Error handling middleware
//     app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => { // Explicitly type _next
//         console.error(err.stack);
//         res.status(500).json({
//             error: 'Internal Server Error',
//             message: config.nodeEnv === 'development' ? err.message : undefined
//         });
//     });

//     return app;
// };























// // src/app.ts

// import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import pool from './db/connection';
// import config from './config';
// import { TimeController } from './controllers/TimeController';
// import { ApiKeyController } from './controllers/ApiKeyController';
// import { ApiKeyService } from './services/ApiKeyService';

// export const createApp = (): Express => {
//     const app: Express = express();

//     // Middlewares
//     app.use(cors());
//     app.use(helmet());
//     app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));

//     // Initialize controllers
//     const timeController = new TimeController(pool);
//     const apiKeyController = new ApiKeyController(pool);
//     const apiKeyService = new ApiKeyService(pool);

//     // API key middleware - Wrap async handler in a try-catch to pass errors to next
//     app.use(async (req: Request, res: Response, next: NextFunction): Promise<void> => { // Explicitly type next as Promise<void>
//         try {
//             // Skip for health check and API key generation
//             if (req.path === '/health' || req.path === '/api/generate-key') {
//                 return next();
//             }

//             const apiKey = req.query.api_key as string | undefined;

//             // Public endpoints have rate limits (10 req/min)
//             const isPublic = !apiKey;
//             // const rateLimitKey = isPublic ? 'public' : apiKey; // rateLimitKey not used directly here
//             const endpoint = req.path;

//             if (isPublic) {
//                 // Check public rate limits
//                 // The original 'const publicIp = req.ip;' was here. Removed as it was unused.
//                 // Implement IP-based rate limiting here if needed
//                 // For simplicity, we'll just use the API key service
//             }

//             const { valid, limitExceeded } = await apiKeyService.validateApiKey(
//                 apiKey || 'public',
//                 endpoint
//             );

//             if (!valid) {
//                 res.status(401).json({ error: 'Invalid API key' });
//                 return; // Explicitly return after sending response
//             }

//             if (limitExceeded) {
//                 res.status(429).json({
//                     error: 'Rate limit exceeded',
//                     message: isPublic
//                         ? 'Get a free API key for higher limits (100 req/min)'
//                         : 'You have exceeded your rate limit'
//                 });
//                 return; // Explicitly return after sending response
//             }

//             // Track API usage
//             if (apiKey) {
//                 await apiKeyService.trackApiUsage(apiKey, endpoint);
//             }

//             next();
//         } catch (error) {
//             next(error); // Pass any errors to the error handling middleware
//         }
//     });

//     // Routes
//     app.get('/', (_req: Request, res: Response) => {
//         res.send('Universal Time API is running');
//     });

//     // Health check
//     app.get('/health', async (_req: Request, res: Response) => {
//         try {
//             await pool.query('SELECT 1');
//             res.status(200).json({
//                 status: 'OK',
//                 database: 'Connected',
//                 environment: config.nodeEnv,
//                 timestamp: new Date().toISOString()
//             });
//         } catch (err: any) {
//             res.status(503).json({
//                 status: 'DOWN',
//                 database: 'Disconnected',
//                 error: err.message,
//                 timestamp: new Date().toISOString()
//             });
//         }
//     });

//     // Time API routes - Use .bind(timeController) and cast to RequestHandler
//     app.get('/api/timezones', timeController.getTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/timezones/popular', timeController.getPopularTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/timezones/search', timeController.searchTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/time', timeController.getCurrentTime.bind(timeController) as RequestHandler);
//     app.get('/api/convert', timeController.convertTime.bind(timeController) as RequestHandler);

//     // API Key routes - Use .bind(apiKeyController) and cast to RequestHandler
//     app.get('/api/generate-key', apiKeyController.generateApiKey.bind(apiKeyController) as RequestHandler);
//     app.get('/api/validate-key', apiKeyController.validateApiKey.bind(apiKeyController) as RequestHandler);
//     app.get('/api/key-stats', apiKeyController.getApiKeyStats.bind(apiKeyController) as RequestHandler);

//     // Error handling middleware
//     app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
//         console.error(err.stack);
//         res.status(500).json({
//             error: 'Internal Server Error',
//             message: config.nodeEnv === 'development' ? err.message : undefined
//         });
//     });

//     return app;
// };





















// // src/app.ts

// import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import pool from './db/connection';
// import config from './config';
// import swaggerUi from 'swagger-ui-express';
// import swaggerSpec from './utils/swagger';
// import { TimeController } from './controllers/TimeController';
// import { ApiKeyController } from './controllers/ApiKeyController';
// import { ApiKeyService } from './services/ApiKeyService';

// export const createApp = (): Express => {
//     const app: Express = express();

//     // Middlewares
//     app.use(cors());
//     app.use(helmet());
//     app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));

//     // Serve Swagger UI in development
//     if (config.nodeEnv === 'development') {
//         app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//     }

//     // Initialize controllers
//     const timeController = new TimeController(pool);
//     const apiKeyController = new ApiKeyController(pool);
//     const apiKeyService = new ApiKeyService(pool);

//     // API key middleware - Wrap async handler in a try-catch to pass errors to next
//     app.use(async (req: Request, res: Response, next: NextFunction): Promise<void> => { // Explicitly type next as Promise<void>
//         try {
//             // Skip for health check and API key generation
//             if (req.path === '/health' || req.path === '/api/generate-key') {
//                 return next();
//             }

//             const apiKey = req.query.api_key as string | undefined;

//             // Public endpoints have rate limits (10 req/min)
//             const isPublic = !apiKey;
//             // const rateLimitKey = isPublic ? 'public' : apiKey; // rateLimitKey not used directly here
//             const endpoint = req.path;

//             if (isPublic) {
//                 // Check public rate limits
//                 // The original 'const publicIp = req.ip;' was here. Removed as it was unused.
//                 // Implement IP-based rate limiting here if needed
//                 // For simplicity, we'll just use the API key service
//             }

//             const { valid, limitExceeded } = await apiKeyService.validateApiKey(
//                 apiKey || 'public',
//                 endpoint
//             );

//             if (!valid) {
//                 res.status(401).json({ error: 'Invalid API key' });
//                 return; // Explicitly return after sending response
//             }

//             if (limitExceeded) {
//                 res.status(429).json({
//                     error: 'Rate limit exceeded',
//                     message: isPublic
//                         ? 'Get a free API key for higher limits (100 req/min)'
//                         : 'You have exceeded your rate limit'
//                 });
//                 return; // Explicitly return after sending response
//             }

//             // Track API usage
//             if (apiKey) {
//                 await apiKeyService.trackApiUsage(apiKey, endpoint);
//             }

//             next();
//         } catch (error) {
//             next(error); // Pass any errors to the error handling middleware
//         }
//     });
    

//     // Routes
//     app.get('/', (_req: Request, res: Response) => {
//         res.send('Universal Time API is running');
//     });

//     // Health check
//     app.get('/health', async (_req: Request, res: Response) => {
//         try {
//             await pool.query('SELECT 1');
//             res.status(200).json({
//                 status: 'OK',
//                 database: 'Connected',
//                 environment: config.nodeEnv,
//                 timestamp: new Date().toISOString()
//             });
//         } catch (err: any) {
//             res.status(503).json({
//                 status: 'DOWN',
//                 database: 'Disconnected',
//                 error: err.message,
//                 timestamp: new Date().toISOString()
//             });
//         }
//     });

//     // Time API routes - Use .bind(timeController) and cast to RequestHandler
//     app.get('/api/timezones', timeController.getTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/timezones/popular', timeController.getPopularTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/timezones/search', timeController.searchTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/time', timeController.getCurrentTime.bind(timeController) as RequestHandler);
//     app.get('/api/convert', timeController.convertTime.bind(timeController) as RequestHandler);

//     // API Key routes - Use .bind(apiKeyController) and cast to RequestHandler
//     app.get('/api/generate-key', apiKeyController.generateApiKey.bind(apiKeyController) as RequestHandler);
//     app.get('/api/validate-key', apiKeyController.validateApiKey.bind(apiKeyController) as RequestHandler);
//     app.get('/api/key-stats', apiKeyController.getApiKeyStats.bind(apiKeyController) as RequestHandler);

//     // Error handling middleware
//     app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
//         console.error(err.stack);
//         res.status(500).json({
//             error: 'Internal Server Error',
//             message: config.nodeEnv === 'development' ? err.message : undefined
//         });
//     });

//     return app;
// };

















// // src/app.ts

// import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import swaggerUi from 'swagger-ui-express';
// import swaggerSpec from './utils/swagger';
// import pool from './db/connection';
// import config from './config';
// import { TimeController } from './controllers/TimeController';
// import { ApiKeyController } from './controllers/ApiKeyController';
// import { ApiKeyService } from './services/ApiKeyService';
// import { RateLimiterService } from './services/RateLimiterService';


// export const createApp = (): Express => {
//     const app: Express = express();

//     // Middlewares
//     app.use(cors());
//     app.use(helmet());
//     app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));

//     // Serve Swagger UI in development
//     if (config.nodeEnv === 'development') {
//         app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//     }

//     // Initialize services
//     const apiKeyService = new ApiKeyService(pool);
//     const rateLimiter = new RateLimiterService(pool);
//     const timeController = new TimeController(pool);
//     const apiKeyController = new ApiKeyController(pool);

//     // API key and rate limiting middleware
//     const apiKeyMiddleware: RequestHandler = async (req, res, next) => {
//     try {
//         // Skip for health check, API key generation, and docs
//         if (req.path === '/health' || 
//             req.path === '/api/generate-key' || 
//             req.path === '/api-docs' ||
//             req.path.startsWith('/api-docs/')) {
//             return next();
//         }

//         const apiKey = req.query.api_key as string | undefined;
//         const isPublic = !apiKey;
//         const endpoint = req.path;

//         // For public requests
//         if (isPublic) {
//             // Get client IP (consider proxy headers if behind one)
//             const ip = req.ip || req.socket.remoteAddress || 'unknown';
//             const publicRateLimitKey = `public:${ip}:${endpoint}`;
            
//             // Check rate limit (10 requests per minute for public)
//             const { allowed } = await rateLimiter.checkRateLimit(publicRateLimitKey, endpoint);
            
//             if (!allowed) {
//                 res.set('X-RateLimit-Limit', '10');
//                 res.status(429).json({ 
//                     error: 'Public rate limit exceeded',
//                     message: 'Get a free API key for higher limits (100 req/min)'
//                 });
//                 return;
//             }
            
//             return next();
//         }

//         // For API key requests
//         const { valid, limitExceeded } = await apiKeyService.validateApiKey(apiKey, endpoint);

//         if (!valid) {
//             res.status(401).json({ error: 'Invalid API key' });
//             return;
//         }

//         if (limitExceeded) {
//             res.status(429).json({ 
//                 error: 'Rate limit exceeded',
//                 message: 'You have exceeded your API key rate limit'
//             });
//             return;
//         }

//         // Track API usage
//         await apiKeyService.trackApiUsage(apiKey, endpoint);
//         next();
//     } catch (error) {
//         next(error);
//     }
//     };

//     // Apply the middleware
//     app.use(apiKeyMiddleware);

//     // Routes
//     app.get('/', (_req: Request, res: Response) => {
//         res.send('Universal Time API is running');
//     });

//     // Health check
//     app.get('/health', async (_req: Request, res: Response) => {
//         try {
//             await pool.query('SELECT 1');
//             res.status(200).json({
//                 status: 'OK',
//                 database: 'Connected',
//                 environment: config.nodeEnv,
//                 timestamp: new Date().toISOString()
//             });
//         } catch (err: any) {
//             res.status(503).json({
//                 status: 'DOWN',
//                 database: 'Disconnected',
//                 error: err.message,
//                 timestamp: new Date().toISOString()
//             });
//         }
//     });

//     // Time API routes
//     app.get('/api/timezones', timeController.getTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/timezones/popular', timeController.getPopularTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/timezones/search', timeController.searchTimezones.bind(timeController) as RequestHandler);
//     app.get('/api/time', timeController.getCurrentTime.bind(timeController) as RequestHandler);
//     app.get('/api/convert', timeController.convertTime.bind(timeController) as RequestHandler);

//     // API Key routes
//     app.get('/api/generate-key', apiKeyController.generateApiKey.bind(apiKeyController) as RequestHandler);
//     app.get('/api/validate-key', apiKeyController.validateApiKey.bind(apiKeyController) as RequestHandler);
//     app.get('/api/key-stats', apiKeyController.getApiKeyStats.bind(apiKeyController) as RequestHandler);

//     // Error handling middleware
//     app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
//         console.error(err.stack);
//         res.status(500).json({
//             error: 'Internal Server Error',
//             message: config.nodeEnv === 'development' ? err.message : undefined
//         });
//     });

//     return app;
// };















// src/app.ts

import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger';
import pool from './db/connection';
import config from './config';
import { TimeController } from './controllers/TimeController';
import { ApiKeyController } from './controllers/ApiKeyController';
import { ApiKeyService } from './services/ApiKeyService';
import { RateLimiterService } from './services/RateLimiterService';


export const createApp = (): Express => {
    const app: Express = express();

    // CRITICAL for deployments behind a proxy (like Render):
    // This enables Express to correctly interpret the 'X-Forwarded-For' header
    // and populate 'req.ip' with the actual client's IP address.
    // This MUST be set before any other middleware that relies on req.ip.
    app.set('trust proxy', true);

    // Middlewares
    app.use(cors());
    app.use(helmet());
    app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Serve Swagger UI in development
    if (config.nodeEnv === 'development') {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    // Initialize services
    const apiKeyService = new ApiKeyService(pool);
    const rateLimiter = new RateLimiterService(pool);
    const timeController = new TimeController(pool);
    const apiKeyController = new ApiKeyController(pool);

    // API key and rate limiting middleware
    const apiKeyMiddleware: RequestHandler = async (req, res, next) => {
    try {
        // Skip for health check, API key generation, and docs
        if (req.path === '/health' || 
            req.path === '/api/generate-key' || 
            req.path === '/api-docs' ||
            req.path.startsWith('/api-docs/')) {
            return next();
        }

        const apiKey = req.query.api_key as string | undefined;
        const isPublic = !apiKey;
        const endpoint = req.path;

        // For public requests
        if (isPublic) {
            // req.ip will now correctly reflect the client's IP due to 'trust proxy' setting
            const ip = req.ip || req.socket.remoteAddress || 'unknown'; 
            const publicRateLimitKey = `public:${ip}:${endpoint}`;
            
            // Check rate limit (10 requests per minute for public)
            const { allowed } = await rateLimiter.checkRateLimit(publicRateLimitKey, endpoint);
            
            if (!allowed) {
                res.set('X-RateLimit-Limit', '10');
                res.status(429).json({ 
                    error: 'Public rate limit exceeded',
                    message: 'Get a free API key for higher limits (100 req/min)'
                });
                return;
            }
            
            return next();
        }

        // For API key requests
        const { valid, limitExceeded } = await apiKeyService.validateApiKey(apiKey, endpoint);

        if (!valid) {
            res.status(401).json({ error: 'Invalid API key' });
            return;
        }

        if (limitExceeded) {
            res.status(429).json({ 
                error: 'Rate limit exceeded',
                message: 'You have exceeded your API key rate limit'
            });
            return;
        }

        // Track API usage
        await apiKeyService.trackApiUsage(apiKey, endpoint);
        next();
    } catch (error) {
        next(error);
    }
    };

    // Apply the middleware
    app.use(apiKeyMiddleware);

    // Routes
    app.get('/', (_req: Request, res: Response) => {
        res.send('Universal Time API is running');
    });

    // Health check
    app.get('/health', async (_req: Request, res: Response) => {
        try {
            await pool.query('SELECT 1');
            res.status(200).json({
                status: 'OK',
                database: 'Connected',
                environment: config.nodeEnv,
                timestamp: new Date().toISOString()
            });
        } catch (err: any) {
            res.status(503).json({
                status: 'DOWN',
                database: 'Disconnected',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // Time API routes
    app.get('/api/timezones', timeController.getTimezones.bind(timeController) as RequestHandler);
    app.get('/api/timezones/popular', timeController.getPopularTimezones.bind(timeController) as RequestHandler);
    app.get('/api/timezones/search', timeController.searchTimezones.bind(timeController) as RequestHandler);
    app.get('/api/time', timeController.getCurrentTime.bind(timeController) as RequestHandler);
    app.get('/api/convert', timeController.convertTime.bind(timeController) as RequestHandler);

    // API Key routes
    app.get('/api/generate-key', apiKeyController.generateApiKey.bind(apiKeyController) as RequestHandler);
    app.get('/api/validate-key', apiKeyController.validateApiKey.bind(apiKeyController) as RequestHandler);
    app.get('/api/key-stats', apiKeyController.getApiKeyStats.bind(apiKeyController) as RequestHandler);

    // Error handling middleware
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error(err.stack);
        res.status(500).json({
            error: 'Internal Server Error',
            message: config.nodeEnv === 'development' ? err.message : undefined
        });
    });

    return app;
};