/**
 * Design System
 *
 * This file exports all components from the design system.
 * Import components from this file to ensure consistent styling across the application.
 *
 * Example usage:
 * ```tsx
 * import { Container, PageHeading, Card } from '../components/ui/design-system';
 *
 * const MyComponent = () => {
 *   return (
 *     <Container>
 *       <PageHeading title="My Page" />
 *       <Card>
 *         <p>Card content</p>
 *       </Card>
 *     </Container>
 *   );
 * };
 * ```
 */

// Layout Components
export { Container } from './Container';
export { PageHeading } from './PageHeading';
export { Card } from './Card';
export { FormSection } from './FormSection';

// Data Display Components
export { InfoItem } from './InfoItem';
export { StatusBadge } from './StatusBadge';

// Feedback Components
export { ErrorMessage } from './ErrorMessage';
export { LoadingState } from './LoadingState';

// Input Components
export { ActionButton } from './ActionButton';