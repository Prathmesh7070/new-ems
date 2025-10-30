import React, { useEffect, useState } from "react";
import Header from "../other/Header";
import CreateTask from "../other/CreateTask";
import AllTask from "../other/AllTask";

const AdminDashboard = ({ changeUser }) => {
  const [overview, setOverview] = useState([]);

  // Fetch employees & tasks
  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://project-for-ems.onrender.com/api/tasks/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error fetching overview:", errorData);
        return;
      }

      const data = await res.json();
      setOverview(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch overview error:", err);
      setOverview([]);
    }
  };

  // Remove employee from UI after dismiss
  const handleDismiss = (employeeId) => {
    setOverview((prev) => prev.filter((emp) => emp._id !== employeeId));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="h-screen w-full p-7 bg-[#1C1C1C] text-white">
      <Header changeUser={changeUser} />
      <CreateTask onTaskCreated={fetchOverview} />
      <AllTask data={overview} onDismiss={handleDismiss} />
    </div>
  );
};

export default AdminDashboard;
