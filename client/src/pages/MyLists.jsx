import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, ShoppingCart, ArrowRight, Edit2, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRIORITY_STYLES = {
  High:   "bg-red-50 text-red-600 border-red-100",
  Medium: "bg-amber-50 text-amber-600 border-amber-100",
  Low:    "bg-blue-50 text-blue-600 border-blue-100",
};

const MyLists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [lists, setLists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListPriority, setNewListPriority] = useState("Medium");
  const [sortBy, setSortBy] = useState("date");
  const [editingList, setEditingList] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPriority, setEditPriority] = useState("");

  useEffect(() => { fetchGroups(); }, []);
  useEffect(() => {
    if (selectedGroup) fetchLists(selectedGroup);
    else setLists([]);
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setGroups(res.data);
      if (res.data.length > 0) {
        setSelectedGroup(location.state?.groupId || res.data[0]._id);
      }
    } catch {}
  };

  const fetchLists = async (groupId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/lists/group/${groupId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setLists(res.data);
    } catch {}
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName || !selectedGroup) return;
    try {
      await axios.post("http://localhost:5000/api/lists",
        { name: newListName, priority: newListPriority, groupId: selectedGroup },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setNewListName(""); setNewListPriority("Medium"); setIsCreating(false);
      fetchLists(selectedGroup);
    } catch {}
  };

  const handleDeleteList = async (e, listId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this list?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/lists/${listId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchLists(selectedGroup);
    } catch {}
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
    } catch {}
  };

  const getSortedLists = () => {
    const sorted = [...lists];
    if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "priority") {
      const p = { High: 3, Medium: 2, Low: 1 };
      sorted.sort((a, b) => (p[b.priority] || 2) - (p[a.priority] || 2));
    } else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted;
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
              <h1 className="text-xl font-semibold text-slate-900">Shopping Lists</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage your family's grocery lists</p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreating(true)}
              className="bg-slate-900 hover:bg-slate-700 text-white h-8 text-xs gap-1.5"
            >
              <Plus size={13} /> New List
            </Button>
          </div>

          {/* Group Tabs + Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
            <div className="flex flex-wrap gap-2">
              {groups.map(g => (
                <button
                  key={g._id}
                  onClick={() => setSelectedGroup(g._id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                    selectedGroup === g._id
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {g.groupName}
                </button>
              ))}
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-7 w-36 text-xs border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date" className="text-xs">By Date</SelectItem>
                <SelectItem value="name" className="text-xs">By Name</SelectItem>
                <SelectItem value="priority" className="text-xs">By Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create Form */}
          {isCreating && (
            <Card className="border-slate-200 shadow-none mb-5">
              <CardContent className="pt-4 pb-4">
                <form onSubmit={handleCreateList} className="flex flex-wrap items-center gap-3">
                  <Input
                    autoFocus
                    placeholder="e.g. Weekend Party Supplies..."
                    value={newListName}
                    onChange={e => setNewListName(e.target.value)}
                    className="flex-1 min-w-[180px] h-8 text-sm border-slate-200"
                  />
                  <Select value={newListPriority} onValueChange={setNewListPriority}>
                    <SelectTrigger className="h-8 w-36 text-xs border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low" className="text-xs">Low Priority</SelectItem>
                      <SelectItem value="Medium" className="text-xs">Medium Priority</SelectItem>
                      <SelectItem value="High" className="text-xs">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" size="sm" className="h-8 bg-slate-900 hover:bg-slate-700 text-white text-xs">
                    Create
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreating(false)} className="h-8 text-xs text-slate-400">
                    Cancel
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lists Grid */}
          {lists.length === 0 ? (
            <Card className="border-slate-200 border-dashed shadow-none">
              <CardContent className="py-16 text-center">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart size={16} className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700 mb-1">No lists found</p>
                <p className="text-xs text-slate-400">Create a new shopping list to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getSortedLists().map(list => {
                const total = list.totalItems || 0;
                const completed = list.completedItems || 0;
                const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
                return (
                  <Card key={list._id} className="border-slate-200 shadow-none bg-white hover:border-slate-300 hover:shadow-sm transition-all group">
                    <CardContent className="pt-5 pb-4 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                          <ShoppingCart size={14} className="text-slate-500" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 border ${PRIORITY_STYLES[list.priority || "Medium"]}`}
                          >
                            {list.priority || "Medium"}
                          </Badge>
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingList(list); setEditName(list.name); setEditPriority(list.priority || "Medium"); }}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteList(e, list._id)}
                              className="w-6 h-6 rounded flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-slate-900 mb-3">{list.name}</p>

                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                          <span>{completed}/{total} items</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="bg-slate-800 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <Separator className="mb-3" />

                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-[10px] text-slate-400">By {list.createdBy?.name || "Unknown"}</p>
                          <p className="text-[10px] text-slate-400">{new Date(list.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/lists/${list._id}`)}
                          className="h-7 px-3 text-xs bg-slate-900 hover:bg-slate-700 text-white gap-1"
                        >
                          Open <ArrowRight size={11} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Edit Modal */}
          {editingList && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <Card className="w-full max-w-sm border-slate-200 shadow-lg">
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-900">Edit List</p>
                    <button onClick={() => setEditingList(null)} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  </div>
                  <form onSubmit={handleUpdateList} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">List Name</Label>
                      <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-8 text-sm border-slate-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Priority</Label>
                      <Select value={editPriority} onValueChange={setEditPriority}>
                        <SelectTrigger className="h-8 text-xs border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low" className="text-xs">Low</SelectItem>
                          <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
                          <SelectItem value="High" className="text-xs">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" size="sm" className="flex-1 h-8 bg-slate-900 hover:bg-slate-700 text-white text-xs">Save</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditingList(null)} className="flex-1 h-8 text-xs border-slate-200">Cancel</Button>
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

export default MyLists;