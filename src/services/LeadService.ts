/**
 * Lead Service
 * 
 * This service provides functions for interacting with lead data in Firebase.
 * It handles CRUD operations for leads, as well as searching and filtering.
 */

import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Lead, LeadFormData } from '../types/Lead';

// Collection reference
const leadsCollection = collection(db, 'leads');

/**
 * Create a new lead
 * @param leadData - The lead data to create
 * @returns Promise that resolves with the ID of the new lead
 */
export const createLead = async (leadData: LeadFormData): Promise<string> => {
  try {
    // Process the data to handle undefined values
    const processedData: Record<string, any> = {};
    
    // Copy all defined values to the processed data
    Object.entries(leadData).forEach(([key, value]) => {
      // Skip undefined values as Firestore doesn't accept them
      if (value !== undefined) {
        processedData[key] = value;
      }
    });
    
    // Handle nested contactPerson object
    if (leadData.contactPerson) {
      processedData.contactPerson = {};
      Object.entries(leadData.contactPerson).forEach(([key, value]) => {
        if (value !== undefined) {
          processedData.contactPerson[key] = value;
        }
      });
    }
    
    // Add timestamps
    processedData.createdAt = serverTimestamp();
    processedData.updatedAt = serverTimestamp();
    
    const docRef = await addDoc(leadsCollection, processedData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

/**
 * Get a lead by ID
 * @param leadId - The ID of the lead to get
 * @returns Promise that resolves with the lead data or null if not found
 */
export const getLeadById = async (leadId: string): Promise<Lead | null> => {
  try {
    const leadDoc = await getDoc(doc(leadsCollection, leadId));
    
    if (!leadDoc.exists()) {
      return null;
    }
    
    const leadData = leadDoc.data();
    
    return {
      leadId: leadDoc.id,
      ...leadData
    } as Lead;
  } catch (error) {
    console.error(`Error getting lead ${leadId}:`, error);
    throw error;
  }
};

/**
 * Get leads with optional filtering and sorting
 * @param filters - Optional filters to apply
 * @param sortField - Optional field to sort by
 * @param sortDirection - Optional sort direction
 * @param maxResults - Optional maximum number of results to return
 * @returns Promise that resolves with an array of leads
 */
export const getLeads = async (
  filters?: any,
  sortField: string = 'createdAt',
  sortDirection: 'asc' | 'desc' = 'desc',
  maxResults?: number
): Promise<Lead[]> => {
  try {
    let q = query(leadsCollection);
    
    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          q = query(q, where(key, '==', value));
        }
      });
    }
    
    // Apply sorting
    q = query(q, orderBy(sortField, sortDirection));
    
    // Apply limit if provided
    if (maxResults) {
      q = query(q, limit(maxResults));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      leadId: doc.id,
      ...doc.data()
    })) as Lead[];
  } catch (error) {
    console.error('Error getting leads:', error);
    throw error;
  }
};

/**
 * Update a lead
 * @param leadId - The ID of the lead to update
 * @param leadData - The lead data to update
 * @returns Promise that resolves when the update is complete
 */
export const updateLead = async (leadId: string, leadData: Partial<LeadFormData>): Promise<void> => {
  try {
    // Process the data to handle undefined values
    const processedData: Record<string, any> = {
      updatedAt: serverTimestamp()
    };
    
    // Copy all defined values to the processed data
    Object.entries(leadData).forEach(([key, value]) => {
      // Skip undefined values as Firestore doesn't accept them
      if (value !== undefined) {
        processedData[key] = value;
      }
    });
    
    // Handle nested contactPerson object if it exists
    if (leadData.contactPerson) {
      processedData.contactPerson = {};
      Object.entries(leadData.contactPerson).forEach(([key, value]) => {
        if (value !== undefined) {
          processedData.contactPerson[key] = value;
        }
      });
    }
    
    await updateDoc(doc(leadsCollection, leadId), processedData);
  } catch (error) {
    console.error(`Error updating lead ${leadId}:`, error);
    throw error;
  }
};

/**
 * Delete a lead
 * @param leadId - The ID of the lead to delete
 * @returns Promise that resolves when the deletion is complete
 */
export const deleteLead = async (leadId: string): Promise<void> => {
  try {
    await deleteDoc(doc(leadsCollection, leadId));
  } catch (error) {
    console.error(`Error deleting lead ${leadId}:`, error);
    throw error;
  }
};

/**
 * Search leads by term
 * @param searchTerm - The term to search for
 * @param maxResults - Optional maximum number of results to return
 * @returns Promise that resolves with an array of leads
 */
export const searchLeads = async (searchTerm: string, maxResults: number = 10): Promise<Lead[]> => {
  try {
    // In a real implementation, this would use a more sophisticated search mechanism
    // For now, we'll just get all leads and filter them client-side
    const allLeads = await getLeads();
    
    const searchTermLower = searchTerm.toLowerCase();
    
    const filteredLeads = allLeads.filter(lead => {
      // Search in contact person name
      if (lead.contactPerson.fullName.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      
      // Search in organisation name
      if (lead.organisationName && lead.organisationName.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      
      // Search in email
      if (lead.contactPerson.email.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      
      // Search in phone
      if (lead.contactPerson.phone && lead.contactPerson.phone.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      
      // Search in job title
      if (lead.contactPerson.jobTitle && lead.contactPerson.jobTitle.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      
      // Search in status
      if (lead.status.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      
      // Search in source
      if (lead.source.toLowerCase().includes(searchTermLower)) {
        return true;
      }
      
      return false;
    });
    
    // Apply limit
    return filteredLeads.slice(0, maxResults);
  } catch (error) {
    console.error(`Error searching leads with term "${searchTerm}":`, error);
    throw error;
  }
};

/**
 * Get leads by organisation
 * @param organisationId - The ID of the organisation to get leads for
 * @returns Promise that resolves with an array of leads
 */
export const getLeadsByOrganisation = async (organisationId: string): Promise<Lead[]> => {
  try {
    const q = query(
      leadsCollection,
      where('organisationId', '==', organisationId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      leadId: doc.id,
      ...doc.data()
    })) as Lead[];
  } catch (error) {
    console.error(`Error getting leads for organisation ${organisationId}:`, error);
    throw error;
  }
};

/**
 * Get leads by contact
 * @param contactId - The ID of the contact to get leads for
 * @returns Promise that resolves with an array of leads
 */
export const getLeadsByContact = async (contactId: string): Promise<Lead[]> => {
  try {
    const q = query(
      leadsCollection,
      where('contactIds', 'array-contains', contactId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      leadId: doc.id,
      ...doc.data()
    })) as Lead[];
  } catch (error) {
    console.error(`Error getting leads for contact ${contactId}:`, error);
    throw error;
  }
};