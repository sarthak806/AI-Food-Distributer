import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, setUser, fetchUserData } = useAuth();

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      enqueueSnackbar("Please enter both email and password.", { variant: "warning" });
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
        throw new Error(response.data?.message || "Login failed. Please try again.");
      }

      if (response.data.token) localStorage.setItem("token", response.data.token);
      if (response.data.user) setUser(response.data.user);
      enqueueSnackbar("Login successful!", { variant: "success" });
      await fetchUserData();
      navigate(`/user/${response.data.user?.role || "Donar"}`);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Login failed. Please try again."
        : error instanceof Error ? error.message : "Login failed. Please try again.";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) navigate(`/user/${user.role}`);
  }, [user, navigate]);

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={submitHandler}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-sm text-muted-foreground">Use your email and app password to continue.</p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email<sup className="text-[red]">*</sup></Label>
          <Input id="email" type="email" value={email} placeholder="john@example.com" onChange={(event) => setEmail(event.target.value)} disabled={loading} required />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">App password<sup className="text-[red]">*</sup></Label>
            <Link to="/user/forgotPassword" className="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</Link>
          </div>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} required className="pr-10" />
            <button type="button" aria-label={showPassword ? "Hide app password" : "Show app password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : "Login"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account? <Link to="/user/signup" className="underline underline-offset-4">Sign up</Link>
      </div>
    </form>
  );
}
