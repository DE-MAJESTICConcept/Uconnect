import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchItems } from "../../api/itemsService";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await searchItems(searchQuery); // Axios response
      console.log("Search API response:", response);
      setSearchResults(response.data || []);
      setShowResults(true);
    } catch (err) {
      setError(err.message || "Error searching items");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
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

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setError("");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString();

  return (
    <div className="relative max-w-4xl mx-auto my-8 px-4">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for lost/found items..."
          className="w-full pl-12 pr-10 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500"
        >
          🔍
        </button>
        {searchQuery && (
          <button
            onClick={clearSearch}
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500"
          >
            ✖
          </button>
        )}
      </form>

      {showResults && (
        <div className="mt-4 bg-gray-700/50 p-4 rounded-xl shadow-lg">
          {isLoading && <div className="text-center py-4">Searching...</div>}
          {error && <div className="text-center text-red-400 py-4">{error}</div>}
          {!isLoading && searchResults.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              No items found.
            </div>
          )}

          <div className="search-results-list space-y-4">
            {searchResults.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 py-3 border-b border-gray-600"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-gray-500">
                  {item.image ? (
                    <img
                      src={`https://uconnect-backend-2qnn.onrender.com${item.image}`}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.classList.add("hidden");
                        e.target.nextSibling.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className="no-image-placeholder flex items-center justify-center text-xs text-gray-300 w-full h-full"
                    style={{ display: item.image ? "none" : "flex" }}
                  >
                    No Image
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold">{item.itemName}</h4>
                  <p className="text-sm text-gray-400 truncate">
                    {item.itemDescription}
                  </p>
                  <div className="flex flex-wrap gap-x-4 text-xs text-gray-400 mt-1">
                    <span>
                      Location:{" "}
                      {item.status === "found"
                        ? item.foundLocation
                        : item.lastLocation}
                    </span>
                    <span>
                      Date:{" "}
                      {formatDate(
                        item.status === "found"
                          ? item.dateFound
                          : item.dateLost || item.createdAt
                      )}
                    </span>
                    <span>Status: {item.status}</span>
                  </div>
                </div>

                {/* Claim button */}
                <div>
                  <button
                    className="bg-purple-600 text-white font-medium py-2 px-4 rounded-full text-xs hover:bg-purple-700 transition"
                    onClick={() => handleClaim(item._id)}
                  >
                    Claim Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;










// import React, { useState } from 'react';
// import { FaSearch, FaTimes } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// import { searchItems } from '../../api/api';

// const SearchBar = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;

//     setIsLoading(true);
//     setError('');
    
//     try {
//       const response = await searchItems(searchQuery);
//       setSearchResults(response.data || []);
//       setShowResults(true);
//     } catch (err) {
//       setError(err.message || 'Error searching items');
//       setSearchResults([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClaim = (itemId) => {
//     navigate('/report-lost', { 
//       state: { claimingItem: itemId, isClaimMode: true } 
//     });
//   };

//   const clearSearch = () => {
//     setSearchQuery('');
//     setSearchResults([]);
//     setShowResults(false);
//     setError('');
//   };

//   const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

//   return (
//     <div className="relative max-w-[1000px] mx-auto my-4">
//       {/* Search bar */}
//       <div className="flex items-center bg-gray-300 rounded-xl p-3 shadow-md w-full max-w-[850px] mx-auto mt-9">
//         <form onSubmit={handleSearch} className="flex items-center relative w-full">
//           <button
//             type="submit"
//             className="bg-gray-300 text-black p-4 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50"
//             disabled={isLoading}
//           >
//             <FaSearch />
//           </button>

//           <input
//             type="text"
//             className="flex-1 border-none outline-none bg-transparent px-3 py-2 text-sm rounded-full ml-3"
//             placeholder="Search for lost items..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />

//           {searchQuery && (
//             <button
//               type="button"
//               onClick={clearSearch}
//               className="absolute right-3 text-gray-600 hover:text-gray-800 p-1"
//             >
//               <FaTimes />
//             </button>
//           )}
//         </form>
//       </div>

//       {/* Search results */}
//       {showResults && (
//         <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 max-h-[500px] overflow-y-auto z-50">
//           <div className="flex justify-between items-center p-4 border-b border-gray-200 rounded-t-lg bg-gray-100">
//             <h3 className="text-gray-800 text-sm m-0">Search Results ({searchResults.length} found)</h3>
//             <button onClick={clearSearch} className="text-gray-600 hover:text-gray-800 p-1">
//               <FaTimes />
//             </button>
//           </div>

//           {error && (
//             <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded">
//               {error}
//             </div>
//           )}

//           {searchResults.length === 0 && !error && (
//             <div className="p-8 text-center text-gray-500 italic">
//               No items found matching "{searchQuery}". Try different keywords.
//             </div>
//           )}

//           <div className="divide-y divide-gray-200">
//             {searchResults.map((item) => (
//               <div key={item._id} className="flex items-start p-4 hover:bg-gray-100 transition">
//                 {/* Image */}
//                 <div className="w-20 h-20 flex-shrink-0 mr-4">
//                   {item.image ? (
//                     <img
//                       src={`http://localhost:5000${item.image}`}
//                       alt={item.itemName}
//                       className="w-full h-full object-cover rounded-md border border-gray-200"
//                       onError={(e) => { e.target.style.display = 'none'; }}
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gray-200 border border-gray-300 rounded-md flex items-center justify-center text-gray-500 text-xs">
//                       No Image
//                     </div>
//                   )}
//                 </div>

//                 {/* Details */}
//                 <div className="flex-1 mr-4">
//                   <h4 className="text-gray-800 font-semibold text-sm mb-1">{item.itemName}</h4>
//                   <p className="text-gray-500 text-xs mb-2 line-clamp-2">{item.itemDescription}</p>
//                   <div className="flex flex-col gap-1 text-gray-400 text-[10px]">
//                     <span>Found at: {item.foundLocation}</span>
//                     <span>Date: {formatDate(item.dateFound)}</span>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex-shrink-0">
//                   <button
//                     className="bg-green-600 text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-green-700 transition"
//                     onClick={() => handleClaim(item._id)}
//                   >
//                     Claim Item
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;









