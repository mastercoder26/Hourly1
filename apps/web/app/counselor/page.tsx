'use client';

import Link from 'next/link';
import { demoCounselorStudents } from '@hourly/shared';

function downloadCsv() {
  const header = [
    'id',
    'slug',
    'firstName',
    'lastName',
    'grade',
    'totalVerifiedHours',
    'hoursThisSemester',
    'lastActivity',
    'orgsServed',
    'primaryCauses',
  ];
  const rows = demoCounselorStudents.map(s => [
    s.id,
    s.slug,
    s.firstName,
    s.lastName,
    String(s.grade),
    String(s.totalVerifiedHours),
    String(s.hoursThisSemester),
    s.lastActivity,
    String(s.orgsServed),
    s.primaryCauses.join(';'),
  ]);
  const body = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hourly-demo-counselor-students.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function CounselorListPage() {
  return (
    <main>
      <nav className="nav">
        <Link href="/">Home</Link>
      </nav>
      <h1>Counselor dashboard</h1>
      <p>Demo roster synced with the mobile app seed. Open a student for semester detail.</p>
      <p>
        <button type="button" className="btn" onClick={downloadCsv}>
          Export CSV
        </button>
      </p>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Grade</th>
              <th>Verified hrs</th>
              <th>This semester</th>
              <th>Last activity</th>
            </tr>
          </thead>
          <tbody>
            {demoCounselorStudents.map(s => (
              <tr key={s.id}>
                <td>
                  <Link href={`/counselor/${encodeURIComponent(s.slug)}`}>
                    {s.firstName} {s.lastName}
                  </Link>
                </td>
                <td>{s.grade}</td>
                <td>{s.totalVerifiedHours}</td>
                <td>{s.hoursThisSemester}</td>
                <td>{s.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
