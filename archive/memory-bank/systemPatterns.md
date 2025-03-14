# System Patterns

This document outlines the key patterns and conventions used in the Jezweb Hub dashboard.

## Architectural Patterns

### Module Pattern
The application is organized into modules, each representing a distinct feature or domain:
- Clients Module (Organisations, Contacts)
- Hosting Module (Websites)
- Support Module (Tickets)
- Projects Module (Website Projects, Graphics Projects, App Projects, SEO Projects, Content Projects)
- Sales Module (Leads, Quotes)
- Tasks Module
- Notes Module
- Events Module
- Timesheets Module
- Articles Module

Each module follows a similar structure:
- Components for list views, detail views, and forms
- Service modules for data access
- Types for type definitions

### Service Pattern
Firebase interactions are encapsulated in service modules:
- Authentication service
- Firestore services for each data type
- Storage service

This pattern provides a clean separation between data access and UI components.

### Component Composition
UI components are composed of smaller, reusable components:
- Layout components (AppLayout, AppHeader, AppSidebar)
- UI components (tables, forms, cards, modals)
- Page components

## Coding Patterns

### TypeScript Interfaces
Data models are defined as TypeScript interfaces:
```typescript
interface Organisation {
  organisationId: string;
  name: string;
  // other properties
}
```

### Async/Await
Asynchronous operations use async/await for better readability:
```typescript
const getOrganisations = async (): Promise<Organisation[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(doc => ({ organisationId: doc.id, ...doc.data() } as Organisation));
};
```

### React Hooks
React hooks are used for state management and side effects:
```typescript
const [organisations, setOrganisations] = useState<Organisation[]>([]);

useEffect(() => {
  const fetchOrganisations = async () => {
    const data = await getOrganisations();
    setOrganisations(data);
  };
  
  fetchOrganisations();
}, []);
```

### Context API
The Context API is used for global state management:
```typescript
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // context implementation
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## UI Patterns

### Card Pattern
Information is displayed in card components:
```tsx
<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
  <h3 className="mb-2 font-semibold text-gray-800 dark:text-white/90">Card Title</h3>
  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Card content</p>
</div>
```

### Table Pattern
Lists are displayed in table components:
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableCell isHeader>Header 1</TableCell>
      <TableCell isHeader>Header 2</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell 1</TableCell>
      <TableCell>Cell 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Form Pattern
Forms use consistent patterns for input fields:
```tsx
<FormField label="Name" htmlFor="name" required>
  <Input
    id="name"
    name="name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</FormField>
```

## Naming Conventions

### Files and Directories
- PascalCase for component files: `OrganisationList.tsx`
- camelCase for utility files: `organisationService.ts`
- kebab-case for directories: `client-module`

### Variables and Functions
- camelCase for variables and functions: `getOrganisations`
- PascalCase for component names: `OrganisationList`
- ALL_CAPS for constants: `COLLECTION_NAME`

### CSS Classes
- TailwindCSS utility classes are used for styling
- Custom classes use kebab-case: `custom-card`

## Error Handling

### Try/Catch Pattern
```typescript
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  console.error('Error:', error);
  throw new Error('Failed to perform operation');
}
```

### Error Boundaries
React error boundaries are used to catch and handle errors in the component tree.

## Testing Patterns

### Component Testing
```typescript
test('renders organisation list', () => {
  render(<OrganisationList organisations={mockOrganisations} />);
  expect(screen.getByText('Organisation 1')).toBeInTheDocument();
});
```

### Service Testing
```typescript
test('getOrganisations returns organisations', async () => {
  // Mock Firestore
  const result = await getOrganisations();
  expect(result).toEqual(mockOrganisations);
});