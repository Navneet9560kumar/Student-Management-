import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, BookOpen,
  ClipboardList, FileText, Activity, LogOut, X
} from "lucide-react";

const allLinks = [
  { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard", roles: ["principal", "teacher", "student"] },
  { to: "/students", icon: <Users size={18} />, label: "Students", roles: ["principal", "teacher"] },
  { to: "/courses", icon: <BookOpen size={18} />, label: "Courses", roles: ["principal", "teacher"] },
  { to: "/enrollments", icon: <ClipboardList size={18} />, label: "Enrollments", roles: ["principal", "teacher"] },
  { to: "/documents", icon: <FileText size={18} />, label: "Documents", roles: ["principal"] },
  { to: "/logs", icon: <Activity size={18} />, label: "Activity Logs", roles: ["principal"] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const links = allLinks.filter(link => link.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="w-60 bg-gray-900 flex flex-col p-4 border-r border-gray-800">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-indigo-400">EduManager</h1>
          <p className="text-xs text-gray-500 capitalize">{user?.role} Portal</p>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-600">Help & Support</p>
          <button className="mt-2 w-full text-xs bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-gray-400">
            Contact Support
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

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
                onClick={handleLogout}
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
