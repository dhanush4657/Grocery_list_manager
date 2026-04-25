import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Copy, Check, Plus, Key, ArrowRight, Home, ShoppingCart, Star, Heart, Building, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Home");
  const [joinGroupId, setJoinGroupId] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [activeTab, setActiveTab] = useState("create"); // 'create' or 'join'
  const [sortBy, setSortBy] = useState("date");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState(null);

  const ICONS = [
    { name: "Home", component: <Home size={20} /> },
    { name: "People", component: <Users size={20} /> },
    { name: "Cart", component: <ShoppingCart size={20} /> },
    { name: "Star", component: <Star size={20} /> },
    { name: "Heart", component: <Heart size={20} /> },
    { name: "Building", component: <Building size={20} /> },
  ];

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups");
    }
  };

  const handleDeleteGroup = async (e, groupId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchGroups();
    } catch(err) {
      alert("Failed to delete group. You might not be the admin.");
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/groups",
        { groupName: newGroupName, description, icon: selectedIcon },
        { headers: { "x-auth-token": localStorage.getItem("token") } },
      );
      setNewGroupName("");
      setDescription("");
      fetchGroups();
    } catch (err) {
      console.error("Failed to create group");
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/groups/join",
        { groupId: joinGroupId },
        { headers: { "x-auth-token": localStorage.getItem("token") } },
      );
      setJoinGroupId("");
      fetchGroups();
    } catch (err) {
      console.error("Failed to join group");
    }
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const renderIcon = (name) => {
    const found = ICONS.find(i => i.name === name);
    return found ? found.component : <Home size={20} />;
  };

  const getSortedGroups = () => {
    let sorted = [...groups];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.groupName.localeCompare(b.groupName));
    } else { // date
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  };

  return (
    <div className="flex bg-slate-soft dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar title="Groups" />
        <main className="flex-1 p-8 overflow-y-auto animate-fade-in relative">
          
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-1">
              Groups
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              Manage your family and shopping groups
            </p>
          </header>

          <div className="max-w-4xl space-y-10">
            {/* Create / Join Section */}
            <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8 animate-slide-up">
              
              <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
                 <button 
                   onClick={() => setActiveTab('create')}
                   className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'create' ? 'bg-brand-emerald/10 text-brand-emerald shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                 >
                    <Plus size={16} /> Create Group
                 </button>
                 <button 
                   onClick={() => setActiveTab('join')}
                   className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'join' ? 'bg-brand-indigo/10 text-brand-indigo shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                 >
                    <Key size={16} /> Join with Code
                 </button>
              </div>

              {activeTab === 'create' ? (
                <form onSubmit={handleCreateGroup} className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Group Icon</label>
                    <div className="flex items-center gap-4">
                      {ICONS.map((icon) => (
                        <button
                          key={icon.name}
                          type="button"
                          onClick={() => setSelectedIcon(icon.name)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            selectedIcon === icon.name
                              ? "bg-brand-emerald/10 text-brand-emerald border-2 border-brand-emerald shadow-sm"
                              : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-slate-600"
                          }`}
                        >
                          {icon.component}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2">Group Name <span className="text-red-500">*</span></label>
                        <input
                        className="w-full p-3.5 rounded-xl border border-brand-emerald bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-brand-emerald/30 text-sm font-medium text-slate-700 dark:text-white transition-all placeholder:text-slate-400"
                        placeholder="e.g., The Jani Family"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2">Description (Optional)</label>
                        <input
                        className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/30 text-sm font-medium text-slate-700 dark:text-white transition-all placeholder:text-slate-400"
                        placeholder="e.g., Weekly grocery group"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                  </div>

                  <button className="bg-brand-emerald text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-brand-emerald/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center">
                    Create Group
                  </button>
                </form>
              ) : (
                <form onSubmit={handleJoinGroup} className="space-y-6 animate-fade-in">
                   <div>
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2">Group Code <span className="text-red-500">*</span></label>
                        <input
                        className="w-full md:w-1/2 p-3.5 rounded-xl border border-brand-indigo bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-brand-indigo/30 text-sm font-bold tracking-widest text-slate-700 dark:text-white transition-all placeholder:text-slate-400 placeholder:font-medium placeholder:tracking-normal"
                        placeholder="Paste Group ID here"
                        value={joinGroupId}
                        onChange={(e) => setJoinGroupId(e.target.value)}
                        required
                        />
                    </div>
                    <button className="bg-brand-indigo text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-brand-indigo/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center">
                    Join Group
                  </button>
                </form>
              )}
            </div>

            {/* My Groups List */}
            <div className="animate-slide-up" style={{animationDelay: '100ms'}}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                   <Users size={18} className="text-brand-emerald" />
                   My Groups ({groups.length})
                </h2>
                <div className="relative">
                   <select 
                     className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl pl-4 pr-10 py-2 outline-none focus:ring-2 focus:ring-brand-emerald/20"
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                   >
                     <option value="date">Sort by Date</option>
                     <option value="name">Sort by Name</option>
                   </select>
                   <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No groups found. Create or join one.</p>
                ) : (
                  getSortedGroups().map((group) => (
                    <div
                      key={group._id}
                      onClick={() => navigate('/lists', { state: { groupId: group._id } })}
                      className="cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:border-brand-emerald/30 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-4">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-emerald/10 rounded-2xl flex items-center justify-center text-brand-emerald shadow-inner">
                                {renderIcon(group.icon)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg tracking-tight flex items-center gap-2">
                                  {group.groupName}
                                </h3>
                                {group.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{group.description}</p>}
                            </div>
                         </div>
                         <span className="bg-brand-emerald/10 text-brand-emerald text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                             Admin
                         </span>
                      </div>

                      <div className="flex items-center gap-2 mb-6">
                          <code className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-600">
                            {group._id.slice(-10).toUpperCase()}
                          </code>
                          <button
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(group._id); }}
                            className={`p-1.5 rounded-lg transition-colors ${copiedId === group._id ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-slate-50 dark:bg-slate-700 text-brand-emerald hover:bg-brand-emerald/10'}`}
                            title="Copy full ID"
                          >
                            {copiedId === group._id ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                      </div>

                      <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedGroupMembers(group); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200/50 dark:border-slate-600">
                             <Users size={14} /> View Members
                          </button>
                          <button 
                            onClick={(e) => handleDeleteGroup(e, group._id)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Members Modal */}
          {selectedGroupMembers && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
               <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md animate-fade-in border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Members in {selectedGroupMembers.groupName}</h2>
                    <button onClick={() => setSelectedGroupMembers(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {selectedGroupMembers.members.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="w-10 h-10 rounded-full bg-brand-emerald/20 text-brand-emerald flex items-center justify-center font-bold">
                          {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{member.name || "Unknown User"}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setSelectedGroupMembers(null)} className="w-full mt-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    Close
                  </button>
               </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Groups;
