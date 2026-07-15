import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (isRegister) {
        await register(form);
        setIsRegister(false);
        setError("");
      } else {
        await login(form.email, form.password);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">EduManager</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isRegister ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        {error && (
          <div className="bg-rose-900/30 border border-rose-800 rounded-lg p-3 mb-4">
            <p className="text-rose-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {isRegister && (
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="principal">Principal</option>
              </select>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isRegister ? "Register" : "Sign In"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-indigo-400 text-sm hover:underline"
          >
            {isRegister ? "Already have account? Sign In" : "Don't have account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}