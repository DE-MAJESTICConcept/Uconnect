import React from 'react';

const ActionButton = ({ label, onClick, icon }) => (
  <button
    className="action-button"
    onClick={onClick}
    style={{
      background: '#e0ffe0',
      color: '#009e2a',
      border: 'none',
      borderRadius: '12px',
      padding: '1rem',
      fontWeight: 'bold',
      fontSize: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      cursor: 'pointer',
      transition: 'background 0.2s',
    }}
    onMouseOver={e => e.currentTarget.style.background = '#b2ffb2'}
    onMouseOut={e => e.currentTarget.style.background = '#e0ffe0'}
  >
    {icon && <span className="icon" style={{ marginRight: '0.5rem' }}>{icon}</span>}
    {label}
  </button>
);

export default ActionButton;
