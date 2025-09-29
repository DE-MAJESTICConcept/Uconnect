import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../api/profileService"; // adjust path

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyProfile();
        // ✅ normalize just based on what your backend actually returns
        setUser({
          id: data?._id || "",
          name: data?.name || "Unnamed",
          avatarUrl: data?.avatar || "", // only use what exists
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="flex justify-between items-center px-5 py-3 max-w-[1000px] mx-auto mb-4">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full border-2 overflow-hidden flex items-center justify-center bg-gray-200">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm text-gray-500">
              {user?.name?.[0] ?? "U"}
            </span>
          )}
        </div>

        {/* Greeting */}
        <span className="text-white font-semibold text-lg">
          Hello, {user?.name ?? "User"}
        </span>
      </div>
    </header>
  );
};

export default Header;
