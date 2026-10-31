const cards = [
  ["Pending NGO requests", "0", "Review new organizations"],
  ["Active donations", "0", "Monitor current listings"],
  ["Registered donors", "0", "Search donor accounts"],
  ["Open reports", "0", "Resolve trust and safety issues"],
];

export default function AdminOverview() {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[#17633b]">Platform control center</p>
      <h1 className="mt-2 font-serif text-4xl font-bold">Good morning, Admin</h1>
      <p className="mt-3 max-w-2xl text-[#536258]">Review NGO applications, monitor donations, and keep the ShareBite network trusted.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, action]) => <article key={label} className="rounded-2xl border border-[#dce5dd] bg-white p-5"><p className="text-sm font-bold text-[#536258]">{label}</p><p className="mt-4 text-4xl font-bold">{value}</p><p className="mt-3 text-xs text-[#536258]">{action}</p></article>)}
      </div>
      <div className="mt-8 rounded-2xl border border-dashed border-[#a9c8a9] bg-[#eef6eb] p-6"><h2 className="font-serif text-2xl font-bold">Admin workspace ready</h2><p className="mt-2 text-sm leading-6 text-[#536258]">The next step is connecting these sections to backend data and adding the NGO approval workflow.</p></div>
    </section>
  );
}
