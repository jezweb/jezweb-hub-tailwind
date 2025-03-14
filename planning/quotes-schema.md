# Quotes Schema (`quotes` Collection)

This document defines the structure of the `quotes` collection in Firestore. This collection stores information about quotes/proposals sent to leads or customers.

## Collection: `quotes`

Each document in the `quotes` collection represents a single quote.

## Document Structure (Interface):

```typescript
interface Quote {
  quoteId: string;        // Unique identifier (auto-generated)
  organisationId?: string; // Reference to the 'organisationId' in the 'organisations' collection (if applicable)
    contactId?: string; // Reference to contact
  projectId?: string;    // Optional: Reference to a project (if the quote is for a specific project)
  quoteNumber: string;    // A unique quote number (e.g., "Q-2024-001") - You might auto-generate this
  subject: string;        // Subject of the quote (e.g., "Website Redesign Proposal")
  quoteDate: string;      // Date the quote was created (ISO 8601 format)
  expiryDate: string;     // Date the quote expires (ISO 8601 format)
  status: string;        // Quote status ("draft", "sent", "accepted", "rejected", "expired")
  items: QuoteItem[];    // Array of quote items (see sub-interface below)
  subtotal: number;       // Calculated subtotal (sum of item amounts)
  tax: number;            // Tax amount
  total: number;          // Total amount (subtotal + tax)
  notes?: string;        // Optional: Notes (e.g., terms and conditions)
    quoteHTML?: string; // HTML for quote
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

interface QuoteItem {
  itemId: string;        // Unique identifier for the item
  description: string;   // Description of the item/service
  quantity: number;
  unitPrice: number;
  amount: number;        // Calculated amount (quantity * unitPrice)
}
```

**Key Fields and Considerations:**

*   **`quoteId`:** Auto-generated unique ID.
*   **`organisationId`:**  Links the quote to the client organisation.
*  **`contactId`:** Links to contact
*   **`projectId`:** (Optional) If the quote is related to a specific project, link it here.
*   **`quoteNumber`:** A unique quote number. You might want to implement a system for automatically generating sequential quote numbers (e.g., using a Cloud Function).
*   **`subject`:** A brief description of the quote.
*   **`quoteDate` & `expiryDate`:**  Store as ISO 8601 strings.
*   **`status`:**  Tracks the quote's progress.  Use a predefined set of values (e.g., "draft," "sent," "accepted," "rejected," "expired").
*   **`items`:** An *array* of `QuoteItem` objects.  This allows for multiple line items in the quote.
    *   **`itemId`:**  Unique identifier for the item.
    *   **`description`:** Description of the item/service.
    *   **`quantity`:**
    *   **`unitPrice`:**
    *   **`amount`:** Calculated amount (quantity * unitPrice).
*   **`subtotal`:** Calculated subtotal (sum of all item amounts).
*   **`tax`:**  Tax amount.
*   **`total`:** Total amount (subtotal + tax).
*   **`notes`:** (Optional)  For terms and conditions, payment instructions, etc.
*  **`quoteHTML`:** HTML for use in PDF generation
*   **`createdAt` & `updatedAt`:** Timestamps.

**Relationships:**

*   **`quotes` ↔️ `organisations`:** (via `organisationId`)
*   **`quotes` ↔️ `projects`:** (via `projectId` - optional)
*  **`quotes` ↔️ `contacts`
**Example JSON Record:**

```json
{
  "quoteId": "quote001",
  "organisationId": "org123",
    "contactId": "contact001",
  "projectId": "websiteProject001",
  "quoteNumber": "Q-2024-001",
  "subject": "Website Redesign Proposal",
  "quoteDate": "2024-03-13",
  "expiryDate": "2024-03-27",
  "status": "sent",
  "items": [
    {
      "itemId": "item001",
      "description": "Website Design and Development",
      "quantity": 1,
      "unitPrice": 5000,
      "amount": 5000
    },
    {
      "itemId": "item002",
      "description": "SEO Optimization",
      "quantity": 1,
      "unitPrice": 1000,
      "amount": 1000
    }
  ],
  "subtotal": 6000,
  "tax": 600,
  "total": 6600,
  "notes": "Payment terms: 50% upfront, 50% on completion.",
  "createdAt": "2024-03-13T08:00:00Z",
  "updatedAt": "2024-03-13T08:00:00Z"
}
```