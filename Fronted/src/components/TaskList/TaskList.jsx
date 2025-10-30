import React from "react";
import EmployeeTaskCard from "./EmployeeTaskCard";

const TaskList = ({ tasks, updateTaskStatus }) => {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="mt-8 flex flex-wrap gap-8 justify-start bg-gradient-to-br from-[#121212] via-[#151515] to-[#1b1b1b] p-8 rounded-3xl border border-gray-800/60 shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-lg transition-all duration-700 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-fadeIn">
      {tasks.map((task) => (
        <EmployeeTaskCard
          key={task._id}
          task={task}
          updateTaskStatus={updateTaskStatus}
        />
      ))}
    </div>
  );
};

export default TaskList;
