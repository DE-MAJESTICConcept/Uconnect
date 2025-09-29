import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock API call since the original service file is not available
const reportFoundItem = async (formData) => {
  console.log('Reporting found item:', formData);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true, message: 'Report submitted successfully!' };
};

const FoundItemForm = ({ onBack }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    itemName: '',
    dateFound: '',
    timeFound: '',
    foundLocation: '',
    itemDescription: '',
    fullName: '',
    matricNumber: '',
    phoneNumber: '',
    email: '',
    shareInfo: false,
    adminContact: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0] || (e.dataTransfer?.files?.[0]);
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e);
  }, [handleImageChange]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    //  Important: add status field
    formData.append("status", "found");

    //  Use the same key as backend (likely 'image')
    if (image) {
      formData.append("image", image);
    }

    // 🔎 Debug log to verify data
    console.log("Reporting found item:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await reportFoundItem(formData);
      setSubmitStatus({ success: true, message: response.message });
      setShowPopup(true);
      setTimeout(() => navigate('/lostButFound'), 3000);
    } catch (err) {
      setSubmitStatus({ success: false, message: err.message || 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="relative bg-[#eaeaea] rounded-3xl shadow-lg shadow-black/10 p-6 md:p-6 lg:p-6 max-w-[900px] mx-auto my-8 border-4 border-[#4a2db4]">
      <div className="flex justify-between items-start">
        <button onClick={onBack} className="absolute top-6 left-6 bg-transparent border-none text-2xl text-[#4a2db4] cursor-pointer p-2 rounded-md shadow-md shadow-black/10 transition-all duration-200 hover:bg-[#4a2db4] hover:text-white hover:-translate-x-1 hover:shadow-lg z-10 sm:top-4 sm:left-4 sm:text-lg sm:p-1">
          <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <h2 className="text-center bg-[#4a2db4] text-white rounded-2xl p-2 font-bold text-lg md:text-xl lg:text-lg mb-4 w-[60%] mx-auto">Report a Found Item</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="text-center font-bold bg-black text-white rounded-xl p-1.5 md:p-1.5 lg:p-1.5 mb-4 mx-auto w-[80%] text-sm">
          Item Details
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              placeholder="Item Name"
              required
              className="w-full p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a2db4]"
            />
          </div>
          <div className="flex flex-1 gap-4">
            <div className="relative w-full">
              <input
                type="date"
                name="dateFound"
                value={form.dateFound}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a2db4]"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="relative w-full">
              <input
                type="time"
                name="timeFound"
                value={form.timeFound}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a2db4]"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            name="foundLocation"
            value={form.foundLocation}
            onChange={handleChange}
            placeholder="Found Location"
            required
            className="w-full p-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a2db4]"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
        </div>

        <textarea
          name="itemDescription"
          value={form.itemDescription}
          onChange={handleChange}
          placeholder="Detailed Description of the item"
          rows="4"
          required
          className="w-full p-2 rounded-lg border border-gray-300 bg-white text-gray-900 resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-[#4a2db4]"
        ></textarea>

        <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 mb-6 ${isDragging ? 'border-[#4a2db4] bg-[#f0f4ff]' : 'border-gray-300 bg-gray-200/50'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('image-upload').click()}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 text-gray-600 hover:text-red-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 text-gray-500 mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 4-4v4z" clipRule="evenodd"></path>
              </svg>
              <p className="text-sm font-medium text-gray-600">Drag & drop or click to upload image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>
      
        <div className="text-center font-bold bg-black text-white rounded-xl p-1.5 md:p-1.5 lg:p-1.5 mb-4 mx-auto w-[80%] text-sm">
          Your Information
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-2 pl-9 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a2db4]"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              name="matricNumber"
              value={form.matricNumber}
              onChange={handleChange}
              placeholder="Matric Number"
              className="w-full p-2 pl-9 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a2db4]"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2a1 1 0 00-1 1v1h2V3a1 1 0 00-1-1zM5 5h10V3a3 3 0 00-6 0v1h-1a1 1 0 100 2h10a1 1 0 100-2h-1V3a3 3 0 00-6 0v1h-1a1 1 0 100 2h-1a1 1 0 100 2H5a1 1 0 100-2h1a1 1 0 100-2H5a1 1 0 100-2z" />
              <path fillRule="evenodd" d="M3 8a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V8zm3 1a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full p-2 pl-9 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a2db4]"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.928.688l2.022 3.864a1 1 0 01-.132 1.258l-1.66 1.66a8 8 0 006.582 6.582l1.66-1.66a1 1 0 011.258-.132l3.864 2.022a1 1 0 01.688.928V17a1 1 0 01-1 1h-2C7.163 18 3 13.837 3 8V6a1 1 0 011-1z" />
            </svg>
          </div>
          <div className="relative flex-1">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full p-2 pl-9 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a2db4]"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
          <label className="flex items-center space-x-2 cursor-pointer text-gray-800">
            <input 
              type="checkbox" 
              name="shareInfo" 
              checked={form.shareInfo}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-[#4a2db4] rounded-lg border-gray-300 focus:ring-[#4a2db4]"
            />
            <span className="text-sm">I agree to share this information for recovery purposes</span>
          </label>
            
          <label className="flex items-center space-x-2 cursor-pointer text-gray-800">
            <input 
              type="checkbox" 
              name="adminContact" 
              checked={form.adminContact}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-[#4a2db4] rounded-lg border-gray-300 focus:ring-[#4a2db4]"
            />
            <span className="text-sm">Admin can contact me for verification</span>
          </label>
        </div>
          
        <button 
          type="submit" 
          className="bg-[#4a2db4] text-white font-bold py-3 px-6 rounded-lg border-none cursor-pointer transition-all duration-200 uppercase text-xs tracking-wider shadow-md hover:bg-[#3a1ea0] hover:-translate-y-px hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed w-full md:w-[20%] mx-auto block mb-5"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
          
        {submitStatus.message && (
          <div className={`p-3 rounded-lg text-center ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default FoundItemForm;










// import React, { useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { reportFoundItem } from '../../api/api';
// import { FaArrowLeft, FaImage, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';

// const FoundItemForm = ({ onBack }) => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     itemName: '', dateFound: '', timeFound: '', foundLocation: '', itemDescription: '',
//     fullName: '', matricNumber: '', phoneNumber: '', email: '', shareInfo: false, adminContact: false
//   });
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
//   const [showPopup, setShowPopup] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   const handleImageChange = useCallback((e) => {
//     const file = e.target.files?.[0] || (e.dataTransfer?.files?.[0]);
//     if (file && file.type.startsWith('image/')) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   }, []);

//   const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
//   const handleDragLeave = () => setIsDragging(false);
//   const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleImageChange(e); };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.itemName || !form.dateFound || !form.timeFound || !form.foundLocation ||
//         !form.itemDescription || !form.fullName || !form.phoneNumber || !form.email) {
//       setSubmitStatus({ success: false, message: 'Please fill in all required fields' });
//       return;
//     }
//     setIsSubmitting(true);
//     setSubmitStatus({ success: null, message: '' });
//     try {
//       const formData = new FormData();
//       Object.entries({ ...form, status: 'found' }).forEach(([k, v]) => { if (v !== null && v !== undefined) formData.append(k, v); });
//       if (image) formData.append('image', image);
//       await reportFoundItem(formData);
//       setShowPopup(true);
//       setForm({ itemName: '', dateFound: '', timeFound: '', foundLocation: '', itemDescription: '',
//                 fullName: '', matricNumber: '', phoneNumber: '', email: '', shareInfo: false, adminContact: false });
//       setImage(null); setImagePreview(null);
//     } catch (error) {
//       setSubmitStatus({ success: false, message: error.message || 'Failed to submit form. Please try again.' });
//     } finally { setIsSubmitting(false); }
//   };

//   const handlePopupClose = () => { setShowPopup(false); navigate('/'); };

//   return (
//     <div className="relative max-w-3xl mx-auto p-6 md:p-8 mt-8 bg-gray-100 border-4 border-purple-700 rounded-3xl shadow-lg">
//       {/* Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-8 shadow-xl text-center max-w-sm w-full">
//             <h3 className="text-green-600 text-lg font-bold mb-4">Submission Successful!</h3>
//             <p className="text-gray-600 mb-6">Thank you, Admin will update you if necessary.</p>
//             <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md font-semibold" onClick={handlePopupClose}>OK</button>
//           </div>
//         </div>
//       )}

//       {/* Back Button */}
//       <button className="absolute top-6 left-6 p-2 rounded shadow text-purple-700 hover:bg-purple-700 hover:text-white transition-transform transform hover:-translate-x-1" onClick={onBack} aria-label="Go back">
//         <FaArrowLeft size={24}/>
//       </button>

//       {/* Title */}
//       <h2 className="text-center text-white bg-purple-700 rounded-xl py-2 text-xl font-bold mb-8 border-b-2 border-gray-200 w-4/5 mx-auto">FOUND ITEM REPORT FORM</h2>

//       <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
//         {/* Item Info */}
//         <div className="text-center font-semibold text-lg mb-4">Item Information</div>
        
//         <div className="flex flex-col gap-4">
//           <div className="relative">
//             <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
//             <input type="text" name="itemName" value={form.itemName} onChange={handleChange} placeholder="Item name" required
//               className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 bg-white text-gray-800" />
//           </div>

//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
//               <input type="date" name="dateFound" value={form.dateFound} onChange={handleChange} required
//                 className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 bg-white text-gray-800" />
//             </div>
//             <div className="relative flex-1">
//               <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
//               <input type="time" name="timeFound" value={form.timeFound} onChange={handleChange} required
//                 className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 bg-white text-gray-800" />
//             </div>
//           </div>

//           <div className="relative">
//             <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
//             <input type="text" name="foundLocation" value={form.foundLocation} onChange={handleChange} placeholder="Where was the item found?" required
//               className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 bg-white text-gray-800" />
//           </div>

//           <textarea name="itemDescription" value={form.itemDescription} onChange={handleChange} rows={4} placeholder="Detailed description..." required
//             className="w-full p-4 rounded-lg border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 bg-white text-gray-800 resize-y" />
//         </div>

//         {/* Upload */}
//         <label className={`relative flex flex-col items-center justify-center border-2 rounded-xl p-8 bg-white border-dashed ${isDragging ? 'border-purple-700 bg-purple-50' : ''} ${imagePreview ? 'p-0 bg-white border-solid' : ''}`}
//           onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
//         >
//           {imagePreview ? (
//             <div className="relative w-full h-48 flex items-center justify-center">
//               <img src={imagePreview} alt="Preview" className="max-w-full max-h-72 object-contain"/>
//               <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                 <FaImage className="text-white text-3xl mb-2"/>
//                 <span className="text-white text-sm">Click or drag to change image</span>
//               </div>
//             </div>
//           ) : (
//             <>
//               <FaImage className="text-purple-700 text-3xl mb-2"/>
//               <span className="text-gray-500 text-sm text-center">Drag and drop image here or click to browse</span>
//             </>
//           )}
//           <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
//         </label>

//         {/* Finder Info */}
//         <div className="bg-purple-700 p-4 rounded-2xl text-white">
//           <div className="text-center text-lg font-semibold mb-4">Enter your details</div>
//           <div className="flex flex-col gap-4">
//             <div className="relative">
//               <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200"/>
//               <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" required
//                 className="w-full pl-10 py-3 rounded-2xl border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 text-gray-800"/>
//             </div>
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="relative flex-1">
//                 <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200"/>
//                 <input type="text" name="matricNumber" value={form.matricNumber} onChange={handleChange} placeholder="Matric Number" required
//                   className="w-full pl-10 py-3 rounded-2xl border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 text-gray-800"/>
//               </div>
//               <div className="relative flex-1">
//                 <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200"/>
//                 <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" required
//                   className="w-full pl-10 py-3 rounded-2xl border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 text-gray-800"/>
//               </div>
//             </div>
//             <div className="relative">
//               <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200"/>
//               <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required
//                 className="w-full pl-10 py-3 rounded-2xl border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 text-gray-800"/>
//             </div>
//           </div>
//         </div>

//         {/* Checkboxes */}
//         <div className="flex flex-col gap-2">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="checkbox" name="shareInfo" checked={form.shareInfo} onChange={handleChange} className="form-checkbox h-5 w-5 text-purple-700"/>
//             <span className="text-gray-800 text-sm">I agree to share this information for recovery purpose</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="checkbox" name="adminContact" checked={form.adminContact} onChange={handleChange} className="form-checkbox h-5 w-5 text-purple-700"/>
//             <span className="text-gray-800 text-sm">Admin can contact me for verification</span>
//           </label>
//         </div>

//         {/* Submit */}
//         <button type="submit" disabled={isSubmitting}
//           className={`bg-green-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition-transform transform ${isSubmitting ? 'cursor-not-allowed opacity-70' : 'hover:-translate-y-1'}`}>
//           {isSubmitting ? 'Submitting...' : 'Submit Report'}
//         </button>

//         {submitStatus.message && (
//           <div className={`text-center py-2 rounded ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//             {submitStatus.message}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default FoundItemForm;
