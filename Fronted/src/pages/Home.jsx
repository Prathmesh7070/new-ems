import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-[#0b0b0b] text-gray-300">

      {/* 🔮 Animated Background Blobs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-10 right-0 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* 🌟 Content */}
      <div className="z-10 text-center animate-fadeIn px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-10 tracking-wide drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
          Welcome to <span className="text-blue-400 glow-text">EMS</span>
        </h1>

        <div className="flex flex-col gap-5 items-center">
          <button
            className="task-btn complete px-8 py-3 rounded-lg text-lg font-semibold w-64"
            onClick={() => navigate("/login/user")}
          >
            <span>Login as User</span>
          </button>

          <button
            className="task-btn accept px-8 py-3 rounded-lg text-lg font-semibold w-64"
            onClick={() => navigate("/login/admin")}
          >
            <span>Login as Admin</span>
          </button>

          <button
            className="task-btn reject px-8 py-3 rounded-lg text-lg font-semibold w-64 mt-4"
            onClick={() => navigate("/signup")}
          >
            <span>Signup</span>
          </button>

          <p className="text-blue-400 font-medium text-lg mt-8 tracking-wide subtle-fade">
            If this is your first time, kindly sign up to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
