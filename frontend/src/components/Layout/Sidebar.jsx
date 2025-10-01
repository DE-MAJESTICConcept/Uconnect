import React from "react";
import { Home, User, MessageCircle, Settings, LogOut, Users,Trash, PackageSearch } from "lucide-react";
import { NavLink } from "react-router-dom";
// IMPORTANT: adjust this path if your hook file is named/located differently.
// If you used the single-file provider/hook earlier, import from "../../context/FriendsContext" instead.
import { useFriends } from "../../context/useFriends";

const Sidebar = () => {
  const { requests = [] } = (() => {
    try {
      return useFriends();
    } catch (e) {
      // If the hook isn't available (not wrapped or path wrong), fail gracefully
      return { requests: [] };
    }
  })();

  const pendingCount = Array.isArray(requests) ? requests.length : 0;

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "AdminProfile", path: "/admin/profile", icon: <User size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageCircle size={20} /> },
    // Friends inserted as a normal nav item (with badge)
    { name: "Friends", path: "/friends", icon: <Users size={20} />, badge: pendingCount },
    { name: "GreenCampus", path: "/green-campus", icon: <Trash size={20} /> },
    { name: "LostButFound", path: "/lostButFound", icon: <PackageSearch size={20} /> },
    { name: "TeacherStyle", path: "/styles", icon: <Settings size={20} /> },
    { name: "MatchLearningStyle", path: "/match-style", icon: <Settings size={20} /> },

  ];

  return (
    // Added 'hidden md:flex' so the sidebar is hidden by default on mobile,
    // and shown permanently only on desktop
    <div className="w-64 h-full bg-[rgb(41,22,112)] text-white flex flex-col shadow-lg hidden md:flex">
      {/* Logo / Header */}
      <div className="px-6 py-4 text-xl font-bold text-[rgb(196,170,86)] border-b border-gray-700">
        UConnect
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-[rgb(196,170,86)] text-[rgb(41,22,112)] font-semibold"
                    : "hover:bg-[rgb(196,170,86)] hover:text-[rgb(41,22,112)]"
                }`
            }
          >
            <div className="flex items-center gap-3">
              {link.icon}
              <span>{link.name}</span>
            </div>

            {/* optional badge (only shown for Friends) */}
            {link.badge > 0 && (
              <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <div className="px-4 py-4 border-t border-gray-700">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-red-500 hover:text-white">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;







// // src/components/layer/sidebar/Sidebar.jsx
// import React from "react";
// import { Home, User, MessageCircle, Settings, LogOut, Users,Trash, PackageSearch } from "lucide-react";
// import { NavLink } from "react-router-dom";
// // IMPORTANT: adjust this path if your hook file is named/located differently.
// // If you used the single-file provider/hook earlier, import from "../../context/FriendsContext" instead.
// import { useFriends } from "../../context/useFriends";

// const Sidebar = () => {
//   const { requests = [] } = (() => {
//     try {
//       return useFriends();
//     } catch (e) {
//       // If the hook isn't available (not wrapped or path wrong), fail gracefully
//       return { requests: [] };
//     }
//   })();

//   const pendingCount = Array.isArray(requests) ? requests.length : 0;

//   const links = [
//     { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
//     { name: "Profile", path: "/profile", icon: <User size={20} /> },
//      { name: "AdminProfile", path: "/admin/profile", icon: <User size={20} /> },
//     { name: "Messages", path: "/messages", icon: <MessageCircle size={20} /> },
//     // Friends inserted as a normal nav item (with badge)
//     { name: "Friends", path: "/friends", icon: <Users size={20} />, badge: pendingCount },
//     { name: "GreenCampus", path: "/green-campus", icon: <Trash size={20} /> },
//     { name: "LostButFound", path: "/lostButFound", icon: <PackageSearch size={20} /> },
//      { name: "TeacherStyle", path: "/styles", icon: <Settings size={20} /> },
//      { name: "MatchLearningStyle", path: "/match-style", icon: <Settings size={20} /> },

//   ];

//   return (
//     <div className="w-64 h-full bg-[rgb(41,22,112)] text-white flex flex-col shadow-lg">
//       {/* Logo / Header */}
//       <div className="px-6 py-4 text-xl font-bold text-[rgb(196,170,86)] border-b border-gray-700">
//         UConnect
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex-1 px-4 py-6 space-y-2 overflow-auto">
//         {links.map((link) => (
//           <NavLink
//             key={link.name}
//             to={link.path}
//             className={({ isActive }) =>
//               `flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-colors
//                 ${
//                   isActive
//                     ? "bg-[rgb(196,170,86)] text-[rgb(41,22,112)] font-semibold"
//                     : "hover:bg-[rgb(196,170,86)] hover:text-[rgb(41,22,112)]"
//                 }`
//             }
//           >
//             <div className="flex items-center gap-3">
//               {link.icon}
//               <span>{link.name}</span>
//             </div>

//             {/* optional badge (only shown for Friends) */}
//             {link.badge > 0 && (
//               <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 min-w-[20px] text-center">
//                 {link.badge}
//               </span>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Logout button */}
//       <div className="px-4 py-4 border-t border-gray-700">
//         <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-red-500 hover:text-white">
//           <LogOut size={20} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;




