import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-[#1a1a1a] via-[#202020] to-[#2a2a2a] p-6 rounded-2xl shadow-lg border border-gray-700/40 backdrop-blur-sm transition-all duration-300 hover:shadow-emerald-500/20">
      <h1 className="text-gray-100 font-semibold text-2xl leading-snug">
        Hello 👋 <br />
        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
          {username || "User"}
        </span>
      </h1>

      <button
        onClick={logout}
        className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-base font-semibold px-6 py-2.5 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-red-500/40 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Log Out
      </button>
    </div>
  );
};

export default Header;
