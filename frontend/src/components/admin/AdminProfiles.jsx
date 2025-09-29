import React, { useEffect, useState } from "react";
import { getAllProfile } from "../../api/profileService";
import { getFoundItems, getLostItems } from "../../api/itemsService";
import axios from "axios";

const API_URL = "http://localhost:5000/api/items"; // adjust if needed

const AdminProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorProfiles, setErrorProfiles] = useState("");
  const [errorFound, setErrorFound] = useState("");
  const [errorLost, setErrorLost] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); // 👈 for popup modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilesData, foundData, lostData] = await Promise.all([
          getAllProfile(),
          getFoundItems(),
          getLostItems(),
        ]);

        setProfiles(Array.isArray(profilesData) ? profilesData : []);
        setFoundItems(Array.isArray(foundData) ? foundData : []);
        setLostItems(Array.isArray(lostData) ? lostData : []);
      } catch (err) {
        console.error("Error loading data:", err);
        setErrorProfiles("Failed to load profiles");
        setErrorFound("Failed to load found items");
        setErrorLost("Failed to load lost items");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =============================
  // ACTIONS
  // =============================
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, { status });
      alert("Status updated");
      setSelectedItem(null);
      window.location.reload();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Item deleted");
      setSelectedItem(null);
      window.location.reload();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 space-y-10">
      {/* ------------------- Profiles ------------------- */}
      <div>
        <h1 className="text-2xl font-bold mb-6">All User Profiles</h1>
        {errorProfiles && <p className="text-red-500">{errorProfiles}</p>}
        {profiles.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-[rgb(41,22,112)] text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-left">Matric/Staff No.</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      {user.profile?.department || "-"}
                    </td>
                    <td className="px-4 py-2">{user.profile?.year || "-"}</td>
                    <td className="px-4 py-2">
                      {user.profile?.matricNumber || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------- Found Items ------------------- */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Found Items</h2>
        {errorFound && <p className="text-red-500">{errorFound}</p>}
        {foundItems.length === 0 ? (
          <p>No found items reported.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2 text-left">Item Name</th>
                  <th className="px-4 py-2 text-left">Finder Name</th>
                  <th className="px-4 py-2 text-left">Found Location</th>
                  <th className="px-4 py-2 text-left">Date Reported</th>
                </tr>
              </thead>
              <tbody>
                {foundItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="px-4 py-2">
                      <img
                        src={item.image || "/no-image.png"}
                        alt={item.itemName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">{item.itemName}</td>
                    <td className="px-4 py-2">
                      {item.finderInfo?.fullName || "-"}
                    </td>
                    <td className="px-4 py-2">{item.foundLocation || "-"}</td>
                    <td className="px-4 py-2">
                      {new Date(item.dateReported).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------- Lost Items ------------------- */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Lost Items</h2>
        {errorLost && <p className="text-red-500">{errorLost}</p>}
        {lostItems.length === 0 ? (
          <p>No lost items reported.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-red-700 text-white">
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2 text-left">Item Name</th>
                  <th className="px-4 py-2 text-left">Owner Name</th>
                  <th className="px-4 py-2 text-left">Last Location</th>
                  <th className="px-4 py-2 text-left">Date Lost</th>
                </tr>
              </thead>
              <tbody>
                {lostItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="px-4 py-2">
                      <img
                        src={item.image || "/no-image.png"}
                        alt={item.itemName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">{item.itemName}</td>
                    <td className="px-4 py-2">{item.fullName || "-"}</td>
                    <td className="px-4 py-2">{item.lastLocation || "-"}</td>
                    <td className="px-4 py-2">
                      {item.dateLost
                        ? new Date(item.dateLost).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------- Popup Modal ------------------- */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setSelectedItem(null)}
            >
              ✖
            </button>
            <img
              src={selectedItem.image || "/no-image.png"}
              alt={selectedItem.itemName}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold">{selectedItem.itemName}</h2>
            <p className="mt-2">{selectedItem.itemDescription}</p>
            <p className="text-sm text-gray-600 mt-2">
              Status: {selectedItem.status}
            </p>

            <div className="mt-4 flex justify-between">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(selectedItem._id, "claimed")}
              >
                Mark Claimed
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteItem(selectedItem._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfiles;











// import React, { useEffect, useState } from "react";
// import { getAllProfile } from "../../api/profileService";
// import { getAllItems } from "../../api/itemsService";

// const AdminProfiles = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [items, setItems] = useState([]);
//   const [loadingProfiles, setLoadingProfiles] = useState(true);
//   const [loadingItems, setLoadingItems] = useState(true);
//   const [errorProfiles, setErrorProfiles] = useState("");
//   const [errorItems, setErrorItems] = useState("");

//   useEffect(() => {
//     const fetchProfiles = async () => {
//       try {
//         const data = await getAllProfile();
//         setProfiles(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to load profiles", err);
//         setErrorProfiles("Failed to load profiles");
//       } finally {
//         setLoadingProfiles(false);
//       }
//     };

//  const fetchItems = async () => {
//   try {
//     const data = await getAllItems();
//     console.log("Fetched items:", data); // 👀 see what comes back
//     setItems(Array.isArray(data) ? data : []);
//   } catch (err) {
//     console.error("Failed to load items", err);
//     setErrorItems("Failed to load items");
//   } finally {
//     setLoadingItems(false);
//   }
// };

//     fetchProfiles();
//     fetchItems();
//   }, []);

//   if (loadingProfiles || loadingItems)
//     return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="p-6 space-y-10">
//       {/* ------------------- Profiles Table ------------------- */}
//       <div>
//         <h1 className="text-2xl font-bold mb-6">All User Profiles</h1>
//         {errorProfiles && <p className="text-red-500">{errorProfiles}</p>}
//         {profiles.length === 0 ? (
//           <p>No users found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white rounded-lg shadow">
//               <thead className="bg-[rgb(41,22,112)] text-white">
//                 <tr>
//                   <th className="px-4 py-2 text-left">Name</th>
//                   <th className="px-4 py-2 text-left">Email</th>
//                   <th className="px-4 py-2 text-left">Role</th>
//                   <th className="px-4 py-2 text-left">Department</th>
//                   <th className="px-4 py-2 text-left">Year</th>
//                   <th className="px-4 py-2 text-left">Matric/Staff No.</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {profiles.map((user) => (
//                   <tr
//                     key={user._id}
//                     className="border-b hover:bg-gray-50 transition"
//                   >
//                     <td className="px-4 py-2">{user.name}</td>
//                     <td className="px-4 py-2">{user.email}</td>
//                     <td className="px-4 py-2 capitalize">{user.role}</td>
//                     <td className="px-4 py-2">{user.profile?.department || "-"}</td>
//                     <td className="px-4 py-2">{user.profile?.year || "-"}</td>
//                     <td className="px-4 py-2">{user.profile?.matricNumber || "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ------------------- Lost & Found Table ------------------- */}
//       <div>
//         <h2 className="text-2xl font-bold mb-6">Lost & Found Items</h2>
//         {errorItems && <p className="text-red-500">{errorItems}</p>}
//         {items.length === 0 ? (
//           <p>No items found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white rounded-lg shadow">
//               <thead className="bg-gray-800 text-white">
//                 <tr>
//                   <th className="px-4 py-2 text-left">Item Name</th>
//                   <th className="px-4 py-2 text-left">Status</th>
//                   <th className="px-4 py-2 text-left">Posted By</th>
//                   <th className="px-4 py-2 text-left">Email</th>
//                   <th className="px-4 py-2 text-left">Phone</th>
//                   <th className="px-4 py-2 text-left">Location</th>
//                   <th className="px-4 py-2 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((item) => (
//                   <tr
//                     key={item._id}
//                     className="border-b hover:bg-gray-50 transition"
//                   >
//                     <td className="px-4 py-2">{item.itemName}</td>
//                     <td className="px-4 py-2 capitalize">{item.status}</td>
//                     <td className="px-4 py-2">{item.finderInfo?.fullName || "-"}</td>
//                     <td className="px-4 py-2">{item.finderInfo?.email || "-"}</td>
//                     <td className="px-4 py-2">{item.finderInfo?.phoneNumber || "-"}</td>
//                     <td className="px-4 py-2">{item.foundLocation || item.lastLocation || "-"}</td>
//                     <td className="px-4 py-2">{new Date(item.dateReported).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminProfiles;





