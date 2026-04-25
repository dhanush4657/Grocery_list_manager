import React from "react";
import { LayoutDashboard, ShoppingCart, Users, BarChart3, User, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "My Lists", icon: <ShoppingCart size={20} />, path: "/lists" },
    { name: "Groups", icon: <Users size={20} />, path: "/groups" },
    { name: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
    { name: "Profile", icon: <User size={20} />, path: "/profile" },
  ];

  return (
    <aside className="w-64 bg-slate-soft dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col h-screen sticky top-0 z-20 font-sans transition-colors duration-300">
      {/* Logo */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-brand-emerald w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-emerald/30 transform -rotate-12 hover:rotate-0 transition-all cursor-pointer" onClick={() => navigate('/dashboard')}>
            {/* Leaf Icon equivalent */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.06 19.43 4 16.05 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.05 16.94 19.43 13 19.93V15H11V19.93ZM13 13H15L12 9L9 13H11V15H13V13Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="tracking-tight text-slate-800 dark:text-white font-extrabold text-xl leading-tight">Grocery</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">Manager</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.name} className="px-4">
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm ${
                  isActive
                    ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                    : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-brand-indigo text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                   {item.icon}
                </div>
                {item.name}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">
             <Settings size={20} />
          </div>
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
