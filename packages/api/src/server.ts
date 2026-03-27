import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router';

export const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
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
