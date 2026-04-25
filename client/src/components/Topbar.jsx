import React, { useState, useEffect } from "react";
import { Search, Bell, Settings, Radio } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

const Topbar = ({ title }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sharedUserIds, setSharedUserIds] = useState(new Set());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAndConnect();
    
    socket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("updateOnlineUsers");
      socket.disconnect();
    };
  }, []);

  const fetchUserAndConnect = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { "x-auth-token": token },
      });
      setUser(userRes.data);

      socket.connect();
      socket.emit("userConnected", userRes.data);

      const groupsRes = await axios.get("http://localhost:5000/api/groups", {
        headers: { "x-auth-token": token },
      });
      
      const memberIds = new Set();
      groupsRes.data.forEach(g => {
        socket.emit("joinGroup", g._id);
        if(g.members && Array.isArray(g.members)) {
          // Sometimes members is populated, sometimes it's just IDs. Handle both:
          g.members.forEach(m => memberIds.add(m._id || m));
        }
      });
      setSharedUserIds(memberIds);

    } catch (err) {
      console.error("Failed to fetch user/groups for socket");
    }
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/search?q=${q}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setSearchResults(res.data);
    } catch(err) {}
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-20 bg-slate-soft dark:bg-slate-900 flex items-center justify-between px-8 border-b border-slate-200/50 dark:border-slate-800/50 z-10 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search lists, items, and groups..." 
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-2.5 pl-10 pr-12 text-sm text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-brand-indigo/20 transition-all placeholder:text-slate-400"
          />
          {isSearchOpen && searchResults && (
            <div className="absolute top-12 left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50 max-h-96 overflow-y-auto">
               {searchResults.groups.length > 0 && <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">Groups</p>{searchResults.groups.map(g => <div key={g._id} onMouseDown={() => navigate('/lists', { state: { groupId: g._id } })} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors">{g.groupName}</div>)}</div>}
               {searchResults.lists.length > 0 && <div className="mt-4"><p className="text-xs font-bold text-slate-400 uppercase mb-2">Lists</p>{searchResults.lists.map(l => <div key={l._id} onMouseDown={() => navigate(`/lists/${l.groupId}`)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors">{l.name}</div>)}</div>}
               {searchResults.items.length > 0 && <div className="mt-4"><p className="text-xs font-bold text-slate-400 uppercase mb-2">Items</p>{searchResults.items.map(i => <div key={i._id} onMouseDown={() => navigate(`/list-details/${i.listId}`)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors">{i.name}</div>)}</div>}
               {searchResults.groups.length === 0 && searchResults.lists.length === 0 && searchResults.items.length === 0 && <p className="text-sm text-slate-500 font-medium">No results found.</p>}
            </div>
          )}
        </div>

        {/* Online Users */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-brand-emerald transition-colors shadow-sm"
          >
            <Radio size={18} className={onlineUsers.filter(u => sharedUserIds.has(u.id) && u.id !== user?._id).length > 0 ? "text-brand-emerald animate-pulse" : ""} />
            {onlineUsers.filter(u => sharedUserIds.has(u.id) && u.id !== user?._id).length > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-emerald rounded-full border border-white dark:border-slate-800"></span>}
          </button>
          
          {isNotifOpen && (
            <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-5 z-50">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
                Online Collaborators
              </h3>
              {onlineUsers.filter(u => sharedUserIds.has(u.id) && u.id !== user?._id).length === 0 ? <p className="text-sm text-slate-500 font-medium">No one is online.</p> : (
                <div className="space-y-4">
                  {onlineUsers.filter(u => sharedUserIds.has(u.id) && u.id !== user?._id).map(u => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center text-xs font-bold">
                        {getInitials(u.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{u.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-1.5 pl-1.5 pr-4 shadow-sm cursor-pointer hover:border-brand-indigo/30 transition-all">
          <div className="w-8 h-8 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs font-bold shadow-md">
            {getInitials(user?.name)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{user?.name || "Test User"}</span>
            <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-wider leading-tight">Admin</span>
          </div>
          <svg className="w-4 h-4 text-slate-400 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
