# Plan: Replace SVG Icons with Lucid React Icons

This plan outlines the steps to replace existing SVG icons with Lucid React icons in the specified files.

**1. Install `lucide-react` (if necessary):**

```bash
npm install lucide-react
```

**2. Modify `src/layout/AppSidebar.tsx`:**

*   **Replace Icon Imports:**

    ```diff
    - import {
    -   BoxCubeIcon,
    -   CalenderIcon,
    -   ChatIcon,
    -   ChevronDownIcon,
    -   DocsIcon,
    -   GridIcon,
    -   HorizontaLDots,
    -   ListIcon,
    -   MailIcon,
    -   PageIcon,
    -   PieChartIcon,
    -   PlugInIcon,
    -   TableIcon,
    -   TaskIcon,
    -   UserCircleIcon,
    - } from "../icons";
    + import {
    +   Box,
    +   Calendar,
    +   MessageCircle,
    +   ChevronDown,
    +   FileText,
    +   LayoutGrid,
    +   MoreHorizontal,
    +   List,
    +   Mail,
    +   File,
    +   PieChart,
    +   Plug,
    +   Table,
    +   CheckSquare,
    +   UserCircle2,
    + } from "lucide-react";
    ```

*   **Replace Icon Components:**

    ```diff
    const navItems: NavItem[] = [
      {
    -    icon: <GridIcon />,
    +    icon: <LayoutGrid />,
        name: "Dashboard",
        path: "/",
      },
      {
    -    icon: <UserCircleIcon />,
    +    icon: <UserCircle2 />,
        name: "Clients",
        path: "/clients",
        subItems: [
          { name: "Organisations", path: "/organisations" },
          { name: "Contacts", path: "/contacts" },
        ],
      },
      {
    -    icon: <GridIcon />,
    +    icon: <LayoutGrid />,
        name: "Hosting",
        subItems: [
          { name: "Websites", path: "/websites" },
        ],
      },
      {
        name: "Support",
    -    icon: <ChatIcon />,
    +    icon: <MessageCircle />,
        subItems: [
          { name: "Tickets", path: "/tickets" },
        ],
      },
      {
        name: "Projects",
    -    icon: <DocsIcon />,
    +    icon: <FileText />,
        subItems: [
          { name: "Website Projects", path: "/projects/website" },
          { name: "Graphics Projects", path: "/projects/graphics" },
          { name: "App Projects", path: "/projects/app" },
          { name: "SEO Projects", path: "/projects/seo" },
          { name: "Content Projects", path: "/projects/content" },
        ],
      },
      {
        name: "Sales",
    -    icon: <PieChartIcon />,
    +    icon: <PieChart />,
        subItems: [
          { name: "Leads", path: "/leads" },
          { name: "Quotes", path: "/quotes" },
        ],
      },
      {
        name: "Tasks",
    -    icon: <TaskIcon />,
    +    icon: <CheckSquare />,
        path: "/tasks",
      },
      {
        name: "Notes",
    -    icon: <ListIcon />,
    +    icon: <List />,
        path: "/notes",
      },
      {
        name: "Events",
    -    icon: <CalenderIcon />,
    +    icon: <Calendar />,
        path: "/events",
      },
      {
        name: "Timesheets",
    -    icon: <TableIcon />,
    +    icon: <Table />,
        path: "/timesheets",
      },
      {
        name: "Articles",
    -    icon: <PageIcon />,
    +    icon: <File />,
        path: "/articles",
      },
      {
        name: "Settings",
    -    icon: <PlugInIcon />,
    +    icon: <Plug />,
        subItems: [
          { name: "Dropdown Lists", path: "/settings" },
        ],
      },
    ];
    ```
    Also replace `<HorizontaLDots className="size-6" />` with `<MoreHorizontal className="h-6 w-6" />` and update the import.

**3. Modify `src/pages/leads/index.tsx`:**

*   **Add Import:**

    ```typescript
    import { Plus, Table2, LayoutGrid } from 'lucide-react';
    ```

*   **Replace Icons:**

    ```diff
    -          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    -            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    -          </svg>
    +          <Plus className="h-5 w-5" />

    -            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    -              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    -            </svg>
    +            <Table2 className="h-5 w-5" />

    -            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    -              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    -            </svg>
    +            <LayoutGrid className="h-5 w-5" />
    ```

**4. Modify `src/pages/quotes/index.tsx`:**

*   **Add Import:**

    ```typescript
    import { Plus, Table2, LayoutGrid } from 'lucide-react';
    ```

*   **Replace Icons:**

    ```diff
    -          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    -            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    -          </svg>
    +          <Plus className="h-5 w-5" />

    -            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    -              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    -            </svg>
    +            <Table2 className="h-5 w-5" />

    -            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    -              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    -            </svg>
    +            <LayoutGrid className="h-5 w-5" />
    ```

**5. Modify `src/pages/contacts/index.tsx`:**

*   **Add Import:**

    ```typescript
    import { Search, PlusCircle } from 'lucide-react';
    ```

*   **Replace Icons:**

    ```diff
    -              <svg
    -                className="h-5 w-5 text-gray-400"
    -                fill="none"
    -                stroke="currentColor"
    -                viewBox="0 0 24 24"
    -                xmlns="http://www.w3.org/2000/svg"
    -              >
    -                <path
    -                  strokeLinecap="round"
    -                  strokeLinejoin="round"
    -                  strokeWidth="2"
    -                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    -                ></path>
    -              </svg>
    +              <Search className="h-5 w-5 text-gray-400" />
        ```
        
     ```diff
    -       <button 
    -         className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    -         onClick={handleAddContact}
    -       >
    +       <button
    +         className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    +         onClick={handleAddContact}
    +       >
    +         <PlusCircle className="mr-2 h-5 w-5" />
              Add Contact
            </button>
        ```

**6. Modify `src/pages/organisations/index.tsx`:**

*   **Add Import:**

    ```typescript
    import { Plus, Search } from 'lucide-react';
    ```

*   **Replace Icons:**

    ```diff
    -            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    -              <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM12 9H9V12H7V9H4V7H7V4H9V7H12V9Z" fill="currentColor" />
    -            </svg>
    +            <Plus className="h-5 w-5" />

    -                <svg
    -                  className="h-5 w-5 text-gray-400"
    -                  fill="none"
    -                  stroke="currentColor"
    -                  viewBox="0 0 24 24"
    -                  xmlns="http://www.w3.org/2000/svg"
    -                >
    -                  <path
    -                    strokeLinecap="round"
    -                    strokeLinejoin="round"
    -                    strokeWidth="2"
    -                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    -                  />
    -                </svg>
    +                <Search className="h-5 w-5 text-gray-400" />