import React from "react";
import {
  LayoutDashboard, ShoppingCart, Users,
  BarChart3, User, Settings
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "My Lists",  icon: ShoppingCart,    path: "/lists" },
  { name: "Groups",    icon: Users,           path: "/groups" },
  { name: "Analytics", icon: BarChart3,       path: "/analytics" },
  { name: "Profile",   icon: User,            path: "/profile" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-20">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <ShoppingCart size={16} className="text-white" />
        </div>
        <div className="leading-none">
          <p className="text-sm font-semibold text-slate-900 tracking-tight">Grocery</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Manager</p>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full justify-start gap-3 h-9 px-3 text-sm font-medium rounded-md",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Icon size={16} />
              {item.name}
            </Button>
          );
        })}
      </nav>

      <Separator />

      {/* Settings */}
      <div className="px-3 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/settings")}
          className="w-full justify-start gap-3 h-9 px-3 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-md"
        >
          <Settings size={16} />
          Settings
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;