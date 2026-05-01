import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrganizationBySlug } from '@hourly/shared';
import { getHourlyApi } from '../../../lib/hourly-api';

type Props = { params: Promise<{ slug: string }> };

export default async function PublicOrgPage({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  try {
    const org = await getHourlyApi().public.orgBySlug.query({ slug: decoded });

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
            {org.totalVolunteers} volunteers · {org.totalHours.toLocaleString()} verified hours · {org.activeListings}{' '}
            active listings
          </p>
          <p>Causes: {org.causeTags.join(', ')}</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Data from Hourly API (`public.orgBySlug`).</p>
        </div>
      </main>
    );
  } catch {
    const org = getOrganizationBySlug(decoded);
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
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Demo seed — API unavailable or slug not found in database.</p>
        </div>
      </main>
    );
  }
}
