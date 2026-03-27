import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { mockUsers, UserProfile } from '../mock-data';

const users: UserProfile[] = [...mockUsers];

export const userRouter = router({
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
