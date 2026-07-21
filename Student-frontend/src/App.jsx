import { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Enrollments from "./pages/Enrollments";
import Documents from "./pages/Documents";
import ActivityLogs from "./pages/ActivityLogs";
import Login from "./pages/login";

// 1. Protected Layout jo check karega user logged in hai ya nahi
function ProtectedLayout() {
  const { user } = useAuth();

  // Agar user nahi hai toh login page par bhejo
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar user hai toh Sidebar, Navbar aur actual page (Outlet) dikhao
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense
            fallback={
              <div className="text-gray-400 animate-pulse">Loading Page...</div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Login page par Sidebar/Navbar nahi dikhega */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes: Sirf login ke baad accessible honge */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/logs" element={<ActivityLogs />} />
        </Route>

        {/* Galat URL daalne par wapas dashboard par redirect karne ke liye */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
