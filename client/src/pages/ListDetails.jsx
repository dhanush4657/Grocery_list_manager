import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, CheckCircle, ArrowLeft, MoreHorizontal, Edit2, Trash2, ChevronDown } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const ListDetails = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, category: "General" });
  const [sortBy, setSortBy] = useState("date"); // date, name, quantity

  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({ name: "", quantity: 1 });

  useEffect(() => {
    if (listId) {
      fetchItems();
    }
  }, [listId]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/items/${listId}`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        },
      );
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name) return;

    try {
      await axios.post(
        "http://localhost:5000/api/items",
        { ...newItem, listId: listId },
        { headers: { "x-auth-token": localStorage.getItem("token") } },
      );
      setNewItem({ name: "", quantity: 1, category: "General" });
      fetchItems();
    } catch (err) {
      console.error("Failed to add item");
    }
  };

  const togglePurchased = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.put(
        `http://localhost:5000/api/items/${id}/toggle`,
        {},
        { headers: { "x-auth-token": localStorage.getItem("token") } },
      );
      fetchItems();
    } catch (err) {
      console.error("Failed to toggle item");
    }
  };

  const openEditModal = (e, item) => {
    e.stopPropagation();
    setEditingItem(item);
    setEditData({ name: item.name, quantity: item.quantity || 1 });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!editingItem || !editData.name) return;
    try {
      await axios.put(
        `http://localhost:5000/api/items/${editingItem._id}`,
        { name: editData.name, quantity: editData.quantity },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      console.error("Failed to update item");
    }
  };

  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this item?")) return;
    try {
      // Assuming a DELETE route exists or needs to be added, but user didn't explicitly ask for delete.
      // I'll skip delete if it doesn't exist, but it's a good feature. I'll focus on edit.
    } catch(err) {}
  };

  const pendingItems = items.filter(i => !i.isPurchased);
  const completedItems = items.filter(i => i.isPurchased);
  const totalItems = items.length;
  const progress = totalItems === 0 ? 0 : Math.round((completedItems.length / totalItems) * 100);

  const sortItems = (list) => {
    let sorted = [...list];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "quantity") {
      sorted.sort((a, b) => (b.quantity || 1) - (a.quantity || 1));
    } else { // date
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  };

  const sortedPending = sortItems(pendingItems);
  const sortedCompleted = sortItems(completedItems);

  return (
    <div className="flex bg-slate-soft dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar title="List Details" />
        
        <main className="flex-1 p-8 overflow-y-auto animate-fade-in relative max-w-5xl mx-auto w-full">
          
          <button onClick={() => navigate('/lists')} className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-6 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft size={16} /> Back to Lists
          </button>

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm animate-slide-up">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-4">
                List Items
              </h1>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-bold">
                 <span>{completedItems.length}/{totalItems} items</span>
                 <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden max-w-[200px]">
                    <div className="bg-brand-emerald h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                 </div>
                 <span className="text-brand-emerald">{progress}%</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative">
                 <select 
                   className="appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-brand-emerald/20"
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value)}
                 >
                   <option value="date">Sort by Date</option>
                   <option value="name">Sort by Name</option>
                   <option value="quantity">Sort by Qty</option>
                 </select>
                 <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
               </div>
            </div>
          </header>

          {/* Add Item Form */}
          <form
            onSubmit={handleAddItem}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-2 pl-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4 mb-10 focus-within:ring-4 focus-within:ring-brand-emerald/10 dark:focus-within:ring-brand-emerald/20 transition-all"
          >
            <input
              className="flex-1 py-4 min-w-[150px] outline-none text-sm font-medium text-slate-800 dark:text-white bg-transparent placeholder-slate-400"
              placeholder="Add new item (e.g. Almond Milk)..."
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <input
              type="number"
              min="1"
              className="w-20 py-4 outline-none text-sm font-bold text-slate-800 dark:text-white bg-transparent text-center border-l border-slate-200 dark:border-slate-700 sm:border-none"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <select
              className="bg-transparent text-slate-500 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer px-4 hover:text-brand-emerald transition-colors"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            >
              <option className="dark:bg-slate-800">General</option>
              <option className="dark:bg-slate-800">Vegetables</option>
              <option className="dark:bg-slate-800">Dairy</option>
              <option className="dark:bg-slate-800">Meat</option>
              <option className="dark:bg-slate-800">Snacks</option>
              <option className="dark:bg-slate-800">Others</option>
            </select>
            <button
              type="submit"
              className="bg-brand-emerald text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-brand-emerald/20 hover:-translate-y-0.5 transition-all"
            >
              <Plus size={24} />
            </button>
          </form>

          {/* Edit Modal */}
          {editingItem && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
               <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md animate-fade-in border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Edit Item</h2>
                  <form onSubmit={handleUpdateItem} className="space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Name</label>
                       <input 
                         value={editData.name}
                         onChange={e => setEditData({...editData, name: e.target.value})}
                         className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-brand-indigo/30 text-sm font-medium text-slate-700 dark:text-white"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity</label>
                       <input 
                         type="number"
                         min="1"
                         value={editData.quantity}
                         onChange={e => setEditData({...editData, quantity: e.target.value})}
                         className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-brand-indigo/30 text-sm font-medium text-slate-700 dark:text-white"
                       />
                     </div>
                     <div className="flex items-center gap-3 pt-4">
                        <button type="submit" className="flex-1 bg-brand-emerald text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors">Save Changes</button>
                        <button type="button" onClick={() => setEditingItem(null)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                     </div>
                  </form>
               </div>
             </div>
          )}

          {/* Items Container */}
          <div className="space-y-10">
            {/* Pending Items */}
            {sortedPending.length > 0 && (
              <div className="animate-slide-up">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-2">To Buy</h2>
                <div className="space-y-3">
                  {sortedPending.map((item) => (
                    <div
                      key={item._id}
                      onClick={(e) => togglePurchased(e, item._id)}
                      className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-brand-emerald/50 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-600 group-hover:border-brand-emerald transition-colors flex items-center justify-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
                           <div className="absolute inset-0 bg-brand-emerald transform scale-0 group-hover:scale-50 transition-transform rounded-full opacity-20"></div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <p className="text-sm font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-brand-emerald transition-colors">
                               {item.name}
                             </p>
                             <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                               Qty: {item.quantity || 1}
                             </span>
                          </div>
                          <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em]">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={(e) => openEditModal(e, item)} className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-400 hover:text-brand-indigo hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all">
                            <Edit2 size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Items */}
            {sortedCompleted.length > 0 && (
              <div className="animate-slide-up" style={{animationDelay: '100ms'}}>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-2">Completed</h2>
                <div className="space-y-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
                  {sortedCompleted.map((item) => (
                    <div
                      key={item._id}
                      onClick={(e) => togglePurchased(e, item._id)}
                      className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-5">
                        <CheckCircle className="text-brand-emerald animate-fade-in" size={24} />
                        <div>
                          <div className="flex items-center gap-2">
                             <p className="text-sm font-bold text-slate-500 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600 decoration-2 tracking-tight group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                               {item.name}
                             </p>
                             <span className="bg-slate-200/50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-md line-through">
                               Qty: {item.quantity || 1}
                             </span>
                          </div>
                          <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em]">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={(e) => openEditModal(e, item)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-400 hover:text-brand-indigo transition-all">
                            <Edit2 size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {items.length === 0 && (
                <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 font-bold">
                    No items yet. Add something to buy!
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListDetails;
