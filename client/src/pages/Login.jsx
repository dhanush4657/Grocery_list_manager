import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email"); // email or phone
  const [formData, setFormData] = useState({ email: "", password: "", phone: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email: formData.email, password: formData.password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { phone: formData.phone });
      setOtpSent(true);
      alert("OTP Sent! Check your backend console.");
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { phone: formData.phone, otp: formData.otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-soft dark:bg-slate-900 p-6 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-emerald/20 dark:bg-brand-emerald/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-brand-indigo/20 dark:bg-brand-indigo/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-10 rounded-3xl shadow-glass w-full max-w-md border border-white dark:border-slate-700 z-10 animate-slide-up">
        <div className="bg-gradient-to-br from-brand-emerald to-brand-indigo w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl mb-8 mx-auto shadow-lg shadow-brand-indigo/30 transform hover:scale-105 transition-transform duration-300">
          🛒
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white text-center mb-2 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">Log in to manage your collaborative lists</p>

        {/* Login Method Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl mb-8">
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${loginMethod === 'email' ? 'bg-white dark:bg-slate-800 text-brand-indigo dark:text-brand-emerald shadow-sm' : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            onClick={() => setLoginMethod('email')}
          >
            Email
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${loginMethod === 'phone' ? 'bg-white dark:bg-slate-800 text-brand-emerald dark:text-brand-emerald shadow-sm' : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
          >
            Mobile OTP
          </button>
        </div>

        {loginMethod === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-indigo focus:border-transparent outline-none bg-white/50 dark:bg-slate-700/50 transition-all font-medium text-slate-700 dark:text-white"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full p-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-indigo focus:border-transparent outline-none bg-white/50 dark:bg-slate-700/50 transition-all font-medium text-slate-700 dark:text-white"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-brand-indigo to-brand-indigoDark text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-indigo/30 hover:-translate-y-0.5 active:translate-y-0 transition-all">
              Sign In with Email
            </button>
          </form>
        ) : (
          <div className="animate-fade-in space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Mobile Number</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-emerald focus:border-transparent outline-none bg-white/50 dark:bg-slate-700/50 transition-all font-medium text-slate-700 dark:text-white"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={otpSent}
              />
            </div>
            
            {otpSent ? (
              <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="123456"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-emerald focus:border-transparent outline-none bg-white/50 dark:bg-slate-700/50 transition-all font-bold tracking-[0.5em] text-center text-slate-800 dark:text-white text-lg"
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    required
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-brand-emerald to-green-600 text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-emerald/30 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                  Verify & Login
                </button>
              </form>
            ) : (
              <button 
                onClick={handleSendOtp}
                className="w-full bg-slate-800 dark:bg-slate-700 text-white p-4 rounded-xl font-bold hover:bg-slate-900 dark:hover:bg-slate-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Send OTP
              </button>
            )}
          </div>
        )}

        <p className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
          New here?{" "}
          <Link to="/register" className="text-brand-indigo dark:text-brand-emerald font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
