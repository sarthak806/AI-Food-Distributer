import React from "react";
import { landingIcons } from "./landingIcons";

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section
      id="home"
      className={`relative mx-auto grid min-h-[680px] max-w-[1400px] scroll-mt-24 items-center gap-8 overflow-hidden bg-[#f7faf5] px-5 py-16 text-[#14231d] md:grid-cols-[.85fr_1.15fr] md:gap-16 md:px-12 lg:gap-32 ${className || ""}`}
    >
      <div className="max-w-[540px] animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="inline-flex items-center gap-2 text-[.68rem] font-bold uppercase tracking-[.14em] text-[#17633b]">
          <span className="h-2 w-2 rounded-full bg-[#53aa6a]" /> AI-powered food redistribution
        </div>
        <h1 className="my-5 font-sans text-[clamp(3.4rem,7vw,6.8rem)] font-bold leading-[.92] tracking-[-.05em]">
          Waste less.
          <br />
          <em className="text-[#65A25D] not-italic">Feed more.</em>
          <br />
          Move smarter.
        </h1>
        <p className="max-w-[500px] text-base leading-8 text-[#718078]">
          ShareBite connects surplus food with the people and organizations that can put it to work — quickly, safely, and intelligently.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            className="inline-flex items-center gap-2 rounded-full bg-[#17633b] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#22784a] hover:shadow-lg"
            href="/user/login"
          >
            Start sharing {landingIcons.arrow}
          </a>

          <a
            className="inline-flex items-center gap-2 py-3 text-sm font-bold text-[#14231d] transition hover:gap-4 hover:text-[#da7848]"
            href="#how-it-works"
          >
            See how it works <span>↓</span>
          </a>
        </div>

        <div className="mt-8 flex items-center gap-3 text-xs text-[#718078]">
          <span className="flex">
            <i className="h-7 w-7 rounded-full border-2 border-[#f7faf5] bg-[#89a878]" />
            <i className="-ml-2 h-7 w-7 rounded-full border-2 border-[#f7faf5] bg-[#efbd70]" />
            <i className="-ml-2 h-7 w-7 rounded-full border-2 border-[#f7faf5] bg-[#8d9ab6]" />
          </span>
          Built for donors, NGOs &amp; communities
        </div>
      </div>

      <div className="relative grid min-h-[510px] place-items-center animate-in fade-in zoom-in-95 duration-1000">
        <div className="absolute h-72 w-72 rounded-full bg-[#d7edca] opacity-60 blur-2xl" />
        <div className="relative z-10 w-full max-w-[620px] rounded-[1.4rem] border border-[#c9d9c9] bg-white/90 p-5 shadow-[0_2rem_5rem_rgba(37,68,45,.12)] transition duration-500 hover:-translate-y-2 hover:rotate-[.35deg] hover:shadow-[0_2.4rem_6rem_rgba(37,68,45,.18)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[.68rem] font-bold uppercase tracking-[.14em] text-[#17633b]">SHAREBITE / LIVE OVERVIEW</span>
              <h3 className="mt-1 font-serif text-xl">Redistribution network</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#17633b]">
              <span className="h-2 w-2 rounded-full bg-[#53aa6a]" />
              Live system
            </div>
          </div>

          <div className="relative mt-5 h-[230px] overflow-hidden rounded-2xl border border-[#c9d9c9] bg-[#eef5e9] bg-[linear-gradient(#cfe0ce_1px,transparent_1px),linear-gradient(90deg,#cfe0ce_1px,transparent_1px)] bg-[size:40px_40px]">
            {/* connection path + moving pulse dot */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                id="route-path"
                d="M 13 76 Q 30 40 47 30 Q 65 20 87 74"
                fill="none"
                stroke="#a9c8a9"
                strokeWidth="0.6"
                strokeDasharray="2 2"
                className="animate-pulse"
              />
              <circle r="1.4" fill="#17633b">
                <animateMotion dur="4s" repeatCount="indefinite" path="M 13 76 Q 30 40 47 30 Q 65 20 87 74" />
              </circle>
            </svg>

            <span className="absolute bottom-8 left-[13%] z-10 grid h-9 w-9 place-items-center rounded-full bg-[#17633b] text-white shadow-[0_0_0_7px_rgba(23,99,59,.12)]">
              {landingIcons.heart}
            </span>
            <span className="absolute left-[47%] top-14 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#df824c] text-white shadow-[0_0_0_7px_rgba(223,130,76,.12)]">
              {landingIcons.users}
            </span>
            <span className="absolute bottom-9 right-[13%] z-10 grid h-9 w-9 place-items-center rounded-full bg-[#64799e] text-white shadow-[0_0_0_7px_rgba(100,121,158,.12)]">
              {landingIcons.admin}
            </span>

            <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 text-[.68rem] font-bold text-[#17633b]">
              Smart routing ●
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f1f6ee] p-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#dcebd6] text-[#17633b]">{landingIcons.spark}</div>
            <div className="flex-1">
              <span className="text-[.68rem] font-bold uppercase tracking-[.14em] text-[#17633b]">SYSTEM STATUS</span>
              <strong className="block text-sm">Awaiting live data</strong>
              <p className="text-[.68rem] text-[#718078]">No donations connected yet. Your real metrics will appear here.</p>
            </div>
            <span className="text-xs font-bold text-[#17633b]">● Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;