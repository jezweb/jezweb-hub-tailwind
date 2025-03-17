/**
 * QuoteStatusBadge Component
 * 
 * A standardized badge component for displaying quote statuses.
 * This component ensures consistent styling for status badges across the quotes module.
 */

import React from 'react';
import { QuoteStatus } from '../../../types/Quote';

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * QuoteStatusBadge component
 * 
 * @param {QuoteStatus} status - The quote status to display
 * @param {string} className - Additional CSS classes
 * @param {string} size - Size of the badge
 */
export const QuoteStatusBadge: React.FC<QuoteStatusBadgeProps> = ({
  status,
  className = '',
  size = 'medium'
}) => {
  // Status color classes
  const statusColors = {
    [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    [QuoteStatus.SENT]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    [QuoteStatus.ACCEPTED]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    [QuoteStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    [QuoteStatus.EXPIRED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  };

  // Status labels
  const statusLabels = {
    [QuoteStatus.DRAFT]: 'Draft',
    [QuoteStatus.SENT]: 'Sent',
    [QuoteStatus.ACCEPTED]: 'Accepted',
    [QuoteStatus.REJECTED]: 'Rejected',
    [QuoteStatus.EXPIRED]: 'Expired'
  };

  // Size classes
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-0.5 text-sm',
    large: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${statusColors[status]} ${sizeClasses[size]} ${className}`}>
      {statusLabels[status]}
    </span>
  );
};