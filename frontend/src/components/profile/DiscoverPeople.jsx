import { useEffect, useState } from "react";
import { discoverPeople } from "../../api/profileService";

const DiscoverPeople = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await discoverPeople();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch discover people:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Discover People</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id} className="p-2 border-b">
            <div className="flex items-center space-x-3">
              <img
                src={u.profile?.avatar || "/default-avatar.png"}
                alt={u.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-500">{u.profile?.department}</p>
              </div>
              {/* TODO: Add Send Friend Request button here */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscoverPeople;
