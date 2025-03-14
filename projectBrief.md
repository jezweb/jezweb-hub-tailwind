# Jezweb Hub Dashboard Implementation Plan

## Overview

This document outlines the plan for creating a dashboard for Jezweb Hub using the TailAdmin Pro template as a starting point. The dashboard will maintain the same design but remove the demo content, replacing it with placeholder content based on the provided data schemas. The dashboard will use Firebase Firestore for data storage and retrieval.

## Project Structure

```mermaid
graph TD
    A[Jezweb Hub Dashboard] --> B[Core Layout]
    A --> C[Firebase Integration]
    A --> D[Dashboard Sections]
    
    B --> B1[AppLayout]
    B --> B2[AppHeader]
    B --> B3[AppSidebar]
    
    C --> C1[Authentication]
    C --> C2[Firestore Services]
    C --> C3[Storage Services]
    
    D --> D1[Home/Landing]
    D --> D2[Clients Module]
    D --> D3[Hosting Module]
    D --> D4[Support Module]
    D --> D5[Projects Module]
    D --> D6[Sales Module]
    D --> D7[Tasks Module]
    D --> D8[Notes Module]
    D --> D9[Events Module]
    D --> D10[Timesheets Module]
    D --> D11[Articles Module]
    
    D2 --> D2A[Organisations]
    D2 --> D2B[Contacts]
    
    D3 --> D3A[Websites]
    
    D4 --> D4A[Tickets]
    
    D5 --> D5A[Website Projects]
    D5 --> D5B[Graphics Projects]
    D5 --> D5C[App Projects]
    D5 --> D5D[SEO Projects]
    D5 --> D5E[Content Projects]
    
    D6 --> D6A[Leads]
    D6 --> D6B[Quotes]
```

## Implementation Phases

### Phase 1: Project Setup and Core Structure

1. **Clean up the TailAdmin Pro template**
   - Remove demo content while preserving the layout structure
   - Update page titles and metadata to use EN-AU spelling
   - Ensure all components use the default TailAdmin CSS styles

2. **Set up Firebase integration**
   - Implement the provided Firebase configuration
   - Create Firebase service modules for authentication, Firestore, and storage
   - Set up data models based on the provided schemas

3. **Create the core layout structure**
   - Modify AppSidebar.tsx to include the new navigation structure
   - Update AppHeader.tsx to reflect Jezweb Hub branding
   - Create a new landing page component for the dashboard

### Phase 2: Dashboard Landing Page

1. **Design and implement the landing page**
   - Create a welcoming dashboard that explains the features and future of Jezweb Hub
   - Include key metrics and quick access to frequently used sections
   - Add placeholder content that can be easily replaced later

2. **Landing page content sections**
   - Welcome message and overview of Jezweb Hub
   - Key features and benefits
   - Quick navigation cards to main sections
   - Recent activity feed (placeholder)
   - System status indicators

### Phase 3: Implement Core Modules

#### Clients Module

1. **Organisations Component**
   - Create list view using TailAdmin table components
   - Implement detail view with organisation information
   - Add forms for creating and editing organisations
   - Connect to Firebase Firestore using the organisations schema

2. **Contacts Component**
   - Create list view for contacts
   - Implement detail view with contact information
   - Add forms for creating and editing contacts
   - Connect to Firebase Firestore using the contacts schema

#### Hosting Module

1. **Websites Component**
   - Create list view for websites
   - Implement detail view with website information
   - Add forms for creating and editing websites
   - Connect to Firebase Firestore using the websites schema

#### Support Module

1. **Tickets Component**
   - Create list view for support tickets
   - Implement detail view with ticket information
   - Add forms for creating and editing tickets
   - Connect to Firebase Firestore using the tickets schema

### Phase 4: Implement Additional Modules

#### Projects Module

1. **Create base project components**
   - Implement shared project functionality
   - Create project list and detail views

2. **Implement project type components**
   - Website Projects
   - Graphics Projects
   - App Projects
   - SEO Projects
   - Content Projects

#### Sales Module

1. **Leads Component**
   - Create list view for leads
   - Implement detail view with lead information
   - Add forms for creating and editing leads

2. **Quotes Component**
   - Create list view for quotes
   - Implement detail view with quote information
   - Add forms for creating and editing quotes

#### Task Management

1. **Tasks Component**
   - Create list view for tasks
   - Implement Kanban board view
   - Add forms for creating and editing tasks
   - Connect to Firebase Firestore using the tasks schema

#### Additional Components

1. **Notes Component**
   - Create list view for notes
   - Implement detail view with note information
   - Add forms for creating and editing notes

2. **Events Component**
   - Create calendar view for events
   - Implement detail view with event information
   - Add forms for creating and editing events

3. **Timesheets Component**
   - Create list view for timesheets
   - Implement detail view with timesheet information
   - Add forms for creating and editing timesheets

4. **Articles Component**
   - Create list view for articles
   - Implement detail view with article information
   - Add forms for creating and editing articles

### Phase 5: UI Components and Styling

1. **Implement shared UI components**
   - Tables with sorting, filtering, and pagination
   - Forms with validation
   - Cards for displaying information
   - Modals for actions and confirmations
   - Alerts and notifications

2. **Ensure consistent styling**
   - Use TailAdmin default styles
   - Implement EN-AU spelling throughout the interface
   - Create a consistent look and feel across all components

### Phase 6: Testing and Deployment

1. **Testing**
   - Test all components and functionality
   - Ensure Firebase integration works correctly
   - Verify responsive design for different screen sizes

2. **Deployment**
   - Set up deployment pipeline
   - Deploy to production environment
   - Monitor for any issues

## Detailed Component Implementation

### Firebase Services

Create reusable Firebase service modules for each data type:

```typescript
// src/services/firebase/organisationService.ts
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Organisation } from '../../types/Organisation';

const COLLECTION_NAME = 'organisations';

export const getOrganisations = async (): Promise<Organisation[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(doc => ({ organisationId: doc.id, ...doc.data() } as Organisation));
};

export const getOrganisation = async (id: string): Promise<Organisation | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { organisationId: docSnap.id, ...docSnap.data() } as Organisation;
  }
  
  return null;
};

export const createOrganisation = async (organisation: Omit<Organisation, 'organisationId'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...organisation,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return docRef.id;
};

export const updateOrganisation = async (id: string, organisation: Partial<Organisation>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...organisation,
    updatedAt: new Date()
  });
};

export const deleteOrganisation = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
```

Similar service modules will be created for each data type (contacts, websites, tasks, etc.).

### UI Components

#### Table Component Example

```typescript
// src/components/ui/table/DataTable.tsx
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../table';
import Pagination from '../pagination/Pagination';

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    cell?: (item: T) => React.ReactNode;
  }[];
  itemsPerPage?: number;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T>({
  data,
  columns,
  itemsPerPage = 10,
  onRowClick
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentData.map((item, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className="py-3">
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : column.cell
                      ? column.cell(item)
                      : item[column.accessor] as React.ReactNode}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
```

#### Form Component Example

```typescript
// src/components/ui/form/FormField.tsx
import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  error,
  required = false,
  children
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
}
```

### Dashboard Landing Page

```typescript
// src/pages/Dashboard/Home.tsx
import React from 'react';
import PageMeta from '../../components/common/PageMeta';

export default function Home() {
  return (
    <>
      <PageMeta
        title="Jezweb Hub Dashboard | Client and Project Management"
        description="Centralised dashboard for managing Jezweb clients, websites, projects, and support tickets"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white/90">
              Welcome to Jezweb Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your centralised platform for managing clients, websites, projects, and support tickets.
            </p>
          </div>
        </div>
        
        {/* Quick Access Cards */}
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Clients</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Manage organisations and contacts
            </p>
            <div className="flex justify-end">
              <button className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300">
                View All →
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Websites</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Manage client websites and hosting
            </p>
            <div className="flex justify-end">
              <button className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300">
                View All →
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Projects</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Track and manage client projects
            </p>
            <div className="flex justify-end">
              <button className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300">
                View All →
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-6 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Support</h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Manage support tickets and requests
            </p>
            <div className="flex justify-end">
              <button className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300">
                View All →
              </button>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    New organisation added
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Acme Pty Ltd was added as a new client
                  </p>
                </div>
                <span className="text-sm text-gray-400">2 hours ago</span>
              </div>
              
              <div className="flex items-start gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    Website updated
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    exampleclient.com.au was updated to WordPress 6.5.1
                  </p>
                </div>
                <span className="text-sm text-gray-400">Yesterday</span>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    Support ticket resolved
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ticket #1234 was marked as resolved
                  </p>
                </div>
                <span className="text-sm text-gray-400">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* System Status */}
        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              System Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Firebase Connection</span>
                <span className="inline-flex items-center rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-500">
                  Online
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Backup</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Today, 03:30 AM
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">System Version</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  1.0.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

## Timeline and Milestones

1. **Week 1: Project Setup and Core Structure**
   - Clean up TailAdmin Pro template
   - Set up Firebase integration
   - Create core layout structure

2. **Week 2: Dashboard Landing Page and Firebase Services**
   - Implement dashboard landing page
   - Create Firebase service modules
   - Set up data models

3. **Week 3-4: Implement Core Modules**
   - Clients Module (Organisations, Contacts)
   - Hosting Module (Websites)
   - Support Module (Tickets)

4. **Week 5-6: Implement Additional Modules**
   - Projects Module
   - Sales Module
   - Task Management
   - Notes, Events, Timesheets, Articles

5. **Week 7: UI Components and Styling**
   - Implement shared UI components
   - Ensure consistent styling
   - Add EN-AU spelling throughout

6. **Week 8: Testing and Deployment**
   - Test all components and functionality
   - Deploy to production environment
   - Monitor for issues

## Firebase Configuration

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxjuSAyinoAosXdTig9HNyzVXYX1fKlYQ",
  authDomain: "jezweb-hub.firebaseapp.com",
  projectId: "jezweb-hub",
  storageBucket: "jezweb-hub.firebasestorage.app",
  messagingSenderId: "741775877175",
  appId: "1:741775877175:web:d7037edf8541659f4b8bb2",
  measurementId: "G-0FX4HYQCHS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

## Conclusion

This plan outlines a comprehensive approach to creating the Jezweb Hub dashboard using the TailAdmin Pro template as a starting point. The dashboard will maintain the same design but remove the demo content, replacing it with placeholder content based on the provided data schemas. The dashboard will use Firebase Firestore for data storage and retrieval.

The implementation will be modular and follow SOLID principles, with each component having a clear purpose and relationship to other components. The code will be well-documented with comments explaining how each file works and its relationship to other components.