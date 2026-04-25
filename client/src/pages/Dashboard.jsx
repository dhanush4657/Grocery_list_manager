import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, FileText, CheckCircle, TrendingUp, ArrowRight, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { socket } from "../socket";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      setActivities((prev) => [activity, ...prev].slice(0, 50));
    });

    return () => socket.off("newActivity");
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setUser(res.data);
    } catch {}
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/activity", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setActivities(res.data);
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups/stats", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setStats(res.data);
    } catch {}
  };

  const statCards = [
    { label: "Active Groups",  value: stats.activeGroups, change: "+12%", icon: Users },
    { label: "Total Lists",    value: stats.totalLists,   change: "+34%", icon: FileText },
    { label: "Gross Input",    value: stats.totalLists,   change: "+8%",  icon: TrendingUp },
    { label: "Fulfillment",    value: stats.fulfillment,  change: "+22%", icon: CheckCircle },
  ];

  const visibleActivities = showAllLogs ? activities : activities.slice(0, 5);

  const dotColor = (type) => {
    if (type === "success") return "bg-emerald-500";
    if (type === "warning") return "bg-red-400";
    return "bg-slate-400";
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Welcome back, {user?.name ? user.name.split(" ")[0] : "there"}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">Here's your high-level overview.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/analytics")}
              className="border-slate-200 text-slate-600 text-xs h-8 gap-1.5"
            >
              View Reports <ArrowRight size={12} />
            </Button>
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
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] text-emerald-700 bg-emerald-50 border-0 px-1.5 py-0"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Recent Projects */}
            <Card className="lg:col-span-2 border-slate-200 shadow-none bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Recent Projects</CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-0.5">Grocery iterations</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/lists")}
                    className="text-xs text-slate-500 h-7 px-2"
                  >
                    View all
                  </Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-2">
                {/* Static placeholder — replace with mapped list data */}
                {[
                  { name: "Weekly Groceries", progress: 0 },
                  { name: "Monthly Essentials", progress: 40 },
                  { name: "Party Supplies", progress: 75 },
                ].map((project) => (
                  <div
                    key={project.name}
                    onClick={() => navigate("/lists")}
                    className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all group"
                  >
                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-medium text-slate-800 truncate">{project.name}</p>
                        <span className="text-xs text-slate-400 ml-2 shrink-0">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-800 h-full rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400 shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="lg:col-span-1 border-slate-200 shadow-none bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">Activity Feed</CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-0.5">Audit log</CardDescription>
                  </div>
                  {activities.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllLogs(!showAllLogs)}
                      className="text-xs text-slate-500 h-7 px-2"
                    >
                      {showAllLogs ? "Less" : "View all"}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                {activities.length === 0 ? (
                  <p className="text-sm text-slate-400">No recent activity.</p>
                ) : (
                  <div
                    className="space-y-4 overflow-y-auto"
                    style={{ maxHeight: showAllLogs ? "360px" : "auto" }}
                  >
                    {visibleActivities.map((log) => (
                      <div key={log._id} className="flex gap-3">
                        <div className="mt-1.5 shrink-0">
                          <div className={`w-2 h-2 rounded-full ${dotColor(log.type)}`} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            <span className="font-medium">
                              {log.userId?.name || "A user"}
                            </span>{" "}
                            {log.action.toLowerCase()}: {log.details}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(log.createdAt).toLocaleDateString()}{" "}
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;