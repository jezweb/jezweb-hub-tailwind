# Organisation Contacts Fixes Plan

## Issues Identified

Based on the code review and user feedback, we've identified the following issues that need to be addressed:

1. **Button for adding contact action is not visible in OrganisationDetails.tsx**
   - The "Add Contact" button exists in the OrganisationContactList component but may not be visible or prominent enough.

2. **The "Add Contact" box should stay open instead of collapsed**
   - The ContactAssociationForm component is collapsed by default (isExpanded is initialized to false).
   - The user wants this form to be expanded by default.

3. **There are two trashcan icons on the contacts row**
   - In the contacts table, there are duplicate trashcan icons in the Actions column.

## Detailed Plan

### 1. Fix the "Add Contact" Button Visibility

The "Add Contact" button is already implemented in the OrganisationContactList component, but we should make it more prominent. We have two options:

a) Add a dedicated "Add Contact" button directly in the OrganisationDetails.tsx file, or
b) Ensure the existing button in OrganisationContactList is visible and properly styled.

Since the button already exists in OrganisationContactList, we'll focus on option b to avoid duplication.

```jsx
// In OrganisationContactList.tsx, ensure the button is properly styled and visible
<Link
  to={`/contacts/new?organisationId=${organisationId}`}
  className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-white hover:bg-opacity-90"
>
  <span className="mr-2">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM12 9H9V12H7V9H4V7H7V4H9V7H12V9Z"
        fill="white"
      />
    </svg>
  </span>
  Add Contact
</Link>
```

### 2. Make ContactAssociationForm Expanded by Default

Change the initial state of `isExpanded` in ContactAssociationForm.tsx from `false` to `true`:

```jsx
// In ContactAssociationForm.tsx
const [isExpanded, setIsExpanded] = useState<boolean>(true); // Changed from false to true
```

### 3. Fix Duplicate Trashcan Icons

In the OrganisationContactList component, there appears to be a duplicate trashcan icon in the Actions column. After examining the code, the issue might be in the SVG paths:

```jsx
// In OrganisationContactList.tsx, in the Actions column
<div className="flex items-center space-x-3.5">
  {/* View Button */}
  <button>...</button>
  
  {/* Edit Button */}
  <button>...</button>
  
  {/* Remove Button - The issue might be here */}
  <button
    className="hover:text-primary"
    aria-label={`Remove ${contact.fullName} from organisation`}
    onClick={() => handleRemoveContact(contact.relationshipId, contact.fullName)}
  >
    <svg
      className="fill-current"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
      />
      <path
        d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
      />
      <path
        d="M10.8789 9.7594C10.8789 9.42189 10.5977 9.11252 10.2321 9.11252C9.89456 9.11252 9.58519 9.39377 9.58519 9.7594V13.3313C9.58519 13.6688 9.86644 13.9782 10.2321 13.9782C10.5695 13.9782 10.8789 13.6969 10.8789 13.3313V9.7594Z"
      />
      <path
        d="M7.12177 9.7594C7.12177 9.42189 6.84052 9.11252 6.47489 9.11252C6.13739 9.11252 5.82812 9.39377 5.82812 9.7594V13.3313C5.82812 13.6688 6.10927 13.9782 6.47489 13.9782C6.84052 13.9782 7.12177 13.6969 7.12177 13.3313V9.7594Z"
      />
    </svg>
  </button>
</div>
```

The issue might be that the SVG is being rendered twice or there's a CSS issue causing it to appear duplicated. We'll need to inspect the rendered HTML to identify the exact cause.

## Implementation Steps

1. **Update ContactAssociationForm.tsx**:
   - Change `const [isExpanded, setIsExpanded] = useState<boolean>(false);` to `const [isExpanded, setIsExpanded] = useState<boolean>(true);`

2. **Investigate and Fix Duplicate Trashcan Icons**:
   - Inspect the rendered HTML to identify the cause of the duplicate icons
   - Modify the OrganisationContactList component to remove the duplicate
   - This might involve:
     - Checking for duplicate SVG elements
     - Verifying CSS styles aren't causing visual duplication
     - Ensuring there aren't multiple buttons with the same icon

3. **Verify "Add Contact" Button Visibility**:
   - Ensure the button in OrganisationContactList is visible and properly styled
   - If needed, adjust the styling or positioning to make it more prominent

## Code Changes

### 1. Update ContactAssociationForm.tsx

```diff
// In ContactAssociationForm.tsx
- const [isExpanded, setIsExpanded] = useState<boolean>(false);
+ const [isExpanded, setIsExpanded] = useState<boolean>(true);
```

### 2. Fix Duplicate Trashcan Icons (Potential Solution)

We'll need to inspect the rendered HTML to identify the exact cause, but a potential solution might be:

```diff
// In OrganisationContactList.tsx
<div className="flex items-center space-x-3.5">
  {/* View Button */}
  <button>...</button>
  
  {/* Edit Button */}
  <button>...</button>
  
  {/* Remove Button */}
  <button
    className="hover:text-primary"
    aria-label={`Remove ${contact.fullName} from organisation`}
    onClick={() => handleRemoveContact(contact.relationshipId, contact.fullName)}
  >
    <svg
      className="fill-current"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
      />
-     <path
-       d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
-     />
-     <path
-       d="M10.8789 9.7594C10.8789 9.42189 10.5977 9.11252 10.2321 9.11252C9.89456 9.11252 9.58519 9.39377 9.58519 9.7594V13.3313C9.58519 13.6688 9.86644 13.9782 10.2321 13.9782C10.5695 13.9782 10.8789 13.6969 10.8789 13.3313V9.7594Z"
-     />
-     <path
-       d="M7.12177 9.7594C7.12177 9.42189 6.84052 9.11252 6.47489 9.11252C6.13739 9.11252 5.82812 9.39377 5.82812 9.7594V13.3313C5.82812 13.6688 6.10927 13.9782 6.47489 13.9782C6.84052 13.9782 7.12177 13.6969 7.12177 13.3313V9.7594Z"
-     />
    </svg>
  </button>
</div>
```

## Testing Plan

1. **Test ContactAssociationForm Expansion**:
   - Verify that the ContactAssociationForm is expanded by default when the page loads
   - Ensure the toggle button still works to collapse and expand the form

2. **Test "Add Contact" Button Visibility**:
   - Verify that the "Add Contact" button is visible and properly styled
   - Test that clicking the button navigates to the correct page

3. **Test Trashcan Icons**:
   - Verify that only one trashcan icon appears for each contact in the list
   - Test that clicking the trashcan icon correctly removes the contact from the organisation

## Conclusion

These changes should address the issues identified by the user:
1. Make the "Add Contact" button more visible
2. Keep the ContactAssociationForm expanded by default
3. Fix the duplicate trashcan icons in the contacts list

After implementing these changes, we should have a more user-friendly and visually consistent interface for managing organisation contacts.