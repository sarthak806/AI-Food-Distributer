import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Tooltip,
  YAxis,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

const COLORS = {
  forest: "#12352A", forestLight: "#1F5240", ink: "#15181C", coral: "#E8A08E",
  coralDark: "#DD7C63", paper: "#F6F4EF", card: "#FFFFFF", line: "#E7E3D9", muted: "#8A8F86",
};

interface Donation { _id: string; quantity: number; status: "pending" | "accepted" | "delivered"; createdAt: string; }
interface DashboardStats { totalDonations: number; totalFoodSaved: number; }
const emptyStats: DashboardStats = { totalDonations: 0, totalFoodSaved: 0 };

const EmptyState = ({ message = "No data available yet" }: { message?: string }) => (
  <div className="flex h-full min-h-[150px] items-center justify-center text-sm" style={{ color: COLORS.muted }}>{message}</div>
);

const tooltipStyle = { background: COLORS.ink, border: "none", borderRadius: 10, color: "white", fontSize: 12 };

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(emptyStats);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const donationsRes = await axios.get<Donation[]>(
          `${import.meta.env.VITE_Backend_URL}/api/donations/my-donations`,
          { withCredentials: true },
        );
        const userDonations = donationsRes.data || [];
        setDonations(userDonations);
        setStats({
          totalDonations: userDonations.length,
          totalFoodSaved: userDonations
            .filter((donation) => donation.status === "accepted" || donation.status === "delivered")
            .reduce((sum, donation) => sum + donation.quantity, 0),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const hasDonations = donations.length > 0;
  const monthMap = donations.reduce<Record<string, number>>((result, donation) => {
    const date = new Date(donation.createdAt);
    const key = date.toLocaleDateString("en-US", { month: "short" });
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
  const trend = Object.entries(monthMap).map(([label, value]) => ({ label, value }));
  const sizes = [
    { label: "Small", value: donations.filter((donation) => donation.quantity < 10).reduce((sum, donation) => sum + donation.quantity, 0), color: COLORS.forestLight },
    { label: "Medium", value: donations.filter((donation) => donation.quantity >= 10 && donation.quantity < 30).reduce((sum, donation) => sum + donation.quantity, 0), color: COLORS.forest },
    { label: "Large", value: donations.filter((donation) => donation.quantity >= 30).reduce((sum, donation) => sum + donation.quantity, 0), color: COLORS.coralDark },
  ];
  const statuses = [
    { label: "Delivered", value: donations.filter((donation) => donation.status === "delivered").length, color: COLORS.forest },
    { label: "Ongoing", value: donations.filter((donation) => donation.status === "accepted").length, color: COLORS.coralDark },
    { label: "Pending", value: donations.filter((donation) => donation.status === "pending").length, color: COLORS.muted },
  ];
  const maxTrend = Math.max(...trend.map((point) => point.value), 1);
  const firstName = user?.name?.split(" ")[0] || "there";

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center" style={{ background: COLORS.paper, color: COLORS.muted }}>Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.paper, color: COLORS.ink, fontFamily: "Inter, system-ui, sans-serif" }}>
        <div className="flex flex-col gap-5 px-5 py-6 md:px-8">
          <section className="relative flex min-h-[190px] items-center justify-between overflow-hidden rounded-2xl p-7 md:p-8" style={{ background: COLORS.forest }}><div className="relative z-10 max-w-xl"><h1 className="mb-3 font-serif text-3xl text-white">Hi {firstName},</h1><p className="mb-5 text-sm leading-relaxed text-white/70">Every donation makes a difference. What do you want to give today?</p>{hasDonations ? <Link to="/user/Donar/donationForm"><Button className="rounded-full px-5 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-md" style={{ background: COLORS.coral, color: COLORS.ink }}>Donate now <ArrowRight size={15} className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5" /></Button></Link> : <div><p className="mb-3 text-sm text-white/75">You have not made a donation yet. Make your first donation today.</p><Link to="/user/Donar/donationForm"><Button className="rounded-full px-5 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-md" style={{ background: COLORS.coral, color: COLORS.ink }}>Make your first donation <ArrowRight size={15} className="ml-2" /></Button></Link></div>}</div><svg className="mr-3 hidden shrink-0 sm:block" width="150" height="150" viewBox="0 0 160 160" fill="none"><circle cx="80" cy="80" r="77" stroke="white" strokeOpacity=".13"/><path d="M30 90a50 30 0 0 0 100 0z" fill={COLORS.coral}/><ellipse cx="80" cy="90" rx="50" ry="10" fill={COLORS.coralDark}/><circle cx="60" cy="80" r="6" fill="#FFF7EE"/><circle cx="80" cy="74" r="7" fill="#FFF7EE"/><circle cx="100" cy="82" r="5.5" fill="#FFF7EE"/><rect x="77" y="30" width="6" height="34" rx="3" fill="white" fillOpacity=".5"/><rect x="96" y="34" width="6" height="30" rx="3" fill="white" fillOpacity=".5" transform="rotate(18 99 49)"/></svg></section>
          <div className="grid gap-5 md:grid-cols-2"><StatCard label="Total donations" value={stats.totalDonations} data={trend} color={COLORS.forest} /><StatCard label="Food saved" value={stats.totalFoodSaved} unit="servings" data={trend} color={COLORS.coralDark} /></div>
          <section className="rounded-2xl border bg-white p-6" style={{ borderColor: COLORS.line }}><div className="mb-3 flex items-start justify-between"><div><h2 className="font-serif text-xl">Donation activity</h2><p className="text-xs" style={{ color: COLORS.muted }}>Donations logged per month</p></div><span className="rounded-full px-3 py-1 text-[11px]" style={{ background: COLORS.paper, color: COLORS.forest }}>Last 7 months</span></div>{hasDonations ? <div className="h-[260px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}><defs><linearGradient id="forestFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.forest} stopOpacity=".28" /><stop offset="100%" stopColor={COLORS.forest} stopOpacity="0" /></linearGradient></defs><CartesianGrid vertical={false} stroke={COLORS.line} /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} /><YAxis allowDecimals={false} domain={[0, maxTrend]} axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="value" stroke={COLORS.forest} strokeWidth={2.5} fill="url(#forestFill)" /></AreaChart></ResponsiveContainer></div> : <EmptyState message="No donation activity yet" />}</section>
          <div className="grid gap-5 min-[900px]:grid-cols-2"><section className="rounded-2xl border bg-white p-6" style={{ borderColor: COLORS.line }}><h2 className="font-serif text-xl">Portion sizes</h2><p className="mb-4 text-xs" style={{ color: COLORS.muted }}>Servings by size, all donations</p>{hasDonations ? <div className="h-[190px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={sizes} layout="vertical" margin={{ left: -12, right: 10 }}><XAxis type="number" hide /><YAxis type="category" dataKey="label" width={65} axisLine={false} tickLine={false} tick={{ fill: COLORS.ink, fontSize: 12 }} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: COLORS.paper }} /><Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>{sizes.map((size) => <Cell key={size.label} fill={size.color} />)}</Bar></BarChart></ResponsiveContainer></div> : <EmptyState />}</section><section className="rounded-2xl border bg-white p-6" style={{ borderColor: COLORS.line }}><h2 className="font-serif text-xl">Donation status</h2><p className="mb-5 text-xs" style={{ color: COLORS.muted }}>{hasDonations ? `Where your ${donations.length} donations stand` : "Where your donations stand"}</p>{hasDonations ? <div className="space-y-4">{statuses.map((status) => <div key={status.label}><div className="mb-1.5 flex justify-between text-xs"><span>{status.label}</span><span style={{ color: COLORS.muted }}>{status.value}</span></div><div className="h-2 overflow-hidden rounded-full" style={{ background: COLORS.paper }}><div className="h-full rounded-full" style={{ width: `${(status.value / donations.length) * 100}%`, background: status.color }} /></div></div>)}</div> : <EmptyState message="No donation status data yet" />}</section></div>
        </div>
    </div>
  );
};

function StatCard({ label, value, unit, data, color }: { label: string; value: number; unit?: string; data: { label: string; value: number }[]; color: string }) {
  return <div className="flex min-h-[120px] items-end justify-between rounded-2xl border bg-white p-6" style={{ borderColor: COLORS.line }}><div><p className="mb-2 text-xs" style={{ color: COLORS.muted }}>{label}</p><div className="flex items-baseline gap-1.5"><span className="font-serif text-[42px] leading-none">{value}</span>{unit && <span className="text-xs" style={{ color: COLORS.muted }}>{unit}</span>}</div></div>{data.length > 0 && <div className="h-12 w-24"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>}</div>;
}

export default Dashboard;
