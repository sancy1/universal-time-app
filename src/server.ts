
// src/server.ts

// import { createApp } from './app';
// import config from './config';

// const app = createApp();

// app.listen(config.port, () => {
//   console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
// });





// src/server.ts

import { createApp } from './app';
import config from './config';

const app = createApp();

// Explicitly bind to '0.0.0.0' for Docker compatibility
app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});

