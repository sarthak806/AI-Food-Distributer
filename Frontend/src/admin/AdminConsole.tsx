import { useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ADMIN_SESSION_KEY } from "./adminCredentials";

const navigation = [
  { label: "Overview", path: "/admin" },
  { label: "NGO requests", path: "/admin/ngo-requests" },
  { label: "Donors & NGOs", path: "/admin/users" },
  { label: "Donations", path: "/admin/donations" },
  { label: "Reports", path: "/admin/reports" },
];

export default function AdminConsole() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== "authenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  const signOut = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f7faf5] text-[#14231d]">
      <header className="border-b border-[#dce5dd] bg-white">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link to="/admin" className="font-serif text-2xl font-bold">Share<span className="text-[#17633b]">Bite</span> <span className="font-sans text-xs uppercase tracking-widest text-[#536258]">Admin</span></Link>
          <button type="button" onClick={signOut} className="min-h-11 rounded-full border border-[#17633b] px-4 text-sm font-bold text-[#17633b]">Sign out</button>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 md:flex-row md:px-8">
        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="min-h-11 rounded-xl border border-[#c9d9c9] bg-white px-4 text-left font-bold md:hidden">Menu</button>
        <aside className={`${menuOpen ? "block" : "hidden"} w-full shrink-0 md:block md:w-56`}>
          <nav aria-label="Admin navigation" className="space-y-2 rounded-2xl bg-white p-3 shadow-sm">
            {navigation.map((item) => <Link key={item.path} onClick={() => setMenuOpen(false)} className={`block rounded-xl px-4 py-3 text-sm font-bold ${location.pathname === item.path ? "bg-[#17633b] text-white" : "text-[#536258] hover:bg-[#eef6eb] hover:text-[#17633b]"}`} to={item.path}>{item.label}</Link>)}
          </nav>
        </aside>
        <main className="min-w-0 flex-1"><Outlet /></main>
      </div>
    </div>
  );
}
