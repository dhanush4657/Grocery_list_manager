import React, { useState, useEffect } from "react";
import axios from "axios";
import { Moon, Sun, User, Mail, Phone, Calendar } from "lucide-react";
import Sidebar from "../components/Sidebar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }

    fetchUser();
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/api/auth/me", editData, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setUser(res.data);
      setIsEditing(false);
    } catch(err) {
      console.error("Failed to update profile");
    }
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  return (
    <div className="flex bg-slate-soft dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 p-6 md:p-12 animate-fade-in max-w-5xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
            Account Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage your personal settings and app preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white dark:border-slate-700 shadow-glass animate-slide-up">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-700/50 pb-8">
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-emerald to-brand-indigo flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-brand-indigo/30 overflow-hidden">
                      {user?.photoUrl ? (
                        <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.name ? user.name.charAt(0).toUpperCase() : "U"
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user?.name || "User"}</h2>
                    <p className="text-brand-indigo dark:text-brand-emerald font-medium">Pro Member</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setEditData({ name: user?.name || "", phone: user?.phone || "" });
                    setIsEditing(true);
                  }}
                  className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-all border border-slate-200 dark:border-slate-600"
                >
                  Edit Profile
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-slate-800 dark:text-white font-medium">{user?.email || "Not Provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mobile Number</p>
                    <p className="text-slate-800 dark:text-white font-medium">{user?.phone || "Not Provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Joined On</p>
                    <p className="text-slate-800 dark:text-white font-medium">{user ? new Date(user.createdAt).toLocaleDateString() : "..."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white dark:border-slate-700 shadow-glass animate-slide-up" style={{animationDelay: '100ms'}}>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                App Preferences
              </h3>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 dark:bg-brand-emerald/10 flex items-center justify-center text-brand-indigo dark:text-brand-emerald">
                    {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Dark Mode</p>
                    <p className="text-xs font-medium text-slate-400">Toggle theme</p>
                  </div>
                </div>
                
                <button 
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${isDarkMode ? 'bg-brand-emerald' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
          {/* Edit Profile Modal */}
          {isEditing && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
               <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md animate-fade-in border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Edit Profile</h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                       <input 
                         value={editData.name}
                         onChange={e => setEditData({...editData, name: e.target.value})}
                         className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-brand-indigo/30 text-sm font-medium text-slate-700 dark:text-white"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                       <input 
                         value={editData.phone}
                         onChange={e => setEditData({...editData, phone: e.target.value})}
                         className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-brand-indigo/30 text-sm font-medium text-slate-700 dark:text-white"
                       />
                     </div>
                     <div className="flex items-center gap-3 pt-4">
                        <button type="submit" className="flex-1 bg-brand-emerald text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                     </div>
                  </form>
               </div>
             </div>
          )}
      </main>
    </div>
  );
};

export default Profile;
