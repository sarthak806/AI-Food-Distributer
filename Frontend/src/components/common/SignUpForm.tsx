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
    <>
      <style>{`
        @keyframes sb-signup-in {
          from { opacity: 0; transform: translateY(18px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sb-orb-float {
          0%, 100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,-9px,0); }
        }
        .sb-signup-card { animation: sb-signup-in .65s cubic-bezier(.22,1,.36,1) both; }
        .sb-orb { animation: sb-orb-float 8s ease-in-out infinite; }
      `}</style>

      <div className="relative min-h-screen w-full overflow-auto bg-[#F7FAF5]">
        <div aria-hidden className="pointer-events-none absolute -left-40 -top-44 h-[430px] w-[430px] rounded-full bg-[#EAF3E7] opacity-80 blur-2xl sb-orb" />
        <div aria-hidden className="pointer-events-none absolute -bottom-52 -right-44 h-[540px] w-[540px] rounded-full bg-[#E8F3E4] opacity-80 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-px w-[58vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#65A25D]/20 to-transparent" />

        <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
          <form
            className={cn(
              "sb-signup-card relative w-full max-w-[520px] overflow-hidden rounded-[28px]",
              "border border-[#DCE8DA] bg-[#FAFCF9]/90 p-6 shadow-[0_30px_85px_rgba(35,65,40,0.13)]",
              "backdrop-blur-xl sm:p-8",
              "transition-shadow duration-500 hover:shadow-[0_36px_95px_rgba(35,65,40,0.16)]",
              className
            )}
            {...props}
            onSubmit={sendOtpHandler}
          >
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#EAF3E7]" />

            <div className="relative">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-2.5 grid h-[52px] w-[52px] place-items-center rounded-[16px] border border-[#D7E7D3] bg-[#EEF6EB] text-[24px] text-[#65A25D] shadow-[0_10px_24px_rgba(101,162,93,0.12)]">
                  ♥
                </div>
                <div className="font-[Space_Grotesk,sans-serif] text-[25px] font-extrabold tracking-[-0.055em] text-[#17352B]">
                  Share<span className="text-[#65A25D]">Bite</span>
                </div>
                <div className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#8A958F]">
                  Make surplus matter
                </div>
              </div>

              <div className="mb-5 text-center">
                <div className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#65A25D]">
                  Create your account
                </div>
                <h1 className="mt-1.5 font-[Space_Grotesk,sans-serif] text-[28px] font-bold leading-none tracking-[-0.045em] text-[#17352B]">
                  Join ShareBite
                </h1>
                <p className="mt-2 text-[12px] leading-5 text-[#7A8780]">
                  Choose your role and start making surplus count.
                </p>
              </div>

              {otpSent ? (
                <div className="grid gap-5 py-1">
                  <div className="rounded-2xl border border-[#DCE8DA] bg-[#F7FAF5] px-4 py-4 text-center">
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#65A25D]">
                      Verification code sent
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Clock size={17} className="text-[#65A25D]" />
                      <div
                        className={cn(
                          "font-mono text-xl font-bold",
                          timeLeft < 60 ? "text-red-500" : "text-[#17352B]"
                        )}
                      >
                        {formatTime(timeLeft)}
                      </div>
                    </div>
                    <p className="mt-1 text-[11px] leading-5 text-[#7A8780]">
                      OTP sent to{" "}
                      <span className="font-semibold text-[#17352B]">
                        {userData.email}
                      </span>
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <Label className="text-center text-[11px] font-semibold text-[#30433A]">
                      Enter your 6-character OTP
                      <sup className="text-red-500">*</sup>
                    </Label>

                    <div className="flex justify-center gap-2 sm:gap-2.5">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          maxLength={1}
                          disabled={verifying}
                          className="h-12 w-11 rounded-[13px] border-[#DCE8DA] bg-[#FBFDFC] text-center text-lg font-bold text-[#17352B] outline-none transition-all duration-200 focus:border-[#65A25D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(101,162,93,.11)]"
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="group h-[51px] w-full rounded-[14px] bg-[#336d5b] text-xs font-extrabold text-[#FAFAF7] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a5949] hover:shadow-[0_14px_28px_rgba(51,109,91,.18)] disabled:opacity-65"
                    onClick={verifyOtpHandler}
                    disabled={verifying}
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        Verify OTP & Register
                        <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between gap-4 pt-1 text-[11px] text-[#7A8780]">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="font-semibold transition-colors hover:text-[#17352B]"
                    >
                      ← Edit details
                    </button>

                    <button
                      type="button"
                      onClick={sendOtpHandler}
                      disabled={loading || verifying}
                      className="font-semibold text-[#65A25D] transition-colors hover:text-[#17352B] disabled:opacity-50"
                    >
                      {loading ? "Sending…" : "Resend OTP"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="relative mx-auto mb-1 flex h-11 w-[190px] rounded-full bg-[#336d5b] p-1 shadow-[inset_0_0_0_1px_rgba(0,0,0,.12)]">
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,.10)] transition-transform duration-300 ease-out",
                        userData.role === "NGO" && "translate-x-[calc(100%+4px)]"
                      )}
                    />
                    <button
                      type="button"
                      className={cn(
                        "relative z-10 flex-1 rounded-full text-xs font-bold transition-colors duration-300",
                        userData.role === "Donar"
                          ? "text-[#17352B]"
                          : "bg-transparent text-[#DCE7E1] hover:text-white"
                      )}
                      onClick={() =>
                        setUserData((prev) => ({
                          ...prev,
                          role: "Donar",
                          registrationNumber: undefined,
                        }))
                      }
                    >
                      Donor
                    </button>

                    <button
                      type="button"
                      className={cn(
                        "relative z-10 flex-1 rounded-full text-xs font-bold transition-colors duration-300",
                        userData.role === "NGO"
                          ? "text-[#17352B]"
                          : "bg-transparent text-[#DCE7E1] hover:text-white"
                      )}
                      onClick={() =>
                        setUserData((prev) => ({
                          ...prev,
                          role: "NGO",
                          registrationNumber: "",
                        }))
                      }
                    >
                      NGO
                    </button>
                  </div>

                  <div>
                    <Label htmlFor="name" className="mb-1.5 block text-[11px] font-extrabold text-[#30433A]">
                      Full Name<sup className="text-red-500">*</sup>
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
                      className="h-12 rounded-[13px] border-[#DCE8DA] bg-[#FBFDFC] px-3.5 text-xs text-[#17352B] placeholder:text-[#A5AFA9] transition-all duration-200 hover:border-[#C8DCC5] focus:border-[#65A25D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(101,162,93,.11)]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="mb-1.5 block text-[11px] font-extrabold text-[#30433A]">
                      Email<sup className="text-red-500">*</sup>
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
                      className="h-12 rounded-[13px] border-[#DCE8DA] bg-[#FBFDFC] px-3.5 text-xs text-[#17352B] placeholder:text-[#A5AFA9] transition-all duration-200 hover:border-[#C8DCC5] focus:border-[#65A25D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(101,162,93,.11)]"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="signup-password" className="mb-1.5 block text-[11px] font-extrabold text-[#30433A]">
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
                          className="h-12 rounded-[13px] border-[#DCE8DA] bg-[#FBFDFC] px-3.5 pr-11 text-xs text-[#17352B] placeholder:text-[#A5AFA9] transition-all duration-200 hover:border-[#C8DCC5] focus:border-[#65A25D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(101,162,93,.11)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#84908A] transition-colors hover:bg-[#EEF6EB] hover:text-[#17352B]"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {!isPasswordValid && (
                        <p className="mt-1.5 text-[10px] font-medium text-red-500">
                          {passwordErrorMessage}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="signup-confirm-password" className="mb-1.5 block text-[11px] font-extrabold text-[#30433A]">
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
                          className="h-12 rounded-[13px] border-[#DCE8DA] bg-[#FBFDFC] px-3.5 pr-11 text-xs text-[#17352B] placeholder:text-[#A5AFA9] transition-all duration-200 hover:border-[#C8DCC5] focus:border-[#65A25D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(101,162,93,.11)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#84908A] transition-colors hover:bg-[#EEF6EB] hover:text-[#17352B]"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatedInput isVisible={userData.role === "NGO"}>
                    <div className="mt-0.5">
                      <Label htmlFor="registrationNumber" className="mb-1.5 block text-[11px] font-extrabold text-[#30433A]">
                        Registration Number<sup className="text-red-500">*</sup>
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
                        className="h-12 rounded-[13px] border-[#DCE8DA] bg-[#FBFDFC] px-3.5 text-xs text-[#17352B] placeholder:text-[#A5AFA9] transition-all duration-200 hover:border-[#C8DCC5] focus:border-[#65A25D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(101,162,93,.11)]"
                      />
                    </div>
                  </AnimatedInput>

                  <Button
                    type="submit"
                    className="mt-1 h-[51px] w-full rounded-[14px] bg-[#336d5b] text-xs font-extrabold text-[#FAFAF7] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a5949] hover:shadow-[0_14px_28px_rgba(51,109,91,.18)] disabled:cursor-not-allowed disabled:opacity-65"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP…
                      </>
                    ) : (
                      <>
                        Send OTP
                        <span className="ml-1.5">→</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="mt-5 text-center text-[17px] text-[#7A8780]">
                Already have an account?{" "}
                <Link
                  to="/user/login"
                  className="font-extrabold text-[#17352B] hover:underline hover:decoration-2 text-lg transition-colors hover-underline hover:text-[#65A25D]"
                >
                  Log in
                </Link>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-medium text-[#929D96]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#65A25D]" />
                Secure account creation
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}