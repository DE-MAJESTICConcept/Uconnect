import React, { useEffect, useState } from "react";
import './ChallengePage.css';
import { getMyProfile } from "../../../api/profileService"; // adjust path
import { useNavigate } from 'react-router-dom';

const challenges = [
  {
    name: 'Recycle 50 Plastics',
    description: 'Avoid single-use plastics for 7-days',
    points: 500,
    route: '/Green-campus/challenge/recycle-50-plastic',
  },
  {
    name: 'Attend 5 Campus Cleanup Events',
    description: 'Unity Park, Saturday, 10AM - 1PM',
    points: 100,
    route: '/Green-campus/challenge/campus-cleanup-events',
  },
  {
    name: 'Recycle 20 Gallons of Plastic',
    description: 'Submit 20 recyclable gallons',
    points: 50,
    route: '/Green-campus/challenge/recycle-20-gallons',
  },
];





const ChallengePage = () => {
  const navigate = useNavigate();
  const points = 28;
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
    <div className="challenge-bg">
      <div className="challenge-card">
        <h2 style={{ color: '#009e2a', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '2rem', textAlign: 'left' }}>GreenCampus</h2>
        <div className="challenge-header">
          <div className="challenge-profile">
            <span className="challenge-avatar">👤</span>
            <span className="challenge-username">Hello, <br /> {user?.name ?? "User"}</span>
          </div>
          <span className="challenge-points">{points}<span>points</span></span>
        </div>
        <div className="challenge-banner">
          <span><span style={{ color: '#b2ff59', fontWeight: 'bold' }}>Green</span>Campus Eco-challenge</span>
        </div>
        <table className="challenge-table">
          <thead>
            <tr>
              <th>Challenge</th>
              <th>Reward</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((c, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 'bold', color: '#009e2a' }}>{c.name}</td>
                <td style={{ fontWeight: 'bold', color: '#009e2a' }}>{c.points}pts</td>
                <td><button className="challenge-join-btn" onClick={() => navigate(c.route)}>Check in</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="challenge-back-btn" onClick={() => window.history.back()}>&lt; Back</button>
      </div>
    </div>
  );
};

export default ChallengePage;
