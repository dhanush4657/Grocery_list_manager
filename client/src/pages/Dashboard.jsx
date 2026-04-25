import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { socket } from "../socket";

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeGroups: 0,
    totalLists: 0,
    itemsPending: 0,
    fulfillment: "0%",
  });
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchUser();
    fetchActivities();
    
    socket.on("newActivity", (activity) => {
      setActivities(prev => [activity, ...prev].slice(0, 50));
    });

    return () => {
      socket.off("newActivity");
    };
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user");
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/activity", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch activities");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups/stats", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  const statCards = [
    {
      label: "Active Groups",
      value: stats.activeGroups,
      change: "+12%",
      icon: <Users size={18} />,
    },
    {
      label: "Total Lists",
      value: stats.totalLists,
      change: "+34%",
      icon: <FileText size={18} />,
    },
    {
      label: "Gross Input",
      value: stats.totalLists, // placeholder
      change: "+8%",
      icon: <TrendingUp size={18} />,
    },
    {
      label: "Fulfillment",
      value: stats.fulfillment,
      change: "+22%",
      icon: <CheckCircle size={18} />,
    },
  ];

  return (
    <div className="flex bg-slate-soft dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar title="Overview" />

        <main className="flex-1 p-8 overflow-y-auto animate-fade-in relative">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-1">
                Welcome back, <span className="text-brand-emerald">{user?.name ? user.name.split(' ')[0] : 'Test'}</span>
              </h1>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-emerald"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                System nominal. Here's your high-level overview.
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/analytics')}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:border-brand-indigo/30 transition-all">
                View Reports
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-800 p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all hover:-translate-y-1 transform animate-slide-up relative overflow-hidden group"
                style={{animationDelay: `${i * 100}ms`}}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-brand-emerald/10 dark:bg-brand-emerald/20 text-brand-emerald flex items-center justify-center mb-6">
                   {stat.icon}
                </div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="bg-brand-emerald/10 text-brand-emerald text-xs font-bold px-2 py-0.5 rounded-md">
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8 animate-slide-up" style={{animationDelay: '400ms'}}>
              <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Projects</h2>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Grocery Iterations</p>
                </div>
                <button className="bg-brand-emerald/10 text-brand-emerald px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-emerald/20 transition-all">
                    View All
                </button>
              </div>

              <div className="space-y-4">
                 {/* Project Item */}
                 <div className="flex items-center gap-6 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-brand-emerald/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-brand-emerald/10 rounded-xl flex items-center justify-center text-brand-emerald">
                        <FileText size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-brand-emerald transition-colors">Weekly Groceries</h3>
                            <span className="text-sm font-bold text-slate-500">0%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-brand-emerald h-full rounded-full" style={{ width: '0%' }}></div>
                        </div>
                    </div>
                    <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors pl-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                 </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className={`lg:col-span-1 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8 animate-slide-up flex flex-col`} style={{animationDelay: '500ms', maxHeight: showAllLogs ? '600px' : 'auto'}}>
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Activity Feed</h2>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Audit Log</p>
                </div>
                {activities.length > 5 && (
                  <button 
                    onClick={() => setShowAllLogs(!showAllLogs)}
                    className="text-xs font-bold text-brand-emerald bg-brand-emerald/10 px-3 py-1.5 rounded-lg hover:bg-brand-emerald/20 transition-colors"
                  >
                    {showAllLogs ? 'Show Less' : 'View All'}
                  </button>
                )}
              </div>
              
              {activities.length === 0 ? (
                <div className="text-slate-500 text-sm font-medium">No recent activity.</div>
              ) : (
              <div className={`relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-700 space-y-6 ${showAllLogs ? 'overflow-y-auto pr-4 flex-1' : ''}`}>
                {(showAllLogs ? activities : activities.slice(0, 5)).map((log) => (
                  <div key={log._id} className="relative flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center z-10 shrink-0">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            log.type === 'success' ? 'bg-brand-emerald' : 
                            log.type === 'warning' ? 'bg-red-500' : 
                            'bg-brand-indigo'
                          }`}></div>
                      </div>
                      <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-white">
                            <span className="text-brand-emerald font-bold">{log.userId?.name ? log.userId.name : 'A user'}</span> {log.action.toLowerCase()}: {log.details}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                            {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                      </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
