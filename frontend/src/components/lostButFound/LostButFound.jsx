import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import SearchBar from './SearchBar';
import ActionCard from './ActionCard';
import RecentItems from './RecentItems';
import LostItemForm from './LostItemForm';
import FoundItemForm from './FoundItemForm';
import lost from '../../assets/images/lost.png';
import found from '../../assets/images/found.png';


function LostButFound() {
  return (
    // Replaced the simple `min-h-screen` and `main-wrapper` with the specific gradient background and font styles.
    <div className="min-h-screen bg-gradient-to-br from-[#090c9b] to-[#6c4ebd] text-white flex flex-col justify-center items-center font-['Segoe UI', Tahoma, Geneva, Verdana, sans-serif]">
      {/* Replaced the `main-wrapper` div with the bordered container from the first code. */}
      <div className="border-2 border-white rounded-md max-w-[1150px] w-full my-8 px-8 py-8 md:p-8 bg-transparent">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <SearchBar />
              {/* Replaced the `<hr>` element with the thin, translucent `div` from the first code. */}
              <div className="w-full max-w-[1020px] h-px bg-white/20 my-6 mx-auto"></div>
              <ActionCard
                title="Did you lose an item?"
                subtitle="Misplace something important on campus? We got you covered"
                imgSrc={lost}
                buttonText="Report it here"
                // Kept the original working link from the second code.
                link="/lostButFound/report-lost"
              />
              {/* Replaced the `<hr>` element with the thin, translucent `div` from the first code. */}
              <div className="w-full max-w-[1020px] h-px bg-white/20 my-6 mx-auto"></div>
              <ActionCard
                title="Did you find a misplaced item?"
                subtitle="Spotted something that is not yours but looks so precious to someone? Let's help you return it to the owner."
                imgSrc={found}
                buttonText="Report it here"
                // Kept the original working link from the second code.
                link="/lostButFound/report-found"
              />
              <RecentItems />
            </>
          } />
          <Route
            path="/report-lost"
            element={
              <>
                {console.log('Rendering LostItemForm')}
                <LostItemForm onBack={() => window.history.back()} />
              </>
            }
          />
          <Route
            path="/report-found"
            element={
              <>
                {console.log('Rendering FoundItemForm')}
                <FoundItemForm onBack={() => window.history.back()} />
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default LostButFound;

// // src/components/lostButFound/LostButFound.jsx
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Header from "./Header";
// import SearchBar from "./SearchBar";
// import ActionCard from "./ActionCard";
// import RecentItems from "./RecentItems";
// import LostItemForm from "./LostItemForm";
// import FoundItemForm from "./FoundItemForm";
// import lost from "../../assets/images/lost.png";
// import found from "../../assets/images/found.png";

// function LostButFound() {
//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 sm:p-6 md:p-8">
//       <div className="w-full max-w-6xl">
//         <Header />

//         <Routes>
//           {/* Main Lost & Found page */}
//           <Route
//             path="/"
//             element={
//               <div className="space-y-8">
//                 <SearchBar />

//                 <div className="border-t border-gray-300 my-6"></div>

//                 <ActionCard
//                   title="Did you lose an item?"
//                   subtitle="Misplace something important on campus? We got you covered."
//                   imgSrc={lost}
//                   buttonText="Report it here"
//                   imgWidth={450}
//                   imgHeight={370}
//                   link="/lostButFound/report-lost"
//                 />

//                 <div className="border-t border-gray-300 my-6"></div>

//                 <ActionCard
//                   title="Did you find a misplaced item?"
//                   subtitle="Spotted something that is not yours but looks so precious to someone? Let's help you return it."
//                   imgSrc={found}
//                   buttonText="Report it here"
//                   imgWidth={450}
//                   imgHeight={370}
//                   link="/lostButFound/report-found"
//                 />

//                 <RecentItems />
//               </div>
//             }
//           />

//           {/* Report Lost Item form */}
//           <Route
//             path="/report-lost"
//             element={<LostItemForm onBack={() => window.history.back()} />}
//           />

//           {/* Report Found Item form */}
//           <Route
//             path="/report-found"
//             element={<FoundItemForm onBack={() => window.history.back()} />}
//           />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default LostButFound;
