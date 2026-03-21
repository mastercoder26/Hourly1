import Link from "next/link";

const MOCK_STUDENTS: Record<string, {
  name: string;
  school: string;
  grade: string;
  totalHours: number;
  causes: { name: string; hours: number }[];
  shifts: { org: string; role: string; date: string; hours: number; cause: string }[];
  badges: { emoji: string; label: string; earned: boolean }[];
}> = {
  s_jenkins: {
    name: "Sarah Jenkins",
    school: "Lincoln High School",
    grade: "10th Grade",
    totalHours: 42.5,
    causes: [
      { name: "Environment", hours: 24 },
      { name: "Food", hours: 12 },
      { name: "Education", hours: 6.5 },
    ],
    shifts: [
      { org: "City Roots Farm", role: "Seedling Planter", date: "Oct 30, 2024", hours: 4, cause: "Environment" },
      { org: "City Food Bank", role: "Pantry Organizer", date: "Oct 14, 2024", hours: 4, cause: "Food" },
      { org: "Downtown Library", role: "Reading Tutor", date: "Oct 12, 2024", hours: 2.5, cause: "Education" },
      { org: "Green Earth Initiative", role: "Beach Cleanup", date: "Oct 8, 2024", hours: 3, cause: "Environment" },
    ],
    badges: [
      { emoji: "🌱", label: "First Shift", earned: true },
      { emoji: "⏱", label: "10 Hours", earned: true },
      { emoji: "🌿", label: "25 Hours", earned: true },
      { emoji: "🏆", label: "50 Hours", earned: false },
      { emoji: "🌍", label: "Eco Warrior", earned: true },
      { emoji: "📚", label: "Educator", earned: false },
    ],
  },
};

export default async function StudentPortfolio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = MOCK_STUDENTS[id];

  if (!student) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <div className="text-center">
          <p className="text-[#888888] mb-4">Student portfolio not found.</p>
          <Link href="/" className="text-[#1D9E75] font-medium hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="bg-white border-b border-[#E4E4E4]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-[#1D9E75] text-2xl font-bold tracking-tight">hourly</span>
          <Link href="/" className="text-xs text-[#888888] hover:text-[#1A1A1A] transition-colors">
            ← Counselor Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-8 mb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#1D9E7520] flex items-center justify-center text-3xl font-bold text-[#1D9E75] mx-auto mb-4">
            {student.name.charAt(0)}
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-1">{student.name}</h1>
          <p className="text-[#888888] text-sm">{student.school} · {student.grade}</p>

          <div className="mt-6 pt-6 border-t border-[#E4E4E4]">
            <p className="text-[48px] font-medium text-[#1D9E75] tracking-tight leading-none">{student.totalHours}</p>
            <p className="text-[#888888] text-sm mt-1 uppercase tracking-wider">Verified Hours</p>
          </div>
        </div>

        {/* Hours by Cause */}
        <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6 mb-6">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-5">Hours by Cause</h2>
          <div className="space-y-4">
            {student.causes.map((cause) => {
              const pct = Math.round((cause.hours / student.totalHours) * 100);
              return (
                <div key={cause.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[#1A1A1A]">{cause.name}</span>
                    <span className="text-sm text-[#1D9E75] font-semibold">{cause.hours}h</span>
                  </div>
                  <div className="h-2 bg-[#E4E4E4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1D9E75] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6 mb-6">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-5">Badges</h2>
          <div className="grid grid-cols-3 gap-3">
            {student.badges.map((badge) => (
              <div
                key={badge.label}
                className={`flex flex-col items-center p-4 rounded-2xl border ${
                  badge.earned
                    ? "border-[#1D9E7530] bg-[#1D9E7508]"
                    : "border-[#E4E4E4] opacity-40"
                }`}
              >
                <span className="text-2xl mb-2">{badge.emoji}</span>
                <span className="text-xs font-medium text-[#1A1A1A] text-center">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Shifts */}
        <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6 mb-10">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-5">Verified Shifts</h2>
          <div className="space-y-4">
            {student.shifts.map((shift, i) => (
              <div key={i} className={`flex items-center justify-between ${i > 0 ? "pt-4 border-t border-[#E4E4E4]" : ""}`}>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{shift.role}</p>
                  <p className="text-xs text-[#888888] mt-0.5">{shift.org} · {shift.date}</p>
                  <span className="inline-block mt-1 text-[10px] font-medium bg-[#1D9E7515] text-[#1D9E75] px-2 py-0.5 rounded-full">
                    {shift.cause}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#1D9E75]">+{shift.hours}h</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#888888] pb-8">
          Verified by Hourly · Read-only view
        </p>
      </main>
    </div>
  );
}
