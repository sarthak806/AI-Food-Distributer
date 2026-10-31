import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ADMIN_CREDENTIALS, ADMIN_SESSION_KEY } from "./adminCredentials";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      code.trim() !== ADMIN_CREDENTIALS.code ||
      email.trim().toLowerCase() !== ADMIN_CREDENTIALS.email ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      setError("The admin code, email, or password is incorrect.");
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
    navigate("/admin", { replace: true });
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f7faf5] px-5 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#dcebd6] opacity-70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#e8f3e4] opacity-80 blur-3xl" />
      <form onSubmit={submit} className="relative w-full max-w-md rounded-[28px] border border-[#dce8da] bg-[#fafcf9]/95 p-8 shadow-[0_30px_80px_-28px_rgba(23,53,43,0.28)] backdrop-blur-xl sm:p-10">
        <Link className="text-sm font-bold text-[#17633b] underline" to="/">Back to ShareBite</Link>
        <div className="mt-10 flex flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#eef6eb] text-2xl text-[#17633b] shadow-sm">♥</div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-[#17633b]">Restricted access</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-[#14231d]">Admin console</h1>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#536258]">This portal is for authorized platform administrators only.</p>

        <div className="mt-8 space-y-4">
          <label className="block text-sm font-bold text-[#14231d]">Admin code
            <input required value={code} onChange={(event) => setCode(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-[#c9d9c9] px-3 outline-none focus:border-[#17633b] focus:ring-2 focus:ring-[#17633b]/20" />
          </label>
          <label className="block text-sm font-bold text-[#14231d]">Admin email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-[#c9d9c9] px-3 outline-none focus:border-[#17633b] focus:ring-2 focus:ring-[#17633b]/20" />
          </label>
          <label className="block text-sm font-bold text-[#14231d]">Password
            <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-[#c9d9c9] px-3 outline-none focus:border-[#17633b] focus:ring-2 focus:ring-[#17633b]/20" />
          </label>
        </div>

        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}
        <button type="submit" className="mt-6 min-h-11 w-full rounded-full bg-[#17633b] px-5 font-bold text-white transition hover:bg-[#22784a]">Sign in to admin</button>
        <p className="mt-5 text-xs leading-5 text-[#536258]">Temporary demo authentication: credentials are defined in <code>src/admin/adminCredentials.ts</code>.</p>
      </form>
    </main>
  );
}
