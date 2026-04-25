import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, CheckCircle, ArrowLeft, Edit2, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["General", "Vegetables", "Dairy", "Meat", "Snacks", "Others"];

const ListDetails = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, category: "General" });
  const [sortBy, setSortBy] = useState("date");
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({ name: "", quantity: 1 });

  useEffect(() => { if (listId) fetchItems(); }, [listId]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/items/${listId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setItems(res.data);
    } catch {}
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name) return;
    try {
      await axios.post("http://localhost:5000/api/items",
        { ...newItem, listId },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setNewItem({ name: "", quantity: 1, category: "General" });
      fetchItems();
    } catch {}
  };

  const togglePurchased = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.put(`http://localhost:5000/api/items/${id}/toggle`, {},
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      fetchItems();
    } catch {}
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!editingItem || !editData.name) return;
    try {
      await axios.put(`http://localhost:5000/api/items/${editingItem._id}`,
        { name: editData.name, quantity: editData.quantity },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setEditingItem(null); fetchItems();
    } catch {}
  };

  const sortItems = (list) => {
    const sorted = [...list];
    if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "quantity") sorted.sort((a, b) => (b.quantity || 1) - (a.quantity || 1));
    else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted;
  };

  const pendingItems = sortItems(items.filter(i => !i.isPurchased));
  const completedItems = sortItems(items.filter(i => i.isPurchased));
  const total = items.length;
  const progress = total === 0 ? 0 : Math.round((completedItems.length / total) * 100);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto max-w-3xl mx-auto w-full">

          {/* Back */}
          <button
            onClick={() => navigate("/lists")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 font-medium mb-5 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Lists
          </button>

          {/* Progress Header */}
          <Card className="border-slate-200 shadow-none bg-white mb-5">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">List Items</p>
                  <p className="text-xs text-slate-400 mt-0.5">{completedItems.length}/{total} items completed</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">{progress}%</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-7 w-32 text-xs border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date" className="text-xs">By Date</SelectItem>
                      <SelectItem value="name" className="text-xs">By Name</SelectItem>
                      <SelectItem value="quantity" className="text-xs">By Qty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-slate-800 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </CardContent>
          </Card>

          {/* Add Item Form */}
          <Card className="border-slate-200 shadow-none bg-white mb-5">
            <CardContent className="pt-4 pb-4">
              <form onSubmit={handleAddItem} className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Add new item (e.g. Almond Milk)..."
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="flex-1 min-w-[150px] h-8 text-sm border-slate-200"
                />
                <Input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-16 h-8 text-sm border-slate-200 text-center"
                />
                <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                  <SelectTrigger className="h-8 w-28 text-xs border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" size="sm" className="h-8 w-8 p-0 bg-slate-900 hover:bg-slate-700 text-white">
                  <Plus size={14} />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Items */}
          <div className="space-y-5">
            {/* Pending */}
            {pendingItems.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 px-1">To Buy</p>
                <div className="space-y-1.5">
                  {pendingItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={(e) => togglePurchased(e, item._id)}
                      className="flex items-center justify-between p-3.5 bg-white rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-200 group-hover:border-slate-400 transition-colors shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400">Qty: {item.quantity || 1}</span>
                            <span className="text-[10px] text-slate-400">·</span>
                            <span className="text-[10px] text-slate-400">{item.category}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingItem(item); setEditData({ name: item.name, quantity: item.quantity || 1 }); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedItems.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 px-1">Completed</p>
                <div className="space-y-1.5 opacity-60 hover:opacity-100 transition-opacity">
                  {completedItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={(e) => togglePurchased(e, item._id)}
                      className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer group transition-all hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-400 line-through">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-300">Qty: {item.quantity || 1}</span>
                            <span className="text-[10px] text-slate-300">·</span>
                            <span className="text-[10px] text-slate-300">{item.category}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingItem(item); setEditData({ name: item.name, quantity: item.quantity || 1 }); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {items.length === 0 && (
              <Card className="border-slate-200 border-dashed shadow-none">
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-slate-400">No items yet. Add something to buy!</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Edit Modal */}
          {editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <Card className="w-full max-w-sm border-slate-200 shadow-lg">
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-900">Edit Item</p>
                    <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  </div>
                  <form onSubmit={handleUpdateItem} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Item Name</Label>
                      <Input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} className="h-8 text-sm border-slate-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Quantity</Label>
                      <Input type="number" min="1" value={editData.quantity} onChange={e => setEditData({ ...editData, quantity: e.target.value })} className="h-8 text-sm border-slate-200" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" size="sm" className="flex-1 h-8 bg-slate-900 hover:bg-slate-700 text-white text-xs">Save</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditingItem(null)} className="flex-1 h-8 text-xs border-slate-200">Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ListDetails;