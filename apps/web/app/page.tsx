import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>Hourly web</h1>
      <p>
        Next.js surfaces: when <code>NEXT_PUBLIC_API_URL</code> points at the Hourly API, org and portfolio pages load
        live Prisma-backed data; otherwise they fall back to <code>@hourly/shared</code> demo seed.
      </p>
      <nav className="nav">
        <Link href="/counselor">Counselor dashboard</Link>
        <Link href="/p/alex-r">Public portfolio (Alex)</Link>
        <Link href="/org/green-earth-foundation">Public org (Green Earth)</Link>
      </nav>
    </main>
  );
}
