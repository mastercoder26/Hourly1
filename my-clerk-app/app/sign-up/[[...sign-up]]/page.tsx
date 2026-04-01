import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-81px)] w-full max-w-md items-center justify-center px-6 py-12">
      <SignUp forceRedirectUrl="/" signInUrl="/sign-in" />
    </main>
  );
}
