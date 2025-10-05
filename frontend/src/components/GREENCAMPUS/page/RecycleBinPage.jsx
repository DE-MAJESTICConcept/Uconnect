import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './RecycleBinPage.css';

const RecycleBinPage = () => {
  const [points, setPoints] = useState(0);
  // Hardcoded user ID (replace with actual ID from your DB)
  const userId = '68d935ba4ad827e0e1a5a344';

  // Check for challenge data when component mounts
  useEffect(() => {
    const challengeData = sessionStorage.getItem('currentChallenge');
    if (challengeData) {
      const { id: challengeId, current, totalRequired } = JSON.parse(challengeData);
      setSubmitStatus(`Working on challenge: ${challengeId} (${current}/${totalRequired} completed)`);
    }
  }, []);

  // Set current date and time when component mounts
  useEffect(() => {
  fetch(`http://localhost:5000/api/recycles/points/${userId}`)
      .then(res => res.json())
      .then(data => setPoints(data.points || 0))
      .catch(() => setPoints(0));
  }, []);

  // Form state
  const [form, setForm] = useState({
    image: null,
    date: '',
    time: '',
    quantity: '',
    address: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef(null);

  // Handle form change
  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Update challenge progress
  const updateChallengeProgress = async (challengeId, currentProgress, totalRequired) => {
    const newProgress = currentProgress + 1; // Increment by 1 for each submission
    localStorage.setItem(`challenge-${challengeId}-${userId}`, newProgress);
    
    // If challenge is completed, show success message
    if (newProgress >= totalRequired) {
      setSubmitStatus('Challenge progress updated! You can now collect your reward!');
    } else {
      setSubmitStatus('Submission successful! Progress updated.');
    }
  };

  // Handle form submit
  const handleSubmit = async (e, scannedAddress) => {
    if (e) e.preventDefault();
    
    try {
      setSubmitStatus('Submitting...');
      
      // Create form data
      const formData = new FormData();
      formData.append('userId', userId);
      
      // Add file if present
      if (form.image) {
        formData.append('image', form.image);
      } else if (!scannedAddress) {
        // If no image and not from QR scan, require an image
        throw new Error('Please select an image');
      }
      
      // Add other form fields
      formData.append('date', form.date);
      formData.append('time', form.time);
      formData.append('quantity', form.quantity || '1');
      formData.append('address', scannedAddress || form.address);
      
      // Log the form data for debugging
      console.log('Submitting form with data:', {
        userId,
        date: form.date,
        time: form.time,
        quantity: form.quantity,
        address: scannedAddress || form.address,
        hasImage: !!form.image
      });
      
      // Submit recycling data
      const res = await fetch('http://localhost:5000/api/recycles', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      console.log('Server response:', data);
      
      if (data.success) {
        // Check if coming from a challenge
        const challengeData = sessionStorage.getItem('currentChallenge');
        if (challengeData) {
          try {
            const { id: challengeId, current, totalRequired } = JSON.parse(challengeData);
            await updateChallengeProgress(challengeId, current, totalRequired);
            
            // Redirect back to challenge page after a short delay
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get('redirect');
            if (redirectUrl) {
              setSubmitStatus('Success! Redirecting back to challenge...');
              setTimeout(() => {
                window.location.href = redirectUrl;
              }, 2000);
              return;
            }
          } catch (error) {
            console.error('Error processing challenge data:', error);
          }
        }
        
        setSubmitStatus('Submitted successfully!');
        
        // Reset form after successful submission
        setForm({
          image: null,
          date: '',
          time: '',
          quantity: '',
          address: ''
        });
        
      } else {
        throw new Error(data.error || 'Submission failed');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus(`Error: ${error.message}`);
    } finally {
      setShowScanner(false);
    }
  };

  // QR Code Scanner instance ref
  const qrCodeScanner = useRef(null);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (qrCodeScanner.current) {
        qrCodeScanner.current.stop().catch(error => {
          console.log('Error stopping QR scanner:', error);
        });
      }
    };
  }, []);

  // Start QR scanner
  const startScanner = async () => {
    try {
      console.log('Starting QR scanner...');
      setShowScanner(true);
      setSubmitStatus('Initializing scanner...');
      
      // Wait for the DOM to update and show the scanner element
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!scannerRef.current) {
        const errorMsg = 'Scanner element not found in DOM';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Stop any existing scanner
      if (qrCodeScanner.current) {
        try {
          console.log('Stopping previous scanner instance...');
          await qrCodeScanner.current.stop();
        } catch (e) {
          console.warn('Error stopping previous scanner:', e);
        }
      }

      // Initialize scanner
      console.log('Initializing new scanner instance...');
      qrCodeScanner.current = new Html5Qrcode(scannerRef.current.id);
      
      // Set current date and time
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0].split('-').reverse().join('/');
      const currentTime = now.toTimeString().substring(0, 5);
      
      console.log('Setting default form values...');
      setForm(prev => ({
        ...prev,
        date: currentDate,
        time: currentTime,
        quantity: '1' // Default quantity for QR code scans
      }));
      
      // Start scanning
      console.log('Starting camera...');
      setSubmitStatus('Scanning for QR codes...');
      
      // Get list of available cameras
      try {
        const devices = await Html5Qrcode.getCameras();
        console.log('Available cameras:', devices);
        
        if (devices && devices.length) {
          console.log('Found cameras, using first back-facing camera');
        } else {
          console.warn('No cameras found');
          setSubmitStatus('Error: No cameras found. Please check your device settings.');
          return;
        }
      } catch (cameraError) {
        console.error('Error accessing cameras:', cameraError);
        setSubmitStatus('Cannot access camera. Please check permissions.');
        return;
      }
      
      // Start the scanner
      try {
        console.log('Starting scanner...');
        await qrCodeScanner.current.start(
          { facingMode: 'environment' },
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            disableFlip: false
          },
          async (decodedText, decodedResult) => {
            console.log('QR Code detected!', { decodedText, decodedResult });
            try {
              console.log('Stopping scanner...');
              await qrCodeScanner.current.stop();
              
              console.log('Updating form with scanned data...');
              setForm(prev => ({
                ...prev,
                address: decodedText,
                date: prev.date || currentDate,
                time: prev.time || currentTime,
                quantity: prev.quantity || '1'
              }));
              
              console.log('Submitting form...');
              await handleSubmit(null, decodedText);
              setShowScanner(false);
            } catch (error) {
              console.error('Error handling scan result:', error);
              setSubmitStatus(`Error: ${error.message}`);
            }
          },
          (errorMessage) => {
            // Skip certain error messages
            const ignoredErrors = [
              'NotFoundException', 
              'NotAllowedError',
              'NotFoundError',
              'Video stream has ended',
              'No MultiFormat Readers were able to detect the code'
            ];
            
            if (errorMessage && !ignoredErrors.some(e => errorMessage.includes(e))) {
              console.error('QR Code scan error:', errorMessage);
              setSubmitStatus(`Scanner: ${errorMessage}`);
            }
          }
        );
        
        console.log('Scanner started successfully');
        setSubmitStatus('Point your camera at a QR code');
        
      } catch (startError) {
        console.error('Failed to start scanner:', startError);
        setSubmitStatus(`Failed to start camera: ${startError.message}`);
        setShowScanner(false);
      }
      
    } catch (error) {
      console.error('Scanner initialization failed:', error);
      setSubmitStatus(`Error: ${error.message}`);
      setShowScanner(false);
    }
  };

  // Stop scanner when modal is closed
  const stopScanner = async () => {
    try {
      if (qrCodeScanner.current) {
        await qrCodeScanner.current.stop();
      }
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
    setShowScanner(false);
  };

  return (
    <div>
      <div className="recycle-bg">
        <div className="recycle-card">
          <div className="recycle-header">
            
            <span style={{ background: '#2e7d32', color: '#fff', borderRadius: '8px', padding: '0.3rem 0.7rem', fontWeight: 'bold', fontSize: '1rem' }}>You have</span>
            <span className="recycle-points">{points}<span>points</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
            <span style={{ color: '#009e2a', fontWeight: 'bold', fontSize: '1.2rem' }}>{points}<span style={{ color: '#43a047', fontWeight: 'normal', fontSize: '1rem', marginLeft: '2px' }}>points</span></span>
            <span style={{ color: '#009e2a', fontWeight: 'bold', fontSize: '2rem' }}>GreenCampus</span>
            <span style={{ fontSize: '1.5rem', color: '#009e2a !important' }}>🔔</span>
          </div>
          {/* <h2 style={{ color: '#009e2a', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '2rem', textAlign: 'left' }}>GreenCampus</h2> */}
          <div className="recycle-banner" style={{ marginBottom: '0.7rem', marginTop: '0.7rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '500', background: '#2e7d32', color: '#fff' }}>
            Log your recycle items, grow your <span style={{ color: '#b2ff59', fontWeight: 'bold' }}>green impact!</span>
          </div>
          <form className="recycle-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="file" name="image" accept="image/*" onChange={handleChange} required />
            <input type="text" name="date" placeholder="DD/MM/YYYY" value={form.date} onChange={handleChange} required />
            <input type="text" name="time" placeholder="Time" value={form.time} onChange={handleChange} required />
            <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Insert address of the bin location..." value={form.address} onChange={handleChange} required />
            <button type="button" className="qr-scan" style={{ background: 'linear-gradient(90deg, #009e2a 0%, #00e676 100%)', fontWeight: 'bold', fontSize: '1.1rem' }} onClick={startScanner}>
              Scan QR code<br /><span style={{ fontWeight: 'normal', fontSize: '0.95rem' }}>on the bin to submit</span>
            </button>
          </form>
          {showScanner && (
            <div style={{ margin: '1rem 0' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            <div 
              id="qr-scanner" 
              ref={scannerRef} 
              style={{ 
                width: '100%', 
                height: '300px', 
                background: '#000',
                borderRadius: '8px',
                overflow: 'hidden'
              }} 
            />
            <div style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              zIndex: 1000 
            }}>
              <button 
                onClick={stopScanner}
                style={{
                  background: 'rgba(255, 0, 0, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          </div>
            </div>
          )}
          {submitStatus && <div style={{ color: '#2e7d32', fontWeight: 'bold', marginTop: '0.5rem' }}>{submitStatus}</div>}
          <div style={{ borderTop: '2px solid #2e7d32', margin: '1.2rem 0 0.7rem 0' }} />
          <div className="recycle-history">
            <span style={{ fontWeight: 'bold', color: '#2e7d32' }}>YOUR RECENT HISTORY</span>
            <input type="text" placeholder="DD/MM/YYYY" style={{ marginTop: '0.5rem', width: '100%', border: 'none', background: 'transparent', color: '#333', fontWeight: 'bold', fontSize: '1rem' }} />
            <div style={{ color: '#888', fontWeight: 'bold', fontSize: '1rem' }}>Pending....</div>
          </div>
          <button className="recycle-back-btn" onClick={() => window.history.back()}>
            &lt; Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecycleBinPage;
