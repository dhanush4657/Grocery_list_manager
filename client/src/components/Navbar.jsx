import React from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  return (
    <nav className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        <Input
          type="text"
          placeholder="Search items, groups..."
          className="pl-9 h-8 text-sm bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-300"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
          <Bell size={16} />
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 leading-none">Dhanush Tej</p>
            <p className="text-xs text-slate-400 mt-0.5">Premium Member</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-semibold">
              DT
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;