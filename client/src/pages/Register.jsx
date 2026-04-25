import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration Successful! Please Login.");
      navigate("/");
    } catch (err) {
      alert("Registration Failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-soft dark:bg-slate-900 p-6 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Decorative background blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-brand-indigo/20 dark:bg-brand-indigo/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-brand-emerald/20 dark:bg-brand-emerald/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-10 rounded-3xl shadow-glass w-full max-w-md border border-white dark:border-slate-700 z-10 animate-slide-up">
        {/* Icon */}
        <div className="bg-gradient-to-br from-brand-indigo to-brand-emerald w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl mb-8 mx-auto shadow-lg shadow-brand-indigo/30 transform hover:scale-105 transition-transform duration-300">
          ✨
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Join the grocery group today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Vadde Dhanush"
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-indigo focus:border-transparent outline-none bg-white/50 dark:bg-slate-700/50 transition-all font-medium text-slate-700 dark:text-white"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-indigo focus:border-transparent outline-none bg-white/50 dark:bg-slate-700/50 transition-all font-medium text-slate-700 dark:text-white"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full p-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-indigo focus:border-transparent outline-none bg-white/50 dark:bg-slate-700/50 transition-all font-medium text-slate-700 dark:text-white"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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

          <button className="w-full bg-gradient-to-r from-brand-indigo to-brand-indigoDark text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-indigo/30 hover:-translate-y-0.5 active:translate-y-0 transition-all mt-2">
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-brand-indigo dark:text-brand-emerald font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
