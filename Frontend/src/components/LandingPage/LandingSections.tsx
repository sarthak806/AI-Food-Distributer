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
    <p className="max-w-[390px] leading-7 text-[#536258]">
      From the moment food is posted to the moment it is delivered, ShareBite brings the coordination into one intelligent flow.
    </p>
  </section>
);

const Step = ({
  n,
  icon,
  label,
  title,
  text,
  action,
}: {
  n: string;
  icon: ReactNode;
  label: string;
  title: string;
  text: string;
  action: string;
}) => (
  <article className="group relative rounded-[1.4rem] border border-[#cfe4d2] bg-white p-9 pt-12 shadow-[0_1rem_2.5rem_rgba(47,102,64,.04)] transition duration-300 hover:-translate-y-2 hover:border-[#8fbea0] hover:shadow-xl">
    <span className="absolute -top-7 left-9 grid h-14 w-14 place-items-center rounded-full border-[6px] border-[#eef6eb] bg-white text-lg font-bold text-[#17633b] shadow-[0_0_0_1px_#cfe4d2] transition duration-300 group-hover:scale-110">
      {n}
    </span>
    <span className="text-xs font-bold uppercase tracking-[.2em] text-[#17633b]">{label}</span>
    <div className="mt-5 grid h-28 w-28 place-items-center rounded-full bg-[#eef6eb] text-[#17633b] transition duration-300 group-hover:scale-105 group-hover:bg-[#e2f1e1]">
      <span className="[&>svg]:h-14 [&>svg]:w-14">{icon}</span>
    </div>
    <h3 className="mt-6 font-sans text-[1.75rem] font-bold leading-tight tracking-[-.04em]">{title}</h3>
    <p className="mt-4 min-h-[5.5rem] text-base leading-7 text-[#536258]">{text}</p>
    <a href="#start" className="mt-5 inline-flex items-center gap-3 text-base font-bold text-[#17633b] transition group-hover:gap-4">
      {action} {landingIcons.arrow}
    </a>
  </article>
);

export const HowItWorks = () => (
  <section id="how-it-works" className="scroll-mt-24 bg-[#f7faf5] px-5 py-20 md:px-20 md:py-32">
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <span className="text-[.72rem] font-bold uppercase tracking-[.2em] text-[#17633b]">How ShareBite works</span>
        <h2 className="mt-4 font-sans text-4xl font-bold leading-[.98] tracking-[-.05em] md:text-6xl">
          From surplus to impact.
        </h2>
      </div>
      <p className="max-w-[390px] text-lg leading-7 text-[#536258]">
        Three simple steps to get good food where it’s needed most.
      </p>
    </div>
    <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
      <div aria-hidden="true" className="absolute left-[12%] right-[12%] top-0 hidden h-0.5 bg-[#2b8a5a] md:block" />
      <Step n="01" label="Donate" icon={landingIcons.heart} title="Donate surplus" text="List extra food, quantity, pickup location and expiry time." action="List food" />
      <Step n="02" label="Match" icon={landingIcons.spark} title="Find the right match" text="We connect your donation with an NGO that can collect it in time." action="Smart matching" />
      <Step n="03" label="Deliver" icon={landingIcons.shield} title="Deliver with confidence" text="Volunteers coordinate pickup and confirm delivery with a secure QR code or OTP." action="Verify delivery" />
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