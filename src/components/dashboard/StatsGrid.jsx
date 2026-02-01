const stats = [
  {
    label: "Active Certificates",
    value: "132",
    trend: "+12.5%",
    positive: true,
  },
  { label: "Total Members", value: "2,487", trend: "+3.1%", positive: true },
  { label: "Pending Requests", value: "18", trend: "-8.2%", positive: false },
  { label: "New Messages", value: "42", trend: "+6.4%", positive: true },
];

export default function StatsGrid() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map(({ label, value, trend, positive }) => (
        <article
          key={label}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
          <span
            className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${
              positive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {positive ? "↑" : "↓"} {trend}
          </span>
        </article>
      ))}
    </section>
  );
}
