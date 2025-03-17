/**
 * useQuoteFormFields Hook
 * 
 * This hook provides form field values and options for the quote form.
 * It includes status values and other form-related utilities.
 */

import { useState, useEffect } from 'react';
import { QuoteStatus } from '../../types/Quote';

/**
 * useQuoteFormFields hook interface
 */
export const useQuoteFormFields = () => {
  const [loading, setLoading] = useState<boolean>(false);
  
  // Status values for the form
  const statusValues = [
    { id: 'draft', value: QuoteStatus.DRAFT, label: 'Draft' },
    { id: 'sent', value: QuoteStatus.SENT, label: 'Sent' },
    { id: 'accepted', value: QuoteStatus.ACCEPTED, label: 'Accepted' },
    { id: 'rejected', value: QuoteStatus.REJECTED, label: 'Rejected' },
    { id: 'expired', value: QuoteStatus.EXPIRED, label: 'Expired' }
  ];
  
  // Generate a new unique item ID
  const generateItemId = (): string => {
    return `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };
  
  // Calculate the amount for a quote item
  const calculateItemAmount = (quantity: number, unitPrice: number): number => {
    return quantity * unitPrice;
  };
  
  // Calculate the subtotal for all items
  const calculateSubtotal = (items: { amount: number }[]): number => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };
  
  // Calculate the tax amount
  const calculateTax = (subtotal: number, taxRate: number = 0.10): number => {
    return subtotal * taxRate;
  };
  
  // Calculate the total amount
  const calculateTotal = (subtotal: number, tax: number): number => {
    return subtotal + tax;
  };
  
  // Generate default expiry date (30 days from now)
  const generateDefaultExpiryDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };
  
  // Generate today's date
  const generateTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };
  
  return {
    loading,
    statusValues,
    generateItemId,
    calculateItemAmount,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
    generateDefaultExpiryDate,
    generateTodayDate
  };
};