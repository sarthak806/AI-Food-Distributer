import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { landingIcons } from "./landingIcons";
import {
  demoLandingImpact,
  formatImpactNumber,
  normalizeLandingImpact,
  type LandingImpact,
} from "./demoData";

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

const EmptyData = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1 text-xs text-[#718078]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#b4c2b5]" />
    {label}
  </span>
);

export const Features = () => (
  <section id="features" className="scroll-mt-24 bg-[#f7faf5] px-5 py-16 md:px-20 md:py-28">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <span className="text-[.68rem] font-bold uppercase tracking-[.14em] text-[#17633b]">Built to coordinate</span>
        <h2 className="mt-3 font-serif text-4xl leading-none md:text-6xl">Intelligence where it matters.</h2>
      </div>
      <p className="max-w-[390px] leading-7 text-[#718078]">
        Explore the platform’s prototype capabilities with clearly marked sample activity.
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
            <Row n="01" name="Community Kitchen" val="96%" />
            <Row n="02" name="Local Relief Hub" val="91%" />
            <Row n="03" name="Food Care Network" val="87%" />
          </div>
        }
      />
      <Feature title="Smart route optimization" icon={landingIcons.route} text="Plan efficient pickup and delivery routes around urgency and capacity." visual={<div className="flex items-center justify-center"><EmptyData label="Demo route · 18 stops optimized" /></div>} />
      <Feature title="Food quality screening" icon={landingIcons.shield} text="AI-assisted image screening for freshness signals and redistribution risk." visual={<div className="flex items-center justify-center"><EmptyData label="Demo screening · 3 checks passed" /></div>} />
      <Feature title="Demand prediction" icon={landingIcons.users} text="Forecast NGO needs from historical donation and demand records." visual={<div className="flex items-center justify-center"><EmptyData label="Sample forecast · 24 meals" /></div>} />
    </div>
  </section>
);

const Impact = ({ title, value, unit }: { title: string; value: string; unit?: string }) => (
  <div className="flex flex-col justify-between py-5">
    <span className="text-sm text-[#536258]">{title}</span>
    <div className="mt-4 flex items-baseline gap-2">
      <span className="font-sans text-3xl font-bold tracking-tight text-[#17633b] md:text-4xl">{value}</span>
      {unit && <span className="text-sm font-medium text-[#536258]">{unit}</span>}
    </div>
  </div>
);

export const ImpactSection = () => {
  const [impact, setImpact] = useState<LandingImpact>(demoLandingImpact);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    const endpoint = import.meta.env.VITE_LANDING_STATS_URL as string | undefined;
    if (!endpoint) return;

    let active = true;
    axios
      .get(endpoint)
      .then(({ data }) => {
        const liveImpact = normalizeLandingImpact(data);
        if (active && liveImpact) {
          setImpact(liveImpact);
          setIsDemo(false);
        }
      })
      .catch(() => {
        if (active) {
          setImpact(demoLandingImpact);
          setIsDemo(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="impact" className="scroll-mt-24 bg-[#f7faf5] px-5 py-16 md:px-20 md:py-24">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] bg-[#edf4e9] px-6 py-10 md:px-12 md:py-12">
        <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[.68rem] font-bold uppercase tracking-[.16em] text-[#17633b]">Community impact</span>
              <span className="rounded-full border border-[#c8d9c3] bg-[#edf4e9] px-3 py-1 text-[.65rem] font-bold uppercase tracking-[.1em] text-[#315d3b]">
                {isDemo ? "Demo data" : "Live data"}
              </span>
            </div>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-[#14231d] md:text-6xl">
              Small acts,
              <br />
              <em className="not-italic text-[#da7848]">meaningful impact.</em>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#536258] md:text-base">
              {isDemo
                ? "A glimpse of the difference a connected food rescue network can make."
                : "Every donation and delivery contributes to a measurable community impact."}
            </p>
            <p className="mt-5 text-xs text-[#718078]">
              {isDemo ? "Illustrative figures for project demonstration." : "Metrics based on available platform activity."}
            </p>
            <a href="#start" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#17633b] transition-all hover:gap-4">
              Explore ShareBite {landingIcons.arrow}
            </a>
          </div>

          <div className="border-t border-[#cbd9c7] md:border-t-0">
            <div className="border-b border-[#cbd9c7] py-7 md:py-9">
              <span className="text-sm text-[#536258]">Food rescued</span>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-sans text-5xl font-bold tracking-tight text-[#17633b] md:text-7xl">
                  {formatImpactNumber(impact.foodRescuedKg)}
                </span>
                <span className="text-lg font-medium text-[#536258]">kg</span>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-[#cbd9c7]">
              <div className="border-b border-[#cbd9c7] pr-5">
                <Impact title="Meals redistributed" value={formatImpactNumber(impact.mealsRedistributed)} />
              </div>
              <div className="border-b border-[#cbd9c7] pl-5">
                <Impact title="Successful deliveries" value={formatImpactNumber(impact.successfulDeliveries)} />
              </div>
              <div className="pr-5">
                <Impact title="NGOs involved" value={formatImpactNumber(impact.ngosInvolved)} />
              </div>
              <div className="pl-5">
                <Impact title="Active volunteers" value={formatImpactNumber(impact.activeVolunteers)} />
              </div>
            </div>
          </div>
        </div>

        {isDemo && (
          <div className="mt-10 border-t border-[#dce5dd] pt-4">
            <p className="text-xs leading-6 text-[#718078]">
              Sample figures shown for project demonstration purposes only. These do not represent actual platform activity.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export const CtaSection = () => (
  <section id="start" className="scroll-mt-24 bg-[#f7faf5] px-5 py-16 md:px-20 md:py-28">
    <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[#dce5dd] bg-[#eaf2e6] p-8 md:flex-row md:items-center">
      <div>
        <span className="text-[.72rem] font-bold uppercase tracking-[.2em] text-[#17633b]">Ready when you are</span>
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
