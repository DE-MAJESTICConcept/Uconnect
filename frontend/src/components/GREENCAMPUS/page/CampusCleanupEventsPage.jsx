import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CampusCleanupEventsPage.css';

// Hardcoded user ID (replace with actual ID from your DB)
const userId = '68d935ba4ad827e0e1a5a344';

const CampusCleanupEventsPage = () => {
  const navigate = useNavigate();
  const [completedEvents, setCompletedEvents] = useState(0);
  const totalRequired = 5;
  const challengeId = 'campus-cleanup-events';

  useEffect(() => {
    // Load progress from localStorage or API
    const savedProgress = localStorage.getItem(`challenge-${challengeId}-${userId}`);
    if (savedProgress) {
      setCompletedEvents(parseInt(savedProgress, 10));
    }
  }, []);

  const handleAttendEvent = () => {
    // Store current challenge info before navigating
    sessionStorage.setItem('currentChallenge', JSON.stringify({
      id: challengeId,
      totalRequired,
      current: completedEvents
    }));
    navigate('/recycle?redirect=/challenge/campus-cleanup-events');
  };

  const handleCollectReward = async () => {
    if (completedEvents >= totalRequired) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}/complete-challenge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            challengeId,
            points: 100 // Points for this challenge
          })
        });
        
        if (response.ok) {
          // Reset progress after collecting reward
          setCompletedEvents(0);
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
        <h3 style={{ fontWeight: 'bold', color: '#009e2a', fontSize: '1.5rem' }}>Attend 5 Campus Cleanup Event</h3>
        <p style={{ color: '#333', fontWeight: '500' }}>Unity Park<br />Saturday, 10AM - 1PM</p>
        <div className="challenge-detail-info">
          <span>🏆 100pts</span>
        </div>
        <div style={{ margin: '1rem 0', color: '#333', fontWeight: '500' }}>
          Progress: {completedEvents}/{totalRequired} events
          <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '10px', marginTop: '0.5rem' }}>
            <div 
              style={{
                width: `${Math.min(100, (completedEvents / totalRequired) * 100)}%`,
                backgroundColor: '#4caf50',
                height: '10px',
                borderRadius: '10px',
                transition: 'width 0.3s ease-in-out'
              }}
            ></div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <button 
            className="challenge-detail-upload"
            onClick={handleAttendEvent}
          >
            Submit photo after event
          </button>
          <button 
            className={`challenge-detail-claim ${completedEvents < totalRequired ? 'disabled' : ''}`}
            onClick={handleCollectReward}
            disabled={completedEvents < totalRequired}
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

export default CampusCleanupEventsPage;
