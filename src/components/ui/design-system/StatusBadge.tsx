/**
 * StatusBadge Component
 * 
 * A standardized badge component for displaying status information.
 * This component provides a consistent way to show status indicators across the application.
 */

import React from 'react';

type StatusType = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'success' | 'error' | 'warning' | 'info';

interface StatusBadgeProps {
  /** The status to display */
  status: StatusType | string;
  
  /** Optional label to display instead of the status */
  label?: string;
  
  /** Whether to show a dot indicator */
  showDot?: boolean;
  
  /** Additional CSS classes to apply to the badge */
  className?: string;
}

/**
 * StatusBadge component
 * 
 * @example
 * // Basic usage
 * <StatusBadge status="active" />
 * 
 * @example
 * // With custom label
 * <StatusBadge status="active" label="Online" />
 * 
 * @example
 * // Without dot indicator
 * <StatusBadge status="active" showDot={false} />
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showDot = true,
  className = ''
}) => {
  // Map status to color classes
  const getStatusClasses = (status: string): string => {
    const statusMap: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      expired: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    };
    
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };
  
  // Map status to dot color classes
  const getDotClasses = (status: string): string => {
    const dotMap: Record<string, string> = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      accepted: 'bg-green-500',
      rejected: 'bg-red-500',
      expired: 'bg-yellow-500',
      active: 'bg-green-500',
      inactive: 'bg-gray-500',
      pending: 'bg-yellow-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };
    
    return dotMap[status.toLowerCase()] || 'bg-gray-500';
  };
  
  // Format status text for display
  const formatStatus = (status: string): string => {
    // Convert camelCase or snake_case to Title Case with spaces
    return (label || status.replace(/([A-Z])/g, ' $1').replace(/_/g, ' '))
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses(status)} ${className}`}>
      {showDot && (
        <span className={`-ml-0.5 mr-1.5 h-2 w-2 rounded-full ${getDotClasses(status)}`}></span>
      )}
      {formatStatus(status)}
    </span>
  );
};