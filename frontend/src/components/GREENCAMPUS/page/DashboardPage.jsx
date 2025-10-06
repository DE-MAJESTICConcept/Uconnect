import React from 'react';
import './DashboardPage.css';

const iconRecycle = (
  <span style={{ marginLeft: '0.5rem', fontSize: '1.2rem' }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#009e2a" strokeWidth="2"/><path d="M10 5v5l3 3" stroke="#009e2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </span>
);
const iconChallenge = (
  <span style={{ marginLeft: '0.5rem', fontSize: '1.2rem' }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#009e2a" strokeWidth="2"/><path d="M10 7v6" stroke="#009e2a" strokeWidth="2" strokeLinecap="round"/><path d="M7 10h6" stroke="#009e2a" strokeWidth="2" strokeLinecap="round"/></svg>
  </span>
);
const iconReward = (
  <span style={{ marginLeft: '0.5rem', fontSize: '1.2rem' }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#009e2a" strokeWidth="2"/><path d="M10 6v8" stroke="#009e2a" strokeWidth="2" strokeLinecap="round"/><path d="M7 10h6" stroke="#009e2a" strokeWidth="2" strokeLinecap="round"/></svg>
  </span>
);

const DashboardPage = () => {
  const points = 28;
  return (
    <div className="dashboard-bg">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <span className="dashboard-title">Green<span style={{ fontWeight: 'normal' }}>Campus</span></span>
          <span className="dashboard-points">{points}<span>points</span></span>
        </div>
        <div className="dashboard-banner">
          Ready to earn more <span className="green">green</span> points today?
        </div>
        <div className="dashboard-actions">
          <button className="dashboard-action-btn" onClick={() => window.location.href= '/Green-campus/recycle'}>
            Recycle bin {iconRecycle}
          </button>
          <button className="dashboard-action-btn" onClick={() => window.location.href='Green-campus/challenge'}>
            Challenge {iconChallenge}
          </button>
          <button className="dashboard-action-btn" onClick={() => window.location.href='/Green-campus/reward'}>
            Reward {iconReward}
          </button>
        </div>
        <button className="dashboard-back-btn" onClick={() => window.history.back()}>
          &lt; Back
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
