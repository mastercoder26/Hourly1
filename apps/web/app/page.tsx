import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>Hourly (demo web)</h1>
      <p>Static Next.js surfaces that share the same seed as the Expo app via @hourly/shared.</p>
      <nav className="nav">
        <Link href="/counselor">Counselor dashboard</Link>
        <Link href="/p/alex-r">Public portfolio (Alex)</Link>
        <Link href="/org/green-earth-foundation">Public org (Green Earth)</Link>
      </nav>
    </main>
  );
}
