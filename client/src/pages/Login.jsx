import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ShoppingCart, Mail, ArrowLeft, RotateCcw } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const API = "http://localhost:5000/api/auth";

const OtpInput = ({ value, onChange }) => {
  const refs = useRef([]);
  const vals = value.split("");

  const handleKey = (e, i) => {
    if (e.key === "Backspace") {
      if (vals[i]) {
        const next = [...vals]; next[i] = ""; onChange(next.join(""));
      } else if (i > 0) refs.current[i - 1].focus();
    }
  };

  const handleChange = (e, i) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    const next = [...vals]; next[i] = char; onChange(next.join(""));
    if (i < 5) refs.current[i + 1].focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(text.padEnd(6, "").slice(0, 6));
    refs.current[Math.min(text.length, 5)].focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={vals[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          className="w-10 h-11 text-center text-lg font-semibold border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
        />
      ))}
    </div>
  );
};

const useCountdown = (seconds) => {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const id = setInterval(() => setLeft((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [left]);
  return { left, start: () => setLeft(seconds) };
};

const Logo = () => (
  <div className="flex items-center justify-center gap-2 mb-8">
    <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
      <ShoppingCart size={14} className="text-white" />
    </div>
    <div className="leading-none">
      <p className="text-sm font-semibold text-slate-900">Grocery</p>
      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Manager</p>
    </div>
  </div>
);

const Login = () => {
  const [step, setStep] = useState("creds"); // "creds" | "otp"
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { left: countdown, start: startCountdown } = useCountdown(60);
  const navigate = useNavigate();

  // Step 1 — email + password → sends OTP to email
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/login`, formData);
      // Demo bypass: backend returns token directly, no OTP step needed
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        navigate("/dashboard");
        return;
      }
      startCountdown();
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify the emailed OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return setError("Please enter all 6 digits.");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/verify-login-otp`, { email: formData.email, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid or expired OTP.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError("");
    try {
      await axios.post(`${API}/resend-otp`, { email: formData.email, purpose: "login" });
      startCountdown();
      setOtp("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to resend. Try again.");
    }
  };

  // ── OTP verification screen ──
  if (step === "otp") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Logo />
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <button
                onClick={() => { setStep("creds"); setOtp(""); setError(""); }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-3 w-fit"
              >
                <ArrowLeft size={12} /> Back
              </button>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                <Mail size={18} className="text-slate-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">Check your email</CardTitle>
              <CardDescription className="text-slate-500 text-sm">
                We sent a login code to{" "}
                <span className="font-medium text-slate-700">{formData.email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-5">
                <OtpInput value={otp} onChange={setOtp} />
                {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                <Button
                  type="submit"
                  className="w-full h-9 bg-slate-900 hover:bg-slate-700 text-white text-sm"
                  disabled={loading || otp.length < 6}
                >
                  {loading ? "Verifying…" : "Verify & Sign in"}
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  Didn't receive it?{" "}
                  {countdown > 0 ? (
                    <span className="text-slate-400">Resend in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-slate-900 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <RotateCcw size={11} /> Resend OTP
                    </button>
                  )}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Credentials screen ──
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Logo />
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Welcome back</CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Sign in to manage your collaborative lists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Email address</Label>
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  className="h-9 text-sm border-slate-200"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-9 text-sm border-slate-200 pr-9"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full h-9 bg-slate-900 hover:bg-slate-700 text-white text-sm mt-1"
                disabled={loading}
              >
                {loading ? "Sending OTP…" : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <Separator />
          <CardFooter className="pt-4">
            <p className="text-center w-full text-xs text-slate-500">
              New here?{" "}
              <Link to="/register" className="text-slate-900 font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;