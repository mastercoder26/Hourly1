import { getAuth } from '@clerk/express';
import { TRPCError, initTRPC } from '@trpc/server';
import type { Request } from 'express';
import { adminSessions } from './mock-data';

type ClerkAuthResult = ReturnType<typeof getAuth>;

function getRequestAuth(req: Request): ClerkAuthResult | null {
	try {
		return getAuth(req);
	} catch {
		return null;
	}
}

export const createContext = async ({ req }: { req: Request }) => {
	const auth = getRequestAuth(req);

	const allowDemoAuth = process.env.ALLOW_DEMO_AUTH === 'true';
	const demoUserId = req.header('x-demo-user-id');
	const userId = auth?.userId ?? (allowDemoAuth && demoUserId ? demoUserId : null);
	const adminToken = req.header('x-admin-token');

	const now = Date.now();
	for (let i = adminSessions.length - 1; i >= 0; i -= 1) {
		if (new Date(adminSessions[i].expiresAt).getTime() <= now) {
			adminSessions.splice(i, 1);
		}
	}

	const adminSession = adminToken
		? adminSessions.find(session => session.token === adminToken)
		: null;
	const adminEmail = adminSession?.email ?? null;

	return {
		auth,
		userId,
		adminEmail,
		adminToken: adminSession?.token ?? null,
	};
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.userId) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' });
	}

	return next({
		ctx: {
			...ctx,
			userId: ctx.userId,
		},
	});
});

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.adminEmail || !ctx.adminToken) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Admin authentication required' });
	}

	return next({
		ctx: {
			...ctx,
			adminEmail: ctx.adminEmail,
			adminToken: ctx.adminToken,
		},
	});
});
