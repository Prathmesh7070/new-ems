import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages and Components
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login/:role" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        

        {/* Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
