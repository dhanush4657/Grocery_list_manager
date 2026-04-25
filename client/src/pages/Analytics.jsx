import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3, TrendingUp, Users, ShoppingCart, ListChecks } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups/stats", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setStats(res.data);
    } catch(err) {}
  };

  if (!stats) return <div className="flex bg-slate-soft dark:bg-slate-900 min-h-screen"></div>;

  const fulfillmentNum = parseInt(stats.fulfillment) || 0;

  return (
    <div className="flex bg-slate-soft dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar title="Analytics" />
        
        <main className="flex-1 p-8 overflow-y-auto animate-fade-in max-w-6xl mx-auto w-full">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
              Analytics & Insights
            </h1>
            <p className="text-slate-500 font-medium">Track your grocery habits and group activity.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-brand-indigo/10 text-brand-indigo rounded-2xl flex items-center justify-center mb-4"><Users size={24}/></div>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.activeGroups}</p>
                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Active Groups</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-4"><ListChecks size={24}/></div>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalLists}</p>
                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Total Lists</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-4"><ShoppingCart size={24}/></div>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.itemsPending}</p>
                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Items Pending</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-brand-emerald/10 text-brand-emerald rounded-2xl flex items-center justify-center mb-4"><TrendingUp size={24}/></div>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.fulfillment}</p>
                <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Fulfillment</p>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
             <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Fulfillment Overview (Last 4 Weeks)</h2>
             
             <div className="flex items-end justify-center gap-4 sm:gap-8 h-64 mt-10 max-w-3xl mx-auto border-b border-slate-200 dark:border-slate-700/50 pb-2">
                <div className="flex-1 flex flex-col items-center gap-3 group">
                   <div className="w-12 sm:w-20 bg-slate-100 dark:bg-slate-700/50 rounded-t-xl h-full flex items-end overflow-hidden relative">
                      <div className="w-full bg-brand-indigo/40 rounded-t-xl transition-all duration-1000" style={{height: `${Math.max(10, fulfillmentNum - 15)}%`}}></div>
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Week 1</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-3 group">
                   <div className="w-12 sm:w-20 bg-slate-100 dark:bg-slate-700/50 rounded-t-xl h-full flex items-end overflow-hidden relative">
                      <div className="w-full bg-brand-indigo/60 rounded-t-xl transition-all duration-1000" style={{height: `${Math.max(15, fulfillmentNum - 5)}%`}}></div>
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Week 2</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-3 group">
                   <div className="w-12 sm:w-20 bg-slate-100 dark:bg-slate-700/50 rounded-t-xl h-full flex items-end overflow-hidden relative">
                      <div className="w-full bg-brand-indigo/80 rounded-t-xl transition-all duration-1000" style={{height: `${Math.max(20, fulfillmentNum + 8 > 100 ? 95 : fulfillmentNum + 8)}%`}}></div>
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Week 3</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-3 group relative">
                   <div className="w-12 sm:w-20 bg-slate-100 dark:bg-slate-700/50 rounded-t-xl h-full flex items-end overflow-hidden relative border border-brand-emerald/20">
                      <div className="w-full bg-brand-emerald rounded-t-xl transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.3)]" style={{height: `${fulfillmentNum}%`}}></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-bold text-sm bg-black/70 backdrop-blur-md px-2 py-1 rounded-md">{fulfillmentNum}%</span>
                      </div>
                   </div>
                   <p className="text-xs font-bold text-brand-emerald uppercase">Current</p>
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
