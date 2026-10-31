import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/admin/ngo-requests": "NGO requests",
  "/admin/users": "Donors & NGOs",
  "/admin/donations": "Donations",
  "/admin/reports": "Reports",
};

export default function AdminPlaceholder() {
  const { pathname } = useLocation();
  return <section><p className="text-xs font-bold uppercase tracking-[.2em] text-[#17633b]">Admin workspace</p><h1 className="mt-2 font-serif text-4xl font-bold">{titles[pathname] || "Admin page"}</h1><div className="mt-8 rounded-2xl border border-dashed border-[#a9c8a9] bg-white p-8"><p className="text-[#536258]">This section is ready for its data table and backend workflow.</p></div></section>;
}
