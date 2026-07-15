import { useEffect, useState } from "react";
import { getAllLogs, getStudentLogs, getCourseLogs } from "../api";
import { getStudents, getCourses } from "../api";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [s, c] = await Promise.all([getStudents(), getCourses()]);
        setStudents(s.data);
        setCourses(c.data);
      } catch (err) {
        console.error("Error fetching metadata:", err);
      }
    };
    fetchMeta();
    fetchLogs("all", "");
  }, []);

  const fetchLogs = async (type, id) => {
    setLoading(true);
    try {
      let res;
      if (type === "all") res = await getAllLogs();
      else if (type === "student" && id) res = await getStudentLogs(id);
      else if (type === "course" && id) res = await getCourseLogs(id);
      else res = await getAllLogs();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setFilter(type);
    setSelectedId("");
    if (type === "all") fetchLogs("all", "");
  };

  const handleIdChange = (e) => {
    setSelectedId(e.target.value);
    if (e.target.value) fetchLogs(filter, e.target.value);
  };

  const actionColor = (type) => {
    switch (type) {
      case "CREATE": return "bg-emerald-900 text-emerald-400";
      case "UPDATE": return "bg-indigo-900 text-indigo-400";
      case "DELETE": return "bg-rose-900 text-rose-400";
      case "UPLOAD": return "bg-amber-900 text-amber-400";
      case "LOGIN": return "bg-cyan-900 text-cyan-400";
      default: return "bg-gray-800 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Activity Logs</h1>

      {/* Filters */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex flex-wrap gap-3 items-center">
        {["all", "student", "course"].map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
              filter === type
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {type === "all" ? "All Logs" : `By ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </button>
        ))}

        {filter === "student" && (
          <select
            value={selectedId}
            onChange={handleIdChange}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}

        {filter === "course" && (
          <select
            value={selectedId}
            onChange={handleIdChange}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Logs List */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : logs.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-10 text-center">
          <p className="text-gray-500">No logs found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${actionColor(log.action_type)}`}>
                    {log.action_type}
                  </span>
                  <p className="text-gray-300 text-sm">{log.description}</p>
                </div>
                <p className="text-gray-500 text-xs">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </button>

              {/* Expanded Block (Merged Code) */}
              {expanded === log.id && (
                <div className="px-5 pb-4 space-y-3 border-t border-gray-800/50 pt-3">
                  
                  {/* Info Row - Student, Course, Status */}
                  <div className="flex flex-wrap gap-3">
                    {log.student_id && (
                      <div className="bg-gray-800 rounded-lg p-3 flex-1 min-w-[120px]">
                        <p className="text-gray-500 text-xs mb-1 font-medium">STUDENT</p>
                        <p className="text-white text-sm font-medium">
                          {students.find(s => s.id === log.student_id)?.name || `ID: ${log.student_id}`}
                        </p>
                      </div>
                    )}
                    {log.course_id && (
                      <div className="bg-gray-800 rounded-lg p-3 flex-1 min-w-[120px]">
                        <p className="text-gray-500 text-xs mb-1 font-medium">COURSE</p>
                        <p className="text-white text-sm font-medium">
                          {courses.find(c => c.id === log.course_id)?.name || `ID: ${log.course_id}`}
                        </p>
                      </div>
                    )}
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-1 font-medium">STATUS</p>
                      <p className={`text-sm font-medium ${log.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {log.status?.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Performed By Section */}
                  {log.performed_by_name && (
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-1 font-medium">PERFORMED BY</p>
                      <p className="text-indigo-400 text-sm font-semibold">
                        {log.performed_by_name}
                        <span className="text-gray-500 ml-2 text-xs font-normal capitalize">
                          ({log.performed_by_role})
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Changes Section (Before / After Grid) */}
                  {log.changes && Object.keys(log.changes).length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-gray-500 text-xs mb-2 font-medium">BEFORE</p>
                        {Object.entries(log.changes).map(([key, val]) => (
                          <p key={key} className="text-rose-400 text-sm break-all">
                            <span className="text-gray-400">{key}:</span> {String(val?.old ?? "null")}
                          </p>
                        ))}
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <p className="text-gray-500 text-xs mb-2 font-medium">AFTER</p>
                        {Object.entries(log.changes).map(([key, val]) => (
                          <p key={key} className="text-emerald-400 text-sm break-all">
                            <span className="text-gray-400">{key}:</span> {String(val?.new ?? "null")}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}