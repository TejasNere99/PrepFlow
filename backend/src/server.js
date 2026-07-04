import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`PrepFlow API running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start PrepFlow API', error);
  process.exit(1);
});
