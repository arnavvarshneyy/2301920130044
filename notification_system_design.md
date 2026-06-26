# Campus Notification Platform - REST API Design

## Overview
A campus notification platform for sending and managing real-time notifications to students, faculty, and staff.

## Real-time Notification Mechanism
**WebSocket** will be used for real-time notifications. Clients can establish a WebSocket connection to receive instant notifications without polling.

- **WebSocket Endpoint**: `ws://localhost:3000/ws`
- **Authentication**: JWT token sent in the initial handshake query parameter
- **Message Format**: JSON objects containing notification data

---

## Implementation Approach (MERN Stack)

### Backend (Node.js + Express)

The backend (`server.js`) provides two API endpoints:

1. **GET /api/notifications** - Fetches all notifications from the external API
2. **GET /api/notifications/priority?n={count}** - Returns top N priority notifications

### Frontend (React)

The React component (`PriorityInbox.jsx`) provides a user interface to:
- Display the top N priority notifications
- Show notification type, message, timestamp, and priority score
- Color-code notification types for visual distinction
- Refresh the priority inbox on demand


## Testing the Implementation

### Backend Testing
```bash
# Install dependencies
npm install

# Start server
npm start

# Test priority inbox endpoint
curl http://localhost:3000/api/notifications/priority?n=10
```

### Frontend Integration
The React component can be integrated into any React application:

```jsx
import PriorityInbox from './PriorityInbox';

function App() {
  return (
    <div className="App">
      <PriorityInbox topN={10} />
    </div>
  );
}
```
