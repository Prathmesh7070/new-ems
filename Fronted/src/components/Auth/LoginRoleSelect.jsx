import React from "react";
import { useNavigate } from "react-router-dom";

const LoginRoleSelect = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-2xl font-bold">Login As</h1>
      <button
        onClick={() => navigate("/login/user")}
        className="bg-green-500 text-white px-10 py-3 rounded hover:bg-green-600"
      >
        User
      </button>
      <button
        onClick={() => navigate("/login/admin")}
        className="bg-blue-500 text-white px-10 py-3 rounded hover:bg-blue-600"
      >
        Admin
      </button>
    </div>
  );
};

export default LoginRoleSelect;
