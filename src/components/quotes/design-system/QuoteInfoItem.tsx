/**
 * QuoteInfoItem Component
 * 
 * A standardized component for displaying key-value information in quotes.
 * This component ensures consistent styling for information display across the quotes module.
 */

import React, { ReactNode } from 'react';

interface QuoteInfoItemProps {
  label: string;
  value: ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

/**
 * QuoteInfoItem component
 * 
 * @param {string} label - The label for the information item
 * @param {ReactNode} value - The value to display
 * @param {string} className - Additional CSS classes for the container
 * @param {string} labelClassName - Additional CSS classes for the label
 * @param {string} valueClassName - Additional CSS classes for the value
 */
export const QuoteInfoItem: React.FC<QuoteInfoItemProps> = ({
  label,
  value,
  className = '',
  labelClassName = '',
  valueClassName = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <span className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${labelClassName}`}>
        {label}
      </span>
      <span className={`mt-1 block text-sm text-gray-900 dark:text-white ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
};