import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState(""); // State to handle error messages
  const navigate = useNavigate();

  // Toggle between login and registration modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "", role: "user" });
    setError(""); // Clear any errors when switching modes
  };

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Login or Register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Set the appropriate URL based on login or registration
    const url = isLogin
      ? "http://localhost:3001/login" // Update this URL to match your backend
      : "http://localhost:3001/register"; // Update this URL to match your backend

    try {
      const res = await axios.post(url, formData);
      console.log(res); // Debug: Log the response from the server

      if (isLogin) {
        localStorage.setItem("token", res.data.token); // Store the token for authenticated requests
        localStorage.setItem("role", res.data.user.role); // Store the user role for redirection

        // Navigate based on user role
        if (res.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      } else {
        alert("Registration successful!");
        setIsLogin(true); // Switch to login mode after successful registration
      }
    } catch (err) {
      console.error(err); // Debug: Log the error
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {/* Display error message if there is an error */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          {!isLogin && (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md cursor-pointer"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-blue-600 underline cursor-pointer"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
