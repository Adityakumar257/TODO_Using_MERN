import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="admin">
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
