# Timesheets Schema (`timesheets` Collection)

This document defines the structure of the `timesheets` collection in Firestore. This collection stores timesheet entries for all projects and tickets within the Jezweb Hub.

## Collection: `timesheets`

Each document in the `timesheets` collection represents a single timesheet entry.

## Document Structure (Interface):

```typescript
interface TimesheetEntry {
  timesheetId: string;       // Unique identifier (auto-generated by Firestore)
  userId: string;            // Reference to the 'userId' in the 'users' collection (who logged the time)
  relatedTo: {            // Link to the related entity (project or ticket)
    entityType: string;     // ("websiteProject", "graphicsProject", "appProject", "seoProject", "contentProject", "ticket")
    entityId: string;       // ID of the related entity
  };
  date: string;            // Date of the work (ISO 8601 format: "YYYY-MM-DD")
  startTime: string;       // Start time (ISO 8601 format: "HH:mm:ss")  --  Store as STRING, not Timestamp
  endTime: string;         // End time (ISO 8601 format: "HH:mm:ss")    --  Store as STRING, not Timestamp
  duration: number;        // Duration in hours (calculated - can be a Cloud Function)
  activityType: string;     // Type of activity (e.g., "Development", "Design", "Meeting", "Communication") - managed via 'options'
  notes?: string;          // Optional notes about the work
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

```

**Key Changes:**

*   **Collection Name:** Changed from `supportTickets` to `tickets`.
*   **Interface Name:** Changed from `SupportTicket` to `Ticket`.
*   **`ticketType` Values:**  Expanded the suggested values for `ticketType` to include options like "billing," "sales," and "internal," in addition to "website" and "email." This makes the `ticketType` field more general-purpose.  You'll manage the list of available ticket types through the `options` collection (using an `optionSetName` like "ticketTypes").

**Relationships:** (Remain the same, but with the collection name change)

*   **`tickets` ↔️ `organisations`:** (via `organisationId`)
*   **`tickets` ↔️ `contacts`:** (via `contactId`)
*   **`tickets` ↔️ `websites`:** (via `websiteId` - optional)
*   **`tickets` ↔️ `users`:** (via `assignedTo` and comments)

**Example JSON Record:**

```json
{{
  "timesheetId": "timesheet001",
  "userId": "user002support",
  "relatedTo": {
    "entityType": "ticket",
    "entityId": "ticket001"
  },
  "date": "2024-03-13",
  "startTime": "09:00:00",
  "endTime": "10:30:00",
  "duration": 1.5,
  "activityType": "Troubleshooting",
  "notes": "Investigated website outage and identified database connection issue.",
  "createdAt": "2024-03-13T09:45:00Z",
  "updatedAt": "2024-03-13T09:45:00Z"
}
```

```json
{{
  "timesheetId": "timesheet002",
  "userId": "user001admin",
  "relatedTo": {
    "entityType": "websiteProject",
    "entityId": "websiteProject001"
  },
  "date": "2024-03-13",
  "startTime": "11:00:00",
  "endTime": "13:00:00",
  "duration": 2,
  "activityType": "Development",
  "notes": "Worked on homepage design and layout.",
  "createdAt": "2024-03-13T13:15:00Z",
  "updatedAt": "2024-03-13T13:15:00Z"
}
```