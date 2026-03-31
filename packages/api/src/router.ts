import { router } from './trpc';
import { opportunityRouter } from './routers/opportunity';
import { applicationRouter } from './routers/application';
import { userRouter } from './routers/user';
import { adminRouter } from './routers/admin';
import { orgRouter } from './routers/org';

export const appRouter = router({
  opportunity: opportunityRouter,
  application: applicationRouter,
  user: userRouter,
  admin: adminRouter,
  org: orgRouter,
});

export type AppRouter = typeof appRouter;
