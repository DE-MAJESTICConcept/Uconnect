import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react"; // hamburger icon
import FriendRequestsBell from "../friends/FriendRequestsBell";


const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove only on logout
    navigate("/login"); // redirect back
  };

  return (
    <nav className="w-full bg-[rgb(41,22,112)] text-white flex items-center justify-between px-4 sm:px-6 py-3 shadow-md">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded hover:bg-white/10 transition"
        >
          <Menu size={24} />
        </button>
        {/* Added UConnect logo text for mobile visibility */}
        {/* <h1 className="text-xl font-bold tracking-wide text-[rgb(196,170,86)]">UConnect</h1> */}
      </div>


      {/* Right: Search + User + Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search..."
          // Hidden on small screens, shown from sm: block, optimized width
          className="hidden sm:block px-3 py-1 rounded-lg text-gray-800 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[rgb(196,170,86)] w-32 md:w-48 transition-all"
        />
        
        {/* Avatar/Initial */}
        <div className="w-8 h-8 rounded-full bg-[rgb(196,170,86)] text-[rgb(41,22,112)] flex items-center justify-center text-sm font-bold">
          U
        </div>

        <FriendRequestsBell />
        
        <button
          onClick={handleLogout} // only this triggers logout
          // Hidden on extra small screens to save space
          className="bg-[rgb(196,170,86)] text-black px-3 py-1 rounded-lg hover:opacity-90 transition shadow-md hidden sm:block" 
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;







// // import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Menu } from "lucide-react"; // hamburger icon
// import FriendRequestsBell from "../friends/FriendRequestsBell";


// const Navbar = ({ onToggleSidebar }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // remove only on logout
//     navigate("/login"); // redirect back
//   };

//   return (
//     <nav className="w-full bg-[rgb(41,22,112)] text-white flex items-center justify-between px-6 py-3 shadow-md">
//       {/* Left: Hamburger + Logo */}
//       <div className="flex items-center gap-4">
//         {/* Hamburger (mobile only) */}
//         <button
//           onClick={onToggleSidebar}
//           className="md:hidden p-2 rounded hover:bg-white/10"
//         >
//           <Menu size={24} />
//         </button>
//         <h1 className="text-xl font-bold tracking-wide"></h1>
//       </div>


//       {/* Right: Search + User + Logout */}
//       <div className="flex items-center gap-4">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="hidden sm:block px-3 py-1 rounded-lg text-black focus:outline-none"
//         />
//         <div className="w-9 h-9 rounded-full bg-[rgb(21,79,29)] flex items-center justify-center text-sm font-bold">
//           U
//         </div>

//                 <FriendRequestsBell />
             

//         <button
//           onClick={handleLogout} // only this triggers logout
//           className="bg-[rgb(196,170,86)] text-black px-3 py-1 rounded-lg hover:opacity-90"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
