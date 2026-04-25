import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Users, Zap, Shield, ArrowRight, CheckCircle, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Users,
    title: "Group Collaboration",
    desc: "Share lists with family or roommates in real-time. Multiple users can add, edit, and manage items simultaneously — everyone stays on the same page.",
  },
  {
    icon: RefreshCw,
    title: "Real-time Sync",
    desc: "Updates are instantly reflected across all devices without a page reload. Built on SSE for seamless live synchronization across all group members.",
  },
  {
    icon: ShoppingCart,
    title: "Smart Item Management",
    desc: "Add, edit, and delete grocery items with category grouping — Vegetables, Dairy, Snacks, and more. Mark items as purchased with visual indicators.",
  },
  {
    icon: Lock,
    title: "Group-based Privacy",
    desc: "Each group has its own private shared list with access control. Only members can view or modify the list, keeping your data secure.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Built on React + Vite for instant load times. The modern stack ensures a snappy experience even with large lists and multiple concurrent users.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    desc: "Data is stored in MongoDB with Mongoose ODM. Role-based group membership ensures only authorized members can access shared lists.",
  },
];

const steps = [
  { step: "01", title: "Register & Join a Group", desc: "Create an account and join or create a shopping group with your family or team." },
  { step: "02", title: "Create a Shared List", desc: "Start a grocery list for your group. All members instantly get access." },
  { step: "03", title: "Add & Categorize Items", desc: "Add items with categories like Vegetables, Dairy, or Snacks for organized shopping." },
  { step: "04", title: "Shop & Mark Purchased", desc: "At the store, check off items as purchased. The list updates live for everyone." },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* Navbar */}
      <nav className="border-b border-slate-200 sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
              <ShoppingCart size={14} className="text-white" />
            </div>
            <div className="leading-none">
              <p className="text-sm font-semibold text-slate-900 tracking-tight">Grocery</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest">Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-slate-600 text-sm">
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/register")} className="bg-slate-900 hover:bg-slate-700 text-white text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <Badge variant="outline" className="mb-6 text-xs text-slate-500 border-slate-300 rounded-full px-3 py-1">
          Collaborative Grocery Management
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto mb-5">
          Organize your shopping,<br />together.
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          A real-time collaborative platform for families and groups to manage shared grocery lists — no more duplicate purchases or missed items.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button size="lg" onClick={() => navigate("/register")} className="bg-slate-900 hover:bg-slate-700 text-white gap-2 h-11 px-6">
            Start for free <ArrowRight size={16} />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="h-11 px-6 border-slate-200 text-slate-700">
            Sign in
          </Button>
        </div>

        {/* Quick proof points */}
        <div className="flex items-center justify-center gap-6 mt-10 text-sm text-slate-400">
          {["Real-time updates", "Group access control", "Category grouping"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle size={13} className="text-slate-400" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">How it works</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">From signup to shopping in minutes.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.step}>
              <p className="text-3xl font-bold text-slate-100 mb-3">{s.step}</p>
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Features</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Everything your household needs.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title}>
                <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center mb-4">
                  <Icon size={15} className="text-slate-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
          Ready to simplify your grocery runs?
        </h2>
        <p className="text-slate-500 mb-8 text-base max-w-md mx-auto">
          Join your group, create a shared list, and start coordinating your shopping in real time.
        </p>
        <Button size="lg" onClick={() => navigate("/register")} className="bg-slate-900 hover:bg-slate-700 text-white gap-2 h-11 px-8">
          Create your account <ArrowRight size={16} />
        </Button>
      </section>

      {/* Footer */}
      <Separator />
      <footer className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center">
            <ShoppingCart size={10} className="text-white" />
          </div>
          GroceryManager
        </div>
        <p>© {new Date().getFullYear()} GroceryManager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;