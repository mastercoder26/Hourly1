import Link from "next/link";

const MOCK_ORGS: Record<string, {
  name: string;
  tagline: string;
  cause: string;
  totalHours: number;
  volunteers: number;
  events: number;
  rating: number;
  reviews: { student: string; grade: string; text: string; rating: number }[];
  recentRoles: { title: string; date: string; hours: number; volunteers: number }[];
}> = {
  city_roots: {
    name: "City Roots Farm",
    tagline: "Growing community through urban agriculture",
    cause: "Environment",
    totalHours: 145,
    volunteers: 12,
    events: 8,
    rating: 4.8,
    reviews: [
      { student: "Sarah J.", grade: "10th", text: "Amazing experience learning about sustainable farming!", rating: 5 },
      { student: "Michael C.", grade: "11th", text: "Very organized, coordinators were super helpful.", rating: 4 },
    ],
    recentRoles: [
      { title: "Seedling Planter", date: "Oct 30", hours: 4, volunteers: 8 },
      { title: "Harvest Helper", date: "Nov 5", hours: 6, volunteers: 5 },
    ],
  },
};

export default async function OrgImpactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const org = MOCK_ORGS[id];

  if (!org) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <div className="text-center">
          <p className="text-[#888888] mb-4">Organization not found.</p>
          <Link href="/" className="text-[#534AB7] font-medium hover:underline">← Back</Link>
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
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Org Header */}
        <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-8 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#534AB720] flex items-center justify-center text-2xl font-bold text-[#534AB7] flex-shrink-0">
              {org.name.charAt(0)}
            </div>
            <div>
              <span className="inline-block text-[10px] font-bold text-[#534AB7] bg-[#534AB715] px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                {org.cause}
              </span>
              <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-1">{org.name}</h1>
              <p className="text-[#888888] text-sm">{org.tagline}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[#534AB7] text-sm font-semibold">{org.rating}</span>
                <span className="text-yellow-400">★</span>
                <span className="text-[#888888] text-xs">({org.reviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6 text-center">
            <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">Hours Given</p>
            <p className="text-4xl font-medium text-[#534AB7] tracking-tight">{org.totalHours}</p>
          </div>
          <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6 text-center">
            <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">Volunteers</p>
            <p className="text-4xl font-medium text-[#534AB7] tracking-tight">{org.volunteers}</p>
          </div>
          <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6 text-center">
            <p className="text-[#888888] text-xs uppercase tracking-wider mb-2">Events</p>
            <p className="text-4xl font-medium text-[#534AB7] tracking-tight">{org.events}</p>
          </div>
        </div>

        {/* Recent Roles */}
        <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6 mb-6">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-5">Recent Opportunities</h2>
          <div className="space-y-4">
            {org.recentRoles.map((role, i) => (
              <div key={i} className={`flex items-center justify-between ${i > 0 ? "pt-4 border-t border-[#E4E4E4]" : ""}`}>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{role.title}</p>
                  <p className="text-xs text-[#888888] mt-0.5">{role.date} · {role.hours}h · {role.volunteers} volunteers</p>
                </div>
                <span className="text-xs font-medium bg-[#534AB715] text-[#534AB7] px-3 py-1 rounded-full">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-[28px] border border-[#E4E4E4] p-6 mb-10">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-5">Volunteer Reviews</h2>
          <div className="space-y-5">
            {org.reviews.map((review, i) => (
              <div key={i} className={i > 0 ? "pt-5 border-t border-[#E4E4E4]" : ""}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#534AB720] flex items-center justify-center text-xs font-bold text-[#534AB7]">
                    {review.student.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{review.student}</p>
                    <p className="text-xs text-[#888888]">{review.grade} Grade</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <span key={j} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#888888] leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#888888] pb-8">
          Impact data verified by Hourly
        </p>
      </main>
    </div>
  );
}
