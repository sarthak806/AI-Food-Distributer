import { Link } from "react-router-dom";

type LegalPageProps = { kind: "privacy" | "terms" };

export default function LegalPage({ kind }: LegalPageProps) {
  const privacy = kind === "privacy";
  return (
    <main className="min-h-screen bg-[#f7faf5] px-5 py-12 text-[#14231d] md:px-20">
      <div className="mx-auto max-w-3xl">
        <Link className="font-bold text-[#17633b] underline" to="/">Back to ShareBite</Link>
        <h1 className="mt-8 font-serif text-5xl font-bold">{privacy ? "Privacy Policy" : "Terms & Conditions"}</h1>
        <p className="mt-4 text-sm text-[#536258]">Last updated: [DATE]</p>
        {privacy ? (
          <>
            <Section title="Data we collect">We may collect account details, contact information, donation details, location information, and technical usage data needed to provide ShareBite.</Section>
            <Section title="Cookies and local storage">Essential storage keeps you signed in and remembers your cookie choice. Optional analytics cookies are disabled until you consent.</Section>
            <Section title="Third parties">We may use infrastructure, email, maps, image hosting, and analytics providers. Replace this placeholder with the specific providers and links used by [COMPANY NAME].</Section>
            <Section title="Your rights">You may request access, correction, export, or deletion of your personal information, subject to applicable law.</Section>
            <Section title="Contact">For privacy questions, contact [sarthakpandey346@gmail.com].</Section>
          </>
        ) : (
          <>
            <Section title="Usage rules">Use ShareBite lawfully, provide accurate information, protect your account, and do not misuse the platform or endanger recipients.</Section>
            <Section title="Liability">ShareBite is provided as a coordination service. [ShareBite] is not responsible for losses arising from user-provided information, food handling, or service interruptions to the extent allowed by law.</Section>
            <Section title="Intellectual property">The ShareBite name, branding, software, and original content belong to [COMPANY NAME] or its licensors. Do not copy or reuse them without permission.</Section>
            <Section title="Governing law">These terms are governed by the laws of [JURISDICTION], without regard to conflict-of-law rules.</Section>
            <Section title="Contact">Questions about these terms may be sent to [CONTACT EMAIL].</Section>
          </>
        )}
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return <section className="mt-8"><h2 className="font-serif text-2xl font-bold">{title}</h2><p className="mt-2 leading-7 text-[#536258]">{children}</p></section>;
}
