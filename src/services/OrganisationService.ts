/**
 * Organisation Service
 * 
 * This service handles all CRUD operations for organisations in the Jezweb Hub system.
 * It provides methods for creating, reading, updating, and deleting organisation data
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
  DocumentReference,
  QueryConstraint,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Organisation, OrganisationFormData } from '../types/Organisation';

// Collection reference
const ORGANISATIONS_COLLECTION = 'organisations';

/**
 * OrganisationService class for handling organisation-related operations
 */
class OrganisationService {
  /**
   * Create a new organisation
   * 
   * @param organisationData - The organisation data to create
   * @returns Promise with the created organisation ID
   */
  async createOrganisation(organisationData: OrganisationFormData): Promise<string> {
    try {
      // Prepare the data for Firestore
      const newOrganisation = {
        ...organisationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add the document to Firestore
      const docRef = await addDoc(collection(db, ORGANISATIONS_COLLECTION), newOrganisation);
      return docRef.id;
    } catch (error) {
      console.error('Error creating organisation:', error);
      throw error;
    }
  }

  /**
   * Get an organisation by ID
   * 
   * @param organisationId - The ID of the organisation to retrieve
   * @returns Promise with the organisation data or null if not found
   */
  async getOrganisationById(organisationId: string): Promise<Organisation | null> {
    try {
      const docRef = doc(db, ORGANISATIONS_COLLECTION, organisationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          organisationId: docSnap.id,
          createdAt: data.createdAt as Timestamp,
          updatedAt: data.updatedAt as Timestamp
        } as Organisation;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting organisation:', error);
      throw error;
    }
  }

  /**
   * Get all organisations with optional filtering
   * 
   * @param filters - Optional query filters
   * @param sortField - Optional field to sort by (default: 'organisationName')
   * @param sortDirection - Optional sort direction (default: 'asc')
   * @param maxResults - Optional maximum number of results to return
   * @returns Promise with array of organisations
   */
  async getOrganisations(
    filters?: { field: string; operator: string; value: any }[],
    sortField: string = 'organisationName',
    sortDirection: 'asc' | 'desc' = 'asc',
    maxResults?: number
  ): Promise<Organisation[]> {
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
      const q = query(collection(db, ORGANISATIONS_COLLECTION), ...constraints);
      const querySnapshot = await getDocs(q);

      // Map results to Organisation objects
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        organisationId: doc.id,
        createdAt: doc.data().createdAt as Timestamp,
        updatedAt: doc.data().updatedAt as Timestamp
      } as Organisation));
    } catch (error) {
      console.error('Error getting organisations:', error);
      throw error;
    }
  }

  /**
   * Update an existing organisation
   * 
   * @param organisationId - The ID of the organisation to update
   * @param organisationData - The updated organisation data
   * @returns Promise indicating success
   */
  async updateOrganisation(
    organisationId: string, 
    organisationData: Partial<OrganisationFormData>
  ): Promise<void> {
    try {
      const docRef = doc(db, ORGANISATIONS_COLLECTION, organisationId);
      
      // Add updated timestamp
      const updateData = {
        ...organisationData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating organisation:', error);
      throw error;
    }
  }

  /**
   * Delete an organisation
   * 
   * @param organisationId - The ID of the organisation to delete
   * @returns Promise indicating success
   */
  async deleteOrganisation(organisationId: string): Promise<void> {
    try {
      const docRef = doc(db, ORGANISATIONS_COLLECTION, organisationId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting organisation:', error);
      throw error;
    }
  }

  /**
   * Search organisations by name
   * 
   * @param searchTerm - The search term to match against organisation names
   * @param maxResults - Optional maximum number of results to return
   * @returns Promise with array of matching organisations
   */
  async searchOrganisationsByName(
    searchTerm: string,
    maxResults: number = 10
  ): Promise<Organisation[]> {
    try {
      // For Firestore, we need to use startAt and endAt with orderBy for prefix search
      // This is a simple implementation that gets all and filters in memory
      // For production, consider using Firestore's array-contains or Algolia
      const allOrganisations = await this.getOrganisations(
        undefined, 
        'organisationName', 
        'asc'
      );

      const searchTermLower = searchTerm.toLowerCase();
      
      return allOrganisations
        .filter(org => org.organisationName.toLowerCase().includes(searchTermLower))
        .slice(0, maxResults);
    } catch (error) {
      console.error('Error searching organisations:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const organisationService = new OrganisationService();