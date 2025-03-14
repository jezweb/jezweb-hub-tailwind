# Custom Form Components

This document provides an overview of the custom form components created for the Jezweb Hub application. These components extend the base TailAdmin components with additional functionality and styling specific to our application needs.

## Table of Contents

- [Overview](#overview)
- [Components](#components)
  - [EmailField](#emailfield)
  - [PhoneField](#phonefield)
  - [CountryStateCityField](#countrystatecityfield)
  - [EmojiPickerField](#emojipickerfield)
  - [ColorPickerField](#colorpickerfield)
  - [ProfilePhotoUploader](#profilephotouploader)
- [Usage Guidelines](#usage-guidelines)
- [Extending Components](#extending-components)

## Overview

The custom components are designed to:

- Provide enhanced functionality beyond basic form inputs
- Maintain consistent styling with the TailAdmin design system
- Support validation and error handling
- Work seamlessly in both light and dark modes
- Provide accessible interfaces

All components are located in the `src/components/custom` directory and can be imported from the index file:

```typescript
import { 
  EmailField, 
  PhoneField, 
  CountryStateCityField,
  EmojiPickerField,
  ColorPickerField,
  ProfilePhotoUploader 
} from '../components/custom';
```

## Components

### EmailField

A specialized input field for email addresses with built-in validation.

**Features:**
- Email format validation
- Icon prefix
- Error state handling
- Required field support

**Props:**
- `label`: Label text
- `initialValue`: Initial email value
- `onChange`: Callback function that receives the email value and validation state
- `error`: Boolean to force error state
- `hint`: Helper text or error message
- `required`: Whether the field is required
- `disabled`: Whether the field is disabled
- `placeholder`: Placeholder text

**Example:**
```jsx
<EmailField
  label="Email Address"
  initialValue="user@example.com"
  onChange={(value, isValid) => console.log(value, isValid)}
  required={true}
/>
```

### PhoneField

A specialized input field for phone numbers with country code selection.

**Features:**
- Country code selection
- Phone number format validation
- Error state handling

**Props:**
- `label`: Label text
- `initialValue`: Initial phone number
- `onChange`: Callback function that receives the phone number and validation state
- `error`: Boolean to force error state
- `hint`: Helper text or error message
- `required`: Whether the field is required
- `disabled`: Whether the field is disabled
- `placeholder`: Placeholder text
- `selectPosition`: Position of the country code selector ('start' or 'end')

**Example:**
```jsx
<PhoneField
  label="Phone Number"
  initialValue="+61 400 123 456"
  onChange={(value, isValid) => console.log(value, isValid)}
/>
```

### CountryStateCityField

A cascading selection field for country, state/province, and city.

**Features:**
- Hierarchical selection (country → state → city)
- Data from @davzon/react-country-state-city package
- Styled to match TailAdmin design

**Props:**
- `label`: Label text
- `initialData`: Initial location data (countryId, stateId, cityId)
- `onChange`: Callback function that receives the location data
- `error`: Boolean to force error state
- `hint`: Helper text or error message
- `disabled`: Whether the field is disabled

**Example:**
```jsx
<CountryStateCityField
  label="Location"
  onChange={(data) => console.log(data)}
  initialData={{ countryId: 13, stateId: 0, cityId: 0 }}
/>
```

### EmojiPickerField

A field for selecting emojis from a comprehensive picker.

**Features:**
- Integration with emoji-picker-react
- Preview of selected emoji
- Dropdown interface

**Props:**
- `label`: Label text
- `initialEmoji`: Initial emoji
- `onChange`: Callback function that receives the selected emoji
- `error`: Boolean to force error state
- `hint`: Helper text or error message
- `disabled`: Whether the field is disabled

**Example:**
```jsx
<EmojiPickerField
  label="Select Icon"
  initialEmoji="😊"
  onChange={(emoji) => console.log(emoji)}
/>
```

### ColorPickerField

A field for selecting colors from a color picker.

**Features:**
- Integration with react-color (TwitterPicker)
- Color preview
- Customizable color palette

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
<ColorPickerField
  label="Brand Color"
  initialColor="#007bff"
  onChange={(color) => console.log(color)}
  colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#1A535C', '#F9C80E']}
/>
```

### ProfilePhotoUploader

An enhanced image upload component specifically designed for profile photos.

**Features:**
- Circular image preview
- Drag and drop support
- File validation (size, type)
- Remove image button

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
<ProfilePhotoUploader
  label="Profile Photo"
  initialImage="/images/profile.jpg"
  onChange={(imageUrl) => console.log(imageUrl)}
  maxSizeMB={2}
/>
```

## Usage Guidelines

### Form Integration

These components are designed to work with both controlled and uncontrolled forms. For controlled forms, use the `onChange` handlers to update your form state.

### Validation

All components provide built-in validation and can display error states. You can either:

1. Use the component's internal validation (returned via the second parameter of onChange)
2. Control validation externally by passing the `error` and `hint` props

### Styling

The components follow the TailAdmin design system and automatically adapt to both light and dark modes. You can add additional classes using the `className` prop.

## Extending Components

To create new custom components:

1. Create a new file in the `src/components/custom` directory
2. Follow the existing component patterns for consistency
3. Add proper TypeScript interfaces for props
4. Include comprehensive JSDoc comments
5. Export the component from the index file
6. Update this documentation

When extending components, ensure they:
- Follow accessibility best practices
- Support both light and dark modes
- Include proper validation
- Handle error states consistently