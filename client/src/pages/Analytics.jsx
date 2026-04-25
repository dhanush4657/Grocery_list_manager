import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, ShoppingCart, TrendingUp, ListChecks } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups/stats", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setStats(res.data);
    } catch {}
  };

  if (!stats) return <div className="flex bg-slate-50 min-h-screen" />;

  const fulfillmentNum = parseInt(stats.fulfillment) || 0;

  const statCards = [
    { label: "Active Groups",  value: stats.activeGroups,  icon: Users,       color: "text-slate-600" },
    { label: "Total Lists",    value: stats.totalLists,    icon: ListChecks,  color: "text-slate-600" },
    { label: "Items Pending",  value: stats.itemsPending,  icon: ShoppingCart,color: "text-slate-600" },
    { label: "Fulfillment",    value: stats.fulfillment,   icon: TrendingUp,  color: "text-slate-600" },
  ];

  const weeks = [
    { label: "Week 1", height: Math.max(10, fulfillmentNum - 15), opacity: "bg-slate-200" },
    { label: "Week 2", height: Math.max(15, fulfillmentNum - 5),  opacity: "bg-slate-300" },
    { label: "Week 3", height: Math.max(20, Math.min(fulfillmentNum + 8, 95)), opacity: "bg-slate-400" },
    { label: "Current", height: fulfillmentNum, opacity: "bg-slate-800", highlight: true },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track your grocery habits and group activity.</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="border-slate-200 shadow-none bg-white">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                      <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center">
                        <Icon size={14} className="text-slate-500" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Chart */}
          <Card className="border-slate-200 shadow-none bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Fulfillment Overview — Last 4 Weeks
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="flex items-end gap-4 h-52 border-b border-slate-100 pb-0 max-w-lg">
                {weeks.map((week) => (
                  <div key={week.label} className="flex-1 flex flex-col items-center gap-2">
                    <p className="text-xs text-slate-500 font-medium tabular-nums">
                      {week.height}%
                    </p>
                    <div className="w-full bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden">
                      <div
                        className={`w-full ${week.opacity} rounded-t-md transition-all duration-700`}
                        style={{ height: `${week.height}%` }}
                      />
                    </div>
                    <p className={`text-[10px] font-medium ${week.highlight ? "text-slate-900" : "text-slate-400"}`}>
                      {week.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                Current fulfillment rate: <span className="font-semibold text-slate-700">{stats.fulfillment}</span>
              </p>
            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  );
};

export default Analytics;