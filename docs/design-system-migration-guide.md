# Design System Migration Guide

## Overview

This guide provides step-by-step instructions for migrating existing components to use the new design system. The design system provides a set of standardized UI components that ensure consistent styling across the application.

## Why Migrate?

Migrating to the design system offers several benefits:

1. **Consistency**: Ensures consistent styling across the application
2. **Maintainability**: Makes it easier to update styling in one place
3. **Efficiency**: Reduces development time by providing ready-to-use components
4. **Accessibility**: Components are designed with accessibility in mind
5. **Dark Mode Support**: All components support dark mode out of the box
6. **Responsive Design**: Components are designed to work on all screen sizes

## Migration Process

### Step 1: Identify Components to Migrate

Start by identifying the components that need to be migrated. Prioritize components that are used frequently or that have inconsistent styling.

### Step 2: Analyze the Component

Analyze the component to understand its structure and functionality:

1. What is the purpose of the component?
2. What UI elements does it contain?
3. What props does it accept?
4. What state does it manage?
5. What styling does it use?

### Step 3: Map to Design System Components

Map the existing component to design system components:

| Existing Pattern | Design System Component |
|------------------|-------------------------|
| Page container with padding | `Container` |
| Page title and description | `PageHeading` |
| Key-value information | `InfoItem` |
| Status indicators | `StatusBadge` |
| Buttons | `ActionButton` |
| Form sections | `FormSection` |
| Error messages | `ErrorMessage` |
| Loading indicators | `LoadingState` |
| Card layouts | `Card` |

### Step 4: Replace Custom Styling

Replace custom styling with design system components. Here are some common patterns and their replacements:

#### Before:

```tsx
<div className="container mx-auto px-4 py-8">
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Title</h1>
    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
      Page description
    </p>
  </div>
  
  {/* Content */}
</div>
```

#### After:

```tsx
<Container>
  <PageHeading
    title="Page Title"
    description="Page description"
  />
  
  {/* Content */}
</Container>
```

#### Before:

```tsx
<div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error Title</h3>
      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
        <p>Error message</p>
      </div>
    </div>
  </div>
</div>
```

#### After:

```tsx
<ErrorMessage
  title="Error Title"
  message="Error message"
/>
```

#### Before:

```tsx
<div className="container mx-auto flex items-center justify-center px-4 py-16">
  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
  <span className="ml-2">Loading...</span>
</div>
```

#### After:

```tsx
<LoadingState message="Loading..." fullPage />
```

#### Before:

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
  <div className="mb-4">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Card Title</h3>
  </div>
  
  {/* Card content */}
  
  <div className="mt-4 flex justify-end">
    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      Action
    </button>
  </div>
</div>
```

#### After:

```tsx
<Card
  header={<h3 className="text-lg font-medium text-gray-900 dark:text-white">Card Title</h3>}
  footer={
    <div className="flex justify-end">
      <ActionButton variant="primary">Action</ActionButton>
    </div>
  }
>
  {/* Card content */}
</Card>
```

### Step 5: Adjust Props

Adjust props as needed to match your requirements. The design system components are designed to be flexible and configurable.

### Step 6: Test Thoroughly

Test the migrated components to ensure they work as expected:

1. Test in both light and dark modes
2. Test on different screen sizes
3. Test with different data
4. Test edge cases

### Step 7: Update Documentation

Update documentation to reflect the changes:

1. Update component documentation
2. Update usage examples
3. Update storybook stories (if applicable)

## Example Migration: QuoteCreate Component

Let's walk through an example migration of the QuoteCreate component:

### Original Component:

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

### Migrated Component:

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

## Common Challenges and Solutions

### Challenge: Component Doesn't Match Design System

**Solution:** Create a wrapper component that combines design system components to match your requirements.

### Challenge: Design System Component Doesn't Support a Required Feature

**Solution:** Extend the design system component to add the required feature. If the feature is generally useful, consider adding it to the design system.

### Challenge: Design System Component Has Different Props

**Solution:** Create a wrapper component that maps your props to the design system component props.

### Challenge: Design System Component Has Different Styling

**Solution:** Use the design system component's styling customization props to match your requirements. If the styling is significantly different, consider adding a new variant to the design system.

## Best Practices

1. **Start Small**: Begin with simple components and gradually move to more complex ones
2. **Test Thoroughly**: Test each migrated component to ensure it works as expected
3. **Involve Designers**: Work with designers to ensure the migrated components match the design
4. **Document Changes**: Document the changes you make to help other developers
5. **Refactor Gradually**: You don't need to migrate everything at once; focus on high-impact areas first

## Conclusion

Migrating to the design system is a gradual process that will improve the consistency and maintainability of the application. By following this guide, you can ensure a smooth migration process.

For detailed documentation on each design system component, refer to the [Design System Documentation](./design-system.md).