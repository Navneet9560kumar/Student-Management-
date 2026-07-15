import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, X, ChevronDown, User, Mail, Shield } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    setShowConfirm(true);
  };

  const initial = (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase();
  const displayName = user?.name || user?.email || "User";
  const displayEmail = user?.email || "";
  const displayRole = user?.role || "";

  return (
    <>
      <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Welcome back, {displayName}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all" title="Notifications">
            <Bell size={20} />
          </button>

          {/* Avatar Dropdown */}
          <div className="relative pl-4 border-l border-gray-800" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                {initial}
              </div>
              <ChevronDown size={14} className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-xl py-2 z-50">
                {/* Profile Header */}
                <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-800">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-base font-bold text-white">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 capitalize truncate">{displayRole} Portal</p>
                  </div>
                </div>

                {/* User Details */}
                <div className="px-4 py-3 border-b border-gray-800 space-y-2">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <User size={14} className="text-gray-500 shrink-0" />
                    <span className="truncate">{displayName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Mail size={14} className="text-gray-500 shrink-0" />
                    <span className="truncate">{displayEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Shield size={14} className="text-gray-500 shrink-0" />
                    <span className="capitalize">{displayRole}</span>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-96 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Confirm Logout</h3>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-1 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your dashboard.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
