import Link from 'next/link';
import { notFound } from 'next/navigation';
import { counselorPublicLabel, getPublicPortfolioBySlug } from '@hourly/shared';

type Props = { params: Promise<{ slug: string }> };

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params;
  const student = getPublicPortfolioBySlug(decodeURIComponent(slug));
  if (!student) notFound();

  const label = counselorPublicLabel(student);

  return (
    <main>
      <nav className="nav">
        <Link href="/">Home</Link>
      </nav>
      <h1>{label}</h1>
      <p>Public portfolio (redacted name). Verified service hours summary.</p>
      <div className="card">
        <p>
          <strong>{student.totalVerifiedHours}</strong> verified hours across{' '}
          <strong>{student.orgsServed}</strong> organizations.
        </p>
        <p>Focus areas: {student.primaryCauses.join(', ')}.</p>
        <p style={{ fontSize: '0.8rem' }}>This is static demo content — no account is required.</p>
      </div>
    </main>
  );
}
