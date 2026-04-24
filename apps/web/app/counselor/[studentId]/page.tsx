import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCounselorStudentBySlug } from '@hourly/shared';

type Props = { params: Promise<{ studentId: string }> };

export default async function CounselorStudentPage({ params }: Props) {
  const { studentId } = await params;
  const student = getCounselorStudentBySlug(decodeURIComponent(studentId));
  if (!student) notFound();

  const bars = [12, 18, 22, 16, 28, 24, 20].map((h, i) => (
    <div key={i} className="bar" style={{ height: `${h * 3}px` }} title={`Week ${i + 1}`} />
  ));

  return (
    <main>
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/counselor">All students</Link>
        <Link href={`/p/${student.slug}`}>Public view</Link>
      </nav>
      <h1>
        {student.firstName} {student.lastName}
      </h1>
      <p>
        Grade {student.grade} · {student.totalVerifiedHours} verified hours · {student.orgsServed} organizations
        served
      </p>
      <div className="card">
        <h2>Primary causes</h2>
        <p>{student.primaryCauses.join(', ')}</p>
        <h2>Hours this semester</h2>
        <p>
          <strong>{student.hoursThisSemester}</strong> hours · last activity {student.lastActivity}
        </p>
        <h2>Weekly rhythm (demo)</h2>
        <div className="bar-chart">{bars}</div>
      </div>
    </main>
  );
}
