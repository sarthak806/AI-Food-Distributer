import { ArrowRight } from "lucide-react";

export const AppUsageSection = () => {
  return (
    <section id="how-it-works" className="bg-[#fbf8f0] py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between gap-6 rounded-[18px] bg-[#00602d] px-7 py-8 text-white">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f9df91]">The bigger picture</p><h2 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-[0.98]">Your surplus can become someone's starting point.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/75">Food waste is a community problem, so we believe the solution should be community-powered too.</p></div>
          <a href="/user/login" className="hidden shrink-0 items-center gap-2 rounded-full bg-[#f9df91] px-5 py-3 text-sm font-bold text-[#10261b] sm:inline-flex">Make an impact <ArrowRight className="h-4 w-4" /></a>
        </div>
      </div>
    </section>
  );
};