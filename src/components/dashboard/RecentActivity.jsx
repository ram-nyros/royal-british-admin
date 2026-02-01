const activities = [
  {
    id: 1,
    title: "Certificate issued",
    detail: "Advanced Leadership – James Scott",
    time: "2h ago",
  },
  {
    id: 2,
    title: "New member joined",
    detail: "Charlotte Perkins",
    time: "4h ago",
  },
  {
    id: 3,
    title: "Feedback received",
    detail: "Quarterly report",
    time: "Yesterday",
  },
];

export default function RecentActivity() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Activity
          </h2>
          <p className="text-sm text-slate-500">
            Track the latest interactions across the community.
          </p>
        </div>
        <button className="text-sm font-semibold text-rose-600 hover:text-rose-500">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <article
            key={activity.id}
            className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
          >
            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">
              {activity.title.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{activity.title}</p>
              <p className="text-sm text-slate-500">{activity.detail}</p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {activity.time}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
