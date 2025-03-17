# Design System Documentation

## Overview

The design system provides a set of standardized UI components that ensure consistent styling across the application. This document provides detailed information about each component, including its purpose, props, and usage examples.

## Core Principles

The design system is built on the following principles:

1. **Consistency**: All components follow the same design language and patterns
2. **Accessibility**: Components are designed with accessibility in mind
3. **Flexibility**: Components are configurable to meet different needs
4. **Dark Mode Support**: All components support both light and dark modes
5. **Responsive Design**: Components are designed to work on all screen sizes

## Components

### Container

The Container component provides a standardized container for page content with consistent padding and maximum width.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The content to be rendered inside the container |
| className | string | '' | Additional CSS classes to apply to the container |
| maxWidth | string | 'max-w-7xl' | Maximum width of the container |
| paddingX | string | 'px-4' | Horizontal padding |
| paddingY | string | 'py-8' | Vertical padding |

#### Usage

```tsx
<Container>
  <h1>Page Content</h1>
</Container>
```

### PageHeading

The PageHeading component provides a standardized heading for pages with optional description, back link, and actions.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | The title of the page |
| description | string | - | Optional description text to display below the title |
| backLink | { to: string, label: string } | - | Optional back link configuration |
| actions | ReactNode | - | Optional actions to display in the header |
| className | string | '' | Additional CSS classes to apply to the container |

#### Usage

```tsx
<PageHeading
  title="Page Title"
  description="Page description"
  backLink={{
    to: "/previous-page",
    label: "Back to Previous Page"
  }}
  actions={
    <ActionButton variant="primary">
      Action
    </ActionButton>
  }
/>
```

### Card

The Card component provides a standardized card layout for displaying information with optional header and footer.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The content to be rendered inside the card |
| header | ReactNode | - | Optional header content to display at the top of the card |
| footer | ReactNode | - | Optional footer content to display at the bottom of the card |
| hoverable | boolean | false | Whether the card should have a hover effect |
| bordered | boolean | true | Whether the card should have a border |
| padding | 'none' \| 'small' \| 'medium' \| 'large' | 'medium' | Padding size for the card content |
| className | string | '' | Additional CSS classes to apply to the card |

#### Usage

```tsx
<Card
  header={<h3 className="text-lg font-medium">Card Title</h3>}
  footer={
    <div className="flex justify-end">
      <ActionButton variant="primary">Action</ActionButton>
    </div>
  }
>
  <p>Card content</p>
</Card>
```

### ActionButton

The ActionButton component provides a standardized button for actions with various variants, sizes, and states.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The content to be rendered inside the button |
| variant | 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark' \| 'link' | 'primary' | The variant of the button |
| size | 'small' \| 'medium' \| 'large' | 'medium' | The size of the button |
| isLoading | boolean | false | Whether the button is in a loading state |
| disabled | boolean | false | Whether the button is disabled |
| fullWidth | boolean | false | Whether the button should take up the full width of its container |
| iconBefore | ReactNode | - | Optional icon to display before the button text |
| iconAfter | ReactNode | - | Optional icon to display after the button text |
| className | string | '' | Additional CSS classes to apply to the button |
| ...props | ButtonHTMLAttributes | - | Additional props to pass to the button element |

#### Usage

```tsx
<ActionButton
  variant="primary"
  size="medium"
  onClick={handleClick}
  isLoading={isSubmitting}
>
  Submit
</ActionButton>
```

### ErrorMessage

The ErrorMessage component provides a standardized error message with optional retry action.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | 'Error' | The title of the error message |
| message | string \| ReactNode | - | The error message content |
| showIcon | boolean | true | Whether to show the error icon |
| className | string | '' | Additional CSS classes to apply to the container |
| action | ReactNode | - | Optional action to display |
| onRetry | () => void | - | Optional callback function for retry action |

#### Usage

```tsx
<ErrorMessage
  title="Error loading data"
  message="Failed to load data. Please try again."
  onRetry={handleRetry}
/>
```

### LoadingState

The LoadingState component provides a standardized loading indicator with optional message.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| message | string | - | Optional message to display alongside the loading indicator |
| fullPage | boolean | false | Whether the loading state should take up the full page |
| size | 'small' \| 'medium' \| 'large' | 'medium' | The size of the loading indicator |
| className | string | '' | Additional CSS classes to apply to the container |

#### Usage

```tsx
<LoadingState message="Loading data..." fullPage />
```

### StatusBadge

The StatusBadge component provides a standardized badge for displaying status information.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| status | string | - | The status to display |
| label | string | - | Optional label to display instead of the status |
| showDot | boolean | true | Whether to show a dot indicator |
| className | string | '' | Additional CSS classes to apply to the badge |

#### Usage

```tsx
<StatusBadge status="active" />
```

### InfoItem

The InfoItem component provides a standardized way to display key-value information.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | The label for the information |
| value | ReactNode | - | The value to display |
| emphasized | boolean | false | Whether the value should be displayed with emphasis |
| direction | 'horizontal' \| 'vertical' | 'horizontal' | Layout direction for the label and value |
| className | string | '' | Additional CSS classes to apply to the container |
| labelClassName | string | '' | Additional CSS classes to apply to the label |
| valueClassName | string | '' | Additional CSS classes to apply to the value |

#### Usage

```tsx
<InfoItem label="Email" value="user@example.com" emphasized />
```

### FormSection

The FormSection component provides a standardized way to group form fields into logical sections.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | The title of the form section |
| description | string | - | Optional description text to display below the title |
| children | ReactNode | - | The form fields to display in the section |
| className | string | '' | Additional CSS classes to apply to the container |
| bordered | boolean | true | Whether the section should have a border |
| padded | boolean | true | Whether the section should have padding |

#### Usage

```tsx
<FormSection
  title="Personal Information"
  description="Enter your personal details below"
>
  <input type="text" placeholder="Name" />
  <input type="email" placeholder="Email" />
</FormSection>
```

## Best Practices

### Component Composition

Components can be composed together to create more complex UI elements. For example:

```tsx
<Container>
  <PageHeading
    title="Dashboard"
    description="Overview of your account"
  />
  
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <h3 className="text-lg font-medium">Card 1</h3>
      <p>Card content</p>
    </Card>
    
    <Card>
      <h3 className="text-lg font-medium">Card 2</h3>
      <p>Card content</p>
    </Card>
    
    <Card>
      <h3 className="text-lg font-medium">Card 3</h3>
      <p>Card content</p>
    </Card>
  </div>
</Container>
```

### Dark Mode Support

All components support dark mode out of the box. The dark mode styles are applied automatically when the `dark` class is added to the `html` element.

### Responsive Design

All components are designed to work on all screen sizes. Use the appropriate Tailwind CSS classes to make your layouts responsive.

### Accessibility

All components are designed with accessibility in mind. Make sure to provide appropriate ARIA attributes when necessary.

## Migration Guide

For information on how to migrate existing components to use the design system, see the [Design System Migration Guide](./design-system-migration-guide.md).