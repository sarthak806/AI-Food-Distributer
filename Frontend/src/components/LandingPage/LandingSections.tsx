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

export const SupportSection = () => {
  const presetAmounts = [100, 250, 500];
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(250);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const amount = selectedAmount === "custom"
    ? Number(customAmount) || 0
    : selectedAmount;

  const selectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setError("");
    setNotice("");
  };

  const selectCustom = () => {
    setSelectedAmount("custom");
    setError("");
    setNotice("");
  };

  const handleDonate = () => {
    if (!amount || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a contribution amount greater than ₹0.");
      setNotice("");
      return;
    }

    if (amount > 100000) {
      setError("Enter a contribution amount of ₹1,00,000 or less.");
      setNotice("");
      return;
    }

    setError("");
    setNotice(
      `Payment checkout is not connected yet. Your selected contribution is ₹${amount.toLocaleString("en-IN")}; no payment will be taken.`,
    );
  };

  return (
    <section id="support" className="scroll-mt-24 bg-[#f7faf5] px-5 py-5 md:px-10">
      <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[24px] border border-[#dce5dd] bg-[#edf4e9] px-5 py-6 sm:px-7 lg:min-h-[190px] lg:px-8 lg:py-5">
        <div className="relative grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <div className="grid items-center gap-5 sm:grid-cols-[220px_minmax(0,1fr)]">
            <div className="group relative mx-auto flex h-[170px] w-[220px] items-center justify-center sm:mx-0">
              <div className="absolute h-[118px] w-[118px] rounded-full bg-[#ddebd7]/70 blur-xl transition duration-500 group-hover:scale-110 group-hover:bg-[#d2e5cb]" />
              <img
                src="/support-box-icon.png"
                alt="Food support box"
                className="relative h-[150px] w-[150px] object-contain opacity-90 mix-blend-multiply transition duration-500 group-hover:-translate-y-1 group-hover:scale-[1.04] group-hover:opacity-100"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#17653f]">
                <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-[#17653f] text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M12 21.5s-7.5-4.6-9.6-9.2C.9 8.9 2.7 5.5 6 5.5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.3 0 5.1 3.4 3.6 6.8C19.5 16.9 12 21.5 12 21.5z" />
                  </svg>
                </span>
                Support our mission
              </div>
              <h2 className="mt-2 text-[30px] font-extrabold leading-[1.05] tracking-[-.035em] text-[#14231d] sm:text-[36px] lg:text-[40px]">
                Help us make every meal matter.
              </h2>
              <p className="mt-2 max-w-[610px] text-[14px] leading-[1.55] text-[#536258] sm:text-[15px]">
                Food shouldn&apos;t go to waste while people go hungry. Support ShareBite in building a smarter network for food redistribution.
              </p>
            </div>
          </div>

          <div className="min-w-0 rounded-[18px] border border-[#dce5dd] bg-white px-5 py-5 shadow-[0_12px_28px_-20px_rgba(22,38,29,.30)] transition duration-300 hover:-translate-y-0.5 hover:border-[#c7d8c2] hover:shadow-[0_16px_32px_-18px_rgba(22,38,29,.34)] sm:px-[22px]">
            <h3 className="mb-4 text-[15px] font-bold text-[#14231d]">Choose your contribution</h3>

            <div className="grid grid-cols-4 gap-2.5" aria-label="Contribution amount">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => selectPreset(amount)}
                  aria-pressed={selectedAmount === amount}
                  className={`grid h-[40px] place-items-center rounded-[10px] border-[1.5px] px-2 text-[13px] font-bold transition duration-200 ${
                    selectedAmount === amount
                      ? "border-[#17653f] bg-[#17653f] text-white shadow-[0_6px_14px_-8px_rgba(23,101,63,.8)]"
                      : "border-[#d9e2d6] bg-white text-[#16261d] hover:-translate-y-0.5 hover:border-[#17653f] hover:bg-[#f3f7f1] hover:shadow-sm"
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
              <button
                type="button"
                onClick={selectCustom}
                aria-pressed={selectedAmount === "custom"}
                className={`grid h-[40px] place-items-center rounded-[10px] border-[1.5px] px-2 text-[13px] font-bold transition duration-200 ${
                  selectedAmount === "custom"
                    ? "border-[#17653f] bg-[#17653f] text-white shadow-[0_6px_14px_-8px_rgba(23,101,63,.8)]"
                    : "border-[#d9e2d6] bg-white text-[#16261d] hover:-translate-y-0.5 hover:border-[#17653f] hover:bg-[#f3f7f1] hover:shadow-sm"
                }`}
              >
                Other
              </button>
            </div>

            {selectedAmount === "custom" && (
              <label className="mt-2 flex h-[38px] items-center gap-2 rounded-[10px] border-[1.5px] border-[#17653f] bg-white px-3" htmlFor="custom-donation">
                <span className="font-bold text-[#17653f]">₹</span>
                <input
                  id="custom-donation"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="100000"
                  step="1"
                  value={customAmount}
                  onChange={(event) => {
                    setCustomAmount(event.target.value);
                    setError("");
                    setNotice("");
                  }}
                  placeholder="Enter amount"
                  className="min-w-0 flex-1 border-0 bg-transparent text-[13px] font-semibold text-[#16261d] outline-none"
                />
              </label>
            )}

            {error && (
              <p role="alert" className="mt-3 text-sm font-medium text-[#b54745]">{error}</p>
            )}

            {notice && (
              <p role="status" className="mt-3 rounded-xl border border-[#d5b98b] bg-[#fff8eb] px-3 py-3 text-xs leading-5 text-[#72552e]">
                {notice}
              </p>
            )}

            <button
              type="button"
              onClick={handleDonate}
              className="mt-4 flex h-[42px] w-full items-center justify-center gap-2 rounded-full border-0 bg-[#17653f] text-[13px] font-bold text-white shadow-[0_8px_18px_-10px_rgba(23,101,63,.7)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0f4e2f] hover:shadow-[0_12px_22px_-12px_rgba(23,101,63,.85)] active:translate-y-0 active:scale-[.985]"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                <path d="M12 21.5s-7.5-4.6-9.6-9.2C.9 8.9 2.7 5.5 6 5.5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.3 0 5.1 3.4 3.6 6.8C19.5 16.9 12 21.5 12 21.5z" />
              </svg>
              Donate now
            </button>

            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#5d6b62]">
              <svg viewBox="0 0 24 24" className="h-[12px] w-[12px] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
              <span>Payment integration pending · One-time contribution</span>
            </p>
          </div>
        </div>
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
