/**
 * ActionButton Component
 * 
 * A standardized button component for actions.
 * This component provides a consistent look and feel for buttons across the application.
 */

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
type ButtonSize = 'small' | 'medium' | 'large';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The content to be rendered inside the button */
  children: React.ReactNode;
  
  /** The variant of the button */
  variant?: ButtonVariant;
  
  /** The size of the button */
  size?: ButtonSize;
  
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Whether the button should take up the full width of its container */
  fullWidth?: boolean;
  
  /** Optional icon to display before the button text */
  iconBefore?: React.ReactNode;
  
  /** Optional icon to display after the button text */
  iconAfter?: React.ReactNode;
  
  /** Additional CSS classes to apply to the button */
  className?: string;
}

/**
 * ActionButton component
 * 
 * @example
 * // Basic usage
 * <ActionButton variant="primary" onClick={handleClick}>
 *   Click Me
 * </ActionButton>
 * 
 * @example
 * // With loading state
 * <ActionButton variant="primary" isLoading>
 *   Saving...
 * </ActionButton>
 * 
 * @example
 * // With icons
 * <ActionButton 
 *   variant="primary" 
 *   iconBefore={<svg>...</svg>}
 *   iconAfter={<svg>...</svg>}
 * >
 *   Click Me
 * </ActionButton>
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  iconBefore,
  iconAfter,
  className = '',
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Classes for different variants
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
    info: 'bg-blue-400 text-white hover:bg-blue-500 focus:ring-blue-400',
    light: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    dark: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700',
    link: 'text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300'
  };
  
  // Classes for different sizes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };
  
  // Classes for full width
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Classes for disabled state
  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClasses}
    ${disabledClasses}
    ${className}
  `.trim();
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="mr-2 -ml-1 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && iconBefore && (
        <span className="mr-2 -ml-1">{iconBefore}</span>
      )}
      
      {children}
      
      {iconAfter && (
        <span className="ml-2 -mr-1">{iconAfter}</span>
      )}
    </button>
  );
};