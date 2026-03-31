import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-4 px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Clerk + Next.js App Router is ready
      </h1>
      <p className="text-base text-zinc-600">
        Use the top-right navigation to create your first user.
      </p>
      <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
        {userId
          ? `Signed in as user: ${userId}`
          : 'Signed out. Click Sign Up in the header to test authentication.'}
      </p>
    </main>
  );
}
