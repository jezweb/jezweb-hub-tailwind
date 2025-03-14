/**
 * Organisation Contact Service
 * 
 * This service handles operations for the many-to-many relationship between
 * organisations and contacts in the Jezweb Hub system. It provides methods for
 * creating, reading, updating, and deleting organisation-contact relationships
 * in the Firestore database.
 * 
 * The service follows the repository pattern, abstracting database operations
 * and providing a clean API for the rest of the application.
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { OrganisationContact, OrganisationContactFormData } from '../types/OrganisationContact';
import { Contact } from '../types/Contact';
import { contactService } from './ContactService';

// Collection reference
const ORG_CONTACTS_COLLECTION = 'organisation_contacts';

/**
 * OrganisationContactService class for handling organisation-contact relationship operations
 */
class OrganisationContactService {
  /**
   * Create a new organisation-contact relationship
   * 
   * @param data - The relationship data to create
   * @returns Promise with the created relationship ID
   */
  async createOrganisationContact(data: OrganisationContactFormData): Promise<string> {
    try {
      // If this is marked as primary, we need to update any existing primary contacts
      if (data.isPrimary) {
        await this.updatePrimaryContact(data.organisationId, data.contactId);
      }
      
      // Prepare the data for Firestore
      const newOrgContact = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add the document to Firestore
      const docRef = await addDoc(collection(db, ORG_CONTACTS_COLLECTION), newOrgContact);
      return docRef.id;
    } catch (error) {
      console.error('Error creating organisation contact relationship:', error);
      throw error;
    }
  }

  /**
   * Get an organisation-contact relationship by ID
   * 
   * @param id - The ID of the relationship to retrieve
   * @returns Promise with the relationship data or null if not found
   */
  async getOrganisationContactById(id: string): Promise<OrganisationContact | null> {
    try {
      const docRef = doc(db, ORG_CONTACTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          createdAt: data.createdAt as Timestamp,
          updatedAt: data.updatedAt as Timestamp
        } as OrganisationContact;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting organisation contact relationship:', error);
      throw error;
    }
  }

  /**
   * Get all contacts for an organisation
   * 
   * @param organisationId - The ID of the organisation
   * @returns Promise with array of contacts and their relationship data
   */
  async getContactsByOrganisation(organisationId: string): Promise<(Contact & { relationshipId: string; role?: string; isPrimary: boolean; priority: number })[]> {
    try {
      // Query organisation_contacts collection for relationships with this organisation
      const q = query(
        collection(db, ORG_CONTACTS_COLLECTION),
        where('organisationId', '==', organisationId),
        orderBy('priority', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      // Get all the contact IDs and relationship data
      const contactPromises = querySnapshot.docs.map(async (doc) => {
        const relationshipData = doc.data();
        const contact = await contactService.getContactById(relationshipData.contactId);
        
        if (contact) {
          return {
            ...contact,
            relationshipId: doc.id,
            role: relationshipData.role,
            isPrimary: relationshipData.isPrimary || false,
            priority: relationshipData.priority || 999
          };
        }
        return null;
      });
      
      // Wait for all promises to resolve and filter out nulls
      const contacts = (await Promise.all(contactPromises)).filter(contact => contact !== null) as (Contact & { relationshipId: string; role?: string; isPrimary: boolean; priority: number })[];
      
      return contacts;
    } catch (error) {
      console.error('Error getting contacts for organisation:', error);
      throw error;
    }
  }

  /**
   * Get all organisations for a contact
   * 
   * @param contactId - The ID of the contact
   * @returns Promise with array of organisation IDs and relationship data
   */
  async getOrganisationsByContact(contactId: string): Promise<{ organisationId: string; relationshipId: string; role?: string; isPrimary: boolean; priority: number }[]> {
    try {
      // Query organisation_contacts collection for relationships with this contact
      const q = query(
        collection(db, ORG_CONTACTS_COLLECTION),
        where('contactId', '==', contactId)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Map to array of organisation IDs and relationship data
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          organisationId: data.organisationId,
          relationshipId: doc.id,
          role: data.role,
          isPrimary: data.isPrimary || false,
          priority: data.priority || 999
        };
      });
    } catch (error) {
      console.error('Error getting organisations for contact:', error);
      throw error;
    }
  }

  /**
   * Update an existing organisation-contact relationship
   * 
   * @param id - The ID of the relationship to update
   * @param data - The updated relationship data
   * @returns Promise indicating success
   */
  async updateOrganisationContact(
    id: string, 
    data: Partial<OrganisationContactFormData>
  ): Promise<void> {
    try {
      const docRef = doc(db, ORG_CONTACTS_COLLECTION, id);
      
      // If updating to primary, handle existing primary contacts
      if (data.isPrimary) {
        // Get the current data to get the organisationId
        const currentDoc = await getDoc(docRef);
        if (currentDoc.exists()) {
          const currentData = currentDoc.data();
          await this.updatePrimaryContact(currentData.organisationId, currentData.contactId);
        }
      }
      
      // Add updated timestamp
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating organisation contact relationship:', error);
      throw error;
    }
  }

  /**
   * Delete an organisation-contact relationship
   * 
   * @param id - The ID of the relationship to delete
   * @returns Promise indicating success
   */
  async deleteOrganisationContact(id: string): Promise<void> {
    try {
      const docRef = doc(db, ORG_CONTACTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting organisation contact relationship:', error);
      throw error;
    }
  }

  /**
   * Helper method to update primary contact status
   * Sets isPrimary=false for all contacts of an organisation except the specified one
   * 
   * @param organisationId - The organisation ID
   * @param excludeContactId - The contact ID to exclude from the update
   * @returns Promise indicating success
   */
  private async updatePrimaryContact(
    organisationId: string,
    excludeContactId: string
  ): Promise<void> {
    try {
      // Query for all relationships for this organisation except the excluded contact
      const q = query(
        collection(db, ORG_CONTACTS_COLLECTION),
        where('organisationId', '==', organisationId),
        where('contactId', '!=', excludeContactId),
        where('isPrimary', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      // If there are any primary contacts, update them
      if (!querySnapshot.empty) {
        const batch = writeBatch(db);
        
        querySnapshot.docs.forEach(docSnapshot => {
          const docRef = doc(db, ORG_CONTACTS_COLLECTION, docSnapshot.id);
          batch.update(docRef, { 
            isPrimary: false,
            updatedAt: serverTimestamp()
          });
        });
        
        await batch.commit();
      }
    } catch (error) {
      console.error('Error updating primary contact status:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const organisationContactService = new OrganisationContactService();