import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Bell, Smartphone, Layout, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Toggle = ({ label, description, icon: Icon, value, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
        <Icon size={13} className="text-slate-500" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-800">{label}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${
        value ? "bg-slate-900" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
          value ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  </div>
);

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifs: true,
    pushNotifs: true,
    compactView: false,
    twoFactorAuth: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const toggleSetting = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem("appSettings", JSON.stringify(updated));
    window.dispatchEvent(new Event("appSettingsChanged"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const sections = [
    {
      title: "Notifications",
      description: "Control how you receive updates",
      items: [
        { key: "emailNotifs", icon: Bell,       label: "Email Notifications", description: "Receive weekly summaries and important alerts" },
        { key: "pushNotifs",  icon: Smartphone,  label: "Push Notifications",  description: "Get instant updates when lists are modified" },
      ],
    },
    {
      title: "Appearance",
      description: "Customize your experience",
      items: [
        { key: "compactView", icon: Layout, label: "Compact View", description: "Reduce spacing to fit more items on screen" },
      ],
    }
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">

          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your notifications and preferences.</p>
          </div>

          <div className="max-w-lg space-y-4">

            {sections.map((section) => (
              <Card key={section.title} className="border-slate-200 shadow-none bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-900">{section.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-400">{section.description}</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-2 pb-2 divide-y divide-slate-100">
                  {section.items.map((item) => (
                    <Toggle
                      key={item.key}
                      icon={item.icon}
                      label={item.label}
                      description={item.description}
                      value={settings[item.key]}
                      onChange={() => toggleSetting(item.key)}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Logout */}
            <Card className="border-red-100 shadow-none bg-red-50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-red-100 flex items-center justify-center">
                      <LogOut size={13} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-red-700">Log Out</p>
                      <p className="text-[11px] text-red-400 mt-0.5">Securely end your current session</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleLogout}
                    className="h-7 px-3 text-xs bg-red-600 hover:bg-red-700 text-white border-0"
                  >
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;