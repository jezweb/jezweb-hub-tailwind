# Quotes Module Design System Migration Guide

## Overview

This guide provides detailed instructions for migrating the Quotes module components to use the design system. It includes specific examples and code snippets for each component in the Quotes module.

## Components to Migrate

The following components in the Quotes module need to be migrated:

1. **QuoteCreate**: The page for creating a new quote
2. **QuoteEdit**: The page for editing an existing quote
3. **QuoteView**: The page for viewing a quote's details
4. **QuoteIndex**: The main quotes listing page
5. **QuoteCard**: The card component for displaying a quote in the card view
6. **QuoteTable**: The table component for displaying quotes in the table view
7. **QuoteForm**: The form component for creating and editing quotes
8. **QuoteDetail**: The component for displaying quote details
9. **QuoteOrganisationForm**: The form for linking a quote to an organisation
10. **QuoteContactForm**: The form for linking a quote to a contact
11. **QuoteLeadForm**: The form for linking a quote to a lead

## Migration Process

The migration process involves the following steps for each component:

1. **Analyze**: Analyze the component to understand its structure and functionality
2. **Identify**: Identify the design system components that can be used
3. **Refactor**: Refactor the component to use the design system components
4. **Test**: Test the refactored component to ensure it works as expected
5. **Document**: Document the changes made to the component

## QuoteCreate Migration

### Original Component

```tsx
const QuoteCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createQuote, submitting, submitError } = useQuotes();
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (data: QuoteFormData) => {
    try {
      setError(null);
      const quoteId = await createQuote(data);
      
      // Navigate to the quote view page after successful creation
      navigate(`/quotes/${quoteId}`);
    } catch (err) {
      console.error('Error creating quote:', err);
      setError('Failed to create quote. Please try again.');
    }
  };
  
  // Handle cancel action
  const handleCancel = () => {
    navigate('/quotes');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Quote</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Create a new quote or proposal for a client
        </p>
      </div>
      
      {/* Error Message */}
      {(error || submitError) && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error creating quote</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error || (submitError && submitError.message) || 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quote Form */}
      <QuoteForm
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};
```

### Migrated Component

```tsx
const QuoteCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createQuote, submitting, submitError } = useQuotes();
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (data: QuoteFormData) => {
    try {
      setError(null);
      const quoteId = await createQuote(data);
      
      // Navigate to the quote view page after successful creation
      navigate(`/quotes/${quoteId}`);
    } catch (err) {
      console.error('Error creating quote:', err);
      setError('Failed to create quote. Please try again.');
    }
  };
  
  // Handle cancel action
  const handleCancel = () => {
    navigate('/quotes');
  };
  
  // Handle retry action
  const handleRetry = () => {
    setError(null);
  };
  
  return (
    <Container>
      <PageHeading
        title="Create Quote"
        description="Create a new quote or proposal for a client"
        backLink={{
          to: '/quotes',
          label: 'Back to Quotes'
        }}
      />
      
      {/* Error Message */}
      {(error || submitError) && (
        <ErrorMessage
          title="Error creating quote"
          message={error || (submitError && submitError.message) || 'An unexpected error occurred'}
          onRetry={handleRetry}
        />
      )}
      
      {/* Quote Form */}
      <QuoteForm
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Container>
  );
};
```

### Changes Made

1. Replaced the container div with the `Container` component
2. Replaced the heading div with the `PageHeading` component
3. Added a back link to the `PageHeading` component
4. Replaced the error message div with the `ErrorMessage` component
5. Added a retry handler for the `ErrorMessage` component

## QuoteCard Migration

### Original Component

```tsx
const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  onViewQuote,
  onEditQuote,
  onDeleteQuote
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate" title={quote.subject}>
          {quote.subject}
        </h3>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses(quote.status)}`}>
          <span className={`-ml-0.5 mr-1.5 h-2 w-2 rounded-full ${getStatusDotClasses(quote.status)}`}></span>
          {formatStatus(quote.status)}
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Organisation */}
        {quote.organisationId && quote.organisationName && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Organisation</span>
            <span className="font-medium text-gray-900 dark:text-white">{quote.organisationName}</span>
          </div>
        )}
        
        {/* Quote ID */}
        <div className="flex justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Quote ID</span>
          <span className="text-gray-700 dark:text-gray-300">{quote.quoteNumber || `Q-${quote.quoteId.substring(0, 8)}`}</span>
        </div>
        
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Quote Date</span>
            <span className="text-gray-700 dark:text-gray-300">{formatDate(quote.quoteDate)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</span>
            <span className="text-gray-700 dark:text-gray-300">{formatDate(quote.expiryDate)}</span>
          </div>
        </div>
        
        {/* Items and Total */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Items</span>
            <span className="text-gray-700 dark:text-gray-300">{quote.items?.length || 0}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(quote.total || 0)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => onViewQuote(quote.quoteId)}
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </button>
        
        <div className="space-x-2">
          <button
            onClick={() => onEditQuote(quote.quoteId)}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          
          <button
            onClick={() => onDeleteQuote(quote.quoteId)}
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Migrated Component

```tsx
const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  onViewQuote,
  onEditQuote,
  onDeleteQuote
}) => {
  return (
    <Card
      className="h-full"
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate" title={quote.subject}>
            {quote.subject}
          </h3>
          <StatusBadge status={quote.status} />
        </div>
      }
      footer={
        <div className="flex justify-between">
          <ActionButton
            variant="secondary"
            size="small"
            onClick={() => onViewQuote(quote.quoteId)}
            iconBefore={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          >
            View
          </ActionButton>
          
          <div className="space-x-2">
            <ActionButton
              variant="light"
              size="small"
              onClick={() => onEditQuote(quote.quoteId)}
              iconBefore={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              Edit
            </ActionButton>
            
            <ActionButton
              variant="danger"
              size="small"
              onClick={() => onDeleteQuote(quote.quoteId)}
              iconBefore={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              Delete
            </ActionButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Organisation */}
        {quote.organisationId && quote.organisationName && (
          <InfoItem
            label="Organisation"
            value={quote.organisationName}
            emphasized
          />
        )}
        
        {/* Quote ID */}
        <InfoItem
          label="Quote ID"
          value={quote.quoteNumber || `Q-${quote.quoteId.substring(0, 8)}`}
        />
        
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            label="Quote Date"
            value={formatDate(quote.quoteDate)}
          />
          
          <InfoItem
            label="Expiry Date"
            value={formatDate(quote.expiryDate)}
          />
        </div>
        
        {/* Items and Total */}
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            label="Items"
            value={quote.items?.length || 0}
          />
          
          <InfoItem
            label="Total"
            value={formatCurrency(quote.total || 0)}
            emphasized
          />
        </div>
      </div>
    </Card>
  );
};
```

### Changes Made

1. Replaced the card div with the `Card` component
2. Moved the header content to the `header` prop of the `Card` component
3. Replaced the status span with the `StatusBadge` component
4. Replaced the key-value divs with the `InfoItem` component
5. Moved the footer content to the `footer` prop of the `Card` component
6. Replaced the buttons with the `ActionButton` component

## Conclusion

By following this guide, you can migrate the Quotes module components to use the design system. This will ensure consistent styling and behavior across the application, improve maintainability, and enhance the developer experience.

For more information on the design system components, see the [Design System Documentation](./design-system.md).