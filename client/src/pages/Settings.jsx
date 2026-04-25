import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Settings as SettingsIcon, Bell, Smartphone, Layout, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifs: true,
    pushNotifs: true,
    compactView: false,
    twoFactorAuth: false
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
    window.dispatchEvent(new Event('appSettingsChanged'));
  };

  const Toggle = ({ label, description, icon: Icon, value, onChange }) => (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-colors hover:border-slate-200 dark:hover:border-slate-600">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-white">{label}</p>
          <p className="text-xs font-medium text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      
      <button 
        onClick={onChange}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${value ? 'bg-brand-emerald' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="flex bg-slate-soft dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar title="Settings" />
        
        <main className="flex-1 p-8 overflow-y-auto animate-fade-in max-w-4xl mx-auto w-full">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
              Preferences
            </h1>
            <p className="text-slate-500 font-medium">Manage your notifications and application settings.</p>
          </header>

          <div className="space-y-8">
             <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 pl-2">Notifications</h2>
                <div className="space-y-4">
                   <Toggle 
                     icon={Bell} 
                     label="Email Notifications" 
                     description="Receive weekly summaries and important alerts" 
                     value={settings.emailNotifs} 
                     onChange={() => toggleSetting('emailNotifs')} 
                   />
                   <Toggle 
                     icon={Smartphone} 
                     label="Push Notifications" 
                     description="Get instant updates when lists are modified" 
                     value={settings.pushNotifs} 
                     onChange={() => toggleSetting('pushNotifs')} 
                   />
                </div>
             </div>

             <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 pl-2">Appearance & Behavior</h2>
                <div className="space-y-4">
                   <Toggle 
                     icon={Layout} 
                     label="Compact View" 
                     description="Reduce spacing to fit more items on screen" 
                     value={settings.compactView} 
                     onChange={() => toggleSetting('compactView')} 
                   />
                </div>
             </div>

             <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 pl-2">Security</h2>
                <div className="space-y-4">
                   <Toggle 
                     icon={Shield} 
                     label="Two-Factor Authentication" 
                     description="Add an extra layer of security to your account" 
                     value={settings.twoFactorAuth} 
                     onChange={() => toggleSetting('twoFactorAuth')} 
                   />
                </div>
             </div>

             <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-red-500/70 mb-4 pl-2">Account Actions</h2>
                <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 shadow-sm transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
                        <LogOut size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-600 dark:text-red-400">Log Out</p>
                        <p className="text-xs font-medium text-red-500/70 mt-0.5">Securely end your current session</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Settings;
