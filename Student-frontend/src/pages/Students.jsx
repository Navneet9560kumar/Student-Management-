import React, { useEffect, useState } from "react";
// API functions
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api";
// 🔥 Eye icon import kar liya hai
import { Plus, Pencil, Trash2, X, FileText, Eye } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "123456",
  });
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // 🔥 Naya state: Kaunse student ki details open karni hai
  const [expandedId, setExpandedId] = useState(null);

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
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      password: "",
    });
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
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
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
              <React.Fragment key={s.id}>
                {/* Main Student Row */}
                <tr className="hover:bg-gray-800 transition">
                  <td className="px-4 py-3 text-gray-400">#{s.id}</td>
                  <td className="px-4 py-3 text-white font-medium flex items-center gap-2">
                    {/* Agar student ka photo_url hai toh dikhao */}
                    {s.photo_url && (
                      <img
                        src={`http://localhost:8000${s.photo_url}`}
                        alt="profile"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{s.email}</td>
                  <td className="px-4 py-3 text-gray-400">{s.phone || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        s.is_active
                          ? "bg-emerald-900 text-emerald-400"
                          : "bg-rose-900 text-rose-400"
                      }`}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {/* 🔥 View Details Button (Eye Icon) */}
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === s.id ? null : s.id)
                      }
                      className={`p-1.5 rounded-lg transition ${
                        expandedId === s.id
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
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

                {/* 🔥 Expanded Details Section (Documents & Enrollments) */}
                {expandedId === s.id && (
                  <tr className="bg-gray-800/30">
                    <td
                      colSpan="6"
                      className="px-6 py-4 border-t border-gray-800"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Enrollments List */}
                        <div>
                          <h4 className="text-sm font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                            Enrolled Courses
                          </h4>
                          {s.enrollments && s.enrollments.length > 0 ? (
                            <div className="space-y-2">
                              {s.enrollments.map((e) => (
                                <div
                                  key={e.id}
                                  className="bg-gray-900 p-3 rounded-lg border border-gray-700"
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm text-white font-medium">
                                      Course ID: #{e.course_id}
                                    </p>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 capitalize">
                                      {e.status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Enrolled:{" "}
                                    {new Date(
                                      e.enrolled_at,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 bg-gray-900 p-3 rounded-lg border border-gray-800 text-center">
                              No active enrollments.
                            </p>
                          )}
                        </div>

                        {/* Documents List */}
                        <div>
                          <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                            Uploaded Documents
                          </h4>
                          {s.documents && s.documents.length > 0 ? (
                            <div className="space-y-2">
                              {s.documents.map((d) => (
                                <div
                                  key={d.id}
                                  className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex justify-between items-center"
                                >
                                  <div>
                                    <p className="text-sm text-white font-medium">
                                      {d.doc_type}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(
                                        d.uploaded_at,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      // Apni Render backend link daal do

                                      // window.open(d.file_url.startsWith("http") ? d.file_url : `http://localhost:8000${d.file_url}`, "_blank")
                                      window.open(
                                        d.file_url.startsWith("http")
                                          ? d.file_url
                                          : `https://student-management-2-9fnf.onrender.com${d.file_url}`,
                                        "_blank",
                                      )
                                    }
                                    className="text-indigo-400 text-xs hover:underline bg-indigo-900/30 px-3 py-1.5 rounded-md transition"
                                  >
                                    View File
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 bg-gray-900 p-3 rounded-lg border border-gray-800 text-center">
                              No documents uploaded yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                {editing ? "Edit Student" : "Add Student"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
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

              {/* Sirf naya student banate waqt Document upload ka option */}
              {!editing && (
                <div className="pt-4 mt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 mb-3 text-gray-400">
                    <FileText size={16} />
                    <span className="text-sm font-medium">
                      Document (Optional)
                    </span>
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
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {file.name}
                      </p>
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
