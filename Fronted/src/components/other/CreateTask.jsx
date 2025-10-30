import React, { useState, useEffect } from "react";

const CreateTask = ({ onTaskCreated }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [category, setCategory] = useState("");
  const [employees, setEmployees] = useState([]);

  // 🧩 Fetch employees list for assignment
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://project-for-ems.onrender.com/api/users/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployees([]);
      }
    };
    fetchEmployees();
  }, []);

  // 🧩 Handle task creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignTo) return alert("Please enter an employee email");

    try {
      const token = localStorage.getItem("token");
      const emp = employees.find(
        (e) => e.email?.toLowerCase() === assignTo.toLowerCase()
      );
      if (!emp) return alert("Employee not found with that email");

      const res = await fetch("https://project-for-ems.onrender.com/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          category,
          assignedTo: emp._id,
          date: taskDate || new Date(),
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Error creating task");

      alert("✅ Task created successfully!");
      onTaskCreated && onTaskCreated();

      // Reset form fields
      setTaskTitle("");
      setTaskDescription("");
      setTaskDate("");
      setAssignTo("");
      setCategory("");
    } catch (err) {
      console.error("Error in CreateTask:", err);
      alert("Something went wrong creating the task");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-[#141414] via-[#1f1f1f] to-[#232323] mt-6 rounded-2xl shadow-2xl border border-gray-700/40 backdrop-blur-sm transition-all duration-300 hover:shadow-emerald-500/20">
      <h2 className="text-xl font-semibold text-white mb-6 tracking-wide">
        ✨ Create New Task
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap w-full gap-8 items-start justify-between"
      >
        {/* Left Section */}
        <div className="w-full md:w-1/2 space-y-5">
          <div>
            <h3 className="text-sm text-gray-300 mb-1 font-medium">Task Title</h3>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="text-sm py-2 px-3 w-full rounded-lg bg-[#2a2a2a] border border-gray-600 focus:border-emerald-500 outline-none text-gray-100 placeholder-gray-400 transition-all duration-300"
              type="text"
              placeholder="Make a UI design"
              required
            />
          </div>

          <div>
            <h3 className="text-sm text-gray-300 mb-1 font-medium">Date</h3>
            <input
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="text-sm py-2 px-3 w-full rounded-lg bg-[#2a2a2a] border border-gray-600 focus:border-emerald-500 outline-none text-gray-100 transition-all duration-300"
              type="date"
            />
          </div>

          <div>
            <h3 className="text-sm text-gray-300 mb-1 font-medium">
              Assign To (Email)
            </h3>
            <input
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="text-sm py-2 px-3 w-full rounded-lg bg-[#2a2a2a] border border-gray-600 focus:border-emerald-500 outline-none text-gray-100 placeholder-gray-400 transition-all duration-300"
              type="email"
              placeholder="employee@example.com"
              required
              list="employeeList"
            />
            <datalist id="employeeList">
              {employees.map((e) => (
                <option key={e._id} value={e.email} />
              ))}
            </datalist>
          </div>

          <div>
            <h3 className="text-sm text-gray-300 mb-1 font-medium">Category</h3>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-sm py-2 px-3 w-full rounded-lg bg-[#2a2a2a] border border-gray-600 focus:border-emerald-500 outline-none text-gray-100 placeholder-gray-400 transition-all duration-300"
              type="text"
              placeholder="design, dev, etc"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-2/5 flex flex-col items-start">
          <h3 className="text-sm text-gray-300 mb-1 font-medium">Description</h3>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full h-48 text-sm py-3 px-4 rounded-lg bg-[#2a2a2a] border border-gray-600 focus:border-emerald-500 outline-none text-gray-100 placeholder-gray-400 resize-none transition-all duration-300"
            placeholder="Describe the task details..."
          />
          <button
            type="submit"
            className="bg-emerald-600 py-3 px-6 rounded-lg text-sm font-semibold text-white mt-5 w-full hover:bg-emerald-500 transition-all duration-300 shadow-md hover:shadow-emerald-600/30"
          >
            + Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
