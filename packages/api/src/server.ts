import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router';
import { createContext } from './trpc';
import { clerkMiddleware } from '@clerk/express';

export const app = express();

const clerkSecretKey = process.env.CLERK_SECRET_KEY ?? '';
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY ?? '';
const shouldUseClerkMiddleware =
  clerkSecretKey.length > 0 &&
  !clerkSecretKey.includes('PLACEHOLDER') &&
  clerkPublishableKey.length > 0;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const trpcStack: express.RequestHandler[] = [];
if (shouldUseClerkMiddleware) {
  trpcStack.push(clerkMiddleware());
}
trpcStack.push(
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use('/trpc', ...trpcStack);

export function startServer(port = Number(process.env.PORT) || 3001) {
  return app.listen(port, '0.0.0.0', () => {
    console.log(`Hourly API server running on port ${port}`);
  });
}
