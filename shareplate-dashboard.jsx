import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  LayoutGrid,
  UtensilsCrossed,
  Bell,
  ChevronRight,
  PanelLeft,
  ChevronDown,
} from "lucide-react";

// ---- palette (lifted straight from the current dashboard) ----
// forest  : the near-black green used in the donut / sidebar accent
// ink     : the near-black used for text + the primary button
// coral   : the salmon used in the little trend sparkline
// sky     : the blue used for the two stat icons
// paper   : warm off-white background
const COLORS = {
  forest: "#12352A",
  forestLight: "#1F5240",
  ink: "#15181C",
  coral: "#E8A08E",
  coralDark: "#DD7C63",
  sky: "#3E6FE0",
  paper: "#F6F4EF",
  card: "#FFFFFF",
  line: "#E7E3D9",
  muted: "#8A8F86",
};

const trend = [
  { label: "Mar", donations: 2 },
  { label: "Apr", donations: 3 },
  { label: "May", donations: 5 },
  { label: "Jun", donations: 4 },
  { label: "Jul", donations: 7 },
  { label: "Aug", donations: 9 },
  { label: "Sep", donations: 8 },
];

const sizes = [
  { label: "Small", value: 20, color: COLORS.forestLight },
  { label: "Medium", value: 30, color: COLORS.forest },
  { label: "Large", value: 10, color: COLORS.coralDark },
];

const statusRows = [
  { label: "Delivered", value: 6, total: 9, color: COLORS.forest },
  { label: "Ongoing", value: 2, total: 9, color: COLORS.coralDark },
  { label: "Pending", value: 1, total: 9, color: COLORS.muted },
];

const servingsSpark = [
  { v: 0 }, { v: 1 }, { v: 1 }, { v: 2 }, { v: 4 }, { v: 4 }, { v: 6 },
];
const donationsSpark = [
  { v: 0 }, { v: 1 }, { v: 1 }, { v: 1 }, { v: 2 }, { v: 2 }, { v: 3 },
];

function NavItem({ icon: Icon, label, active, expandable }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
        active ? "bg-white/10 text-white" : "text-white/60 hover:text-white/90 hover:bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={17} strokeWidth={1.75} />
        <span className="text-[13.5px]">{label}</span>
      </div>
      {expandable && <ChevronRight size={14} strokeWidth={2} className="opacity-50" />}
    </div>
  );
}

function StatHero({ label, value, unit, spark, sparkColor }) {
  return (
    <div className="flex-1 rounded-2xl bg-white p-6 flex items-end justify-between" style={{ border: `1px solid ${COLORS.line}` }}>
      <div>
        <p className="text-[13px] mb-2" style={{ color: COLORS.muted }}>{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[42px] leading-none font-serif" style={{ color: COLORS.ink }}>{value}</span>
          {unit && <span className="text-[13px]" style={{ color: COLORS.muted }}>{unit}</span>}
        </div>
      </div>
      <div className="w-24 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={spark}>
            <Line type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ShareplateDashboard() {
  const [active] = useState("Dashboard");

  return (
    <div
      className="w-full min-h-[860px] flex"
      style={{ background: COLORS.paper, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Sidebar */}
      <aside
        className="w-[240px] shrink-0 flex flex-col justify-between px-4 py-5"
        style={{ background: COLORS.forest }}
      >
        <div>
          <div className="flex items-center gap-2.5 px-2 mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-serif"
              style={{ background: COLORS.coral, color: COLORS.ink }}
            >
              S
            </div>
            <div>
              <p className="text-white text-[13.5px] leading-tight">SharePlate</p>
              <p className="text-white/50 text-[11px] leading-tight">Donor</p>
            </div>
          </div>

          <p className="px-3 text-[10.5px] tracking-wide text-white/35 mb-2">Platform</p>
          <div className="flex flex-col gap-1">
            <NavItem icon={LayoutGrid} label="Dashboard" active={active === "Dashboard"} />
            <NavItem icon={UtensilsCrossed} label="Donation" expandable />
            <NavItem icon={Bell} label="Notifications" />
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 pt-4 border-t border-white/10">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-medium"
            style={{ background: COLORS.coralDark, color: "white" }}
          >
            SP
          </div>
          <div className="min-w-0">
            <p className="text-white text-[12.5px] leading-tight truncate">Sarthak Pandey</p>
            <p className="text-white/40 text-[10.5px] leading-tight truncate">sarthakpandey346@gmail.c...</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-8 py-4" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
          <PanelLeft size={16} strokeWidth={1.75} style={{ color: COLORS.muted }} />
          <span className="text-[13px]" style={{ color: COLORS.muted }}>NGO</span>
          <ChevronRight size={12} style={{ color: COLORS.muted }} />
          <span className="text-[13px]" style={{ color: COLORS.ink }}>Data Fetching</span>
        </div>

        <div className="px-8 py-7 flex flex-col gap-6">
          {/* Hero */}
          <div
            className="rounded-2xl p-8 flex items-center justify-between gap-8 overflow-hidden relative"
            style={{ background: COLORS.forest }}
          >
            <div className="relative z-10 max-w-[420px]">
              <h1 className="font-serif text-white text-[30px] leading-tight mb-3">
                Hi Sarthak Pandey,
              </h1>
              <p className="text-white/65 text-[14.5px] mb-5 leading-relaxed">
                Every donation makes a difference. What do you want to give today?
              </p>
              <button
                className="px-5 py-2.5 rounded-full text-[13.5px] font-medium"
                style={{ background: COLORS.coral, color: COLORS.ink }}
              >
                Donate now
              </button>
            </div>
            {/* decorative bowl illustration, drawn in-palette instead of a stock photo */}
            <svg
              className="relative z-10 shrink-0 hidden sm:block"
              width="160" height="160" viewBox="0 0 160 160" fill="none"
            >
              <circle cx="80" cy="80" r="78" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
              <path d="M30 90 a50 30 0 0 0 100 0 z" fill={COLORS.coral} opacity="0.9" />
              <ellipse cx="80" cy="90" rx="50" ry="10" fill={COLORS.coralDark} />
              <circle cx="60" cy="80" r="6" fill="#FFF7EE" />
              <circle cx="80" cy="74" r="7" fill="#FFF7EE" />
              <circle cx="100" cy="82" r="5.5" fill="#FFF7EE" />
              <rect x="76" y="30" width="6" height="34" rx="3" fill="rgba(255,255,255,0.5)" />
              <rect x="96" y="34" width="6" height="30" rx="3" fill="rgba(255,255,255,0.5)" transform="rotate(18 99 49)" />
            </svg>
          </div>

          {/* Stat hero row */}
          <div className="flex gap-5">
            <StatHero label="Total donations" value="9" spark={donationsSpark} sparkColor={COLORS.forest} />
            <StatHero label="Food saved" value="14" unit="servings" spark={servingsSpark} sparkColor={COLORS.coralDark} />
          </div>

          {/* Big trend chart */}
          <div className="rounded-2xl bg-white p-6" style={{ border: `1px solid ${COLORS.line}` }}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="font-serif text-[18px]" style={{ color: COLORS.ink }}>Donation activity</h2>
                <p className="text-[12.5px]" style={{ color: COLORS.muted }}>Donations logged per month</p>
              </div>
              <span
                className="text-[11.5px] px-2.5 py-1 rounded-full"
                style={{ background: COLORS.paper, color: COLORS.forest }}
              >
                Last 7 months
              </span>
            </div>
            <div className="h-[260px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillForest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.forest} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={COLORS.forest} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={COLORS.line} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: COLORS.muted, fontSize: 12 }}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: COLORS.muted, fontSize: 12 }} width={24} />
                  <Tooltip
                    contentStyle={{
                      background: COLORS.ink,
                      border: "none",
                      borderRadius: 10,
                      fontSize: 12.5,
                      color: "white",
                    }}
                    labelStyle={{ color: "white" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="donations"
                    stroke={COLORS.forest}
                    strokeWidth={2.5}
                    fill="url(#fillForest)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom row: portion sizes (bar, not pie) + status (progress list, not donut) */}
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-2xl bg-white p-6" style={{ border: `1px solid ${COLORS.line}` }}>
              <h2 className="font-serif text-[18px] mb-0.5" style={{ color: COLORS.ink }}>Portion sizes</h2>
              <p className="text-[12.5px] mb-4" style={{ color: COLORS.muted }}>Servings by size, last 30 days</p>
              <div className="h-[190px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sizes} layout="vertical" margin={{ left: -10 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      width={70}
                      tick={{ fill: COLORS.ink, fontSize: 13 }}
                    />
                    <Tooltip
                      cursor={{ fill: COLORS.paper }}
                      contentStyle={{ background: COLORS.ink, border: "none", borderRadius: 10, fontSize: 12.5, color: "white" }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
                      {sizes.map((s, i) => (
                        <Cell key={i} fill={s.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6" style={{ border: `1px solid ${COLORS.line}` }}>
              <h2 className="font-serif text-[18px] mb-0.5" style={{ color: COLORS.ink }}>Donation status</h2>
              <p className="text-[12.5px] mb-5" style={{ color: COLORS.muted }}>Where your 9 donations stand</p>
              <div className="flex flex-col gap-4">
                {statusRows.map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px]" style={{ color: COLORS.ink }}>{row.label}</span>
                      <span className="text-[13px]" style={{ color: COLORS.muted }}>{row.value}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: COLORS.paper }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(row.value / row.total) * 100}%`,
                          background: row.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
