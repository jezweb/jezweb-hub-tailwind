/**
 * QuoteFormSection Component
 * 
 * A standardized component for form sections in the quotes module.
 * This component ensures consistent styling for form sections across the quotes module.
 */

import React, { ReactNode } from 'react';

interface QuoteFormSectionProps {
  title: string;
  children: ReactNode;
  description?: string;
  className?: string;
}

/**
 * QuoteFormSection component
 * 
 * @param {string} title - The section title
 * @param {ReactNode} children - The form fields or content
 * @param {string} description - Optional description text
 * @param {string} className - Additional CSS classes
 */
export const QuoteFormSection: React.FC<QuoteFormSectionProps> = ({
  title,
  children,
  description,
  className = ''
}) => {
  return (
    <div className={`mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      
      <div>
        {children}
      </div>
    </div>
  );
};