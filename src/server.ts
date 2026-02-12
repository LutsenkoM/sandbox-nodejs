import 'dotenv/config';
import app from './app';
import { env } from './config/env';
import prisma from './prisma';

const port = parseInt(env.PORT);

async function start() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected');

    app.listen(port, () => {
      console.log(`✓ Server running on port ${port}`);
      console.log(`✓ Environment: ${env.NODE_ENV}`);
      console.log(`✓ Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

start();
