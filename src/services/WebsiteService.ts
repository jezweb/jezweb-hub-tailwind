/**
 * Website Service
 * 
 * This service handles all CRUD operations for websites in the Jezweb Hub system.
 * It provides methods for creating, reading, updating, and deleting website data
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
  import { Website, WebsiteFormData } from '../types/Website';
  
  // Collection reference
  const WEBSITES_COLLECTION = 'websites';
  
  /**
   * WebsiteService class for handling website-related operations
   */
  class WebsiteService {
    /**
     * Create a new website
     * 
     * @param websiteData - The website data to create
     * @returns Promise with the created website ID
     */
    async createWebsite(websiteData: WebsiteFormData): Promise<string> {
      try {
        // Prepare the data for Firestore
        const newWebsite = {
          ...websiteData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
  
        // Add the document to Firestore
        const docRef = await addDoc(collection(db, WEBSITES_COLLECTION), newWebsite);
        return docRef.id;
      } catch (error) {
        console.error('Error creating website:', error);
        throw error;
      }
    }
  
    /**
     * Get a website by ID
     * 
     * @param websiteId - The ID of the website to retrieve
     * @returns Promise with the website data or null if not found
     */
    async getWebsiteById(websiteId: string): Promise<Website | null> {
      try {
        const docRef = doc(db, WEBSITES_COLLECTION, websiteId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            ...data,
            websiteId: docSnap.id,
            createdAt: data.createdAt as Timestamp,
            updatedAt: data.updatedAt as Timestamp
          } as Website;
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error getting website:', error);
        throw error;
      }
    }
  
    /**
     * Get all websites with optional filtering
     * 
     * @param filters - Optional query filters
     * @param sortField - Optional field to sort by (default: 'domain')
     * @param sortDirection - Optional sort direction (default: 'asc')
     * @param maxResults - Optional maximum number of results to return
     * @returns Promise with array of websites
     */
    async getWebsites(
      filters?: { field: string; operator: string; value: any }[],
      sortField: string = 'domain',
      sortDirection: 'asc' | 'desc' = 'asc',
      maxResults?: number
    ): Promise<Website[]> {
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
        const q = query(collection(db, WEBSITES_COLLECTION), ...constraints);
        const querySnapshot = await getDocs(q);
  
        // Map results to Website objects
        return querySnapshot.docs.map(doc => ({
          ...doc.data(),
          websiteId: doc.id,
          createdAt: doc.data().createdAt as Timestamp,
          updatedAt: doc.data().updatedAt as Timestamp
        } as Website));
      } catch (error) {
        console.error('Error getting websites:', error);
        throw error;
      }
    }
  
    /**
     * Update an existing website
     * 
     * @param websiteId - The ID of the website to update
     * @param websiteData - The updated website data
     * @returns Promise indicating success
     */
    async updateWebsite(
      websiteId: string, 
      websiteData: Partial<WebsiteFormData>
    ): Promise<void> {
      try {
        const docRef = doc(db, WEBSITES_COLLECTION, websiteId);
        
        // Add updated timestamp
        const updateData = {
          ...websiteData,
          updatedAt: serverTimestamp()
        };
  
        await updateDoc(docRef, updateData);
      } catch (error) {
        console.error('Error updating website:', error);
        throw error;
      }
    }
  
    /**
     * Delete a website
     * 
     * @param websiteId - The ID of the website to delete
     * @returns Promise indicating success
     */
    async deleteWebsite(websiteId: string): Promise<void> {
      try {
        const docRef = doc(db, WEBSITES_COLLECTION, websiteId);
        await deleteDoc(docRef);
      } catch (error) {
        console.error('Error deleting website:', error);
        throw error;
      }
    }
  
    /**
     * Search websites by domain
     * 
     * @param searchTerm - The search term to match against website domains
     * @param maxResults - Optional maximum number of results to return
     * @returns Promise with array of matching websites
     */
    async searchWebsitesByDomain(
      searchTerm: string,
      maxResults: number = 10
    ): Promise<Website[]> {
      try {
        // For Firestore, we need to use startAt and endAt with orderBy for prefix search
        // This is a simple implementation that gets all and filters in memory
        const allWebsites = await this.getWebsites(
          undefined, 
          'domain', 
          'asc'
        );
  
        const searchTermLower = searchTerm.toLowerCase();
        
        return allWebsites
          .filter(website => website.domain.toLowerCase().includes(searchTermLower))
          .slice(0, maxResults);
      } catch (error) {
        console.error('Error searching websites:', error);
        throw error;
      }
    }
  
    /**
     * Get websites by organisation ID
     * 
     * @param organisationId - The organisation ID to filter by
     * @returns Promise with array of websites for the organisation
     */
    async getWebsitesByOrganisation(organisationId: string): Promise<Website[]> {
      try {
        return this.getWebsites([
          { field: 'organisationId', operator: '==', value: organisationId }
        ]);
      } catch (error) {
        console.error('Error getting websites by organisation:', error);
        throw error;
      }
    }
  }
  
  // Export a singleton instance
  export const websiteService = new WebsiteService();