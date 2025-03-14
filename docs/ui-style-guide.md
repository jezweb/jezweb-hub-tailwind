# Jezweb Hub UI Style Guide

This document outlines the standard UI components and layout conventions used throughout the Jezweb Hub application, with a focus on the patterns established in the organisation pages. Use this as a reference when implementing new pages or updating existing ones to maintain consistency.

## Table of Contents

- [Layout Containers](#layout-containers)
- [Typography](#typography)
- [Buttons](#buttons)
- [Form Elements](#form-elements)
- [Cards and Panels](#cards-and-panels)
- [Tables](#tables)
- [Status Indicators](#status-indicators)
- [Alerts and Notifications](#alerts-and-notifications)
- [Spacing](#spacing)
- [Responsive Design](#responsive-design)
- [Dark Mode Support](#dark-mode-support)

## Layout Containers

### Page Structure

Each page typically follows this structure:
```jsx
<>
  <PageMeta title="Page Title | Jezweb Hub" description="Page description" />
  <PageBreadcrumb pageTitle="Page Title" items={[/* breadcrumb items */]} />
  
  {/* Main content */}
  <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
    {/* Page content goes here */}
  </div>
</>
```

### Grid Layout

For multi-column layouts:
```jsx
<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
  {/* Column content */}
</div>
```

For form sections with spacing:
```jsx
<div className="space-y-5 sm:space-y-6">
  {/* Form sections */}
</div>
```

### Section Containers

Standard section container:
```jsx
<div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
  <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
    Section Title
  </h4>
  {/* Section content */}
</div>
```

## Typography

### Headings

- **Page Title**: `text-theme-xl font-semibold text-black dark:text-white sm:text-2xl`
- **Section Title**: `mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl`
- **Subsection Title**: `mb-4 text-lg font-semibold text-gray-800 dark:text-white/90`

### Body Text

- **Regular Text**: `text-sm text-gray-800 dark:text-white/90`
- **Label Text**: `mb-2.5 block text-black dark:text-white`
- **Hint/Helper Text**: `text-xs text-gray-500 dark:text-gray-400`
- **Error Text**: `text-danger text-sm mt-1`

## Buttons

### Button Variants

```jsx
// Primary button (blue) - Use for main actions
<Button variant="primary">Primary Action</Button>

// Secondary button (gray) - Use for secondary actions like Cancel/Back
<Button variant="secondary">Secondary Action</Button>

// Danger button (red outline) - Use for destructive actions
<Button variant="danger">Delete</Button>

// Outline button - Use for less emphasized actions
<Button variant="outline">Outline Action</Button>

// Success, Warning, Info buttons - Use for contextual actions
<Button variant="success">Success Action</Button>
<Button variant="warning">Warning Action</Button>
<Button variant="info">Info Action</Button>
```

### Button Sizes

```jsx
// Default size
<Button variant="primary">Normal Button</Button>

// Small size
<Button variant="primary" size="sm">Small Button</Button>
```

### Buttons with Icons

```jsx
// Button with start icon
<Button
  variant="primary"
  startIcon={<svg>...</svg>}
>
  Button Text
</Button>

// Button with end icon
<Button
  variant="primary"
  endIcon={<svg>...</svg>}
>
  Button Text
</Button>
```

### Button Groups

```jsx
<div className="flex space-x-3">
  <Button variant="primary">First Button</Button>
  <Button variant="danger">Second Button</Button>
  <Button variant="secondary">Third Button</Button>
</div>
```

## Form Elements

### Input Fields

```jsx
<div className="mb-4.5">
  <Label>
    Field Label <span className="text-meta-1">*</span>
  </Label>
  <Input
    type="text"
    id="fieldId"
    name="fieldName"
    value={value}
    onChange={handleChange}
    placeholder="Enter value"
    error={!!error}
    hint={error}
  />
</div>
```

### Select Dropdowns

```jsx
<div className="mb-4.5">
  <Label>
    Select Label <span className="text-meta-1">*</span>
  </Label>
  <Select
    options={[
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" }
    ]}
    placeholder="Select an option"
    defaultValue={selectedValue}
    onChange={handleSelectChange}
  />
</div>
```

### Text Areas

```jsx
<div className="mb-4.5">
  <Label>
    Text Area Label
  </Label>
  <TextArea
    value={value}
    onChange={handleChange}
    rows={4}
    placeholder="Enter text here"
  />
</div>
```

### Form Layout

For two-column forms:
```jsx
<form onSubmit={handleSubmit}>
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
    <div className="space-y-5 sm:space-y-6">
      {/* Left column form fields */}
    </div>
    <div className="space-y-6">
      {/* Right column form fields */}
      
      {/* Form Actions */}
      <div className="flex justify-end gap-4.5 mt-6">
        <Button onClick={handleCancel} variant="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </div>
    </div>
  </div>
</form>
```

## Cards and Panels

### Basic Card

```jsx
<div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
  <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
    Card Title
  </h4>
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {/* Card content */}
  </div>
</div>
```

### Information Display Card

For displaying key-value information:
```jsx
<div>
  <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
    Label
  </span>
  <span className="block text-sm text-gray-800 dark:text-white/90">
    Value
  </span>
</div>
```

## Tables

### Standard Table

```jsx
<div className="overflow-x-auto rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-default">
  <table className="w-full table-auto">
    <thead>
      <tr className="bg-gray-2 text-left dark:bg-meta-4">
        <th className="py-4 px-4 font-medium text-gray-800 dark:text-white/90">
          Column Header
        </th>
        {/* More headers */}
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.id}>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            <h5 className="font-medium text-gray-800 dark:text-white/90">
              {item.name}
            </h5>
          </td>
          {/* More cells */}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Table with Actions

```jsx
<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
  <div className="flex items-center space-x-3.5">
    <button
      className="hover:text-primary"
      aria-label="View"
    >
      <svg className="fill-current" width="18" height="18">
        {/* SVG content */}
      </svg>
    </button>
    <button
      className="hover:text-primary"
      aria-label="Edit"
    >
      <svg className="fill-current" width="18" height="18">
        {/* SVG content */}
      </svg>
    </button>
    <button
      className="hover:text-primary"
      aria-label="Delete"
    >
      <svg className="fill-current" width="18" height="18">
        {/* SVG content */}
      </svg>
    </button>
  </div>
</td>
```

## Status Indicators

### Status Badges

```jsx
<span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
  status === 'active' 
    ? 'bg-success bg-opacity-10 text-success' 
    : status === 'inactive'
    ? 'bg-danger bg-opacity-10 text-danger'
    : status === 'lead'
    ? 'bg-warning bg-opacity-10 text-warning'
    : 'bg-info bg-opacity-10 text-info'
}`}>
  {status}
</span>
```

### Loading Spinner

```jsx
<div className="flex justify-center items-center p-8">
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
</div>
```

## Alerts and Notifications

### Alert Component

```jsx
<Alert 
  variant="error" 
  title="Error!" 
  message="Error message here" 
/>

<Alert 
  variant="warning" 
  title="Warning!" 
  message="Warning message here" 
/>

<Alert 
  variant="success" 
  title="Success!" 
  message="Success message here" 
/>

<Alert 
  variant="info" 
  title="Info!" 
  message="Information message here" 
/>
```

## Spacing

### Margin and Padding

- Standard section spacing: `space-y-6`
- Form field spacing: `mb-4.5`
- Button group spacing: `space-x-3`
- Grid gap: `gap-6` (large), `gap-4` (medium)
- Section padding: `p-6`
- Page padding: `px-5 py-7 xl:px-10 xl:py-12`

## Responsive Design

### Breakpoints

- **sm**: Small screens (640px and up)
- **md**: Medium screens (768px and up)
- **lg**: Large screens (1024px and up)
- **xl**: Extra large screens (1280px and up)
- **2xl**: 2X large screens (1536px and up)

### Responsive Patterns

- Single to multi-column layout:
  ```jsx
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
  ```

- Responsive text sizing:
  ```jsx
  <h4 className="text-xl sm:text-2xl">
  ```

- Responsive padding:
  ```jsx
  <div className="px-5 py-7 xl:px-10 xl:py-12">
  ```

## Dark Mode Support

All components should include dark mode variants to ensure a consistent user experience in both light and dark themes.

### Dark Mode Color Classes

- Background: `bg-white dark:bg-white/[0.03]`
- Borders: `border-gray-200 dark:border-gray-800`
- Border radius: Use `rounded-2xl` for consistent border radius on containers
- Text:
  - Primary text: `text-black dark:text-white`
  - Secondary text: `text-gray-600 dark:text-gray-400`
  - Muted text: `text-gray-500 dark:text-gray-400`

### Component-Specific Dark Mode Styling

#### Containers and Cards
```jsx
// Standard container
<div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
  {/* Content */}
</div>

// Card
<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
  {/* Card content */}
</div>
```

#### Buttons
```jsx
// Primary button
<Button variant="primary">Primary Action</Button>

// Outline button
<Button variant="outline">Outline Action</Button>

// Danger button
<Button variant="danger">Delete</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>
```

#### Form Elements
```jsx
// Input field
<input
  type="text"
  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
/>

// Select dropdown
<select
  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
>
  <option>Option 1</option>
</select>

// Checkbox
<input
  type="checkbox"
  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
/>
```

#### Tables
```jsx
// Table header
<thead>
  <tr className="bg-gray-100 dark:bg-gray-800">
    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
      Column Header
    </th>
  </tr>
</thead>

// Table row
<tr className="border-t border-gray-200 dark:border-gray-700">
  <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">
    Cell content
  </td>
</tr>
```

#### Alerts and Notifications
```jsx
// Error alert
<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
  Error message
</div>

// Success alert
<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
  Success message
</div>
```

### Best Practices for Dark Mode

1. **Always include dark mode variants** for all UI elements
2. **Use semantic color naming** rather than visual color names
3. **Test contrast ratios** to ensure readability in both modes
4. **Use opacity for subtle backgrounds** in dark mode (e.g., `dark:bg-white/[0.03]`)
5. **Avoid hard-coded colors** that don't adapt to the theme
6. **Maintain consistent styling patterns** across the application
7. **Use the Button component** for all buttons to ensure consistent styling
8. **Prefer Tailwind classes** over custom CSS for better dark mode support

## Color Scheme

### Primary Colors

- **Primary**: Blue (`bg-blue-600`, `text-primary`)
- **Success**: Green (`bg-success`, `text-success`)
- **Warning**: Yellow/Orange (`bg-warning`, `text-warning`)
- **Danger**: Red (`bg-danger`, `text-danger`)
- **Info**: Light Blue (`bg-info`, `text-info`)

### Neutral Colors

- **Background**: White/Dark (`bg-white`, `dark:bg-white/[0.03]`)
- **Text**: Black/White (`text-black`, `dark:text-white`) 
- **Border**: Gray (`border-gray-200`, `dark:border-gray-800`)
- **Muted Text**: Gray (`text-gray-500`, `dark:text-gray-400`)

## Best Practices

1. **Consistency**: Use the components and patterns in this guide consistently across all pages
2. **Accessibility**: Ensure proper contrast ratios and semantic HTML
3. **Responsiveness**: Test layouts on different screen sizes
4. **Dark Mode**: Always include dark mode variants for all UI elements
5. **Component Reuse**: Use the established components rather than creating custom styles
6. **Semantic Buttons**: Use the appropriate button variant based on the action's purpose
7. **Form Layout**: Follow the established form layout patterns for consistency
8. **Error Handling**: Always include proper error states and messages
9. **Loading States**: Show loading indicators during async operations