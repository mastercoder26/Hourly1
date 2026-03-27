import { router } from './trpc';
import { opportunityRouter } from './routers/opportunity';
import { applicationRouter } from './routers/application';
import { userRouter } from './routers/user';

export const appRouter = router({
  opportunity: opportunityRouter,
  application: applicationRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
