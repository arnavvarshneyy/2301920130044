# Campus Notification Platform - REST API Design

## Overview
A campus notification platform for sending and managing real-time notifications to students, faculty, and staff.

## Real-time Notification Mechanism
**WebSocket** will be used for real-time notifications. Clients can establish a WebSocket connection to receive instant notifications without polling.

- **WebSocket Endpoint**: `ws://localhost:3000/ws`
- **Authentication**: JWT token sent in the initial handshake query parameter
- **Message Format**: JSON objects containing notification data

---

## REST API Endpoints

### 1. Send Notification
Create and send a notification to specific recipients.

**Endpoint**: `POST /api/notifications`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {jwt_token}"
}
```

**Request Body**:
```json
{
  "title": "string",
  "message": "string",
  "type": "urgent|general|academic|event",
  "recipient_ids": ["string"],
  "sender_id": "string",
  "priority": "low|medium|high",
  "expires_at": "ISO8601_datetime (optional)"
}
```

**Response Body** (201 Created):
```json
{
  "success": true,
  "data": {
    "notification_id": "string",
    "title": "string",
    "message": "string",
    "type": "string",
    "recipient_ids": ["string"],
    "sender_id": "string",
    "priority": "string",
    "created_at": "ISO8601_datetime",
    "expires_at": "ISO8601_datetime"
  }
}
```

---

### 2. Get User Notifications
Retrieve all notifications for a specific user.

**Endpoint**: `GET /api/notifications?user_id={user_id}&limit={limit}&offset={offset}`

**Headers**:
```json
{
  "Authorization": "Bearer {jwt_token}"
}
```

**Query Parameters**:
- `user_id` (required): User ID to fetch notifications for
- `limit` (optional): Number of notifications to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `unread_only` (optional): Filter for unread notifications only (default: false)

**Response Body** (200 OK):
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "notification_id": "string",
        "title": "string",
        "message": "string",
        "type": "string",
        "sender_id": "string",
        "sender_name": "string",
        "priority": "string",
        "read": boolean,
        "created_at": "ISO8601_datetime",
        "expires_at": "ISO8601_datetime"
      }
    ],
    "total": number,
    "unread_count": number
  }
}
```

---

### 3. Mark Notification as Read
Mark a specific notification as read.

**Endpoint**: `PUT /api/notifications/{notification_id}/read`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {jwt_token}"
}
```

**Request Body**:
```json
{
  "user_id": "string"
}
```

**Response Body** (200 OK):
```json
{
  "success": true,
  "data": {
    "notification_id": "string",
    "read": true,
    "read_at": "ISO8601_datetime"
  }
}
```

---

### 4. Mark All Notifications as Read
Mark all notifications for a user as read.

**Endpoint**: `PUT /api/notifications/read-all`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {jwt_token}"
}
```

**Request Body**:
```json
{
  "user_id": "string"
}
```

**Response Body** (200 OK):
```json
{
  "success": true,
  "data": {
    "user_id": "string",
    "marked_count": number,
    "marked_at": "ISO8601_datetime"
  }
}
```

---

### 5. Delete Notification
Delete a specific notification.

**Endpoint**: `DELETE /api/notifications/{notification_id}`

**Headers**:
```json
{
  "Authorization": "Bearer {jwt_token}"
}
```

**Query Parameters**:
- `user_id` (required): User ID requesting deletion

**Response Body** (200 OK):
```json
{
  "success": true,
  "data": {
    "notification_id": "string",
    "deleted_at": "ISO8601_datetime"
  }
}
```

---

### 6. Get Notification Statistics
Get statistics about notifications for a user.

**Endpoint**: `GET /api/notifications/stats?user_id={user_id}`

**Headers**:
```json
{
  "Authorization": "Bearer {jwt_token}"
}
```

**Response Body** (200 OK):
```json
{
  "success": true,
  "data": {
    "user_id": "string",
    "total_notifications": number,
    "unread_count": number,
    "read_count": number,
    "urgent_count": number,
    "general_count": number,
    "academic_count": number,
    "event_count": number
  }
}
```

---

## JSON Schemas

### Notification Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "notification_id": {
      "type": "string",
      "format": "uuid"
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200
    },
    "message": {
      "type": "string",
      "minLength": 1,
      "maxLength": 2000
    },
    "type": {
      "type": "string",
      "enum": ["urgent", "general", "academic", "event"]
    },
    "recipient_ids": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uuid"
      },
      "minItems": 1
    },
    "sender_id": {
      "type": "string",
      "format": "uuid"
    },
    "sender_name": {
      "type": "string"
    },
    "priority": {
      "type": "string",
      "enum": ["low", "medium", "high"]
    },
    "read": {
      "type": "boolean"
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "expires_at": {
      "type": "string",
      "format": "date-time"
    },
    "read_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["notification_id", "title", "message", "type", "recipient_ids", "sender_id", "priority", "created_at"]
}
```

### Send Notification Request Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200
    },
    "message": {
      "type": "string",
      "minLength": 1,
      "maxLength": 2000
    },
    "type": {
      "type": "string",
      "enum": ["urgent", "general", "academic", "event"]
    },
    "recipient_ids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1
    },
    "sender_id": {
      "type": "string"
    },
    "priority": {
      "type": "string",
      "enum": ["low", "medium", "high"],
      "default": "medium"
    },
    "expires_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["title", "message", "type", "recipient_ids", "sender_id"]
}
```

### Error Response Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "const": false
    },
    "error": {
      "type": "object",
      "properties": {
        "code": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "details": {
          "type": "object"
        }
      },
      "required": ["code", "message"]
    }
  },
  "required": ["success", "error"]
}
```

---

## WebSocket Message Format

### Client to Server
```json
{
  "action": "subscribe|unsubscribe",
  "user_id": "string"
}
```

### Server to Client (Notification Push)
```json
{
  "type": "notification",
  "data": {
    "notification_id": "string",
    "title": "string",
    "message": "string",
    "type": "string",
    "sender_id": "string",
    "sender_name": "string",
    "priority": "string",
    "created_at": "ISO8601_datetime"
  }
}
```

### Server to Client (Acknowledgment)
```json
{
  "type": "ack",
  "message": "string"
}
```

---

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request body or parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - User not authorized for the action
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

# Stage 3 - Database Query Analysis

## Analysis of the Provided SQL Query

**Query**:
```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

### Query Accuracy
The query is **syntactically accurate** and correctly identifies unread notifications for a specific student (ID 1042), ordered by creation time in ascending order. However, its efficiency is severely lacking given the scale of the database (50,000 students, 5,000,000 notifications).

### Why is this Query Slow?

1. **Full Table Scan**: Without appropriate indexes, the database will likely perform a full table scan on the `notifications` table to find all rows where `studentID = 1042` AND `isRead = false`. With 5 million notifications, this is extremely inefficient.

2. **Low Cardinality Filtering on `isRead`**: The `isRead` column is a boolean with only two possible values (true/false). An index solely on `isRead` would have low selectivity and might not be used effectively by the query optimizer, especially if a large percentage of notifications are unread.

3. **Sorting Overhead**: The `ORDER BY createdAt ASC` clause requires sorting the results. If the data is not already sorted (e.g., via an index that includes `createdAt`), the database will perform an in-memory or on-disk sort operation, which can be very expensive for large result sets.

4. **`SELECT *` Overhead**: Retrieving all columns (`*`) increases I/O operations and network traffic. If only specific columns are needed by the application, this is wasteful.

---

## Proposed Query Optimization

### Recommended Change: Composite Index

Add a composite index on `(studentID, isRead, createdAt)`.

**SQL for Index Creation (PostgreSQL)**:
```sql
CREATE INDEX idx_notifications_student_unread_created 
ON notifications (studentID, isRead, createdAt);
```

### Why This Index is Effective

- **`studentID`**: Primary filtering condition - allows the database to quickly jump to the relevant student's notifications
- **`isRead`**: Secondary filter - further narrows down to unread notifications
- **`createdAt`**: Included last - data is pre-sorted by `createdAt` within the index, allowing the `ORDER BY` to be satisfied directly without an explicit sort operation

### Likely Computation Cost with Index

With this composite index, the query performance improves dramatically:

- **Index Seek**: `O(log N)` where N is the total number of notifications - logarithmic time to find the starting point
- **Index Scan**: `O(M)` where M is the number of unread notifications for the specific student - linear scan only on matching rows
- **No Sorting Required**: Results are already ordered by `createdAt` in the index
- **Bookmark Lookup**: If `SELECT *` is used, the database still needs to look up the full rows from the table. This can be avoided by selecting only indexed columns.

### Optimized Query (Selecting Specific Columns)
```sql
SELECT notification_id, title, message, type, sender_id, priority, created_at, expires_at
FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

---

## Evaluation of Adding Indexes on Every Column

**Advice**: "Add indexes on every column"

**Verdict**: **This is bad advice and should NOT be followed.**

### Why Adding Indexes on Every Column is Problematic

1. **Increased Storage**: Each index consumes additional disk space. With 5 million rows, indexing every column would multiply storage requirements significantly.

2. **Slower Write Operations**: Every INSERT, UPDATE, and DELETE operation must update all indexes. More indexes = slower write performance. For a notification system with frequent inserts, this would be catastrophic.

3. **Query Optimizer Confusion**: Having too many indexes can confuse the query optimizer, leading it to choose suboptimal execution plans.

4. **Maintenance Overhead**: Indexes require maintenance (rebuilding, statistics updates). More indexes = higher maintenance cost.

5. **Diminishing Returns**: Not all columns are selective enough to benefit from indexing. Low-cardinality columns (like booleans) often don't benefit from standalone indexes.

### Recommended Indexing Strategy

Instead of indexing every column, create **targeted indexes** based on actual query patterns:

- **Primary filter columns** (e.g., `studentID`, `notification_id`)
- **Composite indexes** for common multi-column queries
- **Covering indexes** that include all columns needed for frequent queries
- **Foreign key columns** for join operations

---

## SQL Query: Students Who Received "Placement" Notifications in Last 7 Days

Assuming a table structure where notifications have a `type` or `category` field and a `createdAt` timestamp:

```sql
SELECT DISTINCT n.studentID, s.name, s.email, s.department
FROM notifications n
JOIN students s ON n.studentID = s.studentID
WHERE n.type = 'Placement'
  AND n.createdAt >= NOW() - INTERVAL '7 days'
ORDER BY n.createdAt DESC;
```

### Alternative (if using a separate notification_recipients table for many-to-many relationship):

```sql
SELECT DISTINCT s.studentID, s.name, s.email, s.department
FROM students s
JOIN notification_recipients nr ON s.studentID = nr.studentID
JOIN notifications n ON nr.notification_id = n.notification_id
WHERE n.type = 'Placement'
  AND n.createdAt >= NOW() - INTERVAL '7 days'
ORDER BY n.createdAt DESC;
```

### Recommended Index for This Query

```sql
CREATE INDEX idx_notifications_type_created 
ON notifications (type, createdAt);

CREATE INDEX idx_notification_recipients_student_notification 
ON notification_recipients (studentID, notification_id);
```

### Query Explanation

- **Filter by type**: `n.type = 'Placement'` - uses index on `type`
- **Filter by date**: `n.createdAt >= NOW() - INTERVAL '7 days'` - uses composite index on `(type, createdAt)`
- **Join to students**: Links notification recipients to student details
- **DISTINCT**: Ensures each student appears only once even if they received multiple placement notifications
- **ORDER BY**: Returns results in reverse chronological order

---

# Stage 6 - Priority Inbox Implementation

## Overview
The Priority Inbox feature displays the top N most important unread notifications. Priority is determined by a combination of:
1. **Type Weight**: Different notification categories have different importance levels
2. **Recency**: More recent notifications receive a bonus to their priority score

## Priority Weighting System

### Type Weights (Base Priority)
- **Placement**: 100 (highest priority - career opportunities)
- **Result**: 50 (academic outcomes)
- **Urgent**: 75 (time-sensitive)
- **Academic**: 30 (academic information)
- **Event**: 10 (campus events)
- **General**: 5 (default priority)

### Recency Bonus
- **Within 1 hour**: +20 points
- **Within 1 day**: +10 points
- **Within 1 week**: +5 points
- **Older than 1 week**: +0 points

### Priority Score Formula
```
Priority Score = Type Weight + Recency Bonus
```

Higher scores indicate more important notifications.

## Implementation Approach (MERN Stack)

### Backend (Node.js + Express)

The backend (`server.js`) provides two API endpoints:

1. **GET /api/notifications** - Fetches all notifications from the external API
2. **GET /api/notifications/priority?n={count}** - Returns top N priority notifications

**Key Functions**:

- `calculatePriorityScore(notification)`: Computes the priority score based on type and timestamp
- `getPriorityInbox(notifications, topN)`: Filters unread notifications, calculates scores, sorts by priority, and returns top N
- `fetchNotifications()`: Retrieves notifications from the external evaluation service API

**Priority Calculation Logic**:
```javascript
function calculatePriorityScore(notification) {
  const notifType = (notification.Type || 'general').toLowerCase();
  const baseWeight = PRIORITY_WEIGHTS[notifType] || 5;
  
  // Parse timestamp and calculate recency bonus
  const createdAt = new Date(notification.Timestamp);
  const timeDiff = now - createdAt;
  
  let recencyBonus = 0;
  if (timeDiff <= ONE_HOUR) recencyBonus = 20;
  else if (timeDiff <= ONE_DAY) recencyBonus = 10;
  else if (timeDiff <= ONE_WEEK) recencyBonus = 5;
  
  return baseWeight + recencyBonus;
}
```

### Frontend (React)

The React component (`PriorityInbox.jsx`) provides a user interface to:
- Display the top N priority notifications
- Show notification type, message, timestamp, and priority score
- Color-code notification types for visual distinction
- Refresh the priority inbox on demand

**Component Features**:
- Automatic fetching on component mount
- Loading and error states
- Refresh button to manually reload notifications
- Responsive design with color-coded type badges

## Efficiently Maintaining Top N Notifications

### Current Approach (Simple Sorting)
The current implementation fetches all notifications, calculates scores for unread ones, sorts them, and returns the top N. This is O(N log N) where N is the number of unread notifications.

### Optimized Approaches for Scale

#### 1. Database-Level Sorting (Recommended for Production)
For a production system with millions of notifications, implement priority calculation at the database level:

```sql
-- Add computed column for priority score
ALTER TABLE notifications ADD COLUMN priority_score FLOAT;

-- Create index on priority_score
CREATE INDEX idx_notifications_priority ON notifications(priority_score DESC);

-- Query for top N unread notifications
SELECT * FROM notifications
WHERE isRead = false
ORDER BY priority_score DESC
LIMIT 10;
```

**Advantages**:
- O(log N) index lookup instead of O(N log N) sorting
- Database handles sorting efficiently
- Can use materialized views for frequently accessed data

#### 2. Priority Queue Data Structure
Use a max-heap (priority queue) to maintain the top N notifications:

```javascript
class PriorityInbox {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.heap = [];
  }
  
  add(notification) {
    const score = calculatePriorityScore(notification);
    
    if (this.heap.length < this.maxSize) {
      this.heap.push({ notification, score });
      this.heap.sort((a, b) => b.score - a.score);
    } else if (score > this.heap[this.heap.length - 1].score) {
      this.heap.pop();
      this.heap.push({ notification, score });
      this.heap.sort((a, b) => b.score - a.score);
    }
  }
  
  getTopN() {
    return this.heap.map(item => item.notification);
  }
}
```

**Advantages**:
- O(log N) insertion instead of O(N log N) sorting
- Maintains only N items in memory
- Efficient for real-time updates

**Complexity**:
- Insert: O(log N)
- Get top N: O(N)

#### 3. Redis Sorted Sets (Best for Real-Time)
Use Redis sorted sets with priority scores as the score:

```javascript
// Add notification to Redis sorted set
await redis.zadd('priority_inbox', priorityScore, notificationId);

// Get top N notifications
const topIds = await redis.zrevrange('priority_inbox', 0, N - 1);

// Fetch full notification details
const notifications = await redis.mget(topIds.map(id => `notif:${id}`));
```

**Advantages**:
- O(log N) insertion and retrieval
- Built-in ranking and range queries
- Persistent and scalable
- Supports real-time updates

**Complexity**:
- Insert: O(log N)
- Get top N: O(log N + M) where M is the number of items returned

#### 4. Hybrid Approach (Recommended for Large Scale)
Combine multiple strategies:

1. **Hot Cache (Redis)**: Store top 1000 priority notifications in Redis sorted sets for instant access
2. **Warm Cache (Database)**: Use database indexes for queries beyond the cache
3. **Cold Storage**: Archive old notifications (> 30 days) to separate storage

**Benefits**:
- Sub-millisecond response for frequently accessed data
- Cost-effective storage for historical data
- Handles traffic spikes gracefully

### Real-Time Update Strategy

When new notifications arrive:

1. **Calculate priority score** immediately
2. **Insert into Redis sorted set** (O(log N))
3. **Push via WebSocket** to connected clients
4. **Update database** asynchronously for persistence

This ensures users see new high-priority notifications instantly without waiting for full recalculation.

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

## Performance Considerations

### Current Implementation
- **Time Complexity**: O(N log N) for sorting all unread notifications
- **Space Complexity**: O(N) for storing all notifications in memory
- **Suitable for**: < 10,000 unread notifications

### Production Recommendations
- **Database Indexing**: Add composite index on `(isRead, priority_score DESC)`
- **Caching**: Use Redis for top 1000 priority notifications
- **Pagination**: Implement pagination for large result sets
- **Batch Processing**: Calculate priority scores in batches for bulk updates
- **Background Jobs**: Update priority scores asynchronously for old notifications
