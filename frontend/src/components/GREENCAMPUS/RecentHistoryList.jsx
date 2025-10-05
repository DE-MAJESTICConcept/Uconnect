import React from 'react';

const RecentHistoryList = ({ history }) => (
  <div className="recent-history-list">
    {history && history.length > 0 ? (
      history.map((item, idx) => (
        <div key={idx} className="history-item">
          <span>{item.date}</span>
          <span>{item.status}</span>
        </div>
      ))
    ) : (
      <span>No history yet.</span>
    )}
  </div>
);

export default RecentHistoryList;
