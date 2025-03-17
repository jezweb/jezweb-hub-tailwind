/**
 * InfoItem Component
 * 
 * A standardized component for displaying key-value information.
 * This component provides a consistent way to show labeled information across the application.
 */

import React from 'react';

interface InfoItemProps {
  /** The label for the information */
  label: string;
  
  /** The value to display */
  value: React.ReactNode;
  
  /** Whether the value should be displayed with emphasis */
  emphasized?: boolean;
  
  /** Layout direction for the label and value */
  direction?: 'horizontal' | 'vertical';
  
  /** Additional CSS classes to apply to the container */
  className?: string;
  
  /** Additional CSS classes to apply to the label */
  labelClassName?: string;
  
  /** Additional CSS classes to apply to the value */
  valueClassName?: string;
}

/**
 * InfoItem component
 * 
 * @example
 * // Basic usage
 * <InfoItem label="Email" value="user@example.com" />
 * 
 * @example
 * // With emphasized value
 * <InfoItem label="Status" value="Active" emphasized />
 * 
 * @example
 * // With vertical layout
 * <InfoItem label="Description" value="This is a long description that might wrap to multiple lines." direction="vertical" />
 */
export const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  emphasized = false,
  direction = 'horizontal',
  className = '',
  labelClassName = '',
  valueClassName = ''
}) => {
  // Base classes for the container
  const containerBaseClasses = 'group';
  
  // Classes for different layout directions
  const directionClasses = {
    horizontal: 'flex flex-row justify-between items-baseline',
    vertical: 'flex flex-col space-y-1'
  };
  
  // Classes for the label
  const labelBaseClasses = 'text-sm text-gray-500 dark:text-gray-400';
  
  // Classes for the value
  const valueBaseClasses = emphasized
    ? 'font-medium text-gray-900 dark:text-white'
    : 'text-gray-700 dark:text-gray-300';
  
  return (
    <div className={`${containerBaseClasses} ${directionClasses[direction]} ${className}`}>
      <div className={`${labelBaseClasses} ${labelClassName}`}>
        {label}
      </div>
      
      <div className={`${valueBaseClasses} ${valueClassName}`}>
        {value || <span className="text-gray-400 dark:text-gray-500">—</span>}
      </div>
    </div>
  );
};