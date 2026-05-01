import Link from 'next/link';
import { notFound } from 'next/navigation';
import { counselorPublicLabel, getPublicPortfolioBySlug } from '@hourly/shared';
import { getHourlyApi } from '../../../lib/hourly-api';

type Props = { params: Promise<{ slug: string }> };

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  try {
    const live = await getHourlyApi().public.portfolioBySlug.query({ slug: decoded });
    const label = live.displayLabel;

    return (
      <main>
        <nav className="nav">
          <Link href="/">Home</Link>
        </nav>
        <h1>{label}</h1>
        <p>Public portfolio — verified service hours summary (live API).</p>
        <div className="card">
          <p>
            <strong>{live.totalVerifiedHours}</strong> verified hours across <strong>{live.orgsServed}</strong>{' '}
            organizations.
          </p>
          <p>Focus areas: {live.primaryCauses.join(', ') || '—'}.</p>
        </div>
      </main>
    );
  } catch {
    const student = getPublicPortfolioBySlug(decoded);
    if (!student) notFound();

    const label = counselorPublicLabel(student);

    return (
      <main>
        <nav className="nav">
          <Link href="/">Home</Link>
        </nav>
        <h1>{label}</h1>
        <p>Public portfolio (demo seed). Set `NEXT_PUBLIC_API_URL` and a public portfolio slug to use live data.</p>
        <div className="card">
          <p>
            <strong>{student.totalVerifiedHours}</strong> verified hours across <strong>{student.orgsServed}</strong>{' '}
            organizations.
          </p>
          <p>Focus areas: {student.primaryCauses.join(', ')}.</p>
        </div>
      </main>
    );
  }
}
