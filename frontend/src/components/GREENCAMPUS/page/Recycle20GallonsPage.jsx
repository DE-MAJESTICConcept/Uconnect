import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recycle20GallonsPage.css';

// Hardcoded user ID (replace with actual ID from your DB)
const userId = '68d935ba4ad827e0e1a5a344';

const Recycle20GallonsPage = () => {
  const navigate = useNavigate();
  const [completedItems, setCompletedItems] = useState(0);
  const totalRequired = 20;
  const challengeId = 'recycle-20-gallons';

  useEffect(() => {
    // Load progress from localStorage or API
    const savedProgress = localStorage.getItem(`challenge-${challengeId}-${userId}`);
    if (savedProgress) {
      setCompletedItems(parseInt(savedProgress, 10));
    }
  }, []);

  const handleRecycleClick = () => {
    // Store current challenge info before navigating
    sessionStorage.setItem('currentChallenge', JSON.stringify({
      id: challengeId,
      totalRequired,
      current: completedItems
    }));
    navigate('/recycle?redirect=/challenge/recycle-20-gallons');
  };

  const handleCollectReward = async () => {
    if (completedItems >= totalRequired) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}/complete-challenge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            challengeId,
            points: 50 // Points for this challenge
          })
        });
        
        if (response.ok) {
          // Reset progress after collecting reward
          setCompletedItems(0);
          localStorage.removeItem(`challenge-${challengeId}-${userId}`);
          alert('Reward collected successfully!');
        } else {
          alert('Failed to collect reward. Please try again.');
        }
      } catch (error) {
        console.error('Error collecting reward:', error);
        alert('An error occurred while collecting the reward.');
      }
    }
  };

  return (
  <div className="challenge-detail-bg">
    <div className="challenge-detail-card">
      <h2 className="challenge-detail-title">GreenCampus</h2>
      <div className="challenge-detail-box">
        <div className="challenge-detail-icon" style={{ background: '#009e2a' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#009e2a"/><path d="M24 16l8 8-8 8-8-8 8-8z" fill="#fff"/></svg>
        </div>
        <h3 style={{ fontWeight: 'bold', color: '#009e2a', fontSize: '1.5rem' }}>Recycle 20 Gallons of Plastic</h3>
        <p style={{ color: '#333', fontWeight: '500' }}>Submit 20 recyclable gallons</p>
        <div className="challenge-detail-info">
          <span>🏆 50pts</span>
        </div>
        <div style={{ margin: '1rem 0', color: '#333', fontWeight: '500' }}>
          Progress: {completedItems}/{totalRequired} gallons
          <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '10px', marginTop: '0.5rem' }}>
            <div 
              style={{
                width: `${Math.min(100, (completedItems / totalRequired) * 100)}%`,
                backgroundColor: '#4caf50',
                height: '10px',
                borderRadius: '10px',
                transition: 'width 0.3s ease-in-out'
              }}
            ></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <button 
            className="challenge-detail-action" 
            onClick={handleRecycleClick}
          >
            Recycle Gallons
          </button>
          <button 
            className={`challenge-detail-claim ${completedItems < totalRequired ? 'disabled' : ''}`}
            onClick={handleCollectReward}
            disabled={completedItems < totalRequired}
          >
            Collect reward
          </button>
        </div>
        <div style={{ color: '#333', fontWeight: '500', fontSize: '0.95rem', marginTop: '1rem' }}>Check your dashboard to confirm reward</div>
      </div>
      <button className="challenge-detail-back" onClick={() => window.history.back()}>&lt; Back</button>
    </div>
  </div>
  );
};

export default Recycle20GallonsPage;
