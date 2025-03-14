# Organisation Contacts Improvements Plan

## Issues Identified

Based on the code review and user feedback, we've identified the following issues that need to be addressed:

1. **Button for adding contact action is not visible in OrganisationDetails.tsx**
   - The "Add Contact" button exists but is not styled with the default blue color.

2. **The "Add Contact" box should stay open instead of collapsed**
   - The ContactAssociationForm component is collapsed by default (isExpanded is initialized to false).
   - The user wants this form to be expanded by default.

3. **There are two trashcan icons on the contacts row**
   - In the contacts table, there are duplicate trashcan icons in the Actions column.

4. **Contact details page is not displaying all stored information**
   - The ContactDetail.tsx component doesn't display all the fields that are stored in the Contact type.
   - Fields like linkedIn, status, role, icon, and color are missing from the display.

5. **Action buttons in OrganisationDetails.tsx should be at the bottom**
   - The action buttons (Edit, Delete, Back) are currently at the top of the page.
   - The user wants them to be at the bottom.

## Detailed Plan

### 1. Fix the "Add Contact" Button Visibility

The "Add Contact" button in OrganisationDetails.tsx needs to be styled with the default blue color:

```jsx
// In OrganisationDetails.tsx, find the "Add Contact" button and update its styling
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

### 4. Update ContactDetail.tsx to Display All Information

The ContactDetail.tsx component needs to be updated to display all the fields that are stored in the Contact type. Based on the Contact interface, the following fields are missing from the display:

- linkedIn
- status
- role
- icon
- color
- state

We need to add these fields to the ContactDetail.tsx component:

```jsx
// In ContactDetail.tsx, add the following sections to display the missing fields

{/* LinkedIn */}
{selectedContact.linkedIn && (
  <div className="flex items-start">
    <svg
      className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
      ></path>
      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2"></circle>
    </svg>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
      <p className="text-black dark:text-white">
        <a href={selectedContact.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
          {selectedContact.linkedIn}
        </a>
      </p>
    </div>
  </div>
)}

{/* Status */}
{selectedContact.status && (
  <div className="flex items-start">
    <svg
      className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
      <p className="text-black dark:text-white">
        <span className={`inline-flex rounded-full py-1 px-3 text-xs font-medium ${
          selectedContact.status === 'active' 
            ? 'bg-success bg-opacity-10 text-success' 
            : selectedContact.status === 'inactive'
            ? 'bg-danger bg-opacity-10 text-danger'
            : 'bg-warning bg-opacity-10 text-warning'
        }`}>
          {selectedContact.status}
        </span>
      </p>
    </div>
  </div>
)}

{/* Role */}
{selectedContact.role && (
  <div className="flex items-start">
    <svg
      className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
      ></path>
    </svg>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
      <p className="text-black dark:text-white">
        {selectedContact.role}
      </p>
    </div>
  </div>
)}

{/* State/Province */}
{selectedContact.state && (
  <div className="flex items-start">
    <svg
      className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      ></path>
    </svg>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">State/Province</p>
      <p className="text-black dark:text-white">
        {selectedContact.state}
      </p>
    </div>
  </div>
)}

{/* Visual Identification Section */}
{(selectedContact.icon || selectedContact.color) && (
  <div className="mt-6">
    <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
      Visual Identification
    </h4>
    <div className="flex space-x-4">
      {selectedContact.icon && (
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Icon</p>
          <div className="text-3xl">{selectedContact.icon}</div>
        </div>
      )}
      {selectedContact.color && (
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Color</p>
          <div 
            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: selectedContact.color }}
          ></div>
        </div>
      )}
    </div>
  </div>
)}
```

### 5. Move Action Buttons in OrganisationDetails.tsx

The action buttons (Edit, Delete, Back) in OrganisationDetails.tsx need to be moved from the top to the bottom of the page:

```jsx
// In OrganisationDetails.tsx
// 1. Remove the action buttons from the header section
<div className="mb-6 flex justify-between items-center">
  <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
    {selectedOrganisation.organisationName}
  </h3>
  {/* Remove the action buttons from here */}
</div>

// 2. Add the action buttons at the bottom of the page
<div className="flex justify-end space-x-3 mt-6">
  <Button
    variant="primary"
    onClick={handleEdit}
    aria-label={`Edit ${selectedOrganisation.organisationName}`}
    startIcon={
      <svg
        className="fill-current"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.8 0H2.2C1 0 0 1 0 2.2V13.7C0 15 1 16 2.2 16H13.7C14.9 16 15.9 15 15.9 13.8V2.2C16 1 15 0 13.8 0ZM14.4 13.8C14.4 14.1 14.1 14.4 13.8 14.4H2.2C1.9 14.4 1.6 14.1 1.6 13.8V2.2C1.6 1.9 1.9 1.6 2.2 1.6H13.7C14 1.6 14.3 1.9 14.3 2.2V13.7C14.4 13.7 14.4 13.8 14.4 13.8Z"
        />
        <path
          d="M11.8 4.2H4.2C3.9 4.2 3.6 4.5 3.6 4.8C3.6 5.1 3.8 5.4 4.2 5.4H11.8C12.1 5.4 12.4 5.1 12.4 4.8C12.4 4.5 12.1 4.2 11.8 4.2Z"
        />
        <path
          d="M11.8 7.3H4.2C3.9 7.3 3.6 7.6 3.6 7.9C3.6 8.2 3.8 8.5 4.2 8.5H11.8C12.1 8.5 12.4 8.2 12.4 7.9C12.4 7.6 12.1 7.3 11.8 7.3Z"
        />
        <path
          d="M11.8 10.4H4.2C3.9 10.4 3.6 10.7 3.6 11C3.6 11.3 3.8 11.6 4.2 11.6H11.8C12.1 11.6 12.4 11.3 12.4 11C12.4 10.7 12.1 10.4 11.8 10.4Z"
        />
      </svg>
    }
  >
    Edit
  </Button>
  <Button
    variant="danger"
    onClick={handleDelete}
    aria-label={`Delete ${selectedOrganisation.organisationName}`}
    startIcon={
      <svg
        className="fill-current"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.225 2.2h-1.7V1.7C10.525 0.765 9.76 0 8.825 0h-1.65C6.24 0 5.475 0.765 5.475 1.7V2.2h-1.7C3.14 2.2 2.55 2.79 2.55 3.425V4.2c0 0.34 0.215 0.595 0.5 0.7l0.255 5.5c0.04 0.68 0.51 1.2 1.19 1.2h6.935c0.68 0 1.15-0.52 1.19-1.2l0.255-5.5c0.285-0.105 0.5-0.36 0.5-0.7V3.425C13.375 2.79 12.785 2.2 12.225 2.2ZM6.375 1.7C6.375 1.275 6.715 0.935 7.14 0.935h1.65c0.425 0 0.765 0.34 0.765 0.765V2.2H6.375V1.7ZM3.45 3.425C3.45 3.315 3.54 3.225 3.65 3.225h8.625c0.11 0 0.2 0.09 0.2 0.2V3.9c0 0.11-0.09 0.2-0.2 0.2H3.65c-0.11 0-0.2-0.09-0.2-0.2V3.425ZM10.965 10.5H5.035c-0.255 0-0.425-0.17-0.45-0.425L4.36 4.675h7.28L11.415 10.075C11.39 10.33 11.22 10.5 10.965 10.5Z"
        />
        <path
          d="M8.5 5.695C8.285 5.695 8.075 5.88 8.075 6.12V9.085C8.075 9.325 8.26 9.51 8.5 9.51C8.74 9.51 8.925 9.325 8.925 9.085V6.12C8.925 5.88 8.715 5.695 8.5 5.695Z"
        />
        <path
          d="M9.895 5.695C9.68 5.695 9.47 5.88 9.47 6.12V9.085C9.47 9.325 9.655 9.51 9.895 9.51C10.135 9.51 10.32 9.325 10.32 9.085V6.12C10.32 5.88 10.135 5.695 9.895 5.695Z"
        />
        <path
          d="M7.105 5.695C6.89 5.695 6.68 5.88 6.68 6.12V9.085C6.68 9.325 6.865 9.51 7.105 9.51C7.345 9.51 7.53 9.325 7.53 9.085V6.12C7.53 5.88 7.32 5.695 7.105 5.695Z"
        />
      </svg>
    }
  >
    Delete
  </Button>
  <Button
    variant="secondary"
    onClick={handleBack}
    aria-label="Back to organisations list"
    startIcon={
      <svg
        className="fill-current"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.2703 1.61719L5.61328 7.27422L11.2703 12.9312C11.4484 13.1094 11.4484 13.3984 11.2703 13.5766L10.6641 14.1828C10.4859 14.3609 10.1969 14.3609 10.0188 14.1828L3.42969 7.59375C3.25156 7.41562 3.25156 7.12656 3.42969 6.94844L10.0188 0.359375C10.1969 0.18125 10.4859 0.18125 10.6641 0.359375L11.2703 0.965625C11.4484 1.14375 11.4484 1.43281 11.2703 1.61719Z"
        />
      </svg>
    }
  >
    Back
  </Button>
</div>
```

## Implementation Steps

1. **Update ContactAssociationForm.tsx**:
   - Change `const [isExpanded, setIsExpanded] = useState<boolean>(false);` to `const [isExpanded, setIsExpanded] = useState<boolean>(true);`

2. **Investigate and Fix Duplicate Trashcan Icons**:
   - Inspect the rendered HTML to identify the cause of the duplicate icons
   - Modify the OrganisationContactList component to remove the duplicate

3. **Update ContactDetail.tsx**:
   - Add the missing fields to the display (linkedIn, status, role, icon, color, state)
   - Organize them in a logical and visually appealing way

4. **Update OrganisationDetails.tsx**:
   - Move the action buttons from the top to the bottom of the page
   - Ensure the "Add Contact" button is styled with the default blue color

## Testing Plan

1. **Test ContactAssociationForm Expansion**:
   - Verify that the ContactAssociationForm is expanded by default when the page loads
   - Ensure the toggle button still works to collapse and expand the form

2. **Test "Add Contact" Button Visibility**:
   - Verify that the "Add Contact" button is visible and properly styled with the default blue color
   - Test that clicking the button navigates to the correct page

3. **Test Trashcan Icons**:
   - Verify that only one trashcan icon appears for each contact in the list
   - Test that clicking the trashcan icon correctly removes the contact from the organisation

4. **Test ContactDetail Display**:
   - Verify that all fields from the Contact type are displayed correctly
   - Test with contacts that have different combinations of fields filled in

5. **Test OrganisationDetails Action Buttons**:
   - Verify that the action buttons appear at the bottom of the page
   - Test that each button performs its expected action

## Conclusion

These changes should address all the issues identified by the user:
1. Make the "Add Contact" button more visible with the default blue color
2. Keep the ContactAssociationForm expanded by default
3. Fix the duplicate trashcan icons in the contacts list
4. Update the ContactDetail component to display all stored information
5. Move the action buttons in OrganisationDetails from the top to the bottom

After implementing these changes, we should have a more user-friendly and visually consistent interface for managing organisation contacts.