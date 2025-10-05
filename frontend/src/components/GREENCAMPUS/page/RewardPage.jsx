import './RewardPage.css';
import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../../api/profileService"; // adjust path
import { useNavigate } from 'react-router-dom';

const rewards = [
  { name: 'T-shirt', points: 1100 },
  { name: 'Face Cap', points: 900 },
  { name: 'Cafeteria', points: 750 },
  { name: '#1000 Airtime', points: 600 },
];

const RewardPage = () => {
  const points = 28;
  const navigate = useNavigate();
  const handleRedeem = (rewardPoints) => {
    if (points >= rewardPoints) {
      navigate('/Green-campus/reward/success');
    } else {
      navigate('/Green-campus/reward/failed');
    }
  };

 const [user, setUser] = useState(null);


      useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyProfile();
        // ✅ normalize just based on what your backend actually returns
        setUser({
          id: data?._id || "",
          name: data?.name || "Unnamed",
          avatarUrl: data?.avatar || "", // only use what exists
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);


  return (
    <div>
      <div className="reward-bg">
        <div className="reward-card">
          <h2 style={{ color: '#009e2a', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '2rem', textAlign: 'left' }}>GreenCampus</h2>
          <div className="reward-header">
            <div className="reward-profile">
              <span className="reward-avatar">👤</span>
              <span className="reward-username">Hello, <br />{user?.name ?? "User"}</span>
            </div>
            <span className="reward-points">{points}<span>points</span></span>
          </div>
          <div className="reward-banner" style={{ marginBottom: '0.7rem', marginTop: '0.7rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '500', background: '#2e7d32', color: '#fff' }}>
            <span>Collect <span style={{ color: '#b2ff59', fontWeight: 'bold' }}>green</span> your rewards</span>
          </div>
          <hr style={{ border: 'none', borderTop: '2px solid #2e7d32', margin: '0.7rem 0 1.2rem 0' }} />
          <div className="reward-list">
            {rewards.map((reward, idx) => (
              <div className="reward-item" key={idx}>
                <span>{reward.name}<br /><span style={{ color: '#009e2a', fontWeight: 'bold' }}>{reward.points} points</span></span>
                <button className="reward-redeem-btn" onClick={() => handleRedeem(reward.points)}>Redeem Now</button>
              </div>
            ))}
          </div>
          <button className="reward-back-btn" onClick={() => window.history.back()}>
            &lt; Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardPage;
