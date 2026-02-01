import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { useGetDashboardStatsQuery } from "../store/adminApiSlice";
import { selectCurrentUser } from "../store/authSlice";

function StatCard({ icon: Icon, label, value, color, isLoading }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          )}
        </div>
      </div>
    </article>
  );
}

function RecentApplications({ applications = [], isLoading }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      reviewed: "bg-blue-100 text-blue-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          Recent Applications
        </h3>
        <Link
          to="/applications"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View All <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : applications.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            <FiFileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No applications yet</p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                {app.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {app.name}
                </p>
                <p className="text-sm text-slate-500 truncate">{app.course}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}
              >
                {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function RecentUsers({ users = [], isLoading }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Recent Users</h3>
        <Link
          to="/users"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View All <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            <FiUsers className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No users yet</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
              {user.profileImage?.dataUrl ? (
                <img
                  src={user.profileImage.dataUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-slate-500 truncate">{user.email}</p>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-rose-500">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            {user?.name || "Admin"}
          </h1>
          <p className="text-slate-500">
            Here's what's happening with your platform today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          icon={FiFileText}
          label="Total Applications"
          value={stats?.totalApplications || 0}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          icon={FiClock}
          label="Pending Applications"
          value={stats?.pendingApplications || 0}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard
          icon={FiCheckCircle}
          label="Approved Applications"
          value={stats?.approvedApplications || 0}
          color="purple"
          isLoading={isLoading}
        />
      </section>

      {/* Recent Data */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentApplications
          applications={stats?.recentApplications}
          isLoading={isLoading}
        />
        <RecentUsers users={stats?.recentUsers} isLoading={isLoading} />
      </div>
    </div>
  );
}
