import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7faf5] px-5 text-center text-[#14231d]">
      <div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#17633b]">404</p><h1 className="mt-3 font-serif text-5xl font-bold">Page not found</h1><p className="mt-4 text-[#536258]">The page you requested does not exist.</p><Link className="mt-7 inline-flex min-h-11 items-center rounded-full bg-[#17633b] px-6 font-bold text-white" to="/">Return home</Link></div>
    </main>
  );
}
