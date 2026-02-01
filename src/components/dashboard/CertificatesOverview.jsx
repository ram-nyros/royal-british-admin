const certificates = [
  { title: "Leadership Excellence", progress: 72, color: "bg-emerald-500" },
  { title: "Community Outreach", progress: 54, color: "bg-sky-500" },
  { title: "Education Impact", progress: 88, color: "bg-rose-500" },
];

export default function CertificatesOverview() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Certificate Overview
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Monitor course completion across the Royal British program.
      </p>

      <div className="space-y-5">
        {certificates.map(({ title, progress, color }) => (
          <div key={title}>
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-1">
              <span>{title}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${color}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="mt-8 w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300">
        Manage Certificates
      </button>
    </section>
  );
}
