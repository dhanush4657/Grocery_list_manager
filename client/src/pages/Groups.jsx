import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Copy, Check, Plus, Key, Home, ShoppingCart, Star, Heart, Building, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ICONS = [
  { name: "Home",     component: Home },
  { name: "People",   component: Users },
  { name: "Cart",     component: ShoppingCart },
  { name: "Star",     component: Star },
  { name: "Heart",    component: Heart },
  { name: "Building", component: Building },
];

const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Home");
  const [joinGroupId, setJoinGroupId] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [sortBy, setSortBy] = useState("date");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState(null);

  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setGroups(res.data);
    } catch {}
  };

  const handleDeleteGroup = async (e, groupId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this group?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchGroups();
    } catch { alert("Failed to delete group."); }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/groups",
        { groupName: newGroupName, description, icon: selectedIcon },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setNewGroupName(""); setDescription("");
      fetchGroups();
    } catch {}
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/groups/join",
        { groupId: joinGroupId },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setJoinGroupId(""); fetchGroups();
    } catch {}
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const renderIcon = (name) => {
    const found = ICONS.find(i => i.name === name);
    const Icon = found ? found.component : Home;
    return <Icon size={16} />;
  };

  const getSortedGroups = () => {
    const sorted = [...groups];
    if (sortBy === "name") sorted.sort((a, b) => a.groupName.localeCompare(b.groupName));
    else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted;
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">

          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-900">Groups</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your family and shopping groups</p>
          </div>

          <div className="max-w-4xl space-y-6">

            {/* Create / Join Card */}
            <Card className="border-slate-200 shadow-none bg-white">
              <CardHeader className="pb-0">
                <div className="flex gap-1 border-b border-slate-100 pb-4">
                  <button
                    onClick={() => setActiveTab("create")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activeTab === "create"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Plus size={13} /> Create Group
                  </button>
                  <button
                    onClick={() => setActiveTab("join")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activeTab === "join"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Key size={13} /> Join with Code
                  </button>
                </div>
              </CardHeader>

              <CardContent className="pt-5">
                {activeTab === "create" ? (
                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div>
                      <Label className="text-xs text-slate-500 mb-2 block">Group Icon</Label>
                      <div className="flex gap-2">
                        {ICONS.map((icon) => {
                          const Icon = icon.component;
                          return (
                            <button
                              key={icon.name}
                              type="button"
                              onClick={() => setSelectedIcon(icon.name)}
                              className={`w-9 h-9 rounded-md flex items-center justify-center transition-all border ${
                                selectedIcon === icon.name
                                  ? "bg-slate-900 text-white border-slate-900"
                                  : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <Icon size={15} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Group Name <span className="text-red-400">*</span></Label>
                        <Input
                          placeholder="e.g. The Jani Family"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          className="h-9 text-sm border-slate-200"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-600">Description (Optional)</Label>
                        <Input
                          placeholder="e.g. Weekly grocery group"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="h-9 text-sm border-slate-200"
                        />
                      </div>
                    </div>
                    <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-700 text-white h-8 text-xs">
                      Create Group
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleJoinGroup} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Group Code <span className="text-red-400">*</span></Label>
                      <Input
                        placeholder="Paste Group ID here"
                        value={joinGroupId}
                        onChange={(e) => setJoinGroupId(e.target.value)}
                        className="h-9 text-sm border-slate-200 font-mono tracking-wider max-w-sm"
                        required
                      />
                    </div>
                    <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-700 text-white h-8 text-xs">
                      Join Group
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Groups List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Users size={14} className="text-slate-400" />
                  My Groups
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">{groups.length}</Badge>
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-7 w-32 text-xs border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date" className="text-xs">By Date</SelectItem>
                    <SelectItem value="name" className="text-xs">By Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {groups.length === 0 ? (
                <Card className="border-slate-200 shadow-none border-dashed">
                  <CardContent className="py-10 text-center">
                    <p className="text-sm text-slate-400">No groups yet. Create or join one above.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getSortedGroups().map((group) => (
                    <Card
                      key={group._id}
                      onClick={() => navigate("/lists", { state: { groupId: group._id } })}
                      className="border-slate-200 shadow-none bg-white cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                      <CardContent className="pt-5 pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
                              {renderIcon(group.icon)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{group.groupName}</p>
                              {group.description && (
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{group.description}</p>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Admin</Badge>
                        </div>

                        <Separator className="mb-3" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <code className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded font-mono">
                              {group._id.slice(-10).toUpperCase()}
                            </code>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(group._id); }}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              {copiedId === group._id ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); setSelectedGroupMembers(group); }}
                              className="h-7 px-2 text-xs text-slate-500"
                            >
                              <Users size={12} className="mr-1" /> Members
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteGroup(e, group._id)}
                              className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Members Modal */}
          {selectedGroupMembers && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <Card className="w-full max-w-sm border-slate-200 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">
                        {selectedGroupMembers.groupName}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">Group members</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedGroupMembers(null)}
                      className="h-7 w-7 p-0 text-slate-400"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4 space-y-2 max-h-60 overflow-y-auto">
                  {selectedGroupMembers.members.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-semibold">
                          {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-slate-900">{member.name || "Unknown"}</p>
                        <p className="text-[10px] text-slate-400">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <Separator />
                <div className="p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs border-slate-200"
                    onClick={() => setSelectedGroupMembers(null)}
                  >
                    Close
                  </Button>
                </div>
              </Card>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Groups;