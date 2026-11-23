import { useEffect, useState } from "react";

interface LoginTransitionProps {
  role: "NGO" | "Donar";
}

export default function LoginTransition({ role }: LoginTransitionProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f7faf5]"
      role="status"
      aria-live="polite"
      aria-label={`Opening ${role === "NGO" ? "NGO" : "donor"} dashboard`}
    >
      <style>{`
        @keyframes sb-login-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(112px); }
        }
        @keyframes sb-login-box-a {
          0%, 18% { transform: rotate(0deg) scale(1); }
          28%, 100% { transform: rotate(-180deg) scale(1); }
        }
        @keyframes sb-login-box-b {
          0%, 28% { transform: rotate(0deg) scale(1); }
          38%, 100% { transform: rotate(-180deg) scale(1); }
        }
        @keyframes sb-login-box-c {
          0%, 38% { transform: rotate(0deg) scale(1); }
          48%, 100% { transform: rotate(-180deg) scale(1); }
        }
        @keyframes sb-login-box-d {
          0%, 48% { transform: rotate(0deg) scale(1); }
          58%, 100% { transform: rotate(-180deg) scale(1); }
        }
        @keyframes sb-login-squish-a {
          0%, 8% { transform: scale(1); transform-origin: center bottom; }
          18% { transform: scale(1.3, .7); transform-origin: center bottom; }
          28%, 100% { transform: scale(1); transform-origin: center top; }
        }
        @keyframes sb-login-squish-b {
          0%, 18% { transform: scale(1); transform-origin: center bottom; }
          28% { transform: scale(1.3, .7); transform-origin: center bottom; }
          38%, 100% { transform: scale(1); transform-origin: center top; }
        }
        @keyframes sb-login-squish-c {
          0%, 28% { transform: scale(1); transform-origin: center bottom; }
          38% { transform: scale(1.3, .7); transform-origin: center bottom; }
          48%, 100% { transform: scale(1); transform-origin: center top; }
        }
        @keyframes sb-login-squish-d {
          0%, 38% { transform: scale(1); transform-origin: center bottom; }
          48% { transform: scale(1.3, .7); transform-origin: center bottom; }
          58%, 100% { transform: scale(1); transform-origin: center top; }
        }
        @keyframes sb-login-fade {
          0%, 55% { opacity: 0; transform: translateY(8px); }
          75%, 100% { opacity: 1; transform: translateY(0); }
        }
        .sb-login-boxes { width: 250px; display: flex; justify-content: space-between; align-items: center; position: relative; }
        .sb-login-box { width: 33px; height: 33px; position: relative; border-radius: 15%; }
        .sb-login-box::after { content: ""; position: absolute; inset: 0; border-radius: 15%; box-shadow: 0 8px 18px rgba(23,99,59,.16); }
        .sb-login-box:nth-child(1) { animation: sb-login-slide 1.4s ease-in-out 1 alternate; }
        .sb-login-box:nth-child(1)::after { background: #65a25d; animation: sb-login-squish-a 1.4s ease-in-out 1; }
        .sb-login-box:nth-child(2) { animation: sb-login-box-a 1.4s ease-in-out 1 alternate; }
        .sb-login-box:nth-child(2)::after { background: #17633b; animation: sb-login-squish-a 1.4s ease-in-out 1; }
        .sb-login-box:nth-child(3) { animation: sb-login-box-b 1.4s ease-in-out 1 alternate; }
        .sb-login-box:nth-child(3)::after { background: #3d8060; animation: sb-login-squish-b 1.4s ease-in-out 1; }
        .sb-login-box:nth-child(4) { animation: sb-login-box-c 1.4s ease-in-out 1 alternate; }
        .sb-login-box:nth-child(4)::after { background: #89ad78; animation: sb-login-squish-c 1.4s ease-in-out 1; }
        .sb-login-box:nth-child(5) { animation: sb-login-box-d 1.4s ease-in-out 1 alternate; }
        .sb-login-box:nth-child(5)::after { background: #b2d0a2; animation: sb-login-squish-d 1.4s ease-in-out 1; }
        .sb-login-status { animation: sb-login-fade 1.4s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .sb-login-boxes, .sb-login-box, .sb-login-box::after, .sb-login-status { animation: none !important; }
        }
      `}</style>

      <div className="flex flex-col items-center">
        <div className="sb-login-boxes" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((box) => (
            <span className="sb-login-box" key={box} />
          ))}
        </div>
        <p className="sb-login-status mt-8 text-sm font-bold tracking-[.08em] text-[#315d3b]">
          OPENING {role === "NGO" ? "NGO" : "DONOR"} DASHBOARD
        </p>
      </div>
    </div>
  );
}
