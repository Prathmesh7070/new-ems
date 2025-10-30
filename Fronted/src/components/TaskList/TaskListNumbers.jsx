import React from "react";

const TaskListNumbers = ({ taskCounts = {} }) => {
  const getColor = (status) => {
    switch (status) {
      case "newTask":
        return "from-emerald-500 via-emerald-600 to-teal-700 shadow-emerald-400/40";
      case "active":
        return "from-green-500 via-green-600 to-emerald-800 shadow-emerald-400/50";
      case "completed":
        return "from-blue-500 via-blue-600 to-indigo-800 shadow-blue-500/50";
      case "failed":
        return "from-red-500 via-rose-600 to-pink-800 shadow-red-500/50";
      default:
        return "from-gray-500 via-gray-600 to-gray-700 shadow-gray-400/40";
    }
  };

  return (
    <div className="flex flex-wrap mt-10 justify-between gap-6">
      {Object.entries(taskCounts).map(([key, value]) => (
        <div
          key={key}
          className={`
            w-[45%] py-10 px-10 rounded-2xl text-white 
            bg-gradient-to-br ${getColor(key)}
            backdrop-blur-lg border border-white/10
            transition-all duration-500 transform
            hover:scale-105 hover:shadow-2xl
            hover:shadow-emerald-400/40 animate-fadeIn
            relative overflow-hidden
          `}
        >
          {/* Soft Glow Overlay */}
          <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-10 pointer-events-none"></div>

          {/* Task Count Number */}
          <h2
            className="text-5xl md:text-6xl font-extrabold text-center tracking-tight relative z-10
              text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-200 
              drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
          >
            {value ?? 0}
          </h2>

          {/* Task Label */}
          <h3
            className="text-xl md:text-2xl mt-3 font-semibold text-center tracking-wide relative z-10 
              text-white/90 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
          >
            {key === "newTask"
              ? "New Task"
              : key.charAt(0).toUpperCase() + key.slice(1)}
          </h3>

          {/* Animated Shine */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 via-white/30 to-white/10 opacity-0 hover:opacity-40 animate-shimmer rounded-2xl pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
};

export default TaskListNumbers;
