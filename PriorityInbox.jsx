import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PriorityInbox = ({ topN = 10 }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchPriorityNotifications();
  }, [topN]);

  const fetchPriorityNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/notifications/priority?n=${topN}`);
      setNotifications(response.data.data);
    } catch (err) {
      setError('Failed to fetch priority notifications');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'placement': '#10b981', // green
      'result': '#3b82f6', // blue
      'event': '#f59e0b', // amber
      'urgent': '#ef4444', // red
      'academic': '#8b5cf6', // purple
      'general': '#6b7280' // gray
    };
    return colors[type?.toLowerCase()] || '#6b7280';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="priority-inbox-container">
        <div className="loading">Loading priority notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="priority-inbox-container">
        <div className="error">{error}</div>
        <button onClick={fetchPriorityNotifications} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="priority-inbox-container">
      <div className="priority-inbox-header">
        <h2>Priority Inbox</h2>
        <p className="subtitle">Top {notifications.length} most important unread notifications</p>
        <button onClick={fetchPriorityNotifications} className="refresh-button">
          Refresh
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <p>No unread notifications</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif, index) => (
            <div key={notif.ID || index} className="notification-card">
              <div className="notification-header">
                <span
                  className="notification-type"
                  style={{ backgroundColor: getTypeColor(notif.Type) }}
                >
                  {notif.Type?.toUpperCase() || 'GENERAL'}
                </span>
                <span className="priority-score">
                  Score: {notif.priorityScore?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <div className="notification-body">
                <h3 className="notification-title">
                  {notif.Type} - {notif.Message}
                </h3>
                <p className="notification-timestamp">
                  {formatDate(notif.Timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityInbox;
