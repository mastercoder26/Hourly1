import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrganizationBySlug } from '@hourly/shared';

type Props = { params: Promise<{ slug: string }> };

export default async function PublicOrgPage({ params }: Props) {
  const { slug } = await params;
  const org = getOrganizationBySlug(decodeURIComponent(slug));
  if (!org) notFound();

  return (
    <main>
      <nav className="nav">
        <Link href="/">Home</Link>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '2.5rem' }} aria-hidden>
          {org.logoUrl}
        </span>
        <div>
          <h1 style={{ margin: 0 }}>{org.name}</h1>
          {org.verified ? <p style={{ margin: '0.25rem 0 0', color: '#86efac' }}>Verified nonprofit</p> : null}
        </div>
      </div>
      <div className="card">
        <p>{org.mission}</p>
        <p>
          ★ {org.rating} ({org.ratingCount} reviews) · {org.totalVolunteers} volunteers ·{' '}
          {org.totalHours.toLocaleString()} hours served
        </p>
        <p>Causes: {org.causeTags.join(', ')}</p>
      </div>
    </main>
  );
}
