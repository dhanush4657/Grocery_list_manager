import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ShoppingCart } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch {
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
            <ShoppingCart size={14} className="text-white" />
          </div>
          <div className="leading-none">
            <p className="text-sm font-semibold text-slate-900">Grocery</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest">Manager</p>
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Create an account</CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Join your group and start managing groceries together
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Full name</Label>
                <Input
                  type="text"
                  placeholder="Vadde Dhanush"
                  className="h-9 text-sm border-slate-200"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Email address</Label>
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  className="h-9 text-sm border-slate-200"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-9 text-sm border-slate-200 pr-9"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-9 bg-slate-900 hover:bg-slate-700 text-white text-sm mt-1">
                Create account
              </Button>
            </form>
          </CardContent>

          <Separator />

          <CardFooter className="pt-4">
            <p className="text-center w-full text-xs text-slate-500">
              Already have an account?{" "}
              <Link to="/" className="text-slate-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;