import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ShoppingCart } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email");
  const [formData, setFormData] = useState({ email: "", password: "", phone: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      navigate("/dashboard");
    } catch {
      alert("Invalid Credentials");
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { phone: formData.phone });
      setOtpSent(true);
    } catch {
      alert("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        phone: formData.phone,
        otp: formData.otp,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      navigate("/dashboard");
    } catch {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
            <ShoppingCart size={14} className="text-white" />
          </div>
          <div className="leading-none">
            <p className="text-sm font-semibold text-slate-900">Grocery</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest">Manager</p>
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Welcome back</CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Sign in to manage your collaborative lists
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
              {["email", "phone"].map((method) => (
                <button
                  key={method}
                  onClick={() => { setLoginMethod(method); setOtpSent(false); }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                    loginMethod === method
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {method === "email" ? "Email" : "Mobile OTP"}
                </button>
              ))}
            </div>

            {loginMethod === "email" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600">Email address</Label>
                  <Input
                    type="email"
                    placeholder="hello@example.com"
                    className="h-9 text-sm border-slate-200"
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
                <Button type="submit" className="w-full h-9 bg-slate-900 hover:bg-slate-700 text-white text-sm mt-1">
                  Sign in
                </Button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600">Mobile number</Label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="h-9 text-sm border-slate-200"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={otpSent}
                  />
                </div>
                {otpSent ? (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Enter 6-digit OTP</Label>
                      <Input
                        type="text"
                        maxLength="6"
                        placeholder="123456"
                        className="h-9 text-sm border-slate-200 tracking-widest text-center font-mono"
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full h-9 bg-slate-900 hover:bg-slate-700 text-white text-sm">
                      Verify & Sign in
                    </Button>
                  </form>
                ) : (
                  <Button
                    onClick={handleSendOtp}
                    className="w-full h-9 bg-slate-900 hover:bg-slate-700 text-white text-sm"
                  >
                    Send OTP
                  </Button>
                )}
              </div>
            )}
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