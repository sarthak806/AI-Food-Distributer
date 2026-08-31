import { useGoogleLogin } from "@react-oauth/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from 'notistack';
import { useAuth } from "@/context/AuthContext";

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Extract user and auth functions
  const { user, setUser, fetchUserData } = useAuth();

  const googleLoginHandler = useGoogleLogin({
    scope: "openid profile email",
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_Backend_URL}/api/auth/google`,
          {
            credential: tokenResponse.access_token,
          },
          { withCredentials: true }
        );

        if (res.data && res.data.success) {
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
          }
          if (res.data.user) {
            setUser(res.data.user);
          }
          enqueueSnackbar("Google Login Successful!", { variant: "success" });
          await fetchUserData();
          const targetRole = res.data.user?.role || "Donar";
          navigate(`/user/${targetRole}`);
        } else {
          enqueueSnackbar(res.data?.message || "Google login failed", { variant: "error" });
        }
      } catch (error: any) {
        console.error("Google Auth Error:", error);
        const errorMsg = error.response?.data?.message || "Google login failed. Please try again.";
        enqueueSnackbar(errorMsg, { variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    onError: () => enqueueSnackbar("Google Login cancelled", { variant: "warning" }),
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      enqueueSnackbar("Please enter both email and password.", { variant: 'warning' });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/login`,
        { email: email.trim(), password },
        { withCredentials: true }
      );

      if (res.data && res.data.success) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        if (res.data.user) {
          setUser(res.data.user);
        }
        enqueueSnackbar("Login Successful!", { variant: 'success' });
        await fetchUserData();
        const targetRole = res.data.user?.role || "Donar";
        navigate(`/user/${targetRole}`);
      } else {
        const errorMsg = res.data?.message || res.data?.msg || "Login failed. Please try again.";
        enqueueSnackbar(errorMsg, { variant: 'error' });
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.msg || "Login failed. Please check your credentials.";
      enqueueSnackbar(errorMsg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      navigate(`/user/${user.role}`);
    }
  }, [user, navigate]);

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={submitHandler}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email<sup className="text-[red]">*</sup></Label>
          <Input
            id="email"
            type="email"
            value={email}
            placeholder="john@example.com"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">
              Password<sup className="text-[red]">*</sup>
            </Label>
            <Link
              to="/user/forgotPassword"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-transform duration-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</> : "Login"}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            or continue with
          </span>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => googleLoginHandler()}
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Login with Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/user/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}