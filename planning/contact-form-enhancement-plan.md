# Contact Form Enhancement Implementation Plan

Based on your feedback, I've created a detailed plan to enhance the contact forms with the requested npm packages and layout changes. This plan outlines all the necessary steps to implement the changes efficiently.

## 1. Project Setup and Dependencies

First, we need to install the required npm packages:

```bash
npm install emoji-picker-react react-color @davzon/react-country-state-city
```

## 2. Component Structure

We'll create a new directory structure for custom components:

```
src/
└── components/
    └── custom/
        ├── EmojiPickerField.tsx
        ├── ColorPickerField.tsx
        ├── CountryStateCityField.tsx
        ├── EmailField.tsx
        ├── PhoneField.tsx
        └── ProfilePhotoUploader.tsx
```

## 3. Component Implementation

### 3.1 Custom Components

#### EmojiPickerField Component
- Create a wrapper around `emoji-picker-react` that matches the TailAdmin style
- Include label, error handling, and form integration
- Implement the same interface as the current EmojiPicker for easy replacement

#### ColorPickerField Component
- Create a wrapper around `TwitterPicker` from `react-color`
- Match the TailAdmin style and include form integration
- Support the same interface as the current ColorPicker

#### CountryStateCityField Component
- Implement using `@davzon/react-country-state-city`
- Replace the existing city and country fields
- Add proper validation and error handling

#### EmailField Component
- Use the default email field from TailAdmin
- Include validation and error handling

#### PhoneField Component
- Use the phone input with country selection from TailAdmin
- Default to AU country code
- Support both phone and mobile fields

#### ProfilePhotoUploader Component
- Enhance the existing ImageUpload component
- Position it in the right column at the bottom of professional information

### 3.2 Form Updates

#### ContactForm Component
- Update to use the new custom components
- Implement a two-column layout similar to OrganisationCreate.tsx
- Add role and status fields
- Move the profile photo uploader to the right column

## 4. Page Updates

### 4.1 ContactCreate.tsx
- Remove the outer container div
- Update to match the style guide
- Make it similar to OrganisationCreate.tsx

### 4.2 ContactEdit.tsx
- Update to use the new form layout
- Ensure it includes role and status fields

## 5. Implementation Steps

1. **Create Custom Components Directory**
   - Create `src/components/custom` directory

2. **Implement Custom Components**
   - Develop each custom component with proper documentation
   - Ensure they match the TailAdmin style
   - Include validation from the npm packages

3. **Update ContactForm Component**
   - Modify to use the new custom components
   - Implement the two-column layout
   - Add role and status fields
   - Position the profile photo uploader correctly

4. **Update ContactCreate.tsx**
   - Remove the outer container
   - Update to match OrganisationCreate.tsx

5. **Update ContactEdit.tsx**
   - Ensure it includes role and status fields
   - Match the style of ContactCreate.tsx

6. **Testing**
   - Test form validation
   - Test form submission
   - Test responsive layout
   - Test dark mode compatibility

## 6. Timeline Estimate

- Custom Components Implementation: 3-4 hours
- ContactForm Updates: 2-3 hours
- Page Updates: 1-2 hours
- Testing and Refinement: 2-3 hours
- Total: 8-12 hours

## 7. Potential Challenges and Solutions

1. **Integration with Existing Code**
   - Solution: Maintain the same component interfaces for backward compatibility

2. **Styling Consistency**
   - Solution: Use TailAdmin's existing styles as a reference

3. **Form Validation**
   - Solution: Leverage validation from npm packages and TailAdmin

4. **Performance**
   - Solution: Lazy load components where appropriate