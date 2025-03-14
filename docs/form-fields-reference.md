# Form Fields Reference

This document provides a comprehensive reference of all form field components used in the Jezweb Hub application. It serves as a guide for implementing consistent forms across the application.

## Table of Contents

- [Overview](#overview)
- [Standard Form Fields](#standard-form-fields)
  - [Text Input](#text-input)
  - [Select Dropdown](#select-dropdown)
  - [Text Area](#text-area)
  - [Button](#button)
- [Custom Form Fields](#custom-form-fields)
  - [EmailField](#emailfield)
  - [PhoneField](#phonefield)
  - [CountryStateCityField](#countrystatecityfield)
  - [EmojiPickerField](#emojipickerfield)
  - [ColorPickerField](#colorpickerfield)
  - [ProfilePhotoUploader](#profilephotouploader)
- [Complex Form Components](#complex-form-components)
  - [OrganisationAssociationManager](#organisationassociationmanager)
- [Form Layout Patterns](#form-layout-patterns)
- [Form Validation](#form-validation)
- [Error Handling](#error-handling)
- [Accessibility Considerations](#accessibility-considerations)

## Overview

The Jezweb Hub application uses a combination of standard form fields from the TailAdmin design system and custom form components that provide enhanced functionality. This reference documents all these components to ensure consistency across the application.

All form fields follow these principles:
- Consistent styling with the TailAdmin design system
- Support for validation and error states
- Dark mode compatibility
- Accessibility compliance
- Responsive design

## Standard Form Fields

### Text Input

The standard text input field used for most text-based data entry.

**Component:** `Input` from `components/form/input/InputField`

**Props:**
- `type`: Input type (text, password, email, etc.)
- `id`: Unique identifier
- `name`: Form field name
- `value`: Current value
- `onChange`: Change handler function
- `placeholder`: Placeholder text
- `error`: Boolean to indicate error state
- `hint`: Helper text or error message
- `disabled`: Whether the field is disabled
- `required`: Whether the field is required

**Example:**
```jsx
<div className="mb-4.5">
  <Label>
    First Name <span className="text-meta-1">*</span>
  </Label>
  <Input
    type="text"
    id="firstName"
    name="firstName"
    value={formData.firstName}
    onChange={handleChange}
    placeholder="Enter first name"
    error={!!(errors.firstName && touched.firstName)}
    hint={touched.firstName ? errors.firstName : ''}
  />
</div>
```

### Select Dropdown

A dropdown select component for choosing from predefined options.

**Component:** `Select` from `components/form/Select`

**Props:**
- `options`: Array of option objects with value and label
- `placeholder`: Placeholder text
- `defaultValue`: Initial selected value
- `onChange`: Change handler function
- `disabled`: Whether the field is disabled

**Example:**
```jsx
<div className="mb-4.5">
  <Label>
    Role
  </Label>
  <Select
    options={[
      { value: "primary", label: "Primary Contact" },
      { value: "secondary", label: "Secondary Contact" },
      { value: "owner", label: "Owner" },
      { value: "manager", label: "Manager" },
      { value: "staff", label: "Staff" },
      { value: "technical", label: "Technical Contact" },
      { value: "billing", label: "Billing Contact" },
      { value: "other", label: "Other" }
    ]}
    placeholder="Select Role"
    defaultValue={formData.role || 'staff'}
    onChange={(value) => handleSelectChange('role', value)}
  />
</div>
```

### Text Area

A multi-line text input for longer text content.

**Component:** `TextArea` from `components/form/input/TextArea`

**Props:**
- `value`: Current value
- `onChange`: Change handler function
- `rows`: Number of visible rows
- `placeholder`: Placeholder text
- `disabled`: Whether the field is disabled

**Example:**
```jsx
<div className="mb-4.5">
  <Label>
    Notes
  </Label>
  <TextArea
    value={formData.notes || ''}
    onChange={(value) => {
      handleChange({
        target: { name: 'notes', value }
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }}
    rows={4}
    placeholder="Enter notes about this contact"
  />
</div>
```

### Button

Buttons for form actions like submit, cancel, etc.

**Component:** `Button` from `components/ui/button/Button`

**Props:**
- `variant`: Button style variant (primary, secondary, danger, etc.)
- `type`: Button type (button, submit, reset)
- `onClick`: Click handler function
- `disabled`: Whether the button is disabled
- `size`: Button size (sm, md, lg)
- `startIcon`: Icon to display at the start of the button
- `endIcon`: Icon to display at the end of the button

**Example:**
```jsx
<div className="flex justify-end gap-4.5">
  <Button
    onClick={handleCancel}
    variant="secondary"
    disabled={submitting}
  >
    Cancel
  </Button>
  <Button
    type="submit"
    variant="primary"
    disabled={submitting}
  >
    {submitting ? 'Saving...' : 'Create Contact'}
  </Button>
</div>
```

## Custom Form Fields

### EmailField

A specialized input field for email addresses with built-in validation.

**Component:** `EmailField` from `components/custom/EmailField`

**Props:**
- `label`: Label text
- `initialValue`: Initial email value
- `onChange`: Callback function that receives the email value and validation state
- `error`: Boolean to force error state
- `hint`: Helper text or error message
- `required`: Whether the field is required
- `disabled`: Whether the field is disabled

**Example:**
```jsx
<div className="mb-4.5">
  <EmailField
    label="Email"
    initialValue={formData.email}
    onChange={handleEmailChange}
    error={!!(errors.email && touched.email)}
    hint={touched.email ? errors.email : ''}
    required={true}
  />
</div>
```

### PhoneField

A specialized input field for phone numbers with country code selection.

**Component:** `PhoneField` from `components/custom/PhoneField`

**Props:**
- `label`: Label text
- `initialValue`: Initial phone number
- `onChange`: Callback function that receives the phone number and validation state
- `error`: Boolean to force error state
- `hint`: Helper text or error message
- `required`: Whether the field is required
- `disabled`: Whether the field is disabled
- `defaultCountry`: Default country code (e.g., "AU" for Australia)
- `selectPosition`: Position of the country code selector ('start' or 'end')

**Example:**
```jsx
<div className="mb-4.5">
  <PhoneField
    label="Phone"
    initialValue={formData.phone}
    onChange={(value, isValid) => handlePhoneChange(value, isValid, 'phone')}
    error={!!(errors.phone && touched.phone)}
    hint={touched.phone ? errors.phone : ''}
    required={false}
    defaultCountry="AU"
  />
</div>
```

### CountryStateCityField

A cascading selection field for country, state/province, and city.

**Component:** `CountryStateCityField` from `components/custom/CountryStateCityField`

**Props:**
- `label`: Label text
- `initialData`: Initial location data (countryId, stateId, cityId)
- `onChange`: Callback function that receives the location data
- `error`: Boolean to force error state
- `hint`: Helper text or error message
- `disabled`: Whether the field is disabled

**Example:**
```jsx
<div className="mb-4.5">
  <CountryStateCityField
    label="Location"
    onChange={handleLocationChange}
    initialData={{
      countryId: locationData.countryId,
      stateId: locationData.stateId,
      cityId: locationData.cityId
    }}
  />
</div>
```

### EmojiPickerField

A field for selecting emojis from a comprehensive picker.

**Component:** `EmojiPickerField` from `components/custom/EmojiPickerField`

**Props:**
- `label`: Label text
- `initialEmoji`: Initial emoji
- `onChange`: Callback function that receives the selected emoji
- `error`: Boolean to force error state
- `hint`: Helper text or error message
- `disabled`: Whether the field is disabled

**Example:**
```jsx
<div className="mb-4.5">
  <EmojiPickerField
    initialEmoji={formData.icon}
    onChange={handleEmojiChange}
    label="Icon"
  />
</div>
```

### ColorPickerField

A field for selecting colors from a color picker.

**Component:** `ColorPickerField` from `components/custom/ColorPickerField`

**Props:**
- `label`: Label text
- `initialColor`: Initial color (hex)
- `onChange`: Callback function that receives the selected color
- `error`: Boolean to force error state
- `hint`: Helper text or error message
- `disabled`: Whether the field is disabled
- `colors`: Optional array of hex colors for the palette

**Example:**
```jsx
<div className="mb-4.5">
  <ColorPickerField
    initialColor={formData.color || '#000000'}
    onChange={handleColorChange}
    label="Color"
  />
</div>
```

### ProfilePhotoUploader

An enhanced image upload component specifically designed for profile photos.

**Component:** `ProfilePhotoUploader` from `components/custom/ProfilePhotoUploader`

**Props:**
- `label`: Label text
- `initialImage`: Initial image URL
- `onChange`: Callback function that receives the image URL
- `error`: Boolean to force error state
- `hint`: Helper text or error message
- `disabled`: Whether the field is disabled
- `maxSizeMB`: Maximum file size in MB

**Example:**
```jsx
<div className="mt-6">
  <ProfilePhotoUploader
    initialImage={formData.image}
    onChange={handleImageChange}
    label="Profile Photo"
  />
</div>
```

## Complex Form Components

### OrganisationAssociationManager

A complex component for managing associations between contacts and organisations.

**Component:** `OrganisationAssociationManager` from `components/form/OrganisationAssociationManager`

**Props:**
- `contactId`: ID of the contact (optional, for edit mode)
- `initialAssociations`: Array of initial associations
- `onChange`: Callback function that receives the updated associations

**Example:**
```jsx
<div className="mt-6">
  <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
    <OrganisationAssociationManager
      contactId={contactId}
      initialAssociations={[]}
      onChange={handleOrganisationAssociationsChange}
    />
  </div>
</div>
```

## Form Layout Patterns

### Two-Column Layout

The standard layout for forms in the Jezweb Hub application is a two-column grid on larger screens that collapses to a single column on smaller screens.

```jsx
<form onSubmit={handleSubmit}>
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
    {/* Left Column */}
    <div className="space-y-5 sm:space-y-6">
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          Section Title
        </h4>
        {/* Form fields */}
      </div>
    </div>
    
    {/* Right Column */}
    <div className="space-y-6">
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          Section Title
        </h4>
        {/* Form fields */}
      </div>
    </div>
  </div>
  
  {/* Full-width sections */}
  <div className="mt-6">
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Full-width content */}
    </div>
  </div>
  
  {/* Form Actions */}
  <div className="flex justify-end gap-4.5 mt-6">
    <Button variant="secondary">Cancel</Button>
    <Button type="submit" variant="primary">Submit</Button>
  </div>
</form>
```

### Section Container

Each logical section of the form is contained in a card-like container with a title.

```jsx
<div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
  <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
    Section Title
  </h4>
  {/* Form fields */}
</div>
```

### Form Field Container

Each form field is wrapped in a container with consistent spacing.

```jsx
<div className="mb-4.5">
  <Label>
    Field Label {required && <span className="text-meta-1">*</span>}
  </Label>
  {/* Form field component */}
</div>
```

## Form Validation

### Client-Side Validation

The Jezweb Hub application uses a combination of real-time validation and form submission validation.

#### Real-Time Validation

Fields are validated as the user interacts with them:

```jsx
// Handle input changes with validation
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  
  // Mark field as touched
  if (!touched[name]) {
    setTouched(prev => ({ ...prev, [name]: true }));
  }
  
  // Clear error for this field
  if (errors[name]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }
};
```

#### Form Submission Validation

The entire form is validated before submission:

```jsx
const validateForm = () => {
  const newErrors: Record<string, string> = {};
  let isValid = true;
  
  // Mark all fields as touched
  const newTouched: Record<string, boolean> = {};
  Object.keys(formData).forEach(key => {
    newTouched[key] = true;
  });
  setTouched(newTouched);
  
  // Validate required fields
  if (!formData.firstName.trim()) {
    newErrors.firstName = 'First name is required';
    isValid = false;
  }
  
  // More validation rules...
  
  setErrors(newErrors);
  return isValid;
};
```

## Error Handling

### Field-Level Errors

Errors are displayed below each form field:

```jsx
<Input
  type="text"
  id="fieldName"
  name="fieldName"
  value={value}
  onChange={handleChange}
  error={!!(errors.fieldName && touched.fieldName)}
  hint={touched.fieldName ? errors.fieldName : ''}
/>
```

### Form-Level Errors

Form-level errors (e.g., from API responses) are displayed at the top of the form:

```jsx
{submitError && (
  <div className="mb-6">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {submitError.message}</span>
    </div>
  </div>
)}
```

## Accessibility Considerations

### Labels and ARIA Attributes

All form fields have proper labels and ARIA attributes:

```jsx
<Label htmlFor="fieldId">
  Field Label {required && <span className="text-meta-1">*</span>}
</Label>
<Input
  id="fieldId"
  aria-required={required}
  aria-invalid={!!error}
  aria-describedby={error ? `${id}-error` : undefined}
  // Other props
/>
{error && (
  <p id={`${id}-error`} className="text-danger text-sm mt-1">
    {errorMessage}
  </p>
)}
```

### Keyboard Navigation

All form fields are properly focusable and support keyboard navigation.

### Color Contrast

All text and UI elements meet WCAG 2.1 AA contrast requirements in both light and dark modes.