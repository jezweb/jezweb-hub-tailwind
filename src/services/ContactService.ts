/**
 * Contact Service
 * 
 * This service handles all CRUD operations for contacts in the Jezweb Hub system.
 * It provides methods for creating, reading, updating, and deleting contact data
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
  limit, 
  Timestamp, 
  QueryConstraint,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Contact, ContactFormData } from '../types/Contact';

// Collection reference
const CONTACTS_COLLECTION = 'contacts';

/**
 * ContactService class for handling contact-related operations
 */
class ContactService {
  /**
   * Create a new contact
   * 
   * @param contactData - The contact data to create
   * @returns Promise with the created contact ID
   */
  async createContact(contactData: ContactFormData): Promise<string> {
    try {
      // Generate fullName from firstName and lastName
      console.log('Creating contact with data:', contactData);
      const fullName = `${contactData.firstName} ${contactData.lastName}`.trim();
      
      // Prepare the data for Firestore
      const newContact = {
        ...contactData,
        fullName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add the document to Firestore
      const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), newContact);
      return docRef.id;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  /**
   * Get a contact by ID
   * 
   * @param contactId - The ID of the contact to retrieve
   * @returns Promise with the contact data or null if not found
   */
  async getContactById(contactId: string): Promise<Contact | null> {
    try {
      const docRef = doc(db, CONTACTS_COLLECTION, contactId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          contactId: docSnap.id,
          createdAt: data.createdAt as Timestamp,
          updatedAt: data.updatedAt as Timestamp
        } as Contact;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting contact:', error);
      throw error;
    }
  }

  /**
   * Get all contacts with optional filtering
   * 
   * @param filters - Optional query filters
   * @param sortField - Optional field to sort by (default: 'fullName')
   * @param sortDirection - Optional sort direction (default: 'asc')
   * @param maxResults - Optional maximum number of results to return
   * @returns Promise with array of contacts
   */
  async getContacts(
    filters?: { field: string; operator: string; value: any }[],
    sortField: string = 'fullName',
    sortDirection: 'asc' | 'desc' = 'asc',
    maxResults?: number
  ): Promise<Contact[]> {
    try {
      // Build query constraints
      const constraints: QueryConstraint[] = [];

      // Add filters if provided
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator as any, filter.value));
        });
      }

      // Add sorting
      constraints.push(orderBy(sortField, sortDirection));

      // Add limit if provided
      if (maxResults) {
        constraints.push(limit(maxResults));
      }

      // Create and execute query
      const q = query(collection(db, CONTACTS_COLLECTION), ...constraints);
      const querySnapshot = await getDocs(q);

      // Map results to Contact objects
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        contactId: doc.id,
        createdAt: doc.data().createdAt as Timestamp,
        updatedAt: doc.data().updatedAt as Timestamp
      } as Contact));
    } catch (error) {
      console.error('Error getting contacts:', error);
      throw error;
    }
  }

  /**
   * Update an existing contact
   * 
   * @param contactId - The ID of the contact to update
   * @param contactData - The updated contact data
   * @returns Promise indicating success
   */
  async updateContact(
    contactId: string, 
    contactData: Partial<ContactFormData>
  ): Promise<void> {
    try {
      console.log('Updating contact with data:', contactData);
      const docRef = doc(db, CONTACTS_COLLECTION, contactId);
      
      // Update fullName if firstName or lastName is provided
      let updateData: any = { ...contactData };
      
      if (contactData.firstName || contactData.lastName) {
        // Get current data to ensure we have both first and last name
        const currentDoc = await getDoc(docRef);
        if (currentDoc.exists()) {
          const currentData = currentDoc.data();
          const firstName = contactData.firstName || currentData.firstName;
          const lastName = contactData.lastName || currentData.lastName;
          updateData.fullName = `${firstName} ${lastName}`.trim();
        }
      }
      
      // Add updated timestamp
      updateData.updatedAt = serverTimestamp();

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  /**
   * Delete a contact
   * 
   * @param contactId - The ID of the contact to delete
   * @returns Promise indicating success
   */
  async deleteContact(contactId: string): Promise<void> {
    try {
      const docRef = doc(db, CONTACTS_COLLECTION, contactId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  /**
   * Search contacts by name
   * 
   * @param searchTerm - The search term to match against contact names
   * @param maxResults - Optional maximum number of results to return
   * @returns Promise with array of matching contacts
   */
  async searchContactsByName(
    searchTerm: string,
    maxResults: number = 10
  ): Promise<Contact[]> {
    try {
      // For Firestore, we need to use startAt and endAt with orderBy for prefix search
      // This is a simple implementation that gets all and filters in memory
      // For production, consider using Firestore's array-contains or Algolia
      const allContacts = await this.getContacts(
        undefined, 
        'fullName', 
        'asc'
      );

      const searchTermLower = searchTerm.toLowerCase();
      
      return allContacts
        .filter(contact => 
          contact.fullName.toLowerCase().includes(searchTermLower) ||
          contact.email.toLowerCase().includes(searchTermLower)
        )
        .slice(0, maxResults);
    } catch (error) {
      console.error('Error searching contacts:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const contactService = new ContactService();