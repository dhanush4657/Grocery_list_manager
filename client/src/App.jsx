import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import MyLists from "./pages/MyLists";
import ListDetails from "./pages/ListDetails";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  useEffect(() => {
    const checkSettings = () => {
      const saved = localStorage.getItem("appSettings");
      if (saved) {
        const settings = JSON.parse(saved);
        if (settings.compactView) {
          document.body.classList.add('compact');
        } else {
          document.body.classList.remove('compact');
        }
      }
      
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    checkSettings();
    window.addEventListener('appSettingsChanged', checkSettings);
    return () => window.removeEventListener('appSettingsChanged', checkSettings);
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/lists" element={<MyLists />} />
        <Route path="/lists/:listId" element={<ListDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
