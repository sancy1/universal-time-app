
// // src/utils/swagger.ts
// import swaggerJsdoc from 'swagger-jsdoc';
// import { version } from '../../package.json';

// const options: swaggerJsdoc.Options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Universal Time API',
//       version,
//       description: 'API for getting current time in different timezones and converting between timezones',
//       contact: {
//         name: 'API Support',
//         email: 'support@universaltime.dev'
//       },
//       license: {
//         name: 'MIT',
//         url: 'https://opensource.org/licenses/MIT'
//       }
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000',
//         description: 'Development server'
//       },
//       {
//         url: 'https://api.universaltime.dev',
//         description: 'Production server'
//       }
//     ],
//     components: {
//       securitySchemes: {
//         ApiKeyAuth: {
//           type: 'apiKey',
//           in: 'query',
//           name: 'api_key',
//           description: 'API key for authenticated requests'
//         }
//       },
//       schemas: {
//         TimeResponse: {
//           type: 'object',
//           properties: {
//             time: {
//               type: 'string',
//               example: '10:30 AM',
//               description: 'Current time in the requested timezone'
//             },
//             timezone: {
//               type: 'string',
//               example: 'America/New_York',
//               description: 'IANA timezone identifier'
//             },
//             display_name: {
//               type: 'string',
//               example: 'New York, USA (EST)',
//               description: 'Human-readable timezone name'
//             },
//             utc_offset: {
//               type: 'string',
//               example: '-05:00',
//               description: 'UTC offset'
//             },
//             is_dst: {
//               type: 'boolean',
//               example: true,
//               description: 'Whether daylight saving time is active'
//             },
//             timestamp: {
//               type: 'integer',
//               example: 1710518400,
//               description: 'Unix timestamp'
//             }
//           }
//         },
//         Timezone: {
//           type: 'object',
//           properties: {
//             id: {
//               type: 'integer',
//               example: 1
//             },
//             name: {
//               type: 'string',
//               example: 'America/New_York'
//             },
//             display_name: {
//               type: 'string',
//               example: 'New York, USA (EST)'
//             },
//             utc_offset: {
//               type: 'string',
//               example: '-05:00'
//             },
//             is_dst: {
//               type: 'boolean',
//               example: true
//             }
//           }
//         },
//         ApiKey: {
//           type: 'object',
//           properties: {
//             api_key: {
//               type: 'string',
//               example: 'ut_abc123xyz'
//             }
//           }
//         }
//       }
//     }
//   },
//   apis: ['./src/controllers/*.ts'] // Path to the API docs
// };

// const swaggerSpec = swaggerJsdoc(options);

// export default swaggerSpec;















// src/utils/swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Universal Time API',
      version,
      description: 'API for getting current time in different timezones and converting between timezones',
      contact: {
        name: 'API Support',
        email: 'support@universaltime.dev'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.universaltime.dev',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'query',
          name: 'api_key',
          description: 'API key for authenticated requests'
        }
      },
      schemas: {
        TimeResponse: {
          type: 'object',
          properties: {
            time: {
              type: 'string',
              example: '10:30 AM',
              description: 'Current time in the requested timezone'
            },
            timezone: {
              type: 'string',
              example: 'America/New_York',
              description: 'IANA timezone identifier'
            },
            display_name: {
              type: 'string',
              example: 'New York, USA (EST)',
              description: 'Human-readable timezone name'
            },
            utc_offset: {
              type: 'string',
              example: '-05:00',
              description: 'UTC offset'
            },
            is_dst: {
              type: 'boolean',
              example: true,
              description: 'Whether daylight saving time is active'
            },
            timestamp: {
              type: 'integer',
              example: 1710518400,
              description: 'Unix timestamp'
            }
          }
        },
        Timezone: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'America/New_York'
            },
            display_name: {
              type: 'string',
              example: 'New York, USA (EST)'
            },
            utc_offset: {
              type: 'string',
              example: '-05:00'
            },
            is_dst: {
              type: 'boolean',
              example: true
            }
          }
        },
        ApiKey: {
          type: 'object',
          properties: {
            api_key: {
              type: 'string',
              example: 'ut_abc123xyz'
            }
          }
        }
      }
    },
    // Add global security requirement
    security: [{
      ApiKeyAuth: []
    }]
  },
  apis: ['./src/controllers/*.ts'] // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;