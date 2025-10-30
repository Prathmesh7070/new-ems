import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Login = () => {
  const { role } = useParams(); // 'admin' or 'user'
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://project-for-ems.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Adjust role naming (user → employee)
      const expectedRole =
        role.toLowerCase() === "user" ? "employee" : role.toLowerCase();

      if (data.role.toLowerCase() !== expectedRole) {
        alert(`Please login using the correct ${role} account`);
        setLoading(false);
        return;
      }

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      // Redirect based on role
      if (data.role.toLowerCase() === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black">
      <div className="relative bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 p-10 rounded-2xl shadow-2xl w-[24rem] flex flex-col gap-5 hover:shadow-indigo-500/40 transition duration-300">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent mb-3">
          Login as {role}
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-md border border-gray-600 bg-gray-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-md border border-gray-600 bg-gray-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded-md font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-3">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
