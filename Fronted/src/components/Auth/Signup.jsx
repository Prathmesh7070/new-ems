import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // basic email validation
    if (!formData.email.includes("@")) {
      setMessage("Please enter a valid email address with '@'.");
      setLoading(false);
      return;
    }

    try {
      // auto-generate username from email
      const username = formData.email.split("@")[0];
      const payload = { ...formData, username };

      const res = await fetch("https://project-for-ems.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login/user"), 1200);
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-black">
      {/* Animated glowing blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <motion.div
        className="relative z-10 flex flex-col bg-gray-800/40 backdrop-blur-xl border border-gray-700/40 p-10 rounded-2xl shadow-2xl w-[24rem] gap-5 text-white hover:shadow-[0_0_30px_#6366f1]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-3 rounded-md border border-gray-600 bg-gray-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />

          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="px-4 py-3 rounded-md border border-gray-600 bg-gray-900/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded-md font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/40"
          >
            <span className="relative z-10">
              {loading ? "Signing up..." : "Signup"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 opacity-0 hover:opacity-100 transition-all duration-700 blur-xl"></div>
          </motion.button>
        </form>

        {message && (
          <p
            className={`text-center text-sm ${
              message.toLowerCase().includes("success")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Signup;
