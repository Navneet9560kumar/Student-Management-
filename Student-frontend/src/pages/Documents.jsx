import { useEffect, useState } from "react";
import {
  getStudents,
  getStudentDocuments,
  uploadDocument,
  deleteDocument,
} from "../api";
import { Upload, Trash2, X, FileText } from "lucide-react";

export default function Documents() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    doc_type: "",
    file: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudents();
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  const fetchDocuments = async (id) => {
    setLoading(true);

    try {
      const res = await getStudentDocuments(id);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (e) => {
    const id = e.target.value;
    setSelectedStudent(id);

    if (id) {
      fetchDocuments(id);
    } else {
      setDocuments([]);
    }
  };

  const handleUpload = async () => {
    if (!form.doc_type || !form.file) {
      setError("Doc type aur file dono zaroori hain!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("doc_type", form.doc_type);
      formData.append("file", form.file);

      await uploadDocument(selectedStudent, formData);

      setShowModal(false);
      setForm({
        doc_type: "",
        file: null,
      });

      setError("");

      fetchDocuments(selectedStudent);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await deleteDocument(id);
      fetchDocuments(selectedStudent);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Documents</h1>

        {selectedStudent && (
          <button
            onClick={() => {
              setForm({
                doc_type: "",
                file: null,
              });
              setError("");
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Upload size={16} />
            Upload Document
          </button>
        )}
      </div>

      {/* Student Select */}

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <label className="text-gray-400 text-sm mb-2 block">
          Select Student
        </label>

        <select
          value={selectedStudent}
          onChange={handleStudentChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
        >
          <option value="">-- Select Student --</option>

          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Documents */}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-900 p-3 rounded-lg">
                  <FileText size={20} className="text-indigo-400" />
                </div>

                <div>
                  <p className="text-white font-medium">{doc.doc_type}</p>

                  <p className="text-gray-500 text-xs">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  window.open(
                    doc.file_url.startsWith("http")
                      ? doc.file_url
                      : `http://localhost:8000${doc.file_url}`,
                    "_blank",
                  )
                }
                className="text-indigo-400 text-xs hover:underline text-left"
              >
                View File →
              </button>

              <button
                onClick={() => handleDelete(doc.id)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-900 text-rose-400 hover:bg-rose-800 text-sm transition"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : selectedStudent ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center">
          <p className="text-gray-500">No documents found for this student.</p>
        </div>
      ) : null}

      {/* Upload Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Upload Document
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
              <select
                value={form.doc_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    doc_type: e.target.value,
                  })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="">Select Document Type</option>
                <option value="Aadhar Card">Aadhar Card</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Photo">Photo</option>
                <option value="Certificate">Certificate</option>
                <option value="Other">Other</option>
              </select>

              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      file: e.target.files[0],
                    })
                  }
                />

                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload size={24} className="mx-auto text-gray-500 mb-2" />

                  <p className="text-gray-400 text-sm">
                    {form.file
                      ? form.file.name
                      : "Click to upload JPG, PNG or PDF"}
                  </p>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
