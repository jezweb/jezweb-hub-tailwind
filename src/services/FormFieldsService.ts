/**
 * FormFieldsService
 * 
 * This service provides functions for interacting with form field values stored in Firebase.
 * It handles CRUD operations for different field types like roles, statuses, industries, etc.
 * 
 * The service is used by the useFormFields hook to provide dynamic form field options
 * that can be managed through the FormFieldsManager.
 */

import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Field value interface
 */
export interface FieldValue {
  id?: string;
  value: string;
  label: string;
  order?: number;
  isDefault?: boolean;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Get the collection reference for a specific field type
 * @param fieldType - The field type to get the collection reference for
 * @returns Firestore collection reference
 */
const getFieldCollection = (fieldType: string) => {
  return collection(db, 'formFields', fieldType, 'values');
};

/**
 * Get all field values for a specific field type
 * @param fieldType - The field type to get values for
 * @returns Promise that resolves with an array of field values
 */
export const getFieldValues = async (fieldType: string): Promise<FieldValue[]> => {
  try {
    const fieldCollection = getFieldCollection(fieldType);
    const q = query(fieldCollection, orderBy('order', 'asc'), orderBy('label', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FieldValue));
  } catch (error) {
    console.error(`Error fetching ${fieldType} field values:`, error);
    throw new Error(`Failed to fetch ${fieldType} field values: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a specific field value by ID
 * @param fieldType - The field type to get the value from
 * @param id - The ID of the field value to get
 * @returns Promise that resolves with the field value
 */
export const getFieldValueById = async (fieldType: string, id: string): Promise<FieldValue> => {
  try {
    const fieldDoc = doc(getFieldCollection(fieldType), id);
    const snapshot = await getDoc(fieldDoc);
    
    if (!snapshot.exists()) {
      throw new Error(`Field value with ID ${id} not found in ${fieldType}`);
    }
    
    return {
      id: snapshot.id,
      ...snapshot.data()
    } as FieldValue;
  } catch (error) {
    console.error(`Error fetching ${fieldType} field value:`, error);
    throw new Error(`Failed to fetch ${fieldType} field value: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Add a new field value
 * @param fieldType - The field type to add the value to
 * @param fieldValue - The field value to add
 * @returns Promise that resolves with the ID of the new field value
 */
export const addFieldValue = async (fieldType: string, fieldValue: FieldValue): Promise<string> => {
  try {
    // Check if a field with the same value already exists
    const fieldCollection = getFieldCollection(fieldType);
    const q = query(fieldCollection, where('value', '==', fieldValue.value));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      throw new Error(`A field value with value "${fieldValue.value}" already exists in ${fieldType}`);
    }
    
    // Get the highest order value
    const allFields = await getFieldValues(fieldType);
    const maxOrder = allFields.reduce((max, field) => Math.max(max, field.order || 0), 0);
    
    // Add the new field value
    const newFieldValue = {
      ...fieldValue,
      order: fieldValue.order || maxOrder + 1,
      isActive: fieldValue.isActive !== undefined ? fieldValue.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(fieldCollection, newFieldValue);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding ${fieldType} field value:`, error);
    throw new Error(`Failed to add ${fieldType} field value: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update an existing field value
 * @param fieldType - The field type to update the value in
 * @param fieldValue - The updated field value
 * @returns Promise that resolves when the update is complete
 */
export const updateFieldValue = async (fieldType: string, fieldValue: FieldValue): Promise<void> => {
  if (!fieldValue.id) {
    throw new Error('Field value ID is required for update');
  }
  
  try {
    // Check if a field with the same value already exists (excluding this field)
    const fieldCollection = getFieldCollection(fieldType);
    const q = query(fieldCollection, where('value', '==', fieldValue.value));
    const snapshot = await getDocs(q);
    
    const existingField = snapshot.docs.find(doc => doc.id !== fieldValue.id);
    if (existingField) {
      throw new Error(`Another field value with value "${fieldValue.value}" already exists in ${fieldType}`);
    }
    
    // Update the field value
    const fieldDoc = doc(fieldCollection, fieldValue.id);
    const updatedFieldValue = {
      ...fieldValue,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(fieldDoc, updatedFieldValue);
  } catch (error) {
    console.error(`Error updating ${fieldType} field value:`, error);
    throw new Error(`Failed to update ${fieldType} field value: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a field value
 * @param fieldType - The field type to delete the value from
 * @param id - The ID of the field value to delete
 * @returns Promise that resolves when the deletion is complete
 */
export const deleteFieldValue = async (fieldType: string, id: string): Promise<void> => {
  try {
    const fieldDoc = doc(getFieldCollection(fieldType), id);
    await deleteDoc(fieldDoc);
  } catch (error) {
    console.error(`Error deleting ${fieldType} field value:`, error);
    throw new Error(`Failed to delete ${fieldType} field value: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get all available field types
 * @returns Promise that resolves with an array of field types
 */
export const getFieldTypes = async (): Promise<string[]> => {
  try {
    const fieldTypesCollection = collection(db, 'formFields');
    const snapshot = await getDocs(fieldTypesCollection);
    
    return snapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error('Error fetching field types:', error);
    throw new Error(`Failed to fetch field types: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create a new field type
 * @param fieldType - The field type to create
 * @returns Promise that resolves when the creation is complete
 */
export const createFieldType = async (fieldType: string): Promise<void> => {
  try {
    const fieldTypeDoc = doc(db, 'formFields', fieldType);
    await setDoc(fieldTypeDoc, {
      name: fieldType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error creating field type ${fieldType}:`, error);
    throw new Error(`Failed to create field type: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};