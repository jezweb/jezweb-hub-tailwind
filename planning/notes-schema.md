# Notes Schema (`notes` Collection)

This document defines the structure of the `notes` collection in Firestore. This collection stores user notes within the Jezweb Hub.

## Collection: `notes`

Each document in the `notes` collection represents a single note.

## Document Structure (Interface):

```typescript
interface Note {
  noteId: string;          // Unique identifier (auto-generated)
  title: string;           // Title of the note
  content: string;         // Content of the note (could be plain text, Markdown, or even HTML)
  contentHTML: string;
  createdBy: string;      // User ID of the creator
  sharedWith?: string[];   // Optional: Array of user IDs (for shared notes)
  category?: string;      // Optional: Category for the note
  color?: string;         // Optional: Color code for visual identification
  icon?: string;          // Optional: Icon name
  tags?: string[];        // Optional: Tags for categorization
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

Example JSON Record
{
  "noteId": "note789",
  "title": "Meeting Notes - Project Kickoff",
  "content": "# Project Kickoff Meeting Notes\n\n- Discussed project scope\n- Agreed on timelines\n- Assigned tasks",
  "contentHTML": "<h1>Project Kickoff Meeting Notes</h1><ul><li>Discussed project scope</li><li>Agreed on timelines</li><li>Assigned tasks</li></ul>",
  "createdBy": "user001admin",
  "sharedWith": ["user002support", "user003sales"],
  "category": "Meetings",
  "color": "#2ecc71",
  "icon": "clipboard-document-list",
  "tags": ["meeting", "project", "kickoff"],
  "createdAt": "2024-03-12T10:00:00Z",
  "updatedAt": "2024-03-12T10:15:00Z"
}