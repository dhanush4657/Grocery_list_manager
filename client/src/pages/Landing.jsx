import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Users, Zap, Shield, ArrowRight, CheckCircle } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200 overflow-x-hidden selection:bg-brand-emerald/30">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-emerald/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-indigo/20 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-24 py-6">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-brand-emerald w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-emerald/30 transform -rotate-12">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.06 19.43 4 16.05 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.05 16.94 19.43 13 19.93V15H11V19.93ZM13 13H15L12 9L9 13H11V15H13V13Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="tracking-tight text-white font-extrabold text-xl leading-tight">Grocery</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Manager</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/login")} className="text-sm font-bold hover:text-white transition-colors">Sign In</button>
          <button onClick={() => navigate("/register")} className="bg-brand-emerald text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-emerald/30 hover:bg-emerald-400 transition-all">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald"></span>
          </span>
          Grocery Management Reimagined
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6 animate-slide-up">
          Organize Your Shopping <br className="hidden md:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand-indigo">Like A Pro.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium animate-slide-up" style={{animationDelay: '100ms'}}>
          The smartest way to plan, collaborate, and manage your grocery lists. Built for teams, families, and individuals who value efficiency and design.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{animationDelay: '200ms'}}>
          <button onClick={() => navigate("/register")} className="w-full sm:w-auto bg-brand-emerald text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-emerald/20 hover:-translate-y-1 hover:shadow-brand-emerald/40 transition-all flex items-center justify-center gap-2">
            Start for free <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate("/login")} className="w-full sm:w-auto bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-700 transition-all">
            Login to Workspace
          </button>
        </div>
      </section>

      {/* App Preview Mockup */}
      <section className="relative z-10 px-4 pb-32 animate-slide-up" style={{animationDelay: '300ms'}}>
        <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-2 shadow-2xl">
          <div className="rounded-[2rem] bg-slate-900 border border-slate-800 overflow-hidden relative">
             <img src="/landing_preview.png" alt="Dashboard Preview" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Everything you need.</h2>
          <p className="text-slate-400 font-medium text-lg">Powerful features wrapped in a beautiful, intuitive interface.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Users size={24}/>, title: "Group Collaboration", desc: "Share lists with family or roommates in real-time. Everyone stays on the same page." },
            { icon: <Zap size={24}/>, title: "Lightning Fast", desc: "Built on modern web technologies ensuring instant updates and offline capabilities." },
            { icon: <Shield size={24}/>, title: "Secure & Private", desc: "Your data is encrypted and securely stored. Granular permissions keep you in control." }
          ].map((feat, i) => (
            <div key={i} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-[2rem] hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-brand-emerald/10 text-brand-emerald rounded-2xl flex items-center justify-center mb-6">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 text-center text-slate-500 font-medium relative z-10">
         <p>© {new Date().getFullYear()} GroceryManager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
