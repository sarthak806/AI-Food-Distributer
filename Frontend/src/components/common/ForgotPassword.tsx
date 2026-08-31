import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Clock, Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from 'notistack';

export default function ForgotPassword({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(600); // 600 seconds = 10 minutes
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Handle OTP input changes
  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`reset-otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`reset-otp-${index - 1}`)?.focus();
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (timerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      enqueueSnackbar("OTP has expired. Please request a new one.", { 
        variant: 'error',
      });
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive, timeLeft, enqueueSnackbar]);

  // Format time to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Send OTP to the user's email
  const sendOtpHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      enqueueSnackbar("Please enter your email address.", { variant: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/auth/forgot-password`, {
        email: email.trim(),
      });
      if (res.data && res.data.success) {
        setOtpSent(true);
        setTimeLeft(600);
        setTimerActive(true);
        setOtp(new Array(6).fill(""));
        enqueueSnackbar("OTP sent to your email!", { 
          variant: 'success',
        });
      } else {
        enqueueSnackbar(res.data?.message || "Failed to send reset OTP", { variant: 'error' });
      }
    } catch (error: any) {
      console.error("OTP send error:", error);
      const errMsg = error.response?.data?.message || error.response?.data?.msg || "Failed to send OTP. Please check your email address.";
      enqueueSnackbar(errMsg, { 
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and reset password
  const verifyOtpHandler = async () => {
    const enteredOtp = otp.join("").trim();
    
    if (enteredOtp.length !== 6) {
      enqueueSnackbar("Please enter a valid 6-character OTP", { 
        variant: 'warning',
      });
      return;
    }

    if (!newPassword) {
      enqueueSnackbar("Please enter a new password", { 
        variant: 'warning',
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { 
        variant: 'error',
      });
      return;
    }
    
    setVerifying(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/reset-password`,
        {
          email: email.trim(),
          otp: enteredOtp,
          newPassword,
        }
      );
      if (response.data && response.data.success) {
        enqueueSnackbar("Password reset successfully! Please login.", { 
          variant: 'success',
        });
        navigate("/user/login");
      } else {
        const errorMsg = response.data?.message || response.data?.msg || "Invalid OTP. Please try again.";
        enqueueSnackbar(errorMsg, { 
          variant: 'error',
        });
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.msg || "Failed to reset password. Please try again.";
      enqueueSnackbar(errorMsg, { 
        variant: 'error',
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6 max-w-md mx-auto", className)}
      {...props}
      onSubmit={sendOtpHandler}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to reset your password.
        </p>
      </div>

      {/* Step 1: Enter Email */}
      {!otpSent ? (
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="forgot-email">Email<sup className="text-[red]">*</sup></Label>
            <Input
              id="forgot-email"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...</> : "Send OTP"}
          </Button>
        </div>
      ) : (
        // Step 2: Enter OTP and Reset Password
        <div className="grid gap-6">
          {/* Timer Display */}
          <div className="flex items-center justify-center gap-2 py-2">
            <Clock className="text-muted-foreground" size={18} />
            <div className={`text-center font-mono text-lg ${timeLeft < 60 ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* OTP Input */}
          <div className="grid gap-4 py-2">
            <Label className="text-center">Enter 6-character OTP sent to {email}<sup className="text-[red]">*</sup></Label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`reset-otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  disabled={verifying}
                  className="w-12 h-12 text-center text-lg uppercase font-mono"
                />
              ))}
            </div>
          </div>

          {/* New Password */}
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password<sup className="text-red-500">*</sup></Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={verifying}
                required
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

          {/* Confirm Password */}
          <div className="grid gap-2">
            <Label htmlFor="confirm-new-password">Confirm Password<sup className="text-red-500">*</sup></Label>
            <Input
              id="confirm-new-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="Confirm new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={verifying}
              required
            />
          </div>

          {/* Verify OTP and Reset Password */}
          <Button type="button" className="w-full" onClick={verifyOtpHandler} disabled={verifying}>
            {verifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting Password...</> : "Verify OTP & Reset Password"}
          </Button>

          <div className="flex justify-between items-center text-xs mt-1 text-muted-foreground">
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="hover:underline text-blue-500"
            >
              ← Change email
            </button>
            <button
              type="button"
              onClick={sendOtpHandler}
              disabled={loading || verifying}
              className="hover:underline text-blue-500"
            >
              {loading ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      )}

      {/* Back to Login Link */}
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link to="/user/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}