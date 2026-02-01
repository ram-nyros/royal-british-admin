import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiGrid, FiUsers, FiFileText, FiLogOut } from "react-icons/fi";
import { logout, selectCurrentUser } from "../store/authSlice";

const navItems = [
  { to: "/", label: "Dashboard", icon: FiGrid },
  { to: "/users", label: "Users", icon: FiUsers },
  { to: "/applications", label: "Applications", icon: FiFileText },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex w-72 bg-slate-900 text-slate-100 flex-col shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <p className="text-sm uppercase tracking-wide text-slate-400">
          Royal British
        </p>
        <h1 className="text-2xl font-semibold text-white">Admin Portal</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800">
        {user && (
          <div className="flex items-center gap-3 mb-4 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-colors"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
}
