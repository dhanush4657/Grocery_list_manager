import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, ShoppingCart, ArrowRight, Edit2, ChevronDown } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate, useLocation } from "react-router-dom";

const MyLists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [lists, setLists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListPriority, setNewListPriority] = useState("Medium");
  const [sortBy, setSortBy] = useState("date"); // date, name, priority
  
  const [editingList, setEditingList] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPriority, setEditPriority] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchLists(selectedGroup);
    } else {
      setLists([]);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setGroups(res.data);
      if (res.data.length > 0) {
        if (location.state?.groupId) {
          setSelectedGroup(location.state.groupId);
        } else {
          setSelectedGroup(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch groups");
    }
  };

  const fetchLists = async (groupId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/lists/group/${groupId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setLists(res.data);
    } catch (err) {
      console.error("Failed to fetch lists");
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName || !selectedGroup) return;
    try {
      await axios.post(
        "http://localhost:5000/api/lists",
        { name: newListName, priority: newListPriority, groupId: selectedGroup },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setNewListName("");
      setNewListPriority("Medium");
      setIsCreating(false);
      fetchLists(selectedGroup);
    } catch (err) {
      console.error("Failed to create list");
    }
  };

  const handleDeleteList = async (e, listId) => {
    e.stopPropagation();
    if(!window.confirm("Delete this list?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/lists/${listId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchLists(selectedGroup);
    } catch (err) {
      console.error("Failed to delete list");
    }
  };

  const openEditModal = (list) => {
    setEditingList(list);
    setEditName(list.name);
    setEditPriority(list.priority || "Medium");
  };

  const handleUpdateList = async (e) => {
    e.preventDefault();
    if (!editingList || !editName) return;
    try {
      await axios.put(`http://localhost:5000/api/lists/${editingList._id}`, 
        { name: editName, priority: editPriority },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setEditingList(null);
      fetchLists(selectedGroup);
    } catch (err) {
      console.error("Failed to update list");
    }
  };

  const getSortedLists = () => {
    let sorted = [...lists];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "priority") {
      const pLevel = { High: 3, Medium: 2, Low: 1 };
      sorted.sort((a, b) => (pLevel[b.priority] || 2) - (pLevel[a.priority] || 2));
    } else { // date
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  };

  return (
    <div className="flex bg-slate-soft dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar title="Shopping Lists" />
        
        <main className="flex-1 p-8 overflow-y-auto animate-fade-in relative">
          <header className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-1">
                Shopping Lists
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                Manage your family's grocery lists
              </p>
            </div>
            
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-brand-emerald text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm shadow-brand-emerald/20 hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <Plus size={16} /> New Shopping List
            </button>
          </header>

          {/* Controls: Groups & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
               {groups.map(g => (
                  <button
                    key={g._id}
                    onClick={() => setSelectedGroup(g._id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      selectedGroup === g._id
                        ? "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30 shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                     {g.groupName}
                  </button>
               ))}
            </div>
            <div className="relative">
               <select 
                 className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-brand-emerald/20"
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
               >
                 <option value="date">Sort by Date</option>
                 <option value="name">Sort by Name</option>
                 <option value="priority">Sort by Priority</option>
               </select>
               <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Create List Form Overlay */}
          {isCreating && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-brand-emerald/30 mb-8 animate-slide-up">
              <form onSubmit={handleCreateList} className="flex flex-wrap items-center gap-4">
                 <input 
                   autoFocus
                   placeholder="E.g. Weekend Party Supplies..."
                   value={newListName}
                   onChange={e => setNewListName(e.target.value)}
                   className="flex-1 min-w-[200px] p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-brand-emerald/30 text-sm font-medium text-slate-700 dark:text-white"
                 />
                 <select
                   value={newListPriority}
                   onChange={e => setNewListPriority(e.target.value)}
                   className="p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-bold outline-none text-slate-600 dark:text-slate-300"
                 >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                 </select>
                 <button type="submit" className="bg-brand-emerald text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600">Create</button>
                 <button type="button" onClick={() => setIsCreating(false)} className="px-4 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
              </form>
            </div>
          )}

          {/* Edit List Modal */}
          {editingList && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
               <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md animate-fade-in border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Edit List</h2>
                  <form onSubmit={handleUpdateList} className="space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">List Name</label>
                       <input 
                         value={editName}
                         onChange={e => setEditName(e.target.value)}
                         className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-brand-indigo/30 text-sm font-medium text-slate-700 dark:text-white"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                       <select
                         value={editPriority}
                         onChange={e => setEditPriority(e.target.value)}
                         className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-bold outline-none text-slate-600 dark:text-slate-300"
                       >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                       </select>
                     </div>
                     <div className="flex items-center gap-3 pt-4">
                        <button type="submit" className="flex-1 bg-brand-indigo text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-indigoDark transition-colors">Save Changes</button>
                        <button type="button" onClick={() => setEditingList(null)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                     </div>
                  </form>
               </div>
             </div>
          )}

          {/* Lists Grid */}
          {lists.length === 0 ? (
            <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-600">
               <div className="w-16 h-16 bg-brand-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-emerald">
                  <ShoppingCart size={24} />
               </div>
               <p className="text-slate-800 dark:text-white font-bold text-lg mb-1">No lists found</p>
               <p className="text-slate-500 text-sm">Create a new shopping list to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSortedLists().map(list => {
                const total = list.totalItems || 0;
                const completed = list.completedItems || 0;
                const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

                return (
                <div key={list._id} className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-emerald/30 transition-all flex flex-col group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center text-brand-emerald">
                         <ShoppingCart size={20} />
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                           list.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                           list.priority === 'Low' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                           'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                         }`}>
                            {list.priority || 'Medium'}
                         </span>
                         <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                           <button onClick={(e) => { e.stopPropagation(); openEditModal(list); }} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 flex items-center justify-center hover:bg-brand-indigo hover:text-white transition-colors">
                               <Edit2 size={14} />
                           </button>
                           <button onClick={(e) => handleDeleteList(e, list._id)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                               <Trash2 size={14} />
                           </button>
                         </div>
                      </div>
                   </div>

                   <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-1">{list.name}</h3>
                   
                   <div className="mt-4 mb-6">
                      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                         <span>{completed}/{total} items</span>
                         <span>{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div className="bg-brand-emerald h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                      </div>
                   </div>

                   <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">By {list.createdBy?.name || 'Unknown'}</p>
                         <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{new Date(list.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/lists/${list._id}`)}
                        className="bg-brand-emerald text-white font-bold text-sm px-5 py-2 rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                         Open <ArrowRight size={14} />
                      </button>
                   </div>
                </div>
              )})}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default MyLists;
