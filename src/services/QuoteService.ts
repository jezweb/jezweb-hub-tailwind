/**
 * QuoteService
 * 
 * This service handles all quote-related operations, including CRUD operations,
 * calculations, and interactions with the Firestore database.
 */

import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { Quote, QuoteFormData, QuoteItem, QuoteStatus } from '../types/Quote';

/**
 * QuoteService class
 * 
 * Provides methods for managing quotes in the system.
 */
export class QuoteService {
  private static COLLECTION_NAME = 'quotes';
  private static TAX_RATE = 0.10; // 10% tax rate
  
  /**
   * Generate a unique quote number
   * Format: Q-YYYY-XXXX (e.g., Q-2024-0001)
   */
  public static async generateQuoteNumber(): Promise<string> {
    const year = new Date().getFullYear();
    
    // Get the count of quotes for the current year
    const quotesRef = collection(db, this.COLLECTION_NAME);
    const yearPrefix = `Q-${year}-`;
    
    try {
      const q = query(
        quotesRef,
        where('quoteNumber', '>=', yearPrefix),
        where('quoteNumber', '<', `Q-${year + 1}-`),
        orderBy('quoteNumber', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // No quotes for this year yet, start with 0001
        return `${yearPrefix}0001`;
      }
      
      // Get the last quote number and increment
      const lastQuoteNumber = querySnapshot.docs[0].data().quoteNumber;
      const lastNumber = parseInt(lastQuoteNumber.split('-')[2], 10);
      const newNumber = (lastNumber + 1).toString().padStart(4, '0');
      
      return `${yearPrefix}${newNumber}`;
    } catch (error) {
      console.error('Error generating quote number:', error);
      // Fallback to timestamp-based number if there's an error
      return `${yearPrefix}${Date.now().toString().slice(-4)}`;
    }
  }
  
  /**
   * Calculate quote totals
   */
  public static calculateQuoteTotals(items: QuoteItem[]): { subtotal: number; tax: number; total: number } {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate tax
    const tax = subtotal * this.TAX_RATE;
    
    // Calculate total
    const total = subtotal + tax;
    
    return {
      subtotal,
      tax,
      total
    };
  }
  
  /**
   * Create a new quote
   */
  public static async createQuote(quoteData: QuoteFormData): Promise<string> {
    try {
      // Generate a unique quote number
      const quoteNumber = await this.generateQuoteNumber();
      
      // Create the quote document
      const quoteRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        ...quoteData,
        quoteNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return quoteRef.id;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  }
  
  /**
   * Get a quote by ID
   */
  public static async getQuoteById(quoteId: string): Promise<Quote | null> {
    try {
      const quoteRef = doc(db, this.COLLECTION_NAME, quoteId);
      const quoteSnap = await getDoc(quoteRef);
      
      if (quoteSnap.exists()) {
        return { quoteId: quoteSnap.id, ...quoteSnap.data() } as Quote;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting quote:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing quote
   */
  public static async updateQuote(quoteId: string, quoteData: QuoteFormData): Promise<void> {
    try {
      const quoteRef = doc(db, this.COLLECTION_NAME, quoteId);
      
      await updateDoc(quoteRef, {
        ...quoteData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating quote:', error);
      throw error;
    }
  }
  
  /**
   * Delete a quote
   */
  public static async deleteQuote(quoteId: string): Promise<void> {
    try {
      const quoteRef = doc(db, this.COLLECTION_NAME, quoteId);
      await deleteDoc(quoteRef);
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  }
  
  /**
   * Get all quotes
   */
  public static async getAllQuotes(
    filters: Record<string, any> = {},
    sortField: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<Quote[]> {
    try {
      const quotesRef = collection(db, this.COLLECTION_NAME);
      
      // Build query with filters
      let q = query(quotesRef, orderBy(sortField, sortDirection));
      
      // Apply filters if any
      Object.entries(filters).forEach(([field, value]) => {
        if (value) {
          q = query(q, where(field, '==', value));
        }
      });
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        quoteId: doc.id,
        ...doc.data()
      })) as Quote[];
    } catch (error) {
      console.error('Error getting quotes:', error);
      throw error;
    }
  }
  
  /**
   * Update quote status
   */
  public static async updateQuoteStatus(quoteId: string, status: QuoteStatus): Promise<void> {
    try {
      const quoteRef = doc(db, this.COLLECTION_NAME, quoteId);
      
      await updateDoc(quoteRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  }
  
  /**
   * Generate PDF from quote
   */
  public static async generateQuotePDF(quoteId: string): Promise<string> {
    try {
      // This would typically integrate with a PDF generation service
      // For now, we'll just return a placeholder URL
      return `/quotes/${quoteId}/pdf`;
    } catch (error) {
      console.error('Error generating quote PDF:', error);
      throw error;
    }
  }
  
  /**
   * Send quote to client
   */
  public static async sendQuote(quoteId: string): Promise<void> {
    try {
      // This would typically integrate with an email service
      // For now, we'll just update the status to 'sent'
      await this.updateQuoteStatus(quoteId, QuoteStatus.SENT);
    } catch (error) {
      console.error('Error sending quote:', error);
      throw error;
    }
  }
}