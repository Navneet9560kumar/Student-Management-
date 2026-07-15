import { useEffect, useState } from "react";
// 1. Saare required API functions yahan import karein
import { 
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent 
} from "../api";
import { Plus, Pencil, Trash2, X, FileText } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "123456" });
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. useEffect ko standard tarike se call kiya
  useEffect(() => { 
    fetchStudents(); 
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", password: "123456" });
    setDocType("");
    setFile(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({ name: student.name, email: student.email, phone: student.phone || "", password: "" });
    setDocType("");
    setFile(null);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await updateStudent(editing.id, form);
      } else {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("password", form.password);
        
        // Optional Document Upload
        if (docType && file) {
          formData.append("doc_type", docType);
          formData.append("file", file);
        }
        
        await createStudent(formData);
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteStudent(id);
      fetchStudents();
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
        <h1 className="text-2xl font-bold text-white">Students</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-gray-800 transition">
                <td className="px-4 py-3 text-gray-400">#{s.id}</td>
                <td className="px-4 py-3 text-white font-medium">{s.name}</td>
                <td className="px-4 py-3 text-gray-400">{s.email}</td>
                <td className="px-4 py-3 text-gray-400">{s.phone || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    s.is_active ? "bg-emerald-900 text-emerald-400" : "bg-rose-900 text-rose-400"
                  }`}>
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded-lg bg-indigo-900 text-indigo-400 hover:bg-indigo-800 transition"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg bg-rose-900 text-rose-400 hover:bg-rose-800 transition"
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
              <h2 className="text-lg font-semibold text-white">
                {editing ? "Edit Student" : "Add Student"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {error && <p className="text-rose-400 text-sm mb-3">{error}</p>}

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              {!editing && (
                <div className="pt-4 mt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 mb-3 text-gray-400">
                    <FileText size={16} />
                    <span className="text-sm font-medium">Document (Optional)</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Document Type (e.g., Aadhaar Card, PAN)"
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                      />
                    </div>
                    {file && (
                      <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>
                    )}
                  </div>
                </div>
              )}
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