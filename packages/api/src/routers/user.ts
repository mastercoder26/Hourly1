import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { mockUsers, UserProfile } from '../mock-data';

const users: UserProfile[] = [...mockUsers];

export const userRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    let user = users.find(u => u.id === ctx.userId);

    if (!user) {
      user = {
        id: ctx.userId,
        firstName: 'Hourly',
        lastName: 'User',
        email: 'user@hourly.local',
        school: 'Unknown School',
        grade: 0,
        interests: [],
        totalHours: 0,
      };
      users.push(user);
    }

    return user;
  }),

  // Legacy route kept temporarily while screens migrate.
  getProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      const user = users.find(u => u.id === input.userId);
      if (!user) {
        throw new Error(`User not found: ${input.userId}`);
      }
      return user;
    }),

  updateProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        school: z.string().optional(),
        grade: z.number().optional(),
        interests: z.array(z.string()).optional(),
      })
    )
    .mutation(({ input }) => {
      const { userId, ...updates } = input;
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) {
        throw new Error(`User not found: ${userId}`);
      }
      users[index] = { ...users[index], ...updates };
      return users[index];
    }),
});
