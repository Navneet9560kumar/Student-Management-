import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  Activity,
} from "lucide-react";

const links = [
  { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { to: "/students", icon: <Users size={18} />, label: "Students" },
  { to: "/courses", icon: <BookOpen size={18} />, label: "Courses" },
  { to: "/enrollments", icon: <ClipboardList size={18} />, label: "Enrollments" },
  { to: "/documents", icon: <FileText size={18} />, label: "Documents" },
  { to: "/logs", icon: <Activity size={18} />, label: "Activity Logs" },
];

export default function Sidebar() {
  return (
    <div className="w-60 bg-gray-900 flex flex-col p-4 border-r border-gray-800">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-indigo-400">EduManager</h1>
        <p className="text-xs text-gray-500">Admin Portal</p>
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
      </div>
    </div>
  );
}