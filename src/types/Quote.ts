/**
 * Quote Types
 * 
 * This file defines the types and interfaces related to quotes.
 */

/**
 * Quote Status enum
 */
export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

/**
 * Quote Status Type
 * String literal type for quote statuses
 */
export type QuoteStatusType = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

/**
 * Quote Item interface
 */
export interface QuoteItem {
  itemId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

/**
 * Quote interface
 */
export interface Quote {
  quoteId: string;
  organisationId?: string;
  organisationName?: string;
  contactId?: string;
  contactName?: string;
  leadId?: string;
  leadName?: string;
  projectId?: string;
  quoteNumber: string;
  subject: string;
  quoteDate: string;
  expiryDate: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  quoteHTML?: string;
  createdAt: any; // firebase.firestore.Timestamp
  updatedAt: any; // firebase.firestore.Timestamp
}

/**
 * Quote Form Data interface
 */
export interface QuoteFormData {
  subject: string;
  quoteDate: string;
  expiryDate: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}