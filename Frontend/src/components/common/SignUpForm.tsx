import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Clock, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AnimatedInput from "@/Animations/FormDiv";
import { useSnackbar } from 'notistack';

// Auth context
import { useAuth } from "@/context/AuthContext";

interface UserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "Donar" | "NGO";
  registrationNumber?: string;
}

export default function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { user, setUser, fetchUserData } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(600); // 600 seconds = 10 minutes
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Donar",
  });

  // Password validation state
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");

  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (timerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      enqueueSnackbar("OTP has expired. Please request a new OTP.", { 
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

  // Password validation rules
  const validatePassword = (password: string): boolean => {
    const minLength = 6;
    if (password.length < minLength) {
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      return false;
    }
    setPasswordErrorMessage("");
    return true;
  };

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      setIsPasswordValid(validatePassword(value));
    }
  };

  const sendOtpHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!userData.name.trim() || !userData.email.trim() || !userData.password) {
      enqueueSnackbar("Please fill in all required fields.", { variant: 'warning' });
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { 
        variant: 'error',
      });
      return;
    }

    if (!validatePassword(userData.password)) {
      enqueueSnackbar(passwordErrorMessage || "Password does not meet requirements", { 
        variant: 'error',
      });
      return;
    }
    
    if (userData.role === "NGO" && !userData.registrationNumber?.trim()) {
      enqueueSnackbar("Registration number is required for NGO accounts", { 
        variant: 'warning',
      });
      return;
    }
    
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_Backend_URL}/api/auth/send-otp`, {
        ...userData,
        email: userData.email.trim(),
        name: userData.name.trim(),
      });

      if (res.data && res.data.success) {
        setOtpSent(true);
        setTimeLeft(600);
        setTimerActive(true);
        setOtp(new Array(6).fill(""));
        enqueueSnackbar("OTP sent to your email! Please check your inbox.", { 
          variant: 'success',
        });
      } else {
        enqueueSnackbar(res.data?.message || "Failed to send OTP", { variant: 'error' });
      }
    } catch (error: any) {
      console.error("OTP send error:", error);
      const errMsg = error.response?.data?.message || "Failed to send OTP. Please check your details.";
      enqueueSnackbar(errMsg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async () => {
    const enteredOtp = otp.join("").trim();
    
    if (enteredOtp.length !== 6) {
      enqueueSnackbar("Please enter a valid 6-character OTP", { 
        variant: 'warning',
      });
      return;
    }

    setVerifying(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/auth/verify-otp`,
        { 
          userData: {
            ...userData,
            email: userData.email.trim(),
            name: userData.name.trim(),
          }, 
          otp: enteredOtp 
        },
        { withCredentials: true }
      );
      
      if (response.data && response.data.success) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        if (response.data.user) {
          setUser(response.data.user);
        }
        enqueueSnackbar("Registration Successful!", { 
          variant: 'success',
        });
        await fetchUserData();
        const targetRole = response.data.user?.role || userData.role || "Donar";
        navigate(`/user/${targetRole}`);
      } else {
        enqueueSnackbar(response.data?.message || "Failed to verify OTP", { 
          variant: 'error',
        });
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      const errMsg = error.response?.data?.message || "Failed to verify OTP. Please try again.";
      enqueueSnackbar(errMsg, { 
        variant: 'error',
      });
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      navigate(`/user/${user.role}`);
    }
  }, [user, navigate]);

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={sendOtpHandler}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign Up to your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to create an account.
        </p>
      </div>

      {/* Show OTP Input if OTP is Sent */}
      {otpSent ? (
        <div className="grid gap-4 py-2">
          {/* Timer Display */}
          <div className="flex items-center justify-center gap-2 py-2">
            <Clock className="text-muted-foreground" size={18} />
            <div className={`text-center font-mono text-lg ${timeLeft < 60 ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="py-2 grid gap-5">
            <Label className="text-center">
              Enter 6-character OTP sent to {userData.email}<sup className="text-[red]">*</sup>
            </Label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
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

          <Button type="button" className="w-full" onClick={verifyOtpHandler} disabled={verifying}>
            {verifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify OTP & Register"}
          </Button>

          <div className="flex justify-between items-center text-xs mt-2 text-muted-foreground">
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="hover:underline text-blue-500"
            >
              ← Edit details
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
      ) : (
        <div className="grid gap-6">
          {/* Role Selector */}
          <div className="mx-auto flex gap-2 p-1 bg-[#111111] rounded-full max-w-max">
            <Button
              type="button"
              className={`rounded-full px-4 py-1 hover:bg-[#333] transition-all duration-100 ${
                userData.role === "Donar" ? "bg-[#444] text-white" : "bg-transparent text-gray-300"
              }`}
              onClick={() =>
                setUserData((prev) => ({
                  ...prev,
                  role: "Donar",
                  registrationNumber: undefined,
                }))
              }
            >
              Donor
            </Button>
            <Button
              type="button"
              className={`rounded-full px-4 py-1 hover:bg-[#333] transition-all duration-100 ${
                userData.role === "NGO" ? "bg-[#444] text-white" : "bg-transparent text-gray-300"
              }`}
              onClick={() =>
                setUserData((prev) => ({
                  ...prev,
                  role: "NGO",
                  registrationNumber: "",
                }))
              }
            >
              NGO
            </Button>
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">
              Full Name<sup className="text-[red]">*</sup>
            </Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={userData.name}
              placeholder="John Doe"
              onChange={changeHandler}
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="signup-email">
              Email<sup className="text-[red]">*</sup>
            </Label>
            <Input
              id="signup-email"
              type="email"
              name="email"
              value={userData.email}
              placeholder="john@example.com"
              onChange={changeHandler}
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="signup-password">
              Password<sup className="text-red-500">*</sup>
            </Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={changeHandler}
                disabled={loading}
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
            {!isPasswordValid && (
              <p className="text-sm text-red-500 mt-1">{passwordErrorMessage}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="grid gap-2">
            <Label htmlFor="signup-confirm-password">
              Confirm Password<sup className="text-red-500">*</sup>
            </Label>
            <div className="relative">
              <Input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={changeHandler}
                disabled={loading}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-transform duration-200"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Registration Number (Only for NGO) */}
          <AnimatedInput isVisible={userData.role === "NGO"}>
            <div className="grid gap-2 mt-2">
              <Label htmlFor="registrationNumber">
                Registration Number<sup className="text-[red]">*</sup>
              </Label>
              <Input
                id="registrationNumber"
                type="text"
                name="registrationNumber"
                value={userData.registrationNumber || ""}
                onChange={changeHandler}
                disabled={loading}
                placeholder="e.g. NGO-12345-IN"
                required={userData.role === "NGO"}
              />
            </div>
          </AnimatedInput>

          {/* Send OTP Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...</> : "Send OTP"}
          </Button>
        </div>
      )}

      {/* Login Link */}
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/user/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}