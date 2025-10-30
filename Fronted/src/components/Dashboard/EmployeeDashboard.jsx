import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../other/Header";
import TaskList from "../TaskList/TaskList";
import TaskListNumbers from "../TaskList/TaskListNumbers";

const EmployeeDashboard = ({ changeUser }) => {
  const [tasks, setTasks] = useState([]);
  const [taskCounts, setTaskCounts] = useState({
    newTask: 0,
    active: 0,
    completed: 0,
    failed: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("https://project-for-ems.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch tasks:", res.statusText);
        setLoading(false);
        return;
      }

      const data = await res.json();

      const normalizedTasks = data.map((task) => ({
        ...task,
        status: task.status === "new" ? "newTask" : task.status,
      }));

      setTasks(normalizedTasks);
      updateTaskCounts(normalizedTasks);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");
      const backendStatus = status === "newTask" ? "new" : status;

      const res = await fetch(
        `http://localhost:5000/api/tasks/update-status/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: backendStatus }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        const updatedTasks = tasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        );
        setTasks(updatedTasks);
        updateTaskCounts(updatedTasks);
      } else {
        alert(data.message || "Failed to update task status");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const updateTaskCounts = (tasks) => {
    const counts = { newTask: 0, active: 0, completed: 0, failed: 0 };
    tasks.forEach((task) => {
      counts[task.status] = (counts[task.status] || 0) + 1;
    });
    setTaskCounts(counts);
  };

  const handleLogout = () => {
    changeUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="relative p-10 min-h-screen overflow-hidden text-white bg-gradient-to-br from-[#0f0f0f] via-[#181818] to-[#1d1d1d] backdrop-blur-xl">
      {/* Animated glowing orb background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-20%] w-[400px] h-[400px] bg-emerald-600/30 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[180px] rounded-full animate-pulse-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        <div className="animate-fadeIn">
          <Header changeUser={changeUser} onLogout={handleLogout} />
        </div>

        <div className="animate-slideUp">
          <TaskListNumbers taskCounts={taskCounts} />
        </div>

        <div className="animate-fadeInSlow">
          {loading ? (
            <p className="text-gray-400 text-center mt-10 text-lg tracking-wide">
              ⏳ Loading your personalized tasks...
            </p>
          ) : tasks.length === 0 ? (
            <p className="text-white text-lg mt-10 text-center tracking-wide">
              🚀 No tasks assigned yet. Please wait for your admin to assign new tasks.
            </p>
          ) : (
            <TaskList tasks={tasks} updateTaskStatus={updateTaskStatus} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
