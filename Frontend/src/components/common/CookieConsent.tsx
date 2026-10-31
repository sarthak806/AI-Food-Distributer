import { useEffect, useState } from "react";

const CONSENT_KEY = "sharebite-cookie-consent";

export default function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(localStorage.getItem(CONSENT_KEY));
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;
    const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
    const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    if (measurementId) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
      window.gtag("js", new Date());
      window.gtag("config", measurementId);
      return () => script.remove();
    }
    if (plausibleDomain) {
      const script = document.createElement("script");
      script.defer = true;
      script.dataset.domain = plausibleDomain;
      script.src = "https://plausible.io/js/script.js";
      document.head.appendChild(script);
      return () => script.remove();
    }
  }, [consent]);

  const choose = (value: "accepted" | "rejected") => {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  if (consent) return null;
  return (
    <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-[#c9d9c9] bg-white p-5 text-[#14231d] shadow-2xl sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm leading-6">
        We use essential storage to run ShareBite. Optional analytics only load after you consent.{" "}
        <a className="font-bold underline" href="/privacy">Read our Privacy Policy</a>.
      </p>
      <div className="flex shrink-0 gap-3">
        <button type="button" className="min-h-11 rounded-full border border-[#17633b] px-4 text-sm font-bold" onClick={() => choose("rejected")}>Essential only</button>
        <button type="button" className="min-h-11 rounded-full bg-[#17633b] px-4 text-sm font-bold text-white" onClick={() => choose("accepted")}>Accept analytics</button>
      </div>
    </aside>
  );
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
