import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { reportLostItem } from '../../api/itemsService';
import { FaArrowLeft, FaImage, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';

const LostItemForm = ({ onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isClaimMode = location.state?.isClaimMode || false;
  const claimingItemId = location.state?.claimingItem;

  const [form, setForm] = useState({
    itemName: '', dateLost: '', timeLost: '', lastLocation: '', itemDescription: '',
    fullName: '', matricNumber: '', phoneNumber: '', email: '',
    shareInfo: false, adminContact: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isClaimMode) {
      setForm(prev => ({ ...prev, adminContact: true }));
    }
  }, [isClaimMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleImageChange(e); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.itemName || !form.dateLost || !form.timeLost || !form.lastLocation ||
        !form.itemDescription || !form.fullName || !form.phoneNumber || !form.email) {
      setSubmitStatus({ success: false, message: 'Please fill in all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });
    try {
      const formData = new FormData();
      Object.entries({ ...form, status: 'lost', claimingItemId: isClaimMode ? claimingItemId : undefined })
            .forEach(([k, v]) => { if (v !== undefined && v !== null) formData.append(k, v); });
      if (image) formData.append('image', image);
      await reportLostItem(formData);
      if (isClaimMode) setShowPopup(true);
      else setSubmitStatus({ success: true, message: "Lost item reported successfully! We'll notify you if it's found." });
      setForm({ itemName:'', dateLost:'', timeLost:'', lastLocation:'', itemDescription:'', fullName:'', matricNumber:'', phoneNumber:'', email:'', shareInfo:false, adminContact:false });
      setImage(null); setImagePreview(null);
      if (!isClaimMode) setTimeout(() => setSubmitStatus({ success: null, message: '' }), 5000);
    } catch (err) {
      setSubmitStatus({ success: false, message: err.message || 'Failed to submit form. Try again.' });
    } finally { setIsSubmitting(false); }
  };

  const handlePopupClose = () => { setShowPopup(false); navigate('/'); };

  return (
    <div className="relative max-w-3xl mx-auto p-6 md:p-8 mt-8 bg-gray-100 border-4 border-purple-700 rounded-3xl shadow-lg">
      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl text-center max-w-sm w-full">
            <h3 className="text-green-600 text-lg font-bold mb-4">Claim Submitted Successfully!</h3>
            <p className="text-gray-600 mb-6">Admin will contact you after validation.</p>
            <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md font-semibold" onClick={handlePopupClose}>OK</button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button className="absolute top-6 left-6 p-2 rounded shadow text-purple-700 hover:bg-purple-700 hover:text-white transition-transform transform hover:-translate-x-1" onClick={onBack} aria-label="Go back">
        <FaArrowLeft size={24}/>
      </button>

      <h1 className="text-center bg-purple-700 text-white rounded-xl py-2 text-xl font-bold mb-6 md:mb-8 w-4/5 mx-auto">
        {isClaimMode ? 'Claim Item - Fill Your Details' : 'Report Lost Item'}
      </h1>

      {isClaimMode && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4 mb-6">
          Please fill in your details to claim this item. Admin will verify your information.
        </div>
      )}

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Item Info */}
        <div className="text-center font-semibold text-lg mb-4 bg-black text-white rounded-lg py-1">Item Information</div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input type="text" name="itemName" value={form.itemName} onChange={handleChange} placeholder="Item name" required
              className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 bg-white text-gray-800"/>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <input type="date" name="dateLost" value={form.dateLost} onChange={handleChange} required
                className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 bg-white text-gray-800"/>
            </div>
            <div className="relative flex-1">
              <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <input type="time" name="timeLost" value={form.timeLost} onChange={handleChange} required
                className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 bg-white text-gray-800"/>
            </div>
          </div>

          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input type="text" name="lastLocation" value={form.lastLocation} onChange={handleChange} placeholder="Last known location" required
              className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 bg-white text-gray-800"/>
          </div>

          <textarea name="itemDescription" value={form.itemDescription} onChange={handleChange} rows={4} placeholder="Detailed description..." required
            className="w-full p-4 rounded-lg border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 bg-white text-gray-800 resize-y"/>
        </div>

        {/* Upload */}
        <label className={`relative flex flex-col items-center justify-center border-2 rounded-xl p-8 bg-white border-dashed ${isDragging ? 'border-purple-700 bg-purple-50' : ''} ${imagePreview ? 'p-0 border-solid' : ''}`}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        >
          {imagePreview ? (
            <div className="relative w-full h-48 flex items-center justify-center">
              <img src={imagePreview} alt="Preview" className="max-w-full max-h-72 object-contain"/>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <FaImage className="text-white text-3xl mb-2"/>
                <span className="text-white text-sm">Click or drag to change image</span>
              </div>
            </div>
          ) : (
            <>
              <FaImage className="text-purple-700 text-3xl mb-2"/>
              <span className="text-gray-500 text-sm text-center">Drag and drop image here or click to browse</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
        </label>

        {/* Owner Info */}
        <div className="bg-purple-700 p-4 rounded-2xl text-white">
          <div className="text-center text-lg font-semibold mb-4">Enter your details</div>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200"/>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" required
                className="w-full pl-10 py-3 rounded-2xl border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 text-gray-800"/>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200"/>
                <input type="text" name="matricNumber" value={form.matricNumber} onChange={handleChange} placeholder="Matric Number" required
                  className="w-full pl-10 py-3 rounded-2xl border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 text-gray-800"/>
              </div>
              <div className="relative flex-1">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200"/>
                <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" required
                  className="w-full pl-10 py-3 rounded-2xl border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 text-gray-800"/>
              </div>
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200"/>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required
                className="w-full pl-10 py-3 rounded-2xl border border-gray-300 focus:border-purple-700 focus:ring focus:ring-purple-200 text-gray-800"/>
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="shareInfo" checked={form.shareInfo} onChange={handleChange} className="form-checkbox h-5 w-5 text-purple-700"/>
            <span className="text-gray-800 text-sm">I agree to share this information for recovery purposes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="adminContact" checked={form.adminContact} onChange={handleChange} className="form-checkbox h-5 w-5 text-purple-700"/>
            <span className="text-gray-800 text-sm">Admin can contact me for verification</span>
          </label>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting} className={`w-full bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold mt-4 transition-transform transform ${isSubmitting ? 'cursor-not-allowed opacity-70' : 'hover:-translate-y-1'}`}>
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>

        {submitStatus.message && (
          <div className={`text-center py-2 rounded ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} mt-4`}>
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default LostItemForm;
