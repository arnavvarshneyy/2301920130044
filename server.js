const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Priority weights for notification types
const PRIORITY_WEIGHTS = {
  'placement': 100,
  'result': 50,
  'event': 10,
  'general': 5,
  'urgent': 75,
  'academic': 30
};

/**
 * Calculate priority score for a notification based on type weight and recency.
 * Priority Score = Type Weight + Recency Bonus
 */
function calculatePriorityScore(notification) {
  // Get notification type (case-insensitive)
  const notifType = (notification.Type || 'general').toLowerCase();
  
  // Get base weight from priority mapping
  const baseWeight = PRIORITY_WEIGHTS[notifType] || 5;
  
  // Calculate recency bonus
  let recencyBonus = 0;
  const timestampStr = notification.Timestamp;
  
  if (timestampStr) {
    try {
      // Parse timestamp format: "YYYY-MM-DD HH:MM:SS"
      const createdAt = new Date(timestampStr);
      const now = new Date();
      const timeDiff = now - createdAt;
      
      // Calculate recency bonus based on time difference (in milliseconds)
      const ONE_HOUR = 3600000;
      const ONE_DAY = 86400000;
      const ONE_WEEK = 604800000;
      
      if (timeDiff <= ONE_HOUR) {
        recencyBonus = 20;
      } else if (timeDiff <= ONE_DAY) {
        recencyBonus = 10;
      } else if (timeDiff <= ONE_WEEK) {
        recencyBonus = 5;
      }
    } catch (error) {
      console.error('Error parsing timestamp:', error);
    }
  }
  
  // Final priority score
  return baseWeight + recencyBonus;
}


// Get the top N most important unread notifications based on priority score.

function getPriorityInbox(notifications, topN = 10) {
  // Filter for unread notifications only
  const unreadNotifications = notifications.filter(
    notif => !notif.read && !notif.isRead
  );
  
  // Calculate priority score for each notification
  const scoredNotifications = unreadNotifications.map(notif => ({
    notification: notif,
    priorityScore: calculatePriorityScore(notif)
  }));
  
  // Sort by priority score (descending)
  scoredNotifications.sort((a, b) => b.priorityScore - a.priorityScore);
  
  // Extract top N notifications
  return scoredNotifications.slice(0, topN).map(item => ({
    ...item.notification,
    priorityScore: item.priorityScore
  }));
}


// Fetch notifications from the external API

async function fetchNotifications() {
  try {
    console.log('Fetching notifications from external API...');
    const response = await axios.get('http://4.224.186.213/evaluation-service/notifications', {
      timeout: 10000
    });
    console.log('External API response status:', response.status);
    console.log('Response data keys:', Object.keys(response.data));
    const notifications = response.data.notifications || [];
    console.log('Notifications fetched:', notifications.length);
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    // Return mock data for testing if API fails
    console.log('Using mock data for testing...');
    return [
      {
        "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
        "Type": "Result",
        "Message": "mid-sem",
        "Timestamp": "2026-04-22 17:51:30"
      },
      {
        "ID": "a2b3c4d5-e6f7-8901-2345-6789abcdef01",
        "Type": "Placement",
        "Message": "CSX Corporation hiring",
        "Timestamp": "2026-06-25 10:30:00"
      },
      {
        "ID": "f1e2d3c4-b5a6-7890-1234-567890abcdef",
        "Type": "Event",
        "Message": "farewell",
        "Timestamp": "2026-06-20 15:00:00"
      }
    ];
  }
}


app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await fetchNotifications();
    res.json({
      success: true,
      data: notifications,
      total: notifications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch notifications'
      }
    });
  }
});

// API Endpoint: Get priority inbox (top N unread notifications)
app.get('/api/notifications/priority', async (req, res) => {
  try {
    const topN = parseInt(req.query.n) || 10;
    const notifications = await fetchNotifications();
    const priorityNotifications = getPriorityInbox(notifications, topN);
    
    res.json({
      success: true,
      data: priorityNotifications,
      total: priorityNotifications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PRIORITY_ERROR',
        message: 'Failed to calculate priority notifications'
      }
    });
  }
});



app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Notifications API: http://localhost:${PORT}/api/notifications`);
  console.log(`Priority Inbox: http://localhost:${PORT}/api/notifications/priority`);
});
