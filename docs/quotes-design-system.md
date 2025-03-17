# Quotes Design System

This document outlines the standardized components for the quotes module. These components ensure consistent styling and behavior across all quote-related pages.

## Overview

The quotes design system provides reusable components that follow consistent styling patterns. By using these components, we can maintain a cohesive look and feel throughout the quotes module while making it easier to implement new features.

## Components

### QuoteContainer

A container component that provides consistent padding and maximum width for quote pages.

```tsx
import { QuoteContainer } from '../components/quotes/design-system';

<QuoteContainer maxWidth="xl">
  {/* Content goes here */}
</QuoteContainer>
```

**Props:**
- `children`: ReactNode (required) - The content to display inside the container
- `className`: string - Additional CSS classes
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' - Maximum width of the container (default: 'xl')

### QuoteHeading

A heading component for quote pages that includes a title, optional description, and action buttons.

```tsx
import { QuoteHeading } from '../components/quotes/design-system';

<QuoteHeading
  title="Create Quote"
  description="Create a new quote or proposal for a client"
  backLink={{
    to: '/quotes',
    label: 'Back to Quotes',
    onClick: () => navigate('/quotes')
  }}
  actions={
    <button>Create Quote</button>
  }
/>
```

**Props:**
- `title`: string (required) - The page title
- `description`: string - Optional description text
- `actions`: ReactNode - Optional action buttons
- `backLink`: Object - Optional back link configuration
  - `to`: string - The URL to navigate to
  - `label`: string - The link text
  - `onClick`: Function - Click handler
- `className`: string - Additional CSS classes

### QuoteInfoItem

A component for displaying key-value information in quotes.

```tsx
import { QuoteInfoItem } from '../components/quotes/design-system';

<QuoteInfoItem
  label="Quote Date"
  value={formatDate(quote.quoteDate)}
/>
```

**Props:**
- `label`: string (required) - The label for the information item
- `value`: ReactNode (required) - The value to display
- `className`: string - Additional CSS classes

### QuoteStatusBadge

A badge component for displaying quote statuses.

```tsx
import { QuoteStatusBadge } from '../components/quotes/design-system';
import { QuoteStatus } from '../types/Quote';

<QuoteStatusBadge status={QuoteStatus.DRAFT} />
```

**Props:**
- `status`: QuoteStatus (required) - The quote status to display
- `className`: string - Additional CSS classes
- `size`: 'small' | 'medium' | 'large' - Size of the badge (default: 'medium')

### QuoteActionButton

A button component for quote actions.

```tsx
import { QuoteActionButton } from '../components/quotes/design-system';

<QuoteActionButton
  variant="primary"
  onClick={handleSubmit}
  isLoading={submitting}
>
  Save Quote
</QuoteActionButton>
```

**Props:**
- `children`: ReactNode (required) - The button text or content
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' - The button style variant (default: 'primary')
- `isLoading`: boolean - Whether the button is in a loading state (default: false)
- `icon`: ReactNode - Optional icon to display
- `className`: string - Additional CSS classes
- ...other button props

### QuoteFormSection

A component for form sections in the quotes module.

```tsx
import { QuoteFormSection } from '../components/quotes/design-system';

<QuoteFormSection
  title="Quote Information"
  description="Enter the basic information for this quote"
>
  {/* Form fields go here */}
</QuoteFormSection>
```

**Props:**
- `title`: string (required) - The section title
- `children`: ReactNode (required) - The form fields or content
- `description`: string - Optional description text
- `className`: string - Additional CSS classes

### QuoteErrorMessage

A component for displaying error messages in the quotes module.

```tsx
import { QuoteErrorMessage } from '../components/quotes/design-system';

<QuoteErrorMessage
  title="Error creating quote"
  message="Failed to create quote. Please try again."
  onRetry={handleRetry}
/>
```

**Props:**
- `title`: string - Optional error title (default: 'Error')
- `message`: ReactNode (required) - Error message content
- `className`: string - Additional CSS classes
- `onRetry`: Function - Optional retry handler

### QuoteLoadingState

A component for displaying loading states in the quotes module.

```tsx
import { QuoteLoadingState } from '../components/quotes/design-system';

<QuoteLoadingState message="Loading quote data..." />
```

**Props:**
- `message`: string - Optional loading message (default: 'Loading...')
- `className`: string - Additional CSS classes
- `size`: 'small' | 'medium' | 'large' - Size of the loading spinner (default: 'medium')

### QuoteCard

A card component for displaying quote information in a card layout.

```tsx
import { QuoteCard } from '../components/quotes/design-system';

<QuoteCard
  quote={quote}
  onViewQuote={handleViewQuote}
  onEditQuote={handleEditQuote}
  onDeleteQuote={handleDeleteQuote}
/>
```

**Props:**
- `quote`: Quote (required) - The quote data to display
- `onViewQuote`: Function - Handler for viewing a quote
- `onEditQuote`: Function - Handler for editing a quote
- `onDeleteQuote`: Function - Handler for deleting a quote
- `className`: string - Additional CSS classes

## Usage Guidelines

1. **Consistency**: Always use these components instead of creating custom styles for quote pages.
2. **Composition**: Compose these components together to create complex UIs.
3. **Extension**: If you need to extend a component, consider adding props to the existing component rather than creating a new one.
4. **Dark Mode**: All components support dark mode out of the box.

## Example Page

Here's an example of how to use these components together to create a quote page:

```tsx
import React from 'react';
import {
  QuoteContainer,
  QuoteHeading,
  QuoteInfoItem,
  QuoteStatusBadge,
  QuoteActionButton,
  QuoteFormSection,
  QuoteErrorMessage,
  QuoteLoadingState
} from '../components/quotes/design-system';

const QuotePage = () => {
  // Component logic here...

  if (loading) {
    return (
      <QuoteContainer>
        <QuoteLoadingState message="Loading quote data..." />
      </QuoteContainer>
    );
  }

  if (error) {
    return (
      <QuoteContainer>
        <QuoteErrorMessage
          title="Error loading quote"
          message={error.message}
          onRetry={handleRetry}
        />
      </QuoteContainer>
    );
  }

  return (
    <QuoteContainer>
      <QuoteHeading
        title="Quote Details"
        description="View and manage quote information"
        backLink={{
          to: '/quotes',
          label: 'Back to Quotes',
          onClick: handleBack
        }}
        actions={
          <QuoteActionButton
            variant="primary"
            onClick={handleEdit}
          >
            Edit Quote
          </QuoteActionButton>
        }
      />

      <QuoteFormSection
        title="Quote Information"
      >
        <div className="grid grid-cols-2 gap-4">
          <QuoteInfoItem
            label="Quote Number"
            value={quote.quoteNumber}
          />
          <QuoteInfoItem
            label="Status"
            value={<QuoteStatusBadge status={quote.status} />}
          />
        </div>
      </QuoteFormSection>
    </QuoteContainer>
  );
};