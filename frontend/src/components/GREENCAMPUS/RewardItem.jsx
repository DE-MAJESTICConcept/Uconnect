import React from 'react';

const RewardItem = ({ name, points, onRedeem }) => (
  <div className="reward-item">
    <span className="reward-name">{name}</span>
    <span className="reward-points">{points} points</span>
    <button className="redeem-button" onClick={onRedeem}>Redeem Now</button>
  </div>
);

export default RewardItem;
