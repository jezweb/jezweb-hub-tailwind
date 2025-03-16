/**
 * Lead Types
 * 
 * This file defines the types related to leads in the application.
 * It includes the base Lead type, as well as extended types for
 * leads with organisation and contact relationships.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Lead status type
 */
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';

/**
 * Contact Person information within a lead
 */
export interface ContactPerson {
  fullName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
}

/**
 * Base Lead type
 */
export interface Lead {
  leadId: string;
  contactPerson: ContactPerson;
  organisationId: string | null;
  organisationName: string | null;
  status: string;
  source: string;
  notes: string;
  contactIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Form data for creating or updating a lead
 */
export interface LeadFormData {
  leadId?: string;
  contactPerson: ContactPerson;
  organisationId?: string | null;
  organisationName?: string | null;
  status: string;
  source: string;
  notes?: string;
  contactIds?: string[];
}

/**
 * Organisation information for a lead
 */
export interface OrganisationInfo {
  organisationId: string;
  organisationName: string;
}

/**
 * Contact information for a lead
 */
export interface ContactInfo {
  contactId: string;
  fullName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
}

/**
 * Lead with organisation information
 */
export interface LeadWithOrganisation extends Lead {
  organisation?: OrganisationInfo;
}

/**
 * Lead with contact information
 */
export interface LeadWithContacts extends Lead {
  contacts: ContactInfo[];
}