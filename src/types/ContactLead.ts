/**
 * ContactLead Interface
 * 
 * This file defines the TypeScript interface for the relationship between
 * contacts and leads. It represents the many-to-many relationship
 * where a contact can be associated with multiple leads and vice versa.
 */

/**
 * ContactLead interface representing the relationship between a contact and a lead
 */
export interface ContactLead {
  relationshipId: string;     // Unique identifier for the relationship
  contactId: string;          // ID of the contact
  leadId: string;             // ID of the lead
  leadName: string;           // Name or title of the lead (denormalised for convenience)
  role?: string;              // Role of the contact in relation to the lead
  isPrimary: boolean;         // Whether this contact is a primary contact for the lead
  createdAt?: any;            // Creation timestamp
  updatedAt?: any;            // Last update timestamp
}