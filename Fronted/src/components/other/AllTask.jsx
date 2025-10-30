// components/other/AllTask.jsx
import React from "react";
import { CheckCircle, Clock, XCircle, PlayCircle, UserX } from "lucide-react";

const AllTask = ({ data = [], onDismiss }) => {
  // Dismiss Employee
  const handleDismissClick = async (id) => {
    if (!id) return alert("Invalid employee ID");
    if (!window.confirm("Are you sure you want to dismiss this employee?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`https://project-for-ems.onrender.com/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await res.json();
      if (!res.ok) return alert(response.message || "Error dismissing employee");

      alert("✅ Employee dismissed successfully!");
      onDismiss && onDismiss(id);
    } catch (err) {
      console.error("Dismiss error:", err);
      alert("Something went wrong dismissing employee");
    }
  };

  // Delete uploaded file
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://project-for-ems.onrender.com/api/tasks/file/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Error deleting file");

      alert("✅ File deleted successfully");
      window.location.reload(); // Refresh page to show updated files
    } catch (err) {
      console.error(err);
      alert("Error deleting file");
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-xl border border-gray-700 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Employee Task Overview
        </h2>
        <p className="text-sm text-gray-400">Admin Panel • Task Summary</p>
      </div>

      {data.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-lg">
          No employee data available yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((emp) => (
            <div
              key={emp._id}
              className="bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700 p-5 shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {emp.firstName || "Unnamed"}
                </h3>
                <button
                  onClick={() => handleDismissClick(emp._id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                >
                  <UserX size={14} />
                  Dismiss
                </button>
              </div>

              {/* Task Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-400" /> New Tasks
                  </span>
                  <span className="font-bold text-blue-400">
                    {emp.taskCounts?.newTask || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <PlayCircle size={16} className="text-yellow-400" /> Active
                  </span>
                  <span className="font-bold text-yellow-400">
                    {emp.taskCounts?.active || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" /> Completed
                  </span>
                  <span className="font-bold text-emerald-400">
                    {emp.taskCounts?.completed || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <XCircle size={16} className="text-red-400" /> Failed
                  </span>
                  <span className="font-bold text-red-400">
                    {emp.taskCounts?.failed || 0}
                  </span>
                </div>
              </div>

              {/* Uploaded Files */}
              {emp.uploadedFiles && emp.uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">
                    📂 Uploaded Files:
                  </h4>
                  <ul className="space-y-1">
                    {emp.uploadedFiles.map((file) => (
                      <li key={file._id} className="flex items-center justify-between">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-sm"
                        >
                          {file.title || file.filename}
                        </a>
                        <button
                          onClick={() => handleDeleteFile(file._id)}
                          className="text-red-500 text-xs ml-2 hover:underline"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="mt-5 flex justify-end">
                <span className="text-xs text-gray-500">
                  Total Tasks:{" "}
                  {(
                    (emp.taskCounts?.newTask || 0) +
                    (emp.taskCounts?.active || 0) +
                    (emp.taskCounts?.completed || 0) +
                    (emp.taskCounts?.failed || 0)
                  ).toString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTask;
