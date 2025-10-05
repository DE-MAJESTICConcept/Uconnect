import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    year: "",
    matricNumber: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://uconnect-backend-2qnn.onrender.com/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        profile: {
          department: form.department,
          year: form.year,
          matricNumber: form.matricNumber
        }
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>
      <form 
        onSubmit={handleSubmit} 
        // Changed from w-80 to w-11/12 max-w-lg for full responsiveness
        className="w-11/12 max-w-lg bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />

        <select name="role" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>

        <input name="department" placeholder="Department" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
        <input name="year" type="number" placeholder="Year" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
        <input name="matricNumber" placeholder="Matric Number" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}


// import { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

// export default function RegisterPage() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "student",
//     department: "",
//     year: "",
//     matricNumber: ""
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/auth/register", {
//         name: form.name,
//         email: form.email,
//         password: form.password,
//         role: form.role,
//         profile: {
//           department: form.department,
//           year: form.year,
//           matricNumber: form.matricNumber
//         }
//       });
//       alert("Registration successful! Please login.");
//       navigate("/login");
//     } catch (err) {
//       alert(err.response?.data?.error || "Registration failed");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>
//       <form onSubmit={handleSubmit} className="w-80 bg-white shadow-md rounded-lg p-6 space-y-4">
//         <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
//         <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />

//         <select name="role" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
//           <option value="student">Student</option>
//           <option value="admin">Admin</option>
//           <option value="staff">Staff</option>
//         </select>

//         <input name="department" placeholder="Department" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
//         <input name="year" type="number" placeholder="Year" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
//         <input name="matricNumber" placeholder="Matric Number" onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />

//         <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium">
//           Register
//         </button>
//       </form>
//       <p className="mt-4 text-sm text-gray-600">
//         Already have an account?{" "}
//         <Link to="/login" className="text-blue-600 hover:underline">
//           Login
//         </Link>
//       </p>
//     </div>
//   );
// }
