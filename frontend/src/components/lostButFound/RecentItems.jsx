import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFoundItems } from "../../api/itemsService";

const RecentItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    fetchRecentItems();
  }, []);

const fetchRecentItems = async () => {
  try {
    setLoading(true);
    const items = await getFoundItems(); // already returns an array
    console.log("Recent items API:", items);
    setItems(items || []);
  } catch (err) {
    setError("Failed to load recent items");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const handleClaim = (itemId) => {
    navigate("report-lost", {
      state: {
        claimingItem: itemId,
        isClaimMode: true,
      },
    });
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString();

  return (
    <div className="max-w-[1000px] mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">History of Recently Found Items</h3>
        <button
          className="text-[#4a2db4] font-medium hover:underline"
          onClick={() => setShowItems(!showItems)}
        >
          {showItems ? "Hide Items" : "See all"}
        </button>
      </div>

      {error && <div className="text-center text-red-400">{error}</div>}

      {loading && (
        <div className="text-center text-white/70">Loading recent items...</div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center text-white/70">No recent items found.</div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, showItems ? items.length : 3).map((item) => (
            <div
              key={item._id}
              className="bg-[#4a2db4]/50 rounded-xl p-4 shadow-lg flex flex-col items-center text-center"
            >
              {/* Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center mb-4 bg-white border-2 border-gray-300">
                {item.image ? (
                  <img
                   src={`http://localhost:5000${item.image}`}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.classList.add("hidden");
                      e.target.nextSibling.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div
                  className="no-image-placeholder text-xs text-gray-500 p-2"
                  style={{ display: item.image ? "none" : "flex" }}
                >
                  No Image
                </div>
              </div>

              {/* Details */}
              <h4 className="font-semibold text-white text-lg">{item.itemName}</h4>
              <p className="text-sm text-white/80 line-clamp-2 mb-2">
                {item.itemDescription}
              </p>
              <div className="flex flex-col items-center space-y-1 text-xs text-white/60">
                <span>📍 {item.foundLocation}</span>
                <span>🗓️ {formatDate(item.dateFound || item.createdAt)}</span>
              </div>

              {/* Claim button */}
              <button
                className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-full mt-4 hover:bg-purple-700 transition"
                onClick={() => handleClaim(item._id)}
              >
                Claim Item
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentItems;






// // src/components/lostButFound/RecentItems.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getFoundItems } from '../../api/api';

// const RecentItems = () => {
//   const navigate = useNavigate();
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showItems, setShowItems] = useState(false);

//   useEffect(() => {
//     fetchRecentItems();
//   }, []);

//   const fetchRecentItems = async () => {
//     try {
//       setLoading(true);
//       const response = await getFoundItems();
//       setItems(response.data || []);
//     } catch (err) {
//       setError('Failed to load recent items');
//       console.error('Error fetching recent items:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClaim = (itemId) => {
//     navigate('/lostButFound/report-lost', {
//       state: {
//         claimingItem: itemId,
//         isClaimMode: true,
//       },
//     });
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   const toggleShowItems = () => {
//     setShowItems(!showItems);
//   };

//   if (loading) {
//     return (
//       <div className="w-full max-w-4xl px-4 md:px-0 mx-auto mt-8">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold text-gray-800">History of recently found items</h3>
//           <button className="text-gray-500 font-medium px-4 py-2 rounded-full border border-gray-300 cursor-not-allowed">
//             Loading...
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full max-w-4xl px-4 md:px-0 mx-auto mt-8">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold text-gray-800">History of recently found items</h3>
//           <button className="text-red-500 font-medium px-4 py-2 rounded-full border border-red-500 cursor-not-allowed">
//             Error
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-4xl px-4 md:px-0 mx-auto mt-8">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-xl font-semibold text-gray-800">History of recently found items</h3>
//         <button
//           className="text-white bg-[#5D3FD3] font-medium px-4 py-2 rounded-full transition-colors hover:bg-[#4C34B1] focus:outline-none focus:ring-2 focus:ring-[#5D3FD3] focus:ring-offset-2"
//           onClick={toggleShowItems}
//         >
//           {showItems ? 'Hide' : 'See it all'}
//         </button>
//       </div>

//       {showItems && (
//         <>
//           {items.length === 0 ? (
//             <div className="text-center text-gray-500 mt-4 p-4 border rounded-md bg-gray-50">
//               No items found yet. Be the first to report a found item!
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {items.map((item) => (
//                 <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                   <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
//                     {item.image ? (
//                       <img
//                         src={`http://localhost:5000${item.image}`}
//                         alt={item.itemName}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                           e.target.nextSibling.style.display = 'flex';
//                         }}
//                       />
//                     ) : null}
//                     <div
//                       className="absolute inset-0 flex items-center justify-center text-gray-400"
//                       style={{ display: item.image ? 'none' : 'flex' }}
//                     >
//                       No Image
//                     </div>
//                   </div>

//                   <div className="p-4">
//                     <h4 className="text-lg font-bold text-gray-800 truncate">{item.itemName}</h4>
//                     <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.itemDescription}</p>
//                     <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 mt-3">
//                       <span className="flex items-center">
//                         <span className="mr-1 text-gray-400">📍</span>
//                         {item.foundLocation}
//                       </span>
//                       <span className="flex items-center mt-1 sm:mt-0">
//                         <span className="mr-1 text-gray-400">🗓️</span>
//                         {formatDate(item.dateFound)}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="p-4 border-t border-gray-200">
//                     <button
//                       className="w-full text-white bg-[#5D3FD3] py-2 rounded-md font-semibold transition-colors hover:bg-[#4C34B1] focus:outline-none focus:ring-2 focus:ring-[#5D3FD3] focus:ring-offset-2"
//                       onClick={() => handleClaim(item._id)}
//                     >
//                       Claim Item
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default RecentItems;
