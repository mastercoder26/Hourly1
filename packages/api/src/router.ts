import { router } from './trpc';
import { opportunityRouter } from './routers/opportunity';
import { applicationRouter } from './routers/application';
import { userRouter } from './routers/user';
import { adminRouter } from './routers/admin';
import { orgRouter } from './routers/org';
import { attendanceRouter } from './routers/attendance';
import { publicRouter } from './routers/public';

export const appRouter = router({
  public: publicRouter,
  opportunity: opportunityRouter,
  application: applicationRouter,
  user: userRouter,
  admin: adminRouter,
  org: orgRouter,
  attendance: attendanceRouter,
});

export type AppRouter = typeof appRouter;
