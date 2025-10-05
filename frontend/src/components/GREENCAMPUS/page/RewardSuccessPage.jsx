import React from 'react';
import './RewardPage.css';

const RewardSuccessPage = () => (
  <div className="reward-bg">
    <div className="reward-card">
      <h2 style={{ color: '#009e2a', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '2rem', textAlign: 'left' }}>GreenCampus</h2>
      <div className="reward-success-box">
        <div className="reward-success-status success">Success</div>
        <div className="reward-success-message">You have successfully redeemed your reward. Pick it up at Student Union Affairs.</div>
      </div>
      <button className="reward-back-btn" onClick={() => window.history.back()}>&lt; Back</button>
    </div>
  </div>
);

export default RewardSuccessPage;
