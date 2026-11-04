import React, { useState } from "react";
import { BarChart3, CheckCircle2, ClipboardList, Download, Mail, Plus, Search, Users, Warehouse } from "lucide-react";

type Section = "inventory" | "requests" | "distribution" | "reports" | "team" | "messages";

const content: Record<Section, { eyebrow: string; title: string; description: string; icon: React.ElementType }> = {
  inventory: { eyebrow: "Food stock", title: "Inventory management", description: "Track what is available, what is expiring, and what has been distributed.", icon: Warehouse },
  requests: { eyebrow: "Needs board", title: "Community requests", description: "Publish clear requirements so donors can match food to your community.", icon: ClipboardList },
  distribution: { eyebrow: "Beneficiary care", title: "Distribution log", description: "Record every distribution and keep your impact data accurate.", icon: CheckCircle2 },
  reports: { eyebrow: "Your impact", title: "Impact reports", description: "Review your results and download a report for your team or supporters.", icon: BarChart3 },
  team: { eyebrow: "People", title: "Team & volunteers", description: "Coordinate the people who make pickups and distributions possible.", icon: Users },
  messages: { eyebrow: "Communication", title: "Messages", description: "Keep donor and volunteer conversations in one place.", icon: Mail },
};

const NGOOperations: React.FC<{ section: Section }> = ({ section }) => {
  const [showForm, setShowForm] = useState(false);
  const selected = content[section];
  const Icon = selected.icon;

  return (
    <main className="donor-dashboard bg-[#f7faf6]">
      <section className="dashboard-hero dashboard-card">
        <div className="dashboard-hero-content">
          <div><p className="section-eyebrow">{selected.eyebrow}</p><h1 className="font-serif dashboard-hero-title">{selected.title}</h1><p className="dashboard-hero-description">{selected.description}</p></div>
          <Icon className="text-[#79a879]" size={48} />
        </div>
      </section>
      <section className="dashboard-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2ebe0] pb-5">
          <div><h2 className="font-serif text-2xl font-bold text-[#20372a]">Workspace overview</h2><p className="mt-1 text-sm text-[#718078]">This workspace is ready for your NGO operations.</p></div>
          {section !== "messages" && <button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#315d3b] px-4 py-3 text-sm font-semibold text-white hover:bg-[#244b2d]"><Plus size={17} /> Add new</button>}
        </div>
        {showForm && <div className="my-5 rounded-2xl border border-[#cfe1cc] bg-[#f4faf2] p-5"><label className="mb-2 block text-sm font-semibold text-[#315d3b]">Search or add an entry</label><div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-3 text-[#7b927f]" size={17} /><input className="w-full rounded-xl border border-[#d9e7d7] bg-white py-2.5 pl-10 pr-3 outline-none focus:border-[#70a477]" placeholder="Enter details..." /></div><button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-[#cfe1cc] px-4 text-sm font-semibold text-[#315d3b]">Save</button></div></div>}
        <div className="grid gap-4 py-6 sm:grid-cols-3">
          {[["Active items", "0"], ["This month", "0"], ["Pending actions", "0"]].map(([label, value]) => <div key={label} className="rounded-2xl bg-[#fafcf9] p-5"><p className="text-sm text-[#718078]">{label}</p><p className="mt-2 text-3xl font-bold text-[#315d3b]">{value}</p></div>)}
        </div>
        <div className="rounded-2xl border border-dashed border-[#cfe1cc] bg-[#fbfdfb] p-8 text-center"><Icon className="mx-auto text-[#79a879]" size={34} /><h3 className="mt-3 font-semibold text-[#294332]">No records yet</h3><p className="mx-auto mt-1 max-w-md text-sm text-[#718078]">Add your first entry to start building this workspace.</p></div>
        {section === "reports" && <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#d9e7d7] px-4 py-3 text-sm font-semibold text-[#315d3b]"><Download size={17} /> Download report</button>}
      </section>
    </main>
  );
};

export default NGOOperations;
