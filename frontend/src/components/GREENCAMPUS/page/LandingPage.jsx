import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import wasteBinImg from '../../../assets/waste_bin.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const points = 28;
  return (
    <div className="landing-bg">
      <div className="landing-card">
        <h2 style={{ color: '#009e2a', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '2rem', textAlign: 'left !important' }}>
          <span style={{ color: '#00c853', textAlign: 'left !important', justifyContent: 'flex-start'}}>Green</span>Campus
        </h2>
        <div className="landing-banner">
          <span style={{ fontWeight: 'bold', color: '#25e057ff', fontSize: '1.3rem' }}>Recycle <span style={{ color: '#ffffff' }}>today,<br />Build a</span>
           <span style={{ color: '#00c853' }}> greener environment</span>,<br />
            <span style={{ color: '#ffffff' }}>Earn </span><span style={{ color: '#00c853' }}>rewards!</span>
          </span>
          <div className="landing-points">
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>You have</span>
            <div style={{ fontWeight: 'bold', fontSize: '1.7rem', color: '#009e2a' }}>{points}</div>
            <span style={{ fontSize: '1rem' }}>points</span>
          </div>
        </div>
        <button className="landing-dashboard-btn" onClick={() => navigate('dashboard')}>Go to dashboard</button>
        <div className="landing-illustration">
          <img src={wasteBinImg} alt="Recycle illustration" style={{ width: '230px', height: '160px', objectFit: 'contain', marginLeft: '60%', }} />
        </div>
        <button className="landing-back-btn" onClick={() => window.history.back()}>&lt; Back</button>
      </div>
    </div>
  );
};

export default LandingPage;
