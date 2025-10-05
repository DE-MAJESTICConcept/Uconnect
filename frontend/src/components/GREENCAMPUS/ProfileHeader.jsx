import React from 'react';

const ProfileHeader = ({ avatar, username, points }) => (
  <div className="profile-header">
    <img src={avatar} alt="avatar" className="avatar" />
    <span className="username">{username}</span>
    <span className="points">{points} points</span>
  </div>
);

export default ProfileHeader;
