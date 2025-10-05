import React from 'react';

const BackButton = ({ onClick }) => (
  <button
    className="back-button"
    onClick={onClick}
    style={{
      background: '#009e2a',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.7rem 1.2rem',
      fontWeight: 'bold',
      fontSize: '1rem',
      marginTop: '1rem',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'background 0.2s',
    }}
    onMouseOver={e => e.currentTarget.style.background = '#007a1f'}
    onMouseOut={e => e.currentTarget.style.background = '#009e2a'}
  >
    &lt; Back
  </button>
);

export default BackButton;
