import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiBell, FiSearch, FiLogOut, FiMenu } from "react-icons/fi";
import { logout, selectCurrentUser } from "../store/authSlice";

export default function Topbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 h-20 bg-white/95 backdrop-blur shadow-sm flex items-center justify-between px-4 lg:px-10 border-b border-slate-100">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      <div className="hidden sm:flex items-center gap-3 text-slate-600">
        <FiSearch className="text-xl" />
        <input
          className="bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400 w-64"
          placeholder="Search modules, users..."
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
          <FiBell className="text-xl" />
        </button>

        {user && (
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold text-white">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-rose-500 transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
