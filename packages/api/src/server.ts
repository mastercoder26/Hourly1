import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router';
import { createContext } from './trpc';
import { clerkMiddleware } from '@clerk/express';

export const app = express();

const clerkSecretKey = process.env.CLERK_SECRET_KEY ?? '';
const shouldUseClerkMiddleware =
  clerkSecretKey.length > 0 && !clerkSecretKey.includes('PLACEHOLDER');

app.use(cors());
app.use(express.json());

if (shouldUseClerkMiddleware) {
  app.use(clerkMiddleware());
}

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export function startServer(port = 3001) {
  return app.listen(port, () => {
    console.log(`Hourly API server running on http://localhost:${port}`);
  });
}
