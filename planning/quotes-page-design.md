# Quotes Page Design and Implementation

This document explains the design and features of the quotes functionality in the Jezweb Hub application. It covers the main listing page with table and card views, filtering capabilities, the detail view, and the edit functionality. This information is intended to provide context for building similar components elsewhere in the application.

## 1. Quotes Listing Page (index.tsx)

The quotes listing page provides a comprehensive interface for viewing and managing quotes with two display modes: table and card view.

### Key Features

- **Dual View Modes**: Toggle between table and card views
- **Advanced Filtering**: Filter by status, date range, and search term
- **Sorting**: Sort by different fields with direction control
- **Action Buttons**: View, edit, and delete quotes directly from the listing

### Implementation Details

#### View Mode Toggle

The page implements a toggle between table and card views using state:

```tsx
// State for view mode (table or card)
const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

// View toggle buttons
<div className="inline-flex rounded-md shadow-sm">
  <button
    type="button"
    onClick={() => setViewMode('table')}
    className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
      viewMode === 'table'
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    <svg className="mr-2 h-5 w-5" ... />
    Table
  </button>
  <button
    type="button"
    onClick={() => setViewMode('card')}
    className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
      viewMode === 'card'
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    <svg className="mr-2 h-5 w-5" ... />
    Cards
  </button>
</div>
```

#### Filtering System

The filtering system uses state variables and handlers to manage filters:

```tsx
// State for filters
const [filters, setFilters] = useState({
  status: '',
  searchTerm: '',
  dateRange: {
    start: '',
    end: ''
  }
});

// Handle filter changes
const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
  const { name, value } = e.target;
  
  if (name === 'startDate' || name === 'endDate') {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [name === 'startDate' ? 'start' : 'end']: value
      }
    }));
  } else {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

// Apply filters
const applyFilters = () => {
  const activeFilters: any = {};
  
  if (filters.status) {
    activeFilters.status = filters.status;
  }
  
  if (filters.dateRange.start) {
    activeFilters.startDate = filters.dateRange.start;
  }
  
  if (filters.dateRange.end) {
    activeFilters.endDate = filters.dateRange.end;
  }
  
  if (filters.searchTerm) {
    searchQuotes(filters.searchTerm);
  } else {
    fetchQuotes(activeFilters, sortField, sortDirection);
  }
};
```

#### Conditional Rendering

The page uses conditional rendering to display different views based on the current state:

```tsx
{viewMode === 'table' ? (
  <QuoteTable
    quotes={quotes}
    isLoading={loading}
    onViewQuote={handleViewQuote}
    onEditQuote={handleEditQuote}
    onDeleteQuote={handleDeleteQuote}
    onSort={handleSortChange}
    sortField={sortField}
    sortDirection={sortDirection}
  />
) : (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {quotes.map((quote: Quote) => (
      <QuoteCard
        key={quote.quoteId}
        quote={quote}
        onViewQuote={handleViewQuote}
        onEditQuote={handleEditQuote}
        onDeleteQuote={handleDeleteQuote}
      />
    ))}
  </div>
)}
```

## 2. Quote Detail View (QuoteView.tsx)

The quote detail view displays comprehensive information about a specific quote and provides functionality to manage its relationships with organisations, contacts, and leads.

### Key Features

- **Quote Details Display**: Shows all quote information including items, totals, and dates
- **Status Management**: Change quote status (draft, sent, accepted, rejected, expired)
- **PDF Generation**: Generate PDF version of the quote
- **Email Functionality**: Send quote via email
- **Relationship Management**: Link/unlink the quote to organisations, contacts, and leads

### Implementation Details

#### Layout Structure

The detail view uses a grid layout with a main content area and a sidebar:

```tsx
<div className="grid gap-6 lg:grid-cols-3">
  {/* Quote Details */}
  <div className="lg:col-span-2">
    <QuoteDetail
      quote={selectedQuote}
      isLoading={loadingQuote}
      onEdit={handleEditQuote}
      onDelete={handleDeleteQuote}
      onStatusChange={handleStatusChange}
      onGeneratePDF={handleGeneratePDF}
      onSendQuote={handleSendQuote}
    />
  </div>
  
  {/* Sidebar */}
  <div className="space-y-6">
    {/* Organisation Form */}
    <QuoteOrganisationForm
      quote={selectedQuote}
      organisations={organisations}
      isLoading={loadingOrganisations}
      onLinkOrganisation={handleLinkOrganisation}
      onUnlinkOrganisation={handleUnlinkOrganisation}
    />
    
    {/* Contact Form */}
    <QuoteContactForm
      quote={selectedQuote}
      contacts={contacts}
      isLoading={loadingContacts}
      onLinkContact={handleLinkContact}
      onUnlinkContact={handleUnlinkContact}
    />
    
    {/* Lead Form */}
    <QuoteLeadForm
      quote={selectedQuote}
      leads={leads}
      isLoading={loadingLeads}
      onLinkLead={handleLinkLead}
      onUnlinkLead={handleUnlinkLead}
    />
  </div>
</div>
```

#### Status Management

The component provides functionality to change the quote status:

```tsx
// Handle status change action
const handleStatusChange = async (quoteId: string, status: QuoteStatus) => {
  try {
    await updateQuoteStatus(quoteId, status);
    // Refresh quote data
    fetchQuoteById(quoteId);
  } catch (error) {
    console.error('Error updating quote status:', error);
    throw error;
  }
};
```

#### Relationship Management

The component manages relationships with organisations, contacts, and leads:

```tsx
// Handle link to organisation action
const handleLinkOrganisation = async (quoteId: string, organisationId: string, organisationName: string) => {
  try {
    await linkQuoteToOrganisation(quoteId, organisationId, organisationName);
    // Refresh quote data
    fetchQuoteById(quoteId);
  } catch (error) {
    console.error('Error linking quote to organisation:', error);
    throw error;
  }
};

// Similar handlers for contacts and leads
```

## 3. Quote Edit View (QuoteEdit.tsx)

The quote edit view provides a form for modifying an existing quote's details.

### Key Features

- **Pre-populated Form**: Loads existing quote data into the form
- **Validation**: Ensures all required fields are filled correctly
- **Error Handling**: Displays error messages for failed operations
- **Loading States**: Shows loading indicators during data fetching and submission

### Implementation Details

#### Data Fetching

The component fetches the quote data on mount:

```tsx
// Fetch quote data on component mount
useEffect(() => {
  if (quoteId) {
    fetchQuoteById(quoteId);
  }
}, [quoteId, fetchQuoteById]);
```

#### Form Submission

The component handles form submission and navigation:

```tsx
// Handle form submission
const handleSubmit = async (data: QuoteFormData) => {
  if (!quoteId) return;
  
  try {
    setError(null);
    await updateQuote(quoteId, data);
    
    // Navigate to the quote view page after successful update
    navigate(`/quotes/${quoteId}`);
  } catch (err) {
    console.error('Error updating quote:', err);
    setError('Failed to update quote. Please try again.');
  }
};
```

#### Loading and Error States

The component handles loading and error states:

```tsx
// Show loading state
if (loadingQuote) {
  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
      <span className="ml-2">Loading quote data...</span>
    </div>
  );
}

// Show error state
if (quoteError || !selectedQuote) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
        <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Quote</h2>
        <p className="text-red-700 dark:text-red-300">
          {quoteError?.message || 'Quote not found'}
        </p>
        <button
          onClick={() => navigate('/quotes')}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Back to Quotes
        </button>
      </div>
    </div>
  );
}
```

## 4. Data Flow and Component Relationships

### Data Flow

```
useQuotes Hook
    ↓
QuotesPage (index.tsx)
    ↓
QuoteTable / QuoteCard
    ↓
QuoteView / QuoteEdit
    ↓
QuoteForm / QuoteDetail
```

### Component Relationships

- **index.tsx**: Main container that manages state and renders either QuoteTable or QuoteCard components
- **QuoteView.tsx**: Displays quote details and manages relationships
- **QuoteEdit.tsx**: Provides form for editing quotes
- **QuoteForm.tsx**: Reusable form component used by both QuoteCreate and QuoteEdit
- **QuoteDetail.tsx**: Displays detailed quote information
- **QuoteTable.tsx**: Displays quotes in a table format
- **QuoteCard.tsx**: Displays quotes in a card format

## 5. Reusable Patterns for Similar Components

When implementing similar components elsewhere in the application, consider these patterns:

1. **Dual View Modes**: Use state to toggle between different view modes (table/card)
2. **Filtering System**: Implement a consistent filtering system with state management
3. **Component Separation**: Separate display components (Table/Card) from container components
4. **Loading/Error States**: Implement consistent loading and error states
5. **Relationship Management**: Use sidebar forms for managing relationships between entities
6. **Form Reuse**: Create reusable form components that can be used for both creation and editing

## 6. Implementation Guidelines

When implementing similar components:

1. Use the `useX` hook pattern for data fetching and state management
2. Implement proper loading and error states for all async operations
3. Separate business logic from presentation components
4. Use consistent styling for UI elements
5. Implement proper validation for forms
6. Use the grid layout pattern for detail views with sidebars
7. Implement relationship management in the sidebar
8. Use consistent action buttons (view, edit, delete) across the application