# Detailed Implementation Plan: Contacts Cards with Firestore Data

## Overview

We need to modify the Contacts page to:
1. Fetch and display contact data from Firestore
2. Implement filtering by organisation, role, and status
3. Implement search functionality
4. Create contact cards with useful details
5. Enable navigation to contact details page

## Implementation Steps

### 1. Create a ContactCard Component

First, let's create a reusable ContactCard component to display individual contacts. This component will:
- Accept a Contact object as a prop
- Display contact information (name, email, phone, mobile, job title)
- Handle navigation to the contact details page
- Include action buttons (Details, Contact)

### 2. Update the Contacts Page Component

Modify the main Contacts page to:
- Initialize state for contacts, filters, and search
- Fetch contacts on component mount
- Apply filters when filter values change
- Apply search when search term changes
- Display filtered/searched contacts as cards

### 3. Implement Filtering Logic

Create a filtering system that:
- Filters contacts by organisation
- Filters contacts by role
- Filters contacts by status
- Combines multiple filters with AND logic

### 4. Implement Search Functionality

Create a search function that:
- Searches contacts by name, email, and other relevant fields
- Updates results in real-time as the user types
- Combines with active filters

## Code Modifications

### 1. Update the Contacts Component (index.tsx)

- Add state for filters and search term
- Implement useEffect to fetch contacts on mount
- Add filter change handlers
- Add search input handler
- Replace empty state with contact cards when data is available
- Implement loading state

### 2. Create ContactCard Component

- Create a new file: `src/pages/contacts/components/ContactCard.tsx`
- Implement the component with the contact card template from index.tsx
- Add navigation to contact details page

### 3. Update Filtering Logic

- Implement filter functions for each filter type
- Create a combined filter function that applies all active filters

### 4. Update Search Functionality

- Implement search function using the existing searchContacts method from useContacts
- Add debounce to prevent excessive API calls

## Final Result

When implemented, users will be able to:
- View all contacts as cards in a grid layout
- Filter contacts by organisation, role, and status
- Search for contacts by name or email
- Click on a contact card to view more details
- Add new contacts via the "Add Contact" button