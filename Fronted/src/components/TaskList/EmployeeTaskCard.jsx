import React, { useState } from "react";

const EmployeeTaskCard = ({ task, updateTaskStatus }) => {
  const [clickedStatus, setClickedStatus] = useState("");
  const [file, setFile] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "from-gray-700/70 to-gray-800/70 border-gray-600/50";
      case "active":
        return "from-emerald-600/60 to-emerald-800/60 border-emerald-500/40";
      case "completed":
        return "from-blue-600/60 to-blue-800/60 border-blue-500/40";
      case "failed":
        return "from-red-600/60 to-red-800/60 border-red-500/40";
      default:
        return "from-gray-700/70 to-gray-800/70 border-gray-600/50";
    }
  };

  const handleClick = (status) => {
    setClickedStatus(status);
    updateTaskStatus(task._id, status);
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file first");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `https://project-for-ems.onrender.com/api/tasks/upload/${task._id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("✅ File uploaded successfully");
      } else {
        alert(data.message || "Error uploading file");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Something went wrong while uploading file");
    }
  };

  return (
    <div
      className={`w-full md:w-[48%] p-6 rounded-2xl text-white border bg-gradient-to-br ${getStatusColor(
        task.status
      )} shadow-lg backdrop-blur-md transform hover:-translate-y-1 transition-all duration-300`}
    >
      {/* Task Title */}
      <h3 className="text-2xl font-semibold mb-2">{task.title}</h3>
      <p className="text-sm text-gray-200 mb-4">
        {task.description || "No description provided"}
      </p>

      {/* Meta Info */}
      <div className="flex justify-between text-xs text-gray-300 mb-4">
        <p>📁 {task.category || "General"}</p>
        <p>🗓 {new Date(task.date).toLocaleDateString()}</p>
      </div>

      {/* ✅ File Upload Section */}
      <div className="mt-4 p-3 bg-[#1e1e1e]/80 border border-gray-700 rounded-xl shadow-inner">
        <label className="block text-sm font-medium text-emerald-400 mb-2">
          📤 Upload File
        </label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 text-sm text-gray-200 bg-[#2b2b2b] border border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200"
          />
          <button
            onClick={handleFileUpload}
            type="button"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white 
            shadow-[0_0_10px_rgba(168,85,247,0.6)] hover:shadow-[0_0_16px_rgba(168,85,247,0.8)] 
            transition-all duration-300"
          >
            Upload
          </button>
        </div>
        {task.submissionFile && (
          <p className="mt-2 text-green-400 text-xs break-all">
            ✅ Uploaded: {task.submissionFile}
          </p>
        )}
      </div>

      {/* ✅ Status Buttons */}
      <div className="flex gap-3 mt-5">
        {/* Accept Button */}
        <button
          onClick={() => handleClick("active")}
          className={`px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 
            hover:text-gray-900 shadow-[0_0_12px_rgba(16,185,129,0.7)] 
            hover:shadow-[0_0_20px_rgba(16,185,129,0.9)] transition-all duration-300 text-sm
            ${clickedStatus === "active" ? "ring-2 ring-emerald-300" : ""}`}
        >
          Accept
        </button>

        {/* Complete Button */}
        <button
          onClick={() => handleClick("completed")}
          className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm text-white font-semibold 
            shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:shadow-[0_0_18px_rgba(59,130,246,0.8)] 
            transition-all duration-300 ${
              clickedStatus === "completed" ? "ring-2 ring-blue-300" : ""
            }`}
        >
          Complete
        </button>

        {/* Fail Button */}
        <button
          onClick={() => handleClick("failed")}
          className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm text-white font-semibold 
            shadow-[0_0_12px_rgba(239,68,68,0.6)] hover:shadow-[0_0_18px_rgba(239,68,68,0.8)] 
            transition-all duration-300 ${
              clickedStatus === "failed" ? "ring-2 ring-red-300" : ""
            }`}
        >
          Fail
        </button>
      </div>
    </div>
  );
};

export default EmployeeTaskCard;
