import { useEffect, useState } from "react";
// API endpoints ke names sahi kiye (getStudents, getCourses, etc.)
import { getStudents, getCourses, getEnrollments, getAllLogs } from "../api";
import { Users, BookOpen, ClipboardList, Activity } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    enrollments: 0,
    logs: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Promise.allSettled ek API ke fail hone par dusri ko block nahi karega
        const results = await Promise.allSettled([
          getStudents(),
          getCourses(),
          getEnrollments(),
          getAllLogs(),
        ]);

        // Agar API success hui toh data nikalo, warna khali array [] de do
        const studentsData =
          results[0].status === "fulfilled" ? results[0].value.data : [];
        const coursesData =
          results[1].status === "fulfilled" ? results[1].value.data : [];
        const enrollmentsData =
          results[2].status === "fulfilled" ? results[2].value.data : [];
        const logsData =
          results[3].status === "fulfilled" ? results[3].value.data : [];

        setStats({
          students: studentsData.length || 0,
          courses: coursesData.length || 0,
          enrollments: enrollmentsData.length || 0,
          logs: logsData.length || 0,
        });

        setRecentLogs(logsData.slice(0, 5) || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      label: "Total Students",
      value: stats.students,
      icon: <Users size={24} />,
      color: "bg-indigo-600",
    },
    {
      label: "Total Courses",
      value: stats.courses,
      icon: <BookOpen size={24} />,
      color: "bg-emerald-600",
    },
    {
      label: "Enrollments",
      value: stats.enrollments,
      icon: <ClipboardList size={24} />,
      color: "bg-amber-600",
    },
    {
      label: "Activity Logs",
      value: stats.logs,
      icon: <Activity size={24} />,
      color: "bg-rose-600",
    },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-gray-900 rounded-xl p-5 flex items-center gap-4 border border-gray-800"
          >
            <div className={`${card.color} p-3 rounded-lg`}>{card.icon}</div>
            <div>
              <p className="text-gray-400 text-sm">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Logs */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    log.action_type === "CREATE"
                      ? "bg-emerald-900 text-emerald-400"
                      : log.action_type === "UPDATE"
                        ? "bg-indigo-900 text-indigo-400"
                        : log.action_type === "DELETE"
                          ? "bg-rose-900 text-rose-400"
                          : "bg-amber-900 text-amber-400"
                  }`}
                >
                  {log.action_type}
                </span>
                <p className="text-sm text-gray-300">{log.description}</p>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
          ))}
          {recentLogs.length === 0 && (
            <p className="text-gray-500 text-sm">
              No recent activity logs available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
