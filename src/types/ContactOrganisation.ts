/**
 * ContactOrganisation Interface
 * 
 * This file defines the TypeScript interface for the relationship between
 * contacts and organisations. It represents the many-to-many relationship
 * where a contact can be associated with multiple organisations and vice versa.
 */

/**
 * ContactOrganisation interface representing the relationship between a contact and an organisation
 */
export interface ContactOrganisation {
  relationshipId: string;     // Unique identifier for the relationship
  contactId: string;          // ID of the contact
  organisationId: string;     // ID of the organisation
  organisationName: string;   // Name of the organisation (denormalised for convenience)
  role?: string;              // Role of the contact in the organisation (e.g., staff, manager, director)
  isPrimary: boolean;         // Whether this contact is a primary contact for the organisation
  priority?: number;          // Priority order for display (lower numbers = higher priority)
  createdAt?: any;            // Creation timestamp
  updatedAt?: any;            // Last update timestamp
}