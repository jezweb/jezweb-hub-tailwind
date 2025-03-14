# Tasks Schema (`tasks` Collection)

This document defines the structure of the `tasks` collection in Firestore. This collection stores information about individual tasks within the Jezweb Hub.

## Collection: `tasks`

Each document in the `tasks` collection represents a single task.

## Document Structure (Interface):

```typescript
interface Task {
  taskId: string;          // Unique identifier (auto-generated)
  taskName: string;        // Title or brief description of the task
  description?: string;   // Optional: More detailed description
  status: string;          // Status of the task ("open", "inProgress", "completed", "blocked", "deferred")
  priority?: string;       // Optional: Priority ("high", "medium", "low")
  dueDate?: string;     // Optional: Due date (ISO 8601 format: "YYYY-MM-DD")
  assignedTo?: string;     // Optional: User ID of the assigned team member (from 'users' collection)
  relatedTo?: {          // Optional: Link to related entities (e.g., a customer, website, project)
    entityType: string;   // (e.g., "customer", "website", "project")
    entityId: string;     // ID of the related entity
  };
  category?: string;      // Optional: Category for the task (e.g., "Sales", "Marketing", "Development")
  color?: string;         // Optional: Color code for visual identification
  icon?: string;          // Optional: Icon name (e.g., from a Tailwind CSS class or icon library)
  tags?: string[];        // Optional: Tags for categorization
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  createdBy: string;      // User ID of the creator
    comments?: {
      userId: string;
      comment: string;
      createdAt: string;
    }[];
     attachments?: {
        filename?: string;
        url?: string;
        version?: number;
    }[];
}
**Example JSON Record:**
```json
{
  "taskId": "task123",
  "taskName": "Prepare client proposal",
  "description": "Draft the proposal for Acme Corp's website redesign project. Include pricing, timelines, and deliverables.",
  "status": "inProgress",
  "priority": "high",
  "dueDate": "2024-03-15",
  "assignedTo": "user003sales",
  "relatedTo": {
    "entityType": "customer",
    "entityId": "customer456"
  },
  "category": "Sales",
  "color": "#3498db",
  "icon": "document-text",
  "tags": ["proposal", "sales", "acme"],
  "createdAt": "2024-03-12T08:00:00Z",
  "updatedAt": "2024-03-12T09:30:00Z",
  "createdBy": "user003sales",
    "comments":[],
    "attachments": []
}

```