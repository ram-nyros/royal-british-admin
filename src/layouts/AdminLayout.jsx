import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-100 flex flex-col shadow-xl z-50 lg:hidden">
            <div className="p-6 border-b border-slate-800">
              <p className="text-sm uppercase tracking-wide text-slate-400">
                Royal British
              </p>
              <h1 className="text-2xl font-semibold text-white">
                Admin Portal
              </h1>
            </div>
            <Sidebar isMobile onClose={() => setMobileMenuOpen(false)} />
          </aside>
        </>
      )}

      <div className="flex flex-col flex-1">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
