/**
 * FormSection Component
 * 
 * A standardized component for grouping form fields into logical sections.
 * This component provides a consistent way to organize form fields with titles and descriptions.
 */

import React from 'react';

interface FormSectionProps {
  /** The title of the form section */
  title?: string;
  
  /** Optional description text to display below the title */
  description?: string;
  
  /** The form fields to display in the section */
  children: React.ReactNode;
  
  /** Additional CSS classes to apply to the container */
  className?: string;
  
  /** Whether the section should have a border */
  bordered?: boolean;
  
  /** Whether the section should have padding */
  padded?: boolean;
}

/**
 * FormSection component
 * 
 * @example
 * // Basic usage
 * <FormSection title="Personal Information" description="Enter your personal details below">
 *   <input type="text" placeholder="Name" />
 *   <input type="email" placeholder="Email" />
 * </FormSection>
 * 
 * @example
 * // Without border
 * <FormSection title="Contact Information" bordered={false}>
 *   <input type="tel" placeholder="Phone" />
 *   <input type="text" placeholder="Address" />
 * </FormSection>
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
  bordered = true,
  padded = true
}) => {
  // Classes for border
  const borderClasses = bordered
    ? 'border border-gray-200 rounded-lg dark:border-gray-700'
    : '';
  
  // Classes for padding
  const paddingClasses = padded
    ? 'p-6'
    : '';
  
  return (
    <div className={`mb-8 ${borderClasses} ${paddingClasses} ${className}`}>
      {(title || description) && (
        <div className={`${padded ? 'mb-6' : 'mb-4'}`}>
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};