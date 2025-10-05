import React from 'react';

const PointsDisplay = ({ points }) => (
  <div className="points-display" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.5rem' }}>
    <span style={{ color: '#009e2a', fontWeight: 'bold', fontSize: '1.1rem' }}>{points} <span style={{ fontWeight: 'normal', fontSize: '0.95rem', color: '#333' }}>points</span></span>
  </div>
);

export default PointsDisplay;
