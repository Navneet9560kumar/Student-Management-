import { useEffect, useState } from "react";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../api";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", duration_months: "" });
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { ( fetchCourses()); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", duration_months: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      name: course.name,
      description: course.description || "",
      duration_months: course.duration_months,
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const data = { ...form, duration_months: parseInt(form.duration_months) };
      if (editing) {
        await updateCourse(editing.id, data);
      } else {
        await createCourse(data);
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-white font-semibold text-base">{c.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                c.is_active ? "bg-emerald-900 text-emerald-400" : "bg-rose-900 text-rose-400"
              }`}>
                {c.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{c.description || "No description"}</p>
            <p className="text-indigo-400 text-sm font-medium">
              Duration: {c.duration_months} months
            </p>
            <p className="text-gray-600 text-xs">
              Created: {new Date(c.created_at).toLocaleDateString()}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => openEdit(c)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-900 text-indigo-400 hover:bg-indigo-800 text-sm transition"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-900 text-rose-400 hover:bg-rose-800 text-sm transition"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                {editing ? "Edit Course" : "Add Course"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {error && <p className="text-rose-400 text-sm mb-3">{error}</p>}

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Course Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
              <input
                type="number"
                placeholder="Duration (months)"
                value={form.duration_months}
                onChange={(e) => setForm({ ...form, duration_months: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm text-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm font-medium transition"
              >
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}