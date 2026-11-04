import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  HeartHandshake,
  MapPin,
  PackageCheck,
  Plus,
  RefreshCw,
  ShieldCheck,
  Target,
  Users,
  Utensils,
  Warehouse,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type DashboardStats = {
  totalDonations: number;
  totalFoodSaved: number;
  pendingDonations: number;
  currentliveDonations: number;
};

const initialStats: DashboardStats = {
  totalDonations: 0,
  totalFoodSaved: 0,
  pendingDonations: 0,
  currentliveDonations: 0,
};

const statCards = [
  { key: "pendingDonations", label: "Available nearby", detail: "Ready to reserve", icon: PackageCheck, tone: "sage" },
  { key: "currentliveDonations", label: "Active pickups", detail: "Need your attention", icon: Clock3, tone: "amber" },
  { key: "totalDonations", label: "Completed pickups", detail: "All time impact", icon: CheckCircle2, tone: "blue" },
  { key: "totalFoodSaved", label: "Food redistributed", detail: "Estimated kilograms", icon: Utensils, tone: "rose" },
] as const;

const quickActions = [
  { label: "Find donations", description: "Browse food available near you", icon: PackageCheck, path: "/user/NGO/listings", className: "bg-[#eef5ff]" },
  { label: "Schedule pickup", description: "Review your upcoming collections", icon: CalendarDays, path: "/user/NGO/trackdonations", className: "bg-[#eef6eb]" },
  { label: "Post a requirement", description: "Tell donors what your community needs", icon: Target, path: "/user/NGO/requests", className: "bg-[#fff5e8]" },
  { label: "Record distribution", description: "Log food reaching beneficiaries", icon: HeartHandshake, path: "/user/NGO/distribution", className: "bg-[#fff1f0]" },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const firstName = user?.name?.split(" ")[0] || "there";
  const impactProgress = useMemo(
    () => Math.min(100, Math.round((stats.totalDonations / Math.max(stats.totalDonations + 5, 1)) * 100)),
    [stats.totalDonations],
  );

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_URL}/api/donations/ngo-dashboard`,
        { withCredentials: true },
      );
      setStats({ ...initialStats, ...response.data });
    } catch (requestError) {
      console.error("Unable to load NGO dashboard statistics:", requestError);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStats();
  }, []);

  return (
    <main className="donor-dashboard bg-[#f7faf6]">
      <div className="dashboard-hero dashboard-card">
        <div className="dashboard-hero-content">
          <div>
            <p className="section-eyebrow">NGO operations center</p>
            <h1 className="font-serif dashboard-hero-title">Good morning, {firstName}.</h1>
            <p className="dashboard-hero-description">
              Coordinate pickups, manage your food inventory, and keep every meal moving to the people who need it.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#536258]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#eef6eb] px-3 py-2">
                <ShieldCheck size={16} className="text-[#4d8857]" /> Verified organization
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} /> Serving your local community
              </span>
            </div>
          </div>
          <button type="button" className="dashboard-hero-action" onClick={() => navigate("/user/NGO/listings")}>
            Find food nearby <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#f1c7b9] bg-[#fff7f2] px-4 py-3 text-sm text-[#8d4a36]">
          <span>We could not load your latest statistics.</span>
          <button type="button" className="inline-flex items-center gap-2 font-semibold" onClick={() => void fetchStats()}>
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      )}

      <section className="donor-summary-grid" aria-label="NGO performance summary">
        {statCards.map(({ key, label, detail, icon: Icon, tone }) => (
          <div key={key} className={`summary-card summary-card-${tone}`}>
            <div className="summary-card-header">
              <p>{label}</p>
              <Icon aria-hidden="true" />
            </div>
            <strong>{loading ? "—" : key === "totalFoodSaved" ? `${Math.round(stats[key] * 0.55)} kg` : stats[key]}</strong>
            <small>{detail}</small>
          </div>
        ))}
      </section>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="dashboard-card p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="section-eyebrow">Your workbench</p>
              <h2 className="font-serif text-2xl font-bold text-[#20372a]">What would you like to do?</h2>
            </div>
            <Warehouse className="text-[#79a879]" size={28} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map(({ label, description, icon: Icon, path, className }) => (
              <button
                type="button"
                key={label}
                onClick={() => navigate(path)}
                className={`group rounded-2xl border border-transparent ${className} p-4 text-left transition hover:-translate-y-0.5 hover:border-[#c5ddc3]`}
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#4d8857] shadow-sm">
                  <Icon size={20} />
                </span>
                <span className="flex items-center justify-between font-semibold text-[#294332]">
                  {label} <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </span>
                <span className="mt-1 block text-sm leading-5 text-[#6b7b70]">{description}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard-card p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="section-eyebrow">Impact snapshot</p>
              <h2 className="font-serif text-2xl font-bold text-[#20372a]">Community reach</h2>
            </div>
            <Users className="text-[#79a879]" size={26} />
          </div>
          <div className="rounded-2xl bg-[#eef6eb] p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-[#536258]">Pickup consistency</p>
                <p className="mt-1 text-3xl font-bold text-[#315d3b]">{loading ? "—" : `${impactProgress}%`}</p>
              </div>
              <HeartHandshake className="text-[#5d9968]" size={34} />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-[#5d9968] transition-all" style={{ width: `${impactProgress}%` }} />
            </div>
            <p className="mt-3 text-sm leading-5 text-[#536258]">Complete your scheduled pickups to keep surplus food in circulation.</p>
          </div>
          <button type="button" onClick={() => navigate("/user/NGO/reports")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4d8857]">
            View impact reports <ArrowRight size={15} />
          </button>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="dashboard-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="section-eyebrow">Next on your calendar</p>
              <h2 className="font-serif text-2xl font-bold text-[#20372a]">Upcoming pickups</h2>
            </div>
            <button type="button" onClick={() => navigate("/user/NGO/trackdonations")} className="text-sm font-semibold text-[#4d8857]">View all</button>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-[#e2ebe0] p-4">
            <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-[#eef6eb] text-[#4d8857]">
              <span className="text-xs font-semibold">TODAY</span><CalendarDays size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#294332]">{stats.currentliveDonations ? "Reserved food collections" : "No pickups scheduled"}</p>
              <p className="mt-1 truncate text-sm text-[#718078]">{stats.currentliveDonations ? "Review collection details and confirm your route." : "Browse nearby listings to reserve your next pickup."}</p>
            </div>
            <button type="button" aria-label="Open pickup schedule" onClick={() => navigate("/user/NGO/trackdonations")} className="rounded-full p-2 text-[#4d8857] hover:bg-[#eef6eb]"><ArrowRight size={18} /></button>
          </div>
        </section>

        <section className="dashboard-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="section-eyebrow">Needs board</p>
              <h2 className="font-serif text-2xl font-bold text-[#20372a]">Community requests</h2>
            </div>
            <button type="button" onClick={() => navigate("/user/NGO/requests")} className="inline-flex items-center gap-1 rounded-full bg-[#315d3b] px-3 py-2 text-sm font-semibold text-white hover:bg-[#244b2d]"><Plus size={15} /> Add need</button>
          </div>
          <div className="space-y-3">
            {[
              ["Fresh meals", "Needed for tomorrow's community kitchen", "High priority"],
              ["Packaged staples", "Support for 24 local families", "Open request"],
            ].map(([title, detail, status]) => (
              <div key={title} className="flex items-center gap-3 rounded-xl bg-[#fafcf9] p-3">
                <Target size={18} className="text-[#d18a44]" />
                <div className="min-w-0 flex-1"><p className="font-semibold text-[#294332]">{title}</p><p className="truncate text-sm text-[#718078]">{detail}</p></div>
                <span className="whitespace-nowrap rounded-full bg-[#fff1df] px-2.5 py-1 text-xs font-semibold text-[#a7672b]">{status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 pb-8">
        <button type="button" onClick={() => navigate("/user/NGO/inventory")} className="inline-flex items-center gap-2 rounded-xl border border-[#d9e7d7] bg-white px-4 py-3 text-sm font-semibold text-[#315d3b] hover:bg-[#eef6eb]"><Warehouse size={17} /> Manage inventory</button>
        <button type="button" onClick={() => navigate("/user/NGO/team")} className="inline-flex items-center gap-2 rounded-xl border border-[#d9e7d7] bg-white px-4 py-3 text-sm font-semibold text-[#315d3b] hover:bg-[#eef6eb]"><Users size={17} /> Manage volunteers</button>
        <button type="button" onClick={() => navigate("/user/NGO/reports")} className="inline-flex items-center gap-2 rounded-xl border border-[#d9e7d7] bg-white px-4 py-3 text-sm font-semibold text-[#315d3b] hover:bg-[#eef6eb]"><Download size={17} /> Export impact report</button>
      </div>
    </main>
  );
};

export default Dashboard;
