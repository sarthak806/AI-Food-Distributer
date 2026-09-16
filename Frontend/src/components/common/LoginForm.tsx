import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, setUser, fetchUserData } = useAuth();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      enqueueSnackbar("Fill in both fields and you're good.", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/login`,
        { email: email.trim(), password },
        { withCredentials: true }
      );
      if (!response.data?.success) {
        throw new Error(response.data?.message || "That didn't work — try again.");
      }

      if (response.data.token) localStorage.setItem("token", response.data.token);
      if (response.data.user) setUser(response.data.user);
      enqueueSnackbar("You're in.", { variant: "success" });
      await fetchUserData();
      navigate(`/user/${response.data.user?.role || "Donar"}`);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "That didn't work — try again."
        : error instanceof Error ? error.message : "That didn't work — try again.";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) navigate(`/user/${user.role}`);
  }, [user, navigate]);

  // magnetic button — nudges toward the cursor within its own bounds
  const handleBtnMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (!el || loading) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.12}px, ${y * 0.3}px)`;
  };
  const resetBtn = () => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0,0)";
  };

  return (
    <>
      <style>{`
        @keyframes sb-login-in {
          from { opacity: 0; transform: translateY(18px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sb-soft-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(3deg); }
        }
        @keyframes sb-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(101,162,93,.12); }
          50% { box-shadow: 0 0 0 9px rgba(101,162,93,0); }
        }
        .sb-login-card {
          animation: sb-login-in .65s cubic-bezier(.22,1,.36,1) both;
        }
        .sb-login-mark {
          animation: sb-soft-float 5s ease-in-out infinite;
        }
        .sb-secure-dot {
          animation: sb-pulse 2.4s ease-out infinite;
        }
      `}</style>

      <div className="relative min-h-screen w-full overflow-hidden bg-[#F7FAF5]">
        {/* subtle ShareBite background — no food image, no fake stats */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-36 h-96 w-96 rounded-full bg-[#EAF3E7] opacity-70 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-44 -right-36 h-[34rem] w-[34rem] rounded-full bg-[#E8F3E4] opacity-75 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-px w-[55vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#65A25D]/20 to-transparent"
        />

        <div className="relative flex min-h-screen items-center justify-center px-5 py-10">
          <form
            className={cn(
              "sb-login-card relative w-full max-w-[440px] overflow-hidden rounded-[28px]",
              "border border-[#DCE8DA] bg-[#FAFCF9]/90 p-7 shadow-[0_30px_80px_-28px_rgba(23,53,43,0.28)]",
              "backdrop-blur-xl sm:p-9",
              "transition-shadow duration-500 hover:shadow-[0_34px_90px_-25px_rgba(23,53,43,0.32)]",
              className
            )}
            {...props}
            onSubmit={submitHandler}
          >
            {/* decorative brand shape */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#EAF3E7]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-8 top-8 h-2 w-2 rounded-full bg-[#65A25D]/35"
            />

            <div className="relative">
              {/* Brand */}
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="sb-login-mark mb-3 grid h-[58px] w-[58px] place-items-center rounded-[18px] border border-[#D7E7D3] bg-[#EEF6EB] text-[#65A25D] shadow-[0_10px_28px_rgba(101,162,93,0.12)]">
                  <span className="text-[27px] leading-none">♥</span>
                </div>

                <div className="font-[Space_Grotesk,sans-serif] text-[28px] font-extrabold tracking-[-0.055em] text-[#17352B]">
                  Share<span className="text-[#65A25D]">Bite</span>
                </div>

                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A958F]">
                  Make surplus matter
                </div>
              </div>

              {/* Heading */}
              <div className="mb-7 text-center">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#65A25D]">
                  Welcome back
                </div>

                <h1 className="mt-2 font-[Space_Grotesk,sans-serif] text-[30px] font-bold leading-none tracking-[-0.045em] text-[#17352B]">
                  Log in to ShareBite
                </h1>

                <p className="mt-2 text-[13px] leading-6 text-[#7A8780]">
                  Continue making every surplus meal count.
                </p>
              </div>

              {/* Fields — same state and values as the original */}
              <div className="flex flex-col gap-5">
                <FloatingField
                  id="email"
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={setEmail}
                  disabled={loading}
                  delay="80ms"
                />

                <div className="sp-field-in" style={{ animationDelay: "140ms" }}>
                  <div className="relative">
                    <FloatingField
                      id="password"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      value={password}
                      onChange={setPassword}
                      disabled={loading}
                      trailingPad
                    />

                    <button
                      type="button"
                      aria-label={showPassword ? "hide password" : "show password"}
                      onClick={() => setShowPassword((v) => !v)}
                      disabled={loading}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#84908A] transition-all duration-200 hover:bg-[#EEF6EB] hover:text-[#17352B] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span
                        className="inline-block transition-transform duration-300"
                        style={{ transform: showPassword ? "rotateX(180deg)" : "rotateX(0deg)" }}
                      >
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </span>
                    </button>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <Link
                      to="/user/forgotPassword"
                      className="group relative text-[15px] font-semibold text-[#8b9c93] transition-colors hover:text-[#194033]"
                    >
                      Forgot password?
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#65A25D] transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                  </div>
                </div>

                <Button
                  ref={btnRef}
                  type="submit"
                  disabled={loading}
                  onMouseMove={handleBtnMove}
                  onMouseLeave={resetBtn}
                  className={cn(
                    "group relative mt-1 h-[53px] w-full overflow-hidden rounded-[15px] bg-[#336d5b] text-[#FAFAF7]",
                    "font-semibold shadow-none transition-[transform,box-shadow,background] duration-200 ease-out",
                    "hover:bg-[#3b846d] hover:shadow-[0_14px_30px_-12px_rgba(23,53,43,0.65)]",
                    "disabled:cursor-not-allowed disabled:opacity-65",
                    "sp-field-in"
                  )}
                  style={{ animationDelay: "200ms" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging in…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Log in
                      <ArrowRight
                        size={16}
                        className="translate-x-0 opacity-70 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                      />
                    </span>
                  )}
                </Button>
              </div>

              {/* Signup */}
              <div
                className="mt-6 text-center text-[17px]  text-[#85938c] sp-field-in"
                style={{ animationDelay: "260ms" }}
              >
                Don&apos;t have an account?{" "}
                <Link
                  to="/user/signup"
                  className="group relative font-bold text-xl text-[#1c3e33]"
                >
                  Sign up
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#65A25D] transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </div>

              {/* Trust line */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-medium text-[#929D96]">
                <span className="sb-secure-dot h-1.5 w-1.5 rounded-full bg-[#65A25D]" />
                Secure authentication
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function FloatingField({
  id,
  type,
  label,
  value,
  onChange,
  disabled,
  trailingPad,
  delay,
}: {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  trailingPad?: boolean;
  delay?: string;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className="relative sp-field-in" style={delay ? { animationDelay: delay } : undefined}>
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "peer w-full rounded-[14px] border border-[#DDE8DC] bg-[#FBFDFC] px-3.5 pb-2 pt-5 text-[13px] text-[#17352B] outline-none",
          "transition-[border-color,box-shadow,background] duration-200",
          "hover:border-[#C7DCC3] focus:border-[#65A25D] focus:bg-white",
          "focus:shadow-[0_0_0_4px_rgba(101,162,93,0.11)]",
          trailingPad && "pr-12"
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-3.5 text-[#8A958F] transition-all duration-200",
          floated
            ? "top-1.5 text-[10px] font-semibold text-[#65A25D]"
            : "top-1/2 -translate-y-1/2 text-[13px]"
        )}
      >
        {label}
      </label>
    </div>
  );
}