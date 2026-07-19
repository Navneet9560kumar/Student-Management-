import { useEffect, useState } from "react";
// API se deleteEnrollment import karna mat bhoolna (agar api.js mein nahi hai toh bana lena)
import { getEnrollments, createEnrollment, getStudents, getCourses, deleteEnrollment } from "../api";
import { Plus, X, Trash2 } from "lucide-react";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ student_id: "", course_id: "" });
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      const [e, s, c] = await Promise.allSettled([
        getEnrollments(),
        getStudents(),
        getCourses(),
      ]);

      if (e.status === "fulfilled") setEnrollments(e.value.data);
      if (s.status === "fulfilled") setStudents(s.value.data);
      if (c.status === "fulfilled") setCourses(c.value.data);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAll(); 
  }, []);

  const getStudentName = (id) => students.find((s) => s.id === id)?.name || "Unknown";
  const getCourseName = (id) => courses.find((c) => c.id === id)?.name || "Unknown";

  const handleSubmit = async () => {
    // 🔥 Naya Logic: Check karo ki pehle se toh enrolled nahi hai
    const isDuplicate = enrollments.some(
      (e) => e.student_id === parseInt(form.student_id) && e.course_id === parseInt(form.course_id)
    );

    if (isDuplicate) {
      setError("Error: Student is already enrolled in this course!");
      return;
    }

    try {
      await createEnrollment({
        student_id: parseInt(form.student_id),
        course_id: parseInt(form.course_id),
      });
      setShowModal(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!");
    }
  };

  // 🔥 Naya Logic: Delete karne ka function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) return;
    try {
      await deleteEnrollment(id);
      fetchAll(); // Delete hone ke baad table refresh karega
    } catch (err) {
      console.error(err);
      alert("Failed to delete. Make sure deleteEnrollment exists in your api.js");
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
        <h1 className="text-2xl font-bold text-white">Enrollments</h1>
        <button
          onClick={() => { setForm({ student_id: "", course_id: "" }); setError(""); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus size={16} /> Enroll Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Enrolled At</th>
              <th className="px-4 py-3 text-left">Actions</th> {/* 🔥 Naya Action column */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {enrollments.map((e) => (
              <tr key={e.id} className="hover:bg-gray-800 transition">
                <td className="px-4 py-3 text-gray-400">#{e.id}</td>
                <td className="px-4 py-3 text-white font-medium">{getStudentName(e.student_id)}</td>
                <td className="px-4 py-3 text-gray-400">{getCourseName(e.course_id)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-900 text-emerald-400">
                    {e.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(e.enrolled_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {/* 🔥 Naya Delete Button */}
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-1.5 rounded-lg bg-rose-900 text-rose-400 hover:bg-rose-800 transition"
                    title="Delete Enrollment"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Enroll Student</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {error && <p className="text-rose-400 text-sm mb-3">{error}</p>}

            <div className="space-y-3">
              <select
                value={form.student_id}
                onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <select
                value={form.course_id}
                onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
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
                Enroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}