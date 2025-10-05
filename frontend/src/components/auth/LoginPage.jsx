import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://uconnect-backend-2qnn.onrender.com/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="w-80 bg-white shadow-md rounded-lg p-6 space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}










