import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recycle50PlasticPage.css';

// Hardcoded user ID (replace with actual ID from your DB)
const userId = '68d935ba4ad827e0e1a5a344';

const Recycle50PlasticPage = () => {
  const navigate = useNavigate();
  const [completedItems, setCompletedItems] = useState(0);
  const totalRequired = 50;
  const challengeId = 'recycle-50-plastic';

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
    navigate('/Green-campus/recycle?redirect=/Green-campus/challenge/recycle-50-plastic');
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
            points: 500 // Points for this challenge
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
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#009e2a"/><path d="M16 24c2-2 6-2 8 0s6 2 8 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <h3 style={{ fontWeight: 'bold', color: '#009e2a', fontSize: '1.5rem' }}>Recycle 50 Plastics</h3>
        {/* <p>Avoid single-use plastics for 7-days</p> */}
        <div className="challenge-detail-info">
          <span>🏆 500pts</span>
          <span>📅 Ends, Nov 17</span>
        </div>
        <div style={{ margin: '1rem 0', color: '#333', fontWeight: '500' }}>
          Progress: {completedItems}/{totalRequired} plastics
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
            Recycle plastic
          </button>
          <button 
            className={`challenge-detail-claim ${completedItems < totalRequired ? 'disabled' : ''}`}
            onClick={handleCollectReward}
            disabled={completedItems < totalRequired}
          >
            Collect reward
          </button>
        </div>
        <div style={{ color: '#333', fontWeight: '500', fontSize: '0.95rem' }}>Check your dashboard to confirm reward</div>
      </div>
      <button className="challenge-detail-back" onClick={() => window.history.back()}>&lt; Back</button>
    </div>
  </div>
  );
};

export default Recycle50PlasticPage;
