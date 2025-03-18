# OrganisationDetails Design System Implementation Plan

This document outlines the plan to update the right column of the `OrganisationDetails` page (`src/pages/organisations/OrganisationDetails.tsx`) to use the design system components defined in `docs/design-system.md`, aligning its styling with the `QuoteView` page (`src/pages/quotes/QuoteView.tsx`).

## Goal

Refactor the right column of the `OrganisationDetails` page to use design system components for a consistent look and feel, matching the styling of the `QuoteView` page's sidebar.

## Analysis

The right column of `OrganisationDetails.tsx` currently contains the following modules:

*   Contacts
*   Quotes
*   Leads
*   Websites

These modules are currently implemented using basic `div` elements and Tailwind CSS classes. The `QuoteView.tsx` page's sidebar uses components like `Card`, `FormSection`, and `ActionButton` from the design system.

## Plan

1.  **Identify Right Column Sections:** Target the "Contacts", "Quotes", "Leads", and "Websites" modules in `OrganisationDetails.tsx`.

2.  **Examine QuoteView Sidebar Styling:** Note the use of `Card` and `FormSection` components, and `ActionButton` for buttons in `QuoteView.tsx`'s sidebar.

3.  **Component Replacement/Refactoring:**
    *   Replace the outer `div` elements of each module ("Contacts", "Quotes", "Leads", "Websites") with the `Card` component from the design system.
    *   Use the `Card` component's `header` prop to display the module titles ("Contacts", "Quotes", "Leads", "Websites"), using appropriate heading level (e.g., `h4` or `h3`) within the header for consistent styling.
    *   Replace the existing "Create New Quote", "Create New Lead", and "Add Website" buttons with the `ActionButton` component, using the `variant="outline"` prop for consistency with `QuoteView.tsx`.
    *   Ensure consistent typography and spacing within the modules by using standard Tailwind CSS utility classes.

4.  **Step-by-Step Implementation:**

    a.  **Contacts Module:**
        i.  Wrap the "Contacts Module" content in a `Card` component.
        ii. Replace the module title `h4` with `Card`'s `header` prop.
        iii. Replace the "Add Contact" button with `ActionButton`.

    b.  **Quotes Module:**
        i.  Wrap the "Quotes Module" content in a `Card` component.
        ii. Replace the module title `h4` with `Card`'s `header` prop.
        iii. Replace the "Create New Quote" button with `ActionButton` with `variant="outline"`.

    c.  **Leads Module:**
        i.  Wrap the "Leads Module" content in a `Card` component.
        ii. Replace the module title `h4` with `Card`'s `header` prop.
        iii. Replace the "Create New Lead" button with `ActionButton` with `variant="outline"`.

    d.  **Websites Module:**
        i.  Wrap the "Websites Module" content in a `Card` component.
        ii. Replace the module title `h4` with `Card`'s `header` prop.
        iii. Replace the "Add Website" button with `ActionButton` with `variant="outline"`.

5. **Mermaid Diagram:**

```mermaid
graph LR
    A[Start] --> B{Read OrganisationDetails.tsx and QuoteView.tsx};
    B --> C{Analyze Design System Components (design-system.md)};
    C --> D{Identify Right Column Modules in OrganisationDetails};
    D --> E{Examine QuoteView Sidebar Styling};
    E --> F{Plan Component Replacement/Refactoring};
    F --> G{Contacts Module Updates};
    G --> H{Quotes Module Updates};
    H --> I{Leads Module Updates};
    I --> J{Websites Module Updates};
    J --> K{Request User Approval};
    K --> L[End Plan];