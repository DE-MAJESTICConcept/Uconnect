import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionCard = ({ title, subtitle, imgSrc, buttonText, link }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-4 lg:gap-5 bg-white/10 rounded-xl p-5 md:p-4 lg:p-5 mx-auto max-w-[1000px] text-center md:text-left">
      <div className="max-w-full md:max-w-[400px]">
        <h2 className="text-2xl md:text-xl lg:text-2xl font-bold mb-2">{title}</h2>
        <p className="text-base md:text-sm lg:text-base text-gray-300 mb-6 md:mb-4 lg:mb-6">{subtitle}</p>
        <button
          onClick={() => link && navigate(link)}
          className="bg-white text-[#4a2db4] font-semibold py-3 px-6 md:py-2.5 md:px-5 lg:py-3 lg:px-6 rounded-full border-none cursor-pointer shadow-md transition-all ease-in-out duration-200 hover:bg-gray-100 hover:translate-y-[-2px] hover:shadow-lg"
        >
          {buttonText}
        </button>
      </div>
      <img
        src={imgSrc}
        alt=""
        className="block rounded-2xl bg-white w-full h-auto max-w-[450px] md:max-w-none md:w-[140px] sm:w-[140px]"
      />
    </div>
  );
};

export default ActionCard;








// // src/components/lostButFound/ActionCard.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const ActionCard = ({ title, subtitle, imgSrc, buttonText, link }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-xl overflow-hidden">
      
//       {/* Image */}
//       <div className="flex-shrink-0 w-full md:w-1/2">
//         <img
//           src={imgSrc}
//           alt={title}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Text content */}
//       <div className="p-6 flex flex-col justify-between w-full md:w-1/2 space-y-4">
//         <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
//         <p className="text-gray-600">{subtitle}</p>
//         <button
//           onClick={() => navigate(link)}
//           className="mt-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
//         >
//           {buttonText}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ActionCard;





