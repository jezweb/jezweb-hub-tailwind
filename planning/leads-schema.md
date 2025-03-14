# Leads Schema (`leads` Collection)

This document defines the structure of the `leads` collection in Firestore.  This collection stores information about potential customers.

## Collection: `leads`

Each document in the `leads` collection represents a single lead.

## Document Structure (Interface):

```typescript
interface Lead {
  leadId: string;          // Unique identifier (auto-generated)
  organisationName?: string;    // Optional: Organisation name if available
  contactPerson: {         // Information about the primary contact person
    fullName: string;
    email: string;
    phone?: string;        // Optional: Phone number
    jobTitle?: string;    // Optional: Job title
  };
 source: string;          // Source of the lead (e.g., "Website Form", "Referral", "Phone Call", "Event")
  status: string;          // Lead status ("new", "contacted", "qualified", "unqualified", "converted") - manage via 'options'
  assignedTo?: string;     // Optional: User ID of the assigned sales representative (from 'users' collection)
  notes?: string;          // Optional: Notes about the lead
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}
```

**Key Fields and Considerations:**

*   **`leadId`:** Auto-generated unique ID.
*   **`organisationName`:** (Optional) In many cases, a lead might initially just be a contact person.
*   **`contactPerson`:** Information about the primary contact.
*   **`source`:**  *Crucially*, tracks where the lead came from.  Use a predefined set of values (managed via the `options` collection) for consistency (e.g., "Website Form," "Referral," "Phone Call," "Event," "Email Campaign").
*   **`status`:** Tracks the lead's progress through the sales pipeline.  Use a predefined set of values (e.g., "new," "contacted," "qualified," "unqualified," "converted").
*   **`assignedTo`:** (Optional)  Assigns the lead to a sales representative.
*   **`notes`:** (Optional)

**Relationships:**

*   **`leads` ↔️ `users`:** (via `assignedTo`)
*  **`leads` ↔️ `organisations`
*  **`leads` ↔️ `contacts`

**Example JSON Record:**

```json
{
  "leadId": "lead001",
  "organisationName": "Potential Client Pty Ltd",
  "contactPerson": {
    "fullName": "Sarah Lee",
    "email": "sarah.lee@example.com",
    "phone": "+61 4 4444 4444",
    "jobTitle": "Marketing Manager"
  },
  "source": "Website Form",
  "status": "contacted",
  "assignedTo": "user003sales",
  "notes": "Initial contact made.  Interested in website redesign.",
  "createdAt": "2024-03-13T07:00:00Z",
  "updatedAt": "2024-03-13T07:30:00Z"
}
```
