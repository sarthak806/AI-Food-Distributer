import type { ReactNode } from "react";
import { landingIcons } from "./landingIcons";

const EmptyData = ({ label = "Data not available" }: { label?: string }) => (
  <span className="inline-flex items-center gap-1 text-xs text-[#718078]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#b4c2b5]" />
    {label}
  </span>
);

export const ProofSection = () => (
  <section className="flex flex-col justify-between gap-8 border-y border-[#dce5dd] bg-white px-5 py-16 md:flex-row md:items-center md:px-20">
    <div>
      <span className="text-[.68rem] font-bold uppercase tracking-[.14em] text-[#17633b]">ONE PLATFORM</span>
      <h2 className="mt-3 font-serif text-4xl leading-none md:text-6xl">Every surplus has a destination.</h2>
    </div>
    <p className="max-w-[390px] leading-7 text-[#718078]">
      From the moment food is posted to the moment it is delivered, ShareBite brings the coordination into one intelligent flow.
    </p>
  </section>
);

const Step = ({
  n,
  icon,
  title,
  text,
}: {
  n: string;
  icon: ReactNode;
  title: string;
  text: string;
}) => (
  <article className="group relative rounded-3xl border border-[#dce5dd] bg-white p-9 transition duration-300 hover:-translate-y-2 hover:border-[#a9c8a9] hover:shadow-xl">
    <span className="text-xs text-[#a2b3a4]">{n}</span>
    <div className="mt-10 flex h-10 w-10 origin-center items-center justify-center text-[#17633b] transition-transform duration-300 ease-out group-hover:scale-110">
      {icon}
    </div>
    <h3 className="mt-7 font-sans text-2xl font-bold tracking-[-.04em]">{title}</h3>
    <p className="mt-4 text-sm leading-7 text-[#718078]">{text}</p>
    <span className="absolute right-9 top-9 text-xl text-[#17633b] transition group-hover:translate-x-1">
      {landingIcons.arrow}
    </span>
  </article>
);

export const HowItWorks = () => (
  <section id="how-it-works" className="scroll-mt-24 bg-[#eef6eb] px-5 py-16 md:px-20 md:py-28">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <span className="text-[.68rem] font-bold uppercase tracking-[.14em] text-[#17633b]">Simple on the surface</span>
        <h2 className="mt-3 font-sans text-4xl font-bold tracking-[-.045em] md:text-6xl">
          From surplus to impact.
        </h2>
      </div>
      <p className="max-w-[390px] leading-7 text-lg text-[#7c8b83]">
        Three roles. One coordinated system. No wasted handoffs.
      </p>
    </div>
    <div className="mt-12 grid gap-4 md:grid-cols-3">
      <Step n="01" icon={landingIcons.heart} title="Donate" text="Post surplus food with quantity, location, preparation time and expiry." />
      <Step n="02" icon={landingIcons.spark} title="Match" text="ShareBite recommends the best-fit NGO and available pickup path." />
      <Step n="03" icon={landingIcons.shield} title="Deliver" text="Volunteers collect and verify delivery with a secure QR or OTP." />
    </div>
  </section>
);

const Row = ({ n, name, val }: { n: string; name: string; val: string }) => (
  <div className="flex gap-3 border-b border-[#cfdfcf] py-3 text-xs">
    <span className="text-[#718078]">{n}</span>
    <b className="flex-1">{name}</b>
    <strong className="text-[#17633b]">{val}</strong>
  </div>
);

const Feature = ({
  title,
  text,
  icon,
  visual,
  big = false,
}: {
  title: string;
  text: string;
  icon: ReactNode;
  visual: ReactNode;
  big?: boolean;
}) => (
  <article
    className={`group relative flex flex-col rounded-2xl border border-[#dce5dd] bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-[#a9c8a9] hover:shadow-xl ${
      big ? "md:row-span-2" : ""
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex h-10 w-10 origin-center items-center justify-center rounded-xl bg-[#dcebd6] text-[#17633b] transition-transform duration-300 ease-out group-hover:scale-110">
        {icon}
      </div>
      <span className="text-[#17633b] transition group-hover:translate-x-1">{landingIcons.arrow}</span>
    </div>
    <h3 className="mt-6 font-serif text-2xl">{title}</h3>
    <p className="mt-2 text-sm leading-7 text-[#718078]">{text}</p>
    <div className="mt-6 flex flex-1 flex-col justify-center rounded-xl bg-[#e9f2e6] p-4">
      {visual}
    </div>
  </article>
);

export const Features = () => (
  <section id="features" className="scroll-mt-24 bg-[#f7faf5] px-5 py-16 md:px-20 md:py-28">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <span className="text-[.68rem] font-bold uppercase tracking-[.14em] text-[#17633b]">Built to coordinate</span>
        <h2 className="mt-3 font-serif text-4xl leading-none md:text-6xl">Intelligence where it matters.</h2>
      </div>
      <p className="max-w-[390px] leading-7 text-[#718078]">
        Advanced capabilities are ready for your live backend — until then, the UI clearly shows when data is unavailable.
      </p>
    </div>
    <div className="mt-12 grid gap-4 md:grid-cols-2">
      <Feature
        big
        title="AI NGO matching"
        icon={landingIcons.spark}
        text="Rank NGOs using distance, capacity, demand, food type and expiry urgency."
        visual={
          <div className="flex flex-col justify-center gap-1">
            <Row n="01" name="Community Kitchen" val="--" />
            <Row n="02" name="Local Relief Hub" val="--" />
            <Row n="03" name="Food Care Network" val="--" />
          </div>
        }
      />
      <Feature
        title="Smart route optimization"
        icon={landingIcons.route}
        text="Plan efficient pickup and delivery routes around urgency and capacity."
        visual={
          <div className="flex items-center justify-center">
            <EmptyData label="Route data not available" />
          </div>
        }
      />
      <Feature
        title="Food quality screening"
        icon={landingIcons.shield}
        text="AI-assisted image screening for freshness signals and redistribution risk."
        visual={
          <div className="flex items-center justify-center">
            <EmptyData label="No image data" />
          </div>
        }
      />
      <Feature
        title="Demand prediction"
        icon={landingIcons.users}
        text="Forecast NGO needs from historical donation and demand records."
        visual={
          <div className="flex items-center justify-center">
            <EmptyData label="Prediction unavailable" />
          </div>
        }
      />
    </div>
  </section>
);

const Impact = ({ title }: { title: string }) => (
  <div className="min-h-[170px] rounded-xl border border-[#385044] p-5 transition hover:-translate-y-1">
    <span className="text-xs text-[#b7c5bb]">{title}</span>
    <div className="flex h-28 flex-col justify-center">
      <span className="text-3xl text-[#a9d69c]">—</span>
      <b className="text-sm">Data not available</b>
      <small className="mt-1 text-xs text-[#8ba094]">Waiting for backend data</small>
    </div>
  </div>
);

export const ImpactSection = () => (
  <section id="impact" className="scroll-mt-24 bg-[#f7faf5] px-5 py-16 md:px-20 md:py-28">
    <div className="grid gap-8 rounded-3xl bg-[#14231d] p-6 text-white md:grid-cols-[.8fr_1.2fr] md:p-16">
      <div>
        <span className="text-[.68rem] font-bold uppercase tracking-[.14em] text-[#a9d69c]">Impact dashboard</span>
        <h2 className="mt-3 font-serif text-4xl leading-none md:text-6xl">
          Your real numbers.
          <br />
          <em className="text-[#da7848] not-italic">When you connect them.</em>
        </h2>
        <p className="mt-5 max-w-[420px] text-sm leading-7 text-[#b7c5bb]">
          We deliberately never invent impact metrics. Once your backend is connected, these cards will update from real donations, deliveries and users.
        </p>
        <a className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:gap-4" href="#start">
          Connect the system {landingIcons.arrow}
        </a>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Impact title="Meals redistributed" />
        <Impact title="Food saved" />
        <Impact title="Successful deliveries" />
        <Impact title="Active volunteers" />
      </div>
    </div>
  </section>
);

export const CtaSection = () => (
  <section id="start" className="scroll-mt-24 bg-[#f7faf5] px-5 py-16 md:px-20 md:py-28">
    <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[#dce5dd] bg-[#eaf2e6] p-8 md:flex-row md:items-center">
      <div>
        <span className="text-[.68rem] font-bold uppercase tracking-[.14em] text-[#17633b]">Ready when you are</span>
        <h2 className="mt-3 font-serif text-4xl leading-none md:text-6xl">Turn surplus into something useful.</h2>
        <p className="mt-3 text-sm text-[#718078]">Build the network first. Let your live data make it smarter.</p>
      </div>

      <a
        className="inline-flex items-center gap-2 rounded-full bg-[#17633b] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#22784a] hover:shadow-lg"
        href="/user/login"
      >
        Create your account {landingIcons.arrow}
      </a>
    </div>
  </section>
);