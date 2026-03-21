import Link from "next/link";

const MOCK_STUDENTS = [
  { id: "s_jenkins", name: "Sarah Jenkins", school: "Lincoln High", grade: "10th", hours: 42.5, causes: ["Environment", "Food"], lastActive: "Oct 30" },
  { id: "m_chen", name: "Michael Chen", school: "Roosevelt Academy", grade: "11th", hours: 15, causes: ["Education"], lastActive: "Oct 25" },
  { id: "e_rodriguez", name: "Elena Rodriguez", school: "Lincoln High", grade: "12th", hours: 120, causes: ["Health", "Seniors"], lastActive: "Oct 28" },
  { id: "j_kim", name: "James Kim", school: "Washington Prep", grade: "10th", hours: 8, causes: ["Animals"], lastActive: "Oct 20" },
  { id: "p_patel", name: "Priya Patel", school: "Roosevelt Academy", grade: "11th", hours: 65, causes: ["Food", "Youth"], lastActive: "Oct 29" },
  { id: "a_thompson", name: "Alex Thompson", school: "Lincoln High", grade: "9th", hours: 22, causes: ["Arts", "Education"], lastActive: "Oct 15" },
];

export default function CounselorDashboard() {
  const totalStudents = MOCK_STUDENTS.length;
  const totalHours = MOCK_STUDENTS.reduce((sum, s) => sum + s.hours, 0);
  const avgHours = (totalHours / totalStudents).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="bg-white border-b border-[#E4E4E4] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-[#1D9E75] text-2xl font-bold tracking-tight">hourly</span>
          <div className="flex items-center gap-6">
            <span className="text-[#888888] text-sm">Counselor View</span>
            <Link
              href="/student/s_jenkins"
              className="text-sm text-[#1D9E75] font-medium hover:underline"
            >
              View Sample Portfolio →
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#1A1A1A] tracking-tight">Student Hours Dashboard</h1>
          <p className="text-[#888888] mt-2">Lincoln Unified School District · Read-only view</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6">
            <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">Students</p>
            <p className="text-4xl font-medium text-[#1A1A1A] tracking-tight">{totalStudents}</p>
          </div>
          <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6">
            <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">Total Hours</p>
            <p className="text-4xl font-medium text-[#1D9E75] tracking-tight">{totalHours}</p>
          </div>
          <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6">
            <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">Avg Hours</p>
            <p className="text-4xl font-medium text-[#1A1A1A] tracking-tight">{avgHours}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[28px] border border-[#E4E4E4] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E4E4E4] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Students</h2>
            <button className="text-xs text-[#888888] border border-[#E4E4E4] px-4 py-2 rounded-full hover:bg-[#F7F7F5] transition-colors">
              Export CSV
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#E4E4E4]">
                <th className="px-6 py-3 text-xs font-medium text-[#888888] uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-[#888888] uppercase tracking-wider">School</th>
                <th className="px-6 py-3 text-xs font-medium text-[#888888] uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-xs font-medium text-[#888888] uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-xs font-medium text-[#888888] uppercase tracking-wider">Causes</th>
                <th className="px-6 py-3 text-xs font-medium text-[#888888] uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-xs font-medium text-[#888888] uppercase tracking-wider">Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STUDENTS.map((student, i) => (
                <tr key={student.id} className={`${i !== MOCK_STUDENTS.length - 1 ? "border-b border-[#E4E4E4]" : ""} hover:bg-[#F7F7F5] transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1D9E7520] flex items-center justify-center text-sm font-bold text-[#1D9E75]">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-[#1A1A1A]">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#888888]">{student.school}</td>
                  <td className="px-6 py-4 text-sm text-[#888888]">{student.grade}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-[#1D9E75]">{student.hours}h</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {student.causes.map((c) => (
                        <span key={c} className="text-[10px] font-medium bg-[#1D9E7515] text-[#1D9E75] px-2 py-0.5 rounded-full">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#888888]">{student.lastActive}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/student/${student.id}`}
                      className="text-xs text-[#1D9E75] font-medium hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
