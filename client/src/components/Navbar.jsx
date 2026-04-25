import React from "react";
import { Bell, Search, UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="h-20 border-b border-slate-100 bg-white flex items-center justify-between px-10 sticky top-0 z-10">
      <div className="relative w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search items, groups..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-brand-indigo/20 transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-brand-indigo transition-colors">
          <Bell size={22} />
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">Dhanush Tej</p>
            <p className="text-xs text-slate-400">Premium Member</p>
          </div>
          <UserCircle size={32} className="text-slate-300" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
