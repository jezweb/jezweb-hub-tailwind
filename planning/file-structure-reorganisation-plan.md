# Plan for Reorganizing the Organisations and Contacts Directory Structure

Based on analysis of the current codebase, this plan outlines how to reorganize the organisations and contacts directories to follow a consistent architecture pattern. This will improve consistency, maintainability, and reusability across the codebase.

## Current Structure Analysis

### Contacts Directory (Current)
```
src/pages/Contacts.tsx         # Main contacts listing page
src/pages/contacts/
├── ContactCreate.tsx          # Page component that uses ContactForm
├── ContactEdit.tsx            # Page component that uses ContactForm
├── ContactView.tsx            # Page component that uses ContactDetail
└── components/
    ├── ContactDetail.tsx      # Reusable component for displaying contact details
    └── ContactForm.tsx        # Reusable component for creating/editing contacts
```

### Organisations Directory (Current)
```
src/pages/Organisations.tsx    # Main organisations listing page
src/pages/organisations/
├── OrganisationContactList.tsx  # Component for listing contacts in an organisation
├── OrganisationCreate.tsx       # Page with embedded form for creating organisations
├── OrganisationDetails.tsx      # Page with embedded details display
├── OrganisationEdit.tsx         # Page with embedded form for editing organisations
└── OrganisationList.tsx         # Component for listing organisations
```

## Issues with Current Structure

1. **Inconsistent Architecture**: The main listing pages are at different levels in the hierarchy.
2. **Lack of Component Separation**: Form logic is embedded directly in page components rather than being extracted into reusable components.
3. **Code Duplication**: OrganisationCreate.tsx and OrganisationEdit.tsx share a lot of similar form code.
4. **Reduced Reusability**: Components that could be reused are tightly coupled with page-specific logic.

## Proposed New Structure

```
src/pages/contacts/
├── index.tsx                  # Main contacts listing page (moved from Contacts.tsx)
├── ContactCreate.tsx          # Page component that uses ContactForm
├── ContactEdit.tsx            # Page component that uses ContactForm
├── ContactView.tsx            # Page component that uses ContactDetail
└── components/
    ├── ContactDetail.tsx      # Reusable component for displaying contact details
    └── ContactForm.tsx        # Reusable component for creating/editing contacts

src/pages/organisations/
├── index.tsx                  # Main organisations listing page (moved from Organisations.tsx)
├── OrganisationCreate.tsx     # Page component that uses OrganisationForm
├── OrganisationEdit.tsx       # Page component that uses OrganisationForm
├── OrganisationView.tsx       # Page component that uses OrganisationDetail (renamed from Details)
└── components/
    ├── OrganisationDetail.tsx   # Extracted from OrganisationDetails.tsx
    ├── OrganisationForm.tsx     # Extracted from Create/Edit components
    ├── OrganisationList.tsx     # Moved from top level
    └── OrganisationContactList.tsx  # Moved from top level
```

## Implementation Plan

### Phase 1: Reorganize Contacts Directory
1. Create `src/pages/contacts/index.tsx` by moving code from `src/pages/Contacts.tsx`
2. Update imports and routes in the application to point to the new location

### Phase 2: Reorganize Organisations Directory
1. Create `src/pages/organisations/components` directory
2. Extract form logic from OrganisationCreate.tsx and OrganisationEdit.tsx into a reusable OrganisationForm component
3. Extract detail display logic from OrganisationDetails.tsx into OrganisationDetail component
4. Move OrganisationList.tsx and OrganisationContactList.tsx to the components directory
5. Create `src/pages/organisations/index.tsx` by moving code from `src/pages/Organisations.tsx`
6. Update imports and routes in the application to point to the new locations

### Phase 3: Update References and Test
1. Update all imports in the codebase to reference the new file locations
2. Update any routing configurations to point to the new component locations
3. Test the application thoroughly to ensure everything works correctly

## Component Extraction Details

### OrganisationForm Component

Extract the form logic from OrganisationCreate.tsx and OrganisationEdit.tsx into a reusable OrganisationForm component:

```typescript
// src/pages/organisations/components/OrganisationForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganisations } from '../../../hooks/organisations/useOrganisations';
import { OrganisationFormData, Address } from '../../../types/Organisation';

interface OrganisationFormProps {
  organisationId?: string; // If provided, the form will be in edit mode
  initialData?: OrganisationFormData; // Optional initial form data
  onSuccess?: (organisationId: string) => void; // Optional callback on successful submission
  onCancel?: () => void; // Optional callback on form cancellation
}

const OrganisationForm: React.FC<OrganisationFormProps> = ({
  organisationId,
  initialData,
  onSuccess,
  onCancel
}) => {
  // Form state and logic extracted from Create/Edit components
  // ...
};

export default OrganisationForm;
```

### OrganisationDetail Component

Extract the detail display logic from OrganisationDetails.tsx:

```typescript
// src/pages/organisations/components/OrganisationDetail.tsx
import React from 'react';
import { Organisation } from '../../../types/Organisation';
import OrganisationContactList from './OrganisationContactList';

interface OrganisationDetailProps {
  organisationId: string;
  onEdit?: (organisation: Organisation) => void;
  onDelete?: (organisation: Organisation) => void;
  onBack?: () => void;
}

const OrganisationDetail: React.FC<OrganisationDetailProps> = ({
  organisationId,
  onEdit,
  onDelete,
  onBack
}) => {
  // Detail display logic extracted from OrganisationDetails.tsx
  // ...
};

export default OrganisationDetail;
```

## Benefits of This Approach

1. **Improved Code Organization**: Clear separation between page components and reusable UI components
2. **Reduced Duplication**: Form logic is defined once and reused
3. **Consistent Architecture**: Both contacts and organisations follow the same pattern
4. **Better Maintainability**: Smaller, focused components are easier to understand and modify
5. **Enhanced Reusability**: Components can be reused in different contexts

## Diagram of the New Structure

```mermaid
graph TD
    subgraph "src/pages/contacts"
        contactIndex[index.tsx]
        contactCreate[ContactCreate.tsx]
        contactEdit[ContactEdit.tsx]
        contactView[ContactView.tsx]
        
        subgraph "contacts/components"
            contactForm[ContactForm.tsx]
            contactDetail[ContactDetail.tsx]
        end
        
        contactCreate --> contactForm
        contactEdit --> contactForm
        contactView --> contactDetail
    end
    
    subgraph "src/pages/organisations"
        orgIndex[index.tsx]
        orgCreate[OrganisationCreate.tsx]
        orgEdit[OrganisationEdit.tsx]
        orgView[OrganisationView.tsx]
        
        subgraph "organisations/components"
            orgForm[OrganisationForm.tsx]
            orgDetail[OrganisationDetail.tsx]
            orgList[OrganisationList.tsx]
            orgContactList[OrganisationContactList.tsx]
        end
        
        orgCreate --> orgForm
        orgEdit --> orgForm
        orgView --> orgDetail
        orgDetail --> orgContactList
        orgIndex --> orgList
    end