import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, Calendar, Edit2, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", phone: "" });

  useEffect(() => { fetchUser(); }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setUser(res.data);
    } catch {}
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/api/auth/me", editData, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setUser(res.data);
      setIsEditing(false);
    } catch {}
  };

  const fields = [
    { icon: Mail,     label: "Email Address", value: user?.email },
    { icon: Phone,    label: "Mobile Number", value: user?.phone },
    { icon: Calendar, label: "Joined On",      value: user ? new Date(user.createdAt).toLocaleDateString() : null },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">

          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your personal information.</p>
          </div>

          <div className="max-w-2xl space-y-4">

            {/* Avatar + Name */}
            <Card className="border-slate-200 shadow-none bg-white">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-slate-100 text-slate-700 text-base font-semibold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user?.name || "User"}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-1">Pro Member</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setEditData({ name: user?.name || "", phone: user?.phone || "" }); setIsEditing(true); }}
                    className="h-7 px-3 text-xs border-slate-200 gap-1.5"
                  >
                    <Edit2 size={11} /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Fields */}
            <Card className="border-slate-200 shadow-none bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-900">Account Details</CardTitle>
                <CardDescription className="text-xs text-slate-400">Your personal information</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-1">
                {fields.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 py-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-slate-500" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-xs font-medium text-slate-900">{value || "Not provided"}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Edit Modal */}
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <Card className="w-full max-w-sm border-slate-200 shadow-lg">
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-900">Edit Profile</p>
                    <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Name</Label>
                      <Input
                        value={editData.name}
                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                        className="h-8 text-sm border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600">Phone</Label>
                      <Input
                        value={editData.phone}
                        onChange={e => setEditData({ ...editData, phone: e.target.value })}
                        className="h-8 text-sm border-slate-200"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" size="sm" className="flex-1 h-8 bg-slate-900 hover:bg-slate-700 text-white text-xs">
                        Save
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)} className="flex-1 h-8 text-xs border-slate-200">
                        Cancel
                      </Button>
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

export default Profile;